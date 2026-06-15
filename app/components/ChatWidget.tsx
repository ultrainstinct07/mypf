'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import {
  findChatAnswer,
  WELCOME_MESSAGE,
  SUGGESTED_QUESTIONS,
  type ChatLink,
} from '@/lib/chat-knowledge';
import ChatMessage, { TypingIndicator } from './ChatMessage';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  links?: ChatLink[];
  showQuickReplies?: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  text: WELCOME_MESSAGE,
  isBot: true,
  timestamp: new Date(),
  showQuickReplies: true,
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
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

  const sendQuery = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: trimmed,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, showQuickReplies: false })),
      { ...userMessage, showQuickReplies: false },
    ]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findChatAnswer(trimmed);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: answer.text,
        isBot: true,
        timestamp: new Date(),
        links: answer.links,
        showQuickReplies: answer.isFallback ?? false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  }, [isTyping]);

  const handleSend = () => {
    sendQuery(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          ref={launcherRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-crimson text-white border-2 border-black dark:border-white rounded-none shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center z-40 touch-manipulation font-bold"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-widget-title"
          className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-[28.75rem] h-[min(600px,calc(100dvh-6rem))] bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] flex flex-col z-40 overflow-hidden"
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
                  Usually replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="p-1 text-slate-500 dark:text-gray-400 hover:text-crimson transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <ChatMessage
                    text={message.text}
                    isBot={message.isBot}
                    links={message.links}
                  />
                </div>

                {message.isBot && message.showQuickReplies && (
                  <div className="flex flex-wrap gap-2 mt-3 ml-1">
                    {SUGGESTED_QUESTIONS.map((question) => (
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
              </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t-2 border-black dark:border-white/10 bg-slate-100 dark:bg-black">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isTyping}
                className="flex-1 px-4 py-2 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-crimson dark:focus:border-crimson disabled:opacity-60"
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
              Certifications · Projects · NDA work · Contact
            </p>
          </div>
        </div>
      )}
    </>
  );
}
