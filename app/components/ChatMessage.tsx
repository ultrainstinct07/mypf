'use client';

import Link from 'next/link';
import { useState, useCallback, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import type { ChatLink } from '@/lib/chat-knowledge';

interface ChatMessageProps {
  text: string;
  isBot: boolean;
  links?: ChatLink[];
  showCopy?: boolean;
}

const URL_PATTERN =
  /(\bhttps?:\/\/[^\s]+|\b[\w.-]+@[\w.-]+\.\w{2,}|(?:^|\s)(\/[\w/-]+|#[\w-]+))/g;

const BOLD_PATTERN = /\*\*(.+?)\*\*/g;

function renderInlineWithLinks(text: string, isBot: boolean): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(URL_PATTERN.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const token = raw.trim();
    const start = match.index + (raw.length - token.length);

    if (start > lastIndex) {
      parts.push(...renderBoldSegments(text.slice(lastIndex, start), isBot));
    }

    if (token.includes('@') && !token.startsWith('http')) {
      parts.push(
        <a
          key={`${start}-email`}
          href={`mailto:${token}`}
          className={
            isBot
              ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary'
              : 'underline underline-offset-2'
          }
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
          className={
            isBot
              ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary'
              : 'underline underline-offset-2'
          }
        >
          {token}
        </a>
      );
    } else if (token.startsWith('/') || token.startsWith('#')) {
      parts.push(
        <Link
          key={`${start}-path`}
          href={token}
          className={
            isBot
              ? 'text-crimson underline underline-offset-2 hover:text-crimson-secondary'
              : 'underline underline-offset-2'
          }
        >
          {token}
        </Link>
      );
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(...renderBoldSegments(text.slice(lastIndex), isBot));
  }

  return parts.length > 0 ? parts : renderBoldSegments(text, isBot);
}

function renderBoldSegments(text: string, isBot: boolean): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(BOLD_PATTERN.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${match.index}`} className={isBot ? 'font-extrabold text-slate-900 dark:text-white' : 'font-extrabold'}>
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function renderMessageContent(text: string, isBot: boolean): ReactNode {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-none space-y-1.5 my-2">
        {listItems.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-crimson shrink-0">•</span>
            <span>{renderInlineWithLinks(item, isBot)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[•\-]\s+(.*)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      continue;
    }

    flushList();

    if (line.trim() === '') {
      blocks.push(<br key={`br-${blocks.length}`} />);
      continue;
    }

    blocks.push(
      <p key={`p-${blocks.length}`} className={blocks.length > 0 ? 'mt-2' : undefined}>
        {renderInlineWithLinks(line, isBot)}
      </p>
    );
  }

  flushList();
  return blocks.length > 0 ? blocks : renderInlineWithLinks(text, isBot);
}

export default function ChatMessage({ text, isBot, links, showCopy = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [text]);

  return (
    <div
      className={`relative max-w-[80%] rounded-none border-2 px-4 py-2 font-medium ${
        isBot
          ? 'bg-slate-50 dark:bg-dark border-black dark:border-white/10 text-slate-800 dark:text-gray-300 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)]'
          : 'bg-crimson border-black dark:border-white text-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)]'
      }`}
    >
      {isBot && showCopy && text.length > 80 && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-crimson transition-colors"
          aria-label={copied ? 'Copied' : 'Copy message'}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}

      <div className={`text-sm leading-relaxed ${isBot && showCopy && text.length > 80 ? 'pr-6' : ''}`}>
        {renderMessageContent(text, isBot)}
      </div>

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
