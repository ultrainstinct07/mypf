'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Terminal } from 'lucide-react';
import { useCtf } from './CtfProvider';
import { CTF_SHADOW_CIPHER, CTF_STAGES } from '@/lib/ctf/challenges';
import type { CtfStageId } from '@/types/ctf';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

const BANNER = `  __   _____  ____ _____ _____
  \\ \\ / / _ \\|  _ \\_   _| ____|
   \\ V / | | | | | || | |  _|
    | || |_| | |_| || | | |___
    |_| \\___/|____/ |_| |_____|

  Operation VOID999 — infiltration terminal
  Type 'help' for available commands.`;

export default function CtfTerminal() {
  const {
    progress,
    currentStage,
    terminalOpen,
    closeTerminal,
    markStageComplete,
    exportToken,
  } = useCtf();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);

  const appendLine = useCallback((line: Omit<TerminalLine, 'id'>) => {
    setLines((prev) => [...prev, { ...line, id: crypto.randomUUID() }]);
  }, []);

  useEffect(() => {
    if (terminalOpen && !bootedRef.current) {
      bootedRef.current = true;
      setLines([
        { id: 'banner', type: 'output', text: BANNER },
        {
          id: 'boot',
          type: 'success',
          text: '[ OK ] VOID shell online. Stage recon in progress.',
        },
      ]);
    }
  }, [terminalOpen]);

  useEffect(() => {
    if (terminalOpen) {
      inputRef.current?.focus();
    }
  }, [terminalOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const submitFlag = async (stage: CtfStageId, flag: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ctf/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          flag,
          completedStages: progress.completedStages,
        }),
      });
      const data = await response.json();

      if (data.success) {
        appendLine({ type: 'success', text: data.message });
        if (data.nextHint) {
          appendLine({ type: 'output', text: `hint> ${data.nextHint}` });
        }
        markStageComplete(stage, data.proofToken);
        return true;
      }

      appendLine({ type: 'error', text: data.message ?? 'Submission rejected.' });
      return false;
    } catch {
      appendLine({ type: 'error', text: 'Uplink failed. Retry submission.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const runCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendLine({ type: 'input', text: `void999@portfolio:~$ ${trimmed}` });

    const [command, ...args] = trimmed.split(/\s+/);
    const lower = command.toLowerCase();

    switch (lower) {
      case 'help':
        appendLine({
          type: 'output',
          text: [
            'help              Show this message',
            'status            Current infiltration stage',
            'submit <flag>     Submit a stage flag',
            'submit --final <flag>  Submit stage 5 root flag',
            'export TOKEN=<flag>    Export enumeration token',
            'cat shadow        Read shadow hashes (requires exported token)',
            'clear             Clear terminal output',
            'exit              Close terminal',
          ].join('\n'),
        });
        break;

      case 'status': {
        const stageInfo = CTF_STAGES.map(
          (s) =>
            `  [${progress.completedStages.includes(s.id) ? 'x' : ' '}] ${s.id}. ${s.name}`
        ).join('\n');
        appendLine({
          type: 'output',
          text: `Current objective: Stage ${currentStage}\n${stageInfo}`,
        });
        break;
      }

      case 'submit': {
        if (args[0] === '--final') {
          const flag = args.slice(1).join(' ');
          if (!flag) {
            appendLine({ type: 'error', text: 'Usage: submit --final <flag>' });
            break;
          }
          if (!progress.completedStages.includes(4)) {
            appendLine({ type: 'error', text: 'Stage 4 must be cleared first.' });
            break;
          }
          await submitFlag(5, flag);
          break;
        }

        const flag = args.join(' ');
        if (!flag) {
          appendLine({ type: 'error', text: 'Usage: submit <flag>' });
          break;
        }

        const nextStage = (progress.completedStages.length === 0
          ? 1
          : Math.max(...progress.completedStages) + 1) as CtfStageId;

        if (nextStage > 4) {
          appendLine({
            type: 'error',
            text: 'Stages 1–4 complete. Use: submit --final <flag>',
          });
          break;
        }

        await submitFlag(nextStage, flag);
        break;
      }

      case 'export': {
        const exportArg = args.join(' ');
        const match = exportArg.match(/^TOKEN=(.+)$/i);
        if (!match) {
          appendLine({ type: 'error', text: 'Usage: export TOKEN=<decoded_flag>' });
          break;
        }
        if (!progress.completedStages.includes(2)) {
          appendLine({ type: 'error', text: 'Stage 2 access required before token export.' });
          break;
        }

        const exported = await submitFlag(3, match[1].trim());
        if (exported) {
          exportToken();
          appendLine({ type: 'success', text: 'TOKEN exported to environment.' });
        }
        break;
      }

      case 'cat': {
        if (args[0] !== 'shadow') {
          appendLine({ type: 'error', text: 'Only shadow file is readable.' });
          break;
        }
        if (!progress.tokenExported && !progress.completedStages.includes(3)) {
          appendLine({ type: 'error', text: 'Permission denied. Export TOKEN first.' });
          break;
        }
        appendLine({
          type: 'output',
          text: `root:${CTF_SHADOW_CIPHER}:18446:0:99999:7:::\n\n# Hint: hero stat cards encode the shift.`,
        });
        break;
      }

      case 'clear':
        setLines([]);
        break;

      case 'exit':
        closeTerminal();
        break;

      default:
        appendLine({ type: 'error', text: `command not found: ${command}` });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const value = input;
    setInput('');
    void runCommand(value);
  };

  if (!terminalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={closeTerminal}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="VOID999 terminal"
        className="fixed inset-x-4 top-[10vh] bottom-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-[61] flex flex-col bg-black border-2 border-crimson shadow-[8px_8px_0px_#D90429] overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-crimson bg-crimson/10">
          <div className="flex items-center gap-2 text-crimson">
            <Terminal size={18} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              void999@portfolio
            </span>
          </div>
          <button
            type="button"
            onClick={closeTerminal}
            className="p-2 text-gray-400 hover:text-crimson transition-colors"
            aria-label="Close terminal"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={
                line.type === 'input'
                  ? 'text-white'
                  : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'success'
                      ? 'text-green-400'
                      : 'text-gray-300 whitespace-pre-wrap'
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t-2 border-crimson/40 p-3 flex gap-2">
          <span className="text-crimson font-mono text-sm self-center">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-gray-600"
            placeholder="enter command..."
          />
        </form>
      </div>
    </>
  );
}
