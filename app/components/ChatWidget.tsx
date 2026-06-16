'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Bot, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  findChatAnswer,
  WELCOME_MESSAGE,
  getPageAwareSuggestions,
  type ChatLink,
} from '@/lib/chat-knowledge';
import { CTF_OPEN_CHAT_EVENT } from '@/lib/ctf/public-hints';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import ChatMessage, { TypingIndicator } from './ChatMessage';

interface StoredMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  links?: ChatLink[];
  followUpQuestions?: string[];
  showQuickReplies?: boolean;
  entryId?: string;
}

interface Message extends Omit<StoredMessage, 'timestamp'> {
  timestamp: Date;
}

const STORAGE_KEY = 'chat-widget-messages';
const HINT_KEY = 'chat-widget-hint-seen';
const MAX_MESSAGES = 50;

function createWelcomeMessage(suggestions: string[]): Message {
  return {
    id: 'welcome',
    text: WELCOME_MESSAGE,
    isBot: true,
    timestamp: new Date(),
    showQuickReplies: true,
    followUpQuestions: suggestions,
  };
}

function serializeMessages(messages: Message[]): StoredMessage[] {
  return messages.map(({ timestamp, ...rest }) => ({
    ...rest,
    timestamp: timestamp.toISOString(),
  }));
}

function deserializeMessages(stored: StoredMessage[]): Message[] {
  return stored.map(({ timestamp, ...rest }) => ({
    ...rest,
    timestamp: new Date(timestamp),
  }));
}

export default function ChatWidget() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const pageSuggestions = useMemo(
    () => getPageAwareSuggestions(pathname),
    [pathname]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [storedMessages, setStoredMessages] = useLocalStorage<StoredMessage[] | null>(
    STORAGE_KEY,
    null
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    if (storedMessages && storedMessages.length > 0) {
      return deserializeMessages(storedMessages);
    }
    return [createWelcomeMessage(getPageAwareSuggestions('/'))];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(HINT_KEY);
  });
  const [lastEntryId, setLastEntryId] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    const serialized = serializeMessages(messages.slice(-MAX_MESSAGES));
    setStoredMessages((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(serialized)) {
        return prev;
      }
      return serialized;
    });
  }, [messages, setStoredMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping, scrollToBottom]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(HINT_KEY, '1');
      setShowHint(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeChat]);

  useEffect(() => {
    const handleOpenChat = () => openChat();
    window.addEventListener(CTF_OPEN_CHAT_EVENT, handleOpenChat);
    return () => window.removeEventListener(CTF_OPEN_CHAT_EVENT, handleOpenChat);
  }, [openChat]);

  const sendQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || isTyping) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: trimmed,
        isBot: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, showQuickReplies: false, followUpQuestions: undefined })),
        userMessage,
      ]);
      setInput('');
      setIsTyping(true);

      window.setTimeout(() => {
        const answer = findChatAnswer(trimmed, { lastEntryId });
        if (answer.entryId) {
          setLastEntryId(answer.entryId);
        }

        const botMessage: Message = {
          id: crypto.randomUUID(),
          text: answer.text,
          isBot: true,
          timestamp: new Date(),
          links: answer.links,
          followUpQuestions: answer.followUpQuestions,
          showQuickReplies: answer.isFallback ?? false,
          entryId: answer.entryId,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    },
    [isTyping, lastEntryId]
  );

  const clearChat = useCallback(() => {
    setLastEntryId(undefined);
    setMessages([createWelcomeMessage(pageSuggestions)]);
  }, [pageSuggestions]);

  const handleSend = () => {
    sendQuery(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const motionEnabled = !prefersReducedMotion;

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            key="chat-launcher"
            onClick={openChat}
            initial={motionEnabled ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={motionEnabled ? { opacity: 0, scale: 0.9 } : undefined}
            whileHover={motionEnabled ? { scale: 1.05 } : undefined}
            whileTap={motionEnabled ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
            className="fixed left-4 sm:left-6 bottom-6 w-12 h-12 bg-crimson text-white border-2 border-black dark:border-white rounded-none shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[-2px] transition-all flex items-center justify-center z-40 touch-manipulation font-bold"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            {showHint && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-black dark:border-white rounded-full" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-widget-title"
            initial={motionEnabled ? { opacity: 0, y: 16, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionEnabled ? { opacity: 0, y: 16, scale: 0.98 } : undefined}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 sm:left-6 bottom-6 w-[calc(100vw-3rem)] sm:w-[28.75rem] h-[min(600px,calc(100dvh-6rem))] bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] flex flex-col z-40 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-black dark:border-white/10 bg-slate-100 dark:bg-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-crimson/10 border-2 border-black dark:border-white/20 rounded-none flex items-center justify-center">
                  <Bot className="text-crimson" size={20} />
                </div>
                <div>
                  <h3
                    id="chat-widget-title"
                    className="font-extrabold uppercase text-sm sm:text-base text-slate-900 dark:text-white"
                  >
                    FAQ Assistant
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    Ask about certs, projects, or contact
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-1 text-slate-500 dark:text-gray-400 hover:text-crimson transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 text-slate-500 dark:text-gray-400 hover:text-crimson transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const followUpQuestions =
                  message.id === 'welcome'
                    ? pageSuggestions
                    : message.followUpQuestions;

                return (
                  <motion.div
                    key={message.id}
                    initial={motionEnabled ? { opacity: 0, y: 8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: motionEnabled ? Math.min(index * 0.03, 0.15) : 0,
                    }}
                  >
                    <div
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <ChatMessage
                        text={message.text}
                        isBot={message.isBot}
                        links={message.links}
                        showCopy={message.isBot}
                      />
                    </div>

                    {message.isBot && followUpQuestions && followUpQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 ml-1">
                        {followUpQuestions.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => sendQuery(question)}
                            disabled={isTyping}
                            className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 border-2 border-black dark:border-white/20 bg-white dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:border-crimson hover:text-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t-2 border-black dark:border-white/10 bg-slate-100 dark:bg-black">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={isTyping}
                  rows={1}
                  className="flex-1 px-4 py-2 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-crimson dark:focus:border-crimson disabled:opacity-60 resize-none min-h-[44px] max-h-[120px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2 bg-crimson text-white border-2 border-black dark:border-white rounded-none hover:bg-crimson-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-[2px_2px_0px_#000] min-h-[44px] touch-manipulation"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-2">
                Enter to send · Shift+Enter for newline
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
