'use client';

export interface AnalyticsEvent {
  type: 'page_view' | 'project_view' | 'search' | 'filter' | 'click';
  data?: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  try {
    const events = getStoredEvents();
    events.push({
      ...event,
      timestamp: Date.now(),
    });

    // Keep only last 100 events
    const trimmed = events.slice(-100);
    localStorage.setItem('analytics-events', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function getStoredEvents(): (AnalyticsEvent & { timestamp: number })[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('analytics-events');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getPageViewCount(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const count = localStorage.getItem('page-view-count');
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementPageView(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const current = getPageViewCount();
    const newCount = current + 1;
    localStorage.setItem('page-view-count', newCount.toString());
    trackEvent({ type: 'page_view' });
    return newCount;
  } catch {
    return 0;
  }
}

export function getPopularSearches(limit: number = 5): string[] {
  const events = getStoredEvents();
  const searches = events
    .filter((e) => e.type === 'search' && e.data?.query)
    .map((e) => e.data!.query as string);

  const frequency: Record<string, number> = {};
  searches.forEach((query) => {
    frequency[query] = (frequency[query] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query]) => query);
}

