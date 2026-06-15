'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CtfProgress, CtfStageId } from '@/types/ctf';
import {
  completeStage,
  getCurrentStage,
  loadCtfProgress,
  markVoidDiscovered,
  saveCtfProgress,
  setTokenExported,
} from '@/lib/ctf/progress';
import { useKeyboardShortcut } from '@/app/hooks/useKeyboardShortcut';

interface CtfContextValue {
  progress: CtfProgress;
  currentStage: number;
  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  discoverVoid: () => void;
  markStageComplete: (stage: CtfStageId, proofToken?: string) => void;
  exportToken: () => void;
  canOpenTerminal: boolean;
}

const CtfContext = createContext<CtfContextValue | null>(null);

export function CtfProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CtfProgress>(() => loadCtfProgress());
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    saveCtfProgress(progress);
  }, [progress]);

  const canOpenTerminal = progress.voidDiscovered;

  const openTerminal = useCallback(() => {
    if (!canOpenTerminal) return;
    setTerminalOpen(true);
  }, [canOpenTerminal]);

  const closeTerminal = useCallback(() => setTerminalOpen(false), []);

  const toggleTerminal = useCallback(() => {
    if (!canOpenTerminal) return;
    setTerminalOpen((open) => !open);
  }, [canOpenTerminal]);

  useKeyboardShortcut(['mod+shift+`'], () => {
    if (canOpenTerminal) {
      setTerminalOpen((open) => !open);
    }
  }, canOpenTerminal);

  const discoverVoid = useCallback(() => {
    setProgress((prev) => markVoidDiscovered(prev));
  }, []);

  const markStageComplete = useCallback((stage: CtfStageId, proofToken?: string) => {
    setProgress((prev) => completeStage(prev, stage, proofToken));
  }, []);

  const exportToken = useCallback(() => {
    setProgress((prev) => setTokenExported(prev));
  }, []);

  const value = useMemo(
    () => ({
      progress,
      currentStage: getCurrentStage(progress),
      terminalOpen,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      discoverVoid,
      markStageComplete,
      exportToken,
      canOpenTerminal,
    }),
    [
      progress,
      terminalOpen,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      discoverVoid,
      markStageComplete,
      exportToken,
      canOpenTerminal,
    ]
  );

  return <CtfContext.Provider value={value}>{children}</CtfContext.Provider>;
}

export function useCtf() {
  const context = useContext(CtfContext);
  if (!context) {
    throw new Error('useCtf must be used within CtfProvider');
  }
  return context;
}

export function useCtfOptional() {
  return useContext(CtfContext);
}
