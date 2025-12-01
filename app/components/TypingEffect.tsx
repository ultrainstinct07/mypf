'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
}

export default function TypingEffect({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  className = '',
}: TypingEffectProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText === currentFullText) {
            // Wait before deleting
            setTimeout(() => setIsDeleting(true), delayBetweenTexts);
          } else {
            // Typing
            setCurrentText(currentFullText.slice(0, currentText.length + 1));
          }
        } else {
          if (currentText === '') {
            // Move to next text
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          } else {
            // Deleting
            setCurrentText(currentFullText.slice(0, currentText.length - 1));
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delayBetweenTexts]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

