'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/constants';
import Fuse from 'fuse.js';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const fuseOptions: Fuse.IFuseOptions<typeof FAQ_ITEMS[0]> = {
  keys: ['question', 'answer'],
  threshold: 0.4,
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help answer questions about Kshitiz Kumar and his work. Ask me anything!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const findAnswer = (query: string): string | null => {
    const fuse = new Fuse(FAQ_ITEMS, fuseOptions);
    const results = fuse.search(query);

    if (results.length > 0) {
      return results[0].item.answer;
    }

    // Fallback responses
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('email') || lowerQuery.includes('contact')) {
      return "You can reach Kshitiz at bbruce670@gmail.com. Feel free to connect on LinkedIn as well!";
    }
    if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
      return "Kshitiz is based in Faridabad, Haryana, India.";
    }
    if (lowerQuery.includes('project') || lowerQuery.includes('work')) {
      return "Kshitiz has worked on several security projects including Ark Surveillance, Collegia, phishing detection systems, and mobile app penetration testing. Check out the Projects section to learn more!";
    }
    if (lowerQuery.includes('skill') || lowerQuery.includes('expertise')) {
      return "Kshitiz specializes in security tooling, threat research, product security, and secure workflows. He's proficient with Burp Suite and focuses on OWASP Top 10 remediation.";
    }

    return "I'm not sure about that. Try asking about Kshitiz's projects, skills, contact information, or check the FAQ section for more details!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const answer = findAnswer(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer || "I'm not sure how to help with that. Feel free to check the FAQ section!",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan text-dark rounded-full shadow-lg hover:bg-cyan/90 hover:scale-110 transition-all flex items-center justify-center z-40 glow-cyan"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-dark-lighter border border-white/10 rounded-lg shadow-2xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan/20 rounded-full flex items-center justify-center">
                <Bot className="text-cyan" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">FAQ Assistant</h3>
                <p className="text-xs text-gray-400">Usually replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-cyan transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isBot
                      ? 'bg-dark border border-white/5 text-gray-300'
                      : 'bg-cyan text-dark'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-dark">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-dark-lighter border border-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-4 py-2 bg-cyan text-dark rounded-lg hover:bg-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Ask about projects, skills, contact info, or check the FAQ
            </p>
          </div>
        </div>
      )}
    </>
  );
}

