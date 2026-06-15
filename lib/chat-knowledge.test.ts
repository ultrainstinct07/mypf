import { describe, expect, it } from 'vitest';
import {
  findChatAnswer,
  getPageAwareSuggestions,
} from './chat-knowledge';
import { PUBLIC_PROJECTS } from './public-projects';

describe('findChatAnswer', () => {
  it('routes project queries ahead of location for ambiguous phrasing', () => {
    const answer = findChatAnswer('where are your projects');
    expect(answer.entryId).toBe('projects-overview');
    expect(answer.text.toLowerCase()).toContain('project');
  });

  it('returns location for a based-in query', () => {
    const answer = findChatAnswer('where are you based');
    expect(answer.entryId).toBe('location');
  });

  it('finds all public projects by slug or name', () => {
    const queries = [
      'what is ad void',
      'offensive toolkit',
      'mobile pentest',
      'windows internals',
      'vulnessus',
      'dpdp scanner',
      'phishing detector',
    ];

    for (const query of queries) {
      const answer = findChatAnswer(query);
      expect(answer.isFallback).not.toBe(true);
      expect(answer.entryId?.startsWith('project-')).toBe(true);
    }

    expect(PUBLIC_PROJECTS).toHaveLength(7);
  });

  it('boosts related follow-up context from the previous entry', () => {
    const first = findChatAnswer('Tell me about Vulnessus');
    expect(first.entryId).toBe('project-vulnessus');

    const followUp = findChatAnswer('what about nda work', {
      lastEntryId: first.entryId,
    });
    expect(followUp.isFallback).not.toBe(true);
    expect(followUp.entryId).toMatch(/nda|projects/);
  });

  it('returns clarification for very short queries', () => {
    const answer = findChatAnswer('hi');
    expect(answer.isFallback).toBe(true);
    expect(answer.text.toLowerCase()).toContain('detail');
  });

  it('returns near-miss or fallback for gibberish instead of a random entry', () => {
    const answer = findChatAnswer('xyzzy plugh qwerty');
    expect(answer.isFallback === true || answer.text.toLowerCase().includes('did you mean')).toBe(
      true
    );
  });

  it('attaches follow-up questions to successful matches', () => {
    const answer = findChatAnswer('What certifications do you hold?');
    expect(answer.followUpQuestions?.length).toBeGreaterThan(0);
  });
});

describe('getPageAwareSuggestions', () => {
  it('returns project-specific suggestions on project detail pages', () => {
    const suggestions = getPageAwareSuggestions('/projects/vulnessus');
    expect(suggestions[0]).toContain('Vulnessus');
  });

  it('returns projects page suggestions', () => {
    const suggestions = getPageAwareSuggestions('/projects');
    expect(suggestions.some((s) => s.includes('Vulnessus'))).toBe(true);
  });
});
