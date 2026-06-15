'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ChatLink } from '@/lib/chat-knowledge';

interface ChatMessageProps {
  text: string;
  isBot: boolean;
  links?: ChatLink[];
}

const URL_PATTERN =
  /(\bhttps?:\/\/[^\s]+|\b[\w.-]+@[\w.-]+\.\w{2,}|(?:^|\s)(\/[\w/-]+|#[\w-]+))/g;

function renderTextWithLinks(text: string, isBot: boolean) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(URL_PATTERN.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const token = raw.trim();
    const start = match.index + (raw.length - token.length);

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    if (token.includes('@') && !token.startsWith('http')) {
      parts.push(
        <a
          key={`${start}-email`}
          href={`mailto:${token}`}
          className={isBot ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary' : 'underline underline-offset-2'}
        >
          {token}
        </a>
      );
    } else if (token.startsWith('http')) {
      parts.push(
        <a
          key={`${start}-url`}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className={isBot ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary' : 'underline underline-offset-2'}
        >
          {token}
        </a>
      );
    } else if (token.startsWith('/') || token.startsWith('#')) {
      parts.push(
        <Link
          key={`${start}-path`}
          href={token}
          className={isBot ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary' : 'underline underline-offset-2'}
        >
          {token}
        </Link>
      );
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function ChatMessage({ text, isBot, links }: ChatMessageProps) {
  return (
    <div
      className={`max-w-[80%] rounded-none border-2 px-4 py-2 font-medium ${
        isBot
          ? 'bg-slate-50 dark:bg-dark border-black dark:border-white/10 text-slate-800 dark:text-gray-300 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)]'
          : 'bg-crimson border-black dark:border-white text-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)]'
      }`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {renderTextWithLinks(text, isBot)}
      </p>

      {isBot && links && links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
          {links.map((link) =>
            link.href.startsWith('/') || link.href.startsWith('#') ? (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 border border-crimson text-crimson hover:bg-crimson hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 border border-crimson text-crimson hover:bg-crimson hover:text-white transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-none border-2 px-4 py-3 bg-slate-50 dark:bg-dark border-black dark:border-white/10 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5" aria-label="Assistant is typing">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-crimson rounded-none animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { TypingIndicator };
