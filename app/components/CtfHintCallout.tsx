'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crosshair, MessageCircle, Terminal, X } from 'lucide-react';
import {
  CTF_CALLOUT_DISMISS_KEY,
  CTF_OPEN_CHAT_EVENT,
  CTF_START_HINT,
  CTF_TAGLINE,
  CTF_TITLE,
} from '@/lib/ctf/public-hints';

export default function CtfHintCallout() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(CTF_CALLOUT_DISMISS_KEY);
    if (!dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(CTF_CALLOUT_DISMISS_KEY, '1');
    setVisible(false);
  };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent(CTF_OPEN_CHAT_EVENT));
  };

  if (!visible) return null;

  return (
    <section
      aria-label="Operation VOID999 challenge hint"
      className="border-t-2 border-black bg-slate-50 dark:border-white/10 dark:bg-black"
    >
      <div className="container-custom py-8 sm:py-10">
        <div className="relative border-2 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_#D90429] dark:border-white/20 dark:bg-dark-card dark:shadow-[6px_6px_0px_rgba(217,4,41,0.45)]">
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-slate-500 transition-colors hover:text-crimson dark:text-gray-400 dark:hover:text-crimson"
            aria-label="Dismiss challenge hint"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col gap-5 pr-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-crimson">
                <Crosshair size={18} strokeWidth={2.5} />
                <span className="text-xs font-extrabold uppercase tracking-[0.25em]">
                  Easter Egg Detected
                </span>
              </div>

              <h2 className="font-syne text-xl sm:text-2xl font-extrabold uppercase text-black dark:text-white">
                {CTF_TITLE}
              </h2>

              <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-gray-300">
                {CTF_TAGLINE}
              </p>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 border-l-4 border-crimson pl-4">
                <span className="font-extrabold uppercase tracking-wider text-crimson text-xs block mb-1">
                  Start here
                </span>
                {CTF_START_HINT}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/void"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-crimson text-white text-xs font-extrabold uppercase tracking-wider border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000000] transition-all min-h-[44px]"
              >
                <Terminal size={15} />
                Start Mission
              </Link>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-extrabold uppercase tracking-wider border-2 border-black dark:bg-dark-card dark:text-white dark:border-white/20 hover:border-crimson hover:text-crimson transition-colors min-h-[44px]"
              >
                <MessageCircle size={15} />
                Ask The Bot
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
