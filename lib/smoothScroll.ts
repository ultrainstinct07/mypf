let activeFrameId: number | null = null;

export function cancelActiveScroll() {
  if (activeFrameId !== null) {
    cancelAnimationFrame(activeFrameId);
    activeFrameId = null;
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function getScrollDuration(distance: number): number {
  return Math.min(600, Math.max(280, Math.abs(distance) * 0.35));
}

function getNavbarOffset(): number {
  const nav = document.querySelector('nav');
  return (nav?.getBoundingClientRect().height ?? 72) + 8;
}

export function smoothScrollToPosition(
  targetPosition: number,
  options?: { duration?: number; onComplete?: () => void }
) {
  cancelActiveScroll();

  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;

  if (Math.abs(distance) < 2) {
    options?.onComplete?.();
    return;
  }

  const duration = options?.duration ?? getScrollDuration(distance);
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

    if (timeElapsed < duration) {
      activeFrameId = requestAnimationFrame(animation);
    } else {
      activeFrameId = null;
      options?.onComplete?.();
    }
  };

  activeFrameId = requestAnimationFrame(animation);
}

export function smoothScrollToSectionId(
  sectionId: string,
  options?: { navbarOffset?: number; onComplete?: () => void }
) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const offset = options?.navbarOffset ?? getNavbarOffset();
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;

  smoothScrollToPosition(elementPosition - offset, { onComplete: options?.onComplete });
}
