import Fuse, { type IFuseOptions } from 'fuse.js';
import {
  SITE_CONFIG,
  FAQ_ITEMS,
  EXPERTISE_ITEMS,
  CONTACT_ENGAGEMENTS,
  TESTIMONIALS,
} from '@/lib/constants';
import {
  CONFIDENTIAL_STATS,
  CONFIDENTIAL_ENGAGEMENTS,
} from '@/lib/confidential-engagements';
import {
  CTF_CHAT_ENCODED_TOKEN,
  CTF_CHAT_SECRET_PHRASE,
} from '@/lib/ctf/challenges';
import {
  CTF_CHAT_HINT_ANSWER,
  CTF_CHAT_HINT_QUESTION,
} from '@/lib/ctf/public-hints';
import { PUBLIC_PROJECTS, getPublicProjectBySlug } from '@/lib/public-projects';

export interface ChatLink {
  label: string;
  href: string;
}

export type ChatCategory =
  | 'about'
  | 'certs'
  | 'contact'
  | 'projects'
  | 'nda'
  | 'expertise'
  | 'services'
  | 'general';

export interface ChatEntry {
  id: string;
  category: ChatCategory;
  keywords: string[];
  question: string;
  answer: string;
  links?: ChatLink[];
  relatedEntryIds?: string[];
}

export interface ChatAnswer {
  text: string;
  links?: ChatLink[];
  followUpQuestions?: string[];
  isFallback?: boolean;
  entryId?: string;
}

export interface FindChatAnswerOptions {
  lastEntryId?: string;
}

export const WELCOME_MESSAGE = `Hi! I'm ${SITE_CONFIG.name}'s portfolio assistant. Ask about certifications (OSCP, OSCP+, CRTA), ${CONFIDENTIAL_STATS.displayLabel} NDA engagements, public projects like Vulnessus, or how to get in touch.`;

export const SUGGESTED_QUESTIONS = [
  'What certifications do you hold?',
  'Tell me about your public projects',
  'What NDA work have you done?',
  'How can I contact you?',
  'Are you available for consulting?',
] as const;

export const SUGGESTED_ANSWERS: Record<(typeof SUGGESTED_QUESTIONS)[number], ChatAnswer> = {
  'What certifications do you hold?': {
    text: FAQ_ITEMS[0].answer,
    links: [{ label: 'About section', href: '#about' }],
    entryId: 'faq-1',
    followUpQuestions: [
      'Tell me about your public projects',
      'What is your expertise in Red Team Operations?',
      'Are you available for consulting?',
    ],
  },
  'Tell me about your public projects': {
    text: `${SITE_CONFIG.name} builds and maintains open security tools you can explore publicly:\n\n• Vulnessus — enterprise vulnerability management (Rust/Axum, Python plugins, Elasticsearch)\n• DPDP Act Compliance Scanner — automated privacy compliance with 23-rule coverage\n• Phishing Detection System — multi-factor URL analysis (~95% accuracy)\n• AD-Void — Active Directory attack cheat sheet and red team reference\n\nMore tools and write-ups are on the projects page.`,
    links: [
      { label: 'All projects', href: '/projects' },
      { label: 'Featured work', href: '#projects' },
      { label: 'GitHub', href: SITE_CONFIG.github },
    ],
    entryId: 'projects-overview',
    followUpQuestions: [
      'Tell me about Vulnessus',
      'Tell me about AD-Void',
      'What NDA work have you done?',
    ],
  },
  'What NDA work have you done?': {
    text: `${SITE_CONFIG.name} has delivered ${CONFIDENTIAL_STATS.displayLabel} professional security engagements under client NDAs — scope, findings, and deliverables stay confidential. Work spans web & API VAPT, mobile pentesting, Active Directory/red team ops, network pentests, critical infrastructure audits, cloud assessments, wireless/IoT reviews, phishing simulation, and compliance-aligned reporting. Categories are anonymized by sector and engagement type; detailed case studies are shared during scoping calls.`,
    links: [
      { label: 'Confidential work', href: '/projects' },
      { label: 'Contact for scoping', href: '#contact' },
    ],
    entryId: 'nda-summary',
    followUpQuestions: [
      'What types of NDA engagements have you done?',
      'Tell me about your public projects',
      'How can I contact you?',
    ],
  },
  'How can I contact you?': {
    text: `Reach ${SITE_CONFIG.name} directly:\n\n• Email: ${SITE_CONFIG.email}\n• Phone: ${SITE_CONFIG.phone}\n• Location: ${SITE_CONFIG.location}\n• LinkedIn & GitHub links are on the contact section.`,
    links: [
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Contact section', href: '#contact' },
      { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
    ],
    entryId: 'contact-summary',
    followUpQuestions: [
      'Are you available for consulting?',
      'What consulting services do you offer?',
      'What certifications do you hold?',
    ],
  },
  'Are you available for consulting?': {
    text: `Yes — ${SITE_CONFIG.name} is open to security consulting and full-time offensive security roles. Services include web/API pentesting, mobile assessments, AD/red team operations, critical infrastructure VAPT, cloud reviews, and security automation. Email ${SITE_CONFIG.email} to request reports or schedule a scoping call.`,
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Services offered', href: '#contact' },
    ],
    entryId: 'availability',
    followUpQuestions: [
      'What consulting services do you offer?',
      'How can I contact you?',
      'What NDA work have you done?',
    ],
  },
};

const CATEGORY_FOLLOW_UPS: Record<ChatCategory, string[]> = {
  about: ['What certifications do you hold?', 'Tell me about your public projects'],
  certs: ['Tell me about your public projects', 'Are you available for consulting?'],
  contact: ['Are you available for consulting?', 'What consulting services do you offer?'],
  projects: ['What NDA work have you done?', 'How can I contact you?'],
  nda: ['Tell me about your public projects', 'How can I contact you?'],
  expertise: ['Tell me about your public projects', 'What certifications do you hold?'],
  services: ['How can I contact you?', 'Are you available for consulting?'],
  general: ['What certifications do you hold?', 'Tell me about your public projects'],
};

const QUERY_ALIASES: Record<string, string> = {
  oscp: 'oscp certification',
  'oscp+': 'oscp plus certification',
  crta: 'certified red team analyst',
  vapt: 'vulnerability assessment penetration testing',
  pentest: 'penetration testing',
  pentesting: 'penetration testing',
  ad: 'active directory',
  'red team': 'red team operations',
  hire: 'available consulting',
  email: 'contact email',
};

function normalizeQuery(query: string): string {
  let normalized = query.trim().replace(/\s+/g, ' ').toLowerCase();
  normalized = normalized.replace(/[^\w\s+/-]/g, ' ').replace(/\s+/g, ' ').trim();

  for (const [alias, expansion] of Object.entries(QUERY_ALIASES)) {
    const pattern = new RegExp(`\\b${alias.replace(/[+]/g, '\\+')}\\b`, 'gi');
    if (pattern.test(normalized)) {
      normalized = `${normalized} ${expansion}`;
    }
  }

  return normalized.replace(/\s+/g, ' ').trim();
}

function matchSuggestedQuestion(query: string): ChatAnswer | null {
  const normalized = normalizeQuery(query);

  if (normalized === normalizeQuery(CTF_CHAT_HINT_QUESTION)) {
    return {
      text: CTF_CHAT_HINT_ANSWER,
      links: [
        { label: 'Start at /void', href: '/void' },
        { label: 'View robots.txt', href: '/robots.txt' },
      ],
      entryId: 'ctf-hint',
      followUpQuestions: ['Tell me about your public projects', 'How can I contact you?'],
    };
  }

  for (const question of SUGGESTED_QUESTIONS) {
    if (normalized === question.toLowerCase()) {
      return SUGGESTED_ANSWERS[question];
    }
  }

  return null;
}

function buildChatKnowledge(): ChatEntry[] {
  const entries: ChatEntry[] = [];

  for (const faq of FAQ_ITEMS) {
    entries.push({
      id: `faq-${faq.id}`,
      category: faq.id === '1' ? 'certs' : faq.id === '4' ? 'services' : 'general',
      keywords: faq.question.toLowerCase().split(/\W+/).filter(Boolean),
      question: faq.question,
      answer: faq.answer,
      relatedEntryIds:
        faq.id === '1'
          ? ['projects-overview', 'availability']
          : faq.id === '3'
            ? ['project-vulnessus', 'services']
            : ['contact-summary'],
    });
  }

  entries.push({
    id: 'bio-short',
    category: 'about',
    keywords: ['about', 'bio', 'background', 'who', 'introduction', 'summary'],
    question: `Who is ${SITE_CONFIG.name}?`,
    answer: SITE_CONFIG.bio.short,
    links: [{ label: 'About section', href: '#about' }],
    relatedEntryIds: ['faq-1', 'experience', 'projects-overview'],
  });

  entries.push({
    id: 'contact-summary',
    category: 'contact',
    keywords: ['contact', 'reach', 'touch', 'get in touch'],
    question: 'How can I contact you?',
    answer: `Reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email} or ${SITE_CONFIG.phone}. Based in ${SITE_CONFIG.location}.`,
    links: [
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Contact section', href: '#contact' },
      { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
    ],
    relatedEntryIds: ['availability', 'services'],
  });

  entries.push({
    id: 'contact-email',
    category: 'contact',
    keywords: ['email', 'mail', 'reach', 'write'],
    question: 'What is your email address?',
    answer: `You can reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email}.`,
    links: [
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Contact section', href: '#contact' },
    ],
    relatedEntryIds: ['contact-summary', 'availability'],
  });

  entries.push({
    id: 'contact-phone',
    category: 'contact',
    keywords: ['phone', 'call', 'number', 'mobile'],
    question: 'What is your phone number?',
    answer: `${SITE_CONFIG.name}'s phone number is ${SITE_CONFIG.phone}.`,
    links: [{ label: 'Call', href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}` }],
    relatedEntryIds: ['contact-summary'],
  });

  entries.push({
    id: 'contact-linkedin',
    category: 'contact',
    keywords: ['linkedin', 'social', 'profile'],
    question: 'Do you have LinkedIn?',
    answer: `Yes — connect with ${SITE_CONFIG.name} on LinkedIn.`,
    links: [{ label: 'LinkedIn profile', href: SITE_CONFIG.linkedin }],
    relatedEntryIds: ['contact-github', 'contact-summary'],
  });

  entries.push({
    id: 'contact-github',
    category: 'contact',
    keywords: ['github', 'code', 'repository', 'repos', 'open source'],
    question: 'Do you have GitHub?',
    answer: `${SITE_CONFIG.name} publishes open-source security tools on GitHub.`,
    links: [{ label: 'GitHub profile', href: SITE_CONFIG.github }],
    relatedEntryIds: ['projects-overview', 'contact-linkedin'],
  });

  entries.push({
    id: 'location',
    category: 'about',
    keywords: ['location', 'where', 'based', 'city', 'country', 'faridabad', 'india'],
    question: 'Where are you based?',
    answer: `${SITE_CONFIG.name} is based in ${SITE_CONFIG.location}.`,
    relatedEntryIds: ['contact-summary', 'company'],
  });

  entries.push({
    id: 'company',
    category: 'about',
    keywords: ['company', 'employer', 'work', 'job', 'levithan'],
    question: 'Where do you work?',
    answer: `${SITE_CONFIG.name} is ${SITE_CONFIG.employmentStatus.toLowerCase()} at ${SITE_CONFIG.company} as an ${SITE_CONFIG.role}.`,
    relatedEntryIds: ['experience', 'bio-short'],
  });

  entries.push({
    id: 'experience',
    category: 'about',
    keywords: ['experience', 'years', 'career', 'background'],
    question: 'How much experience do you have?',
    answer: SITE_CONFIG.bio.paragraph1,
    links: [{ label: 'About section', href: '#about' }],
    relatedEntryIds: ['faq-1', 'nda-summary'],
  });

  entries.push({
    id: 'nda-summary',
    category: 'nda',
    keywords: ['nda', 'confidential', 'engagements', '50', 'private', 'client'],
    question: 'Tell me about confidential / NDA work',
    answer: `${CONFIDENTIAL_STATS.summary} Categories include web VAPT, mobile pentesting, AD/red team, API security, network pentests, critical infrastructure audits, cloud assessments, and more — all anonymized by sector and engagement type.`,
    links: [
      { label: 'View projects', href: '/projects' },
      { label: 'Contact for scoping', href: '#contact' },
    ],
    relatedEntryIds: ['nda-categories', 'projects-overview'],
  });

  const topCategories = CONFIDENTIAL_ENGAGEMENTS.slice(0, 4)
    .map((e) => `${e.title} (${e.count})`)
    .join('; ');
  entries.push({
    id: 'nda-categories',
    category: 'nda',
    keywords: ['categories', 'types', 'engagement types', 'scope'],
    question: 'What types of NDA engagements have you done?',
    answer: `Top engagement categories include: ${topCategories}. Full breakdown is on the projects page under the Confidential tab.`,
    links: [{ label: 'Confidential work', href: '/projects' }],
    relatedEntryIds: ['nda-summary', 'services'],
  });

  for (const project of PUBLIC_PROJECTS) {
    entries.push({
      id: `project-${project.slug}`,
      category: 'projects',
      keywords: [
        project.slug,
        project.title.toLowerCase(),
        ...project.title.toLowerCase().split(/\W+/).filter(Boolean),
        ...project.tags.map((t) => t.toLowerCase()),
      ],
      question: `Tell me about ${project.title}`,
      answer: project.description,
      links: [{ label: `View ${project.title}`, href: `/projects/${project.slug}` }],
      relatedEntryIds: ['projects-overview', 'nda-summary'],
    });
  }

  entries.push({
    id: 'projects-overview',
    category: 'projects',
    keywords: ['projects', 'portfolio', 'tools', 'work', 'public', 'built'],
    question: 'What projects have you built?',
    answer: `Featured public projects: ${PUBLIC_PROJECTS.filter((p) => p.featured).map((p) => p.title).join(', ')}. ${SITE_CONFIG.name} has also delivered ${CONFIDENTIAL_STATS.displayLabel} professional engagements under NDAs.`,
    links: [
      { label: 'All projects', href: '/projects' },
      { label: 'Featured work', href: '#projects' },
    ],
    relatedEntryIds: ['project-vulnessus', 'project-ad-void', 'nda-summary'],
  });

  entries.push({
    id: 'tech-stack',
    category: 'general',
    keywords: ['tech stack', 'technology', 'automation', 'python', 'rust', 'tools', 'stack'],
    question: 'What is your technology stack for security automation?',
    answer: FAQ_ITEMS[2].answer,
    links: [
      { label: 'View Vulnessus', href: '/projects/vulnessus' },
      { label: 'All projects', href: '/projects' },
    ],
    relatedEntryIds: ['project-vulnessus', 'project-offensive-toolkit'],
  });

  for (const item of EXPERTISE_ITEMS) {
    entries.push({
      id: `expertise-${item.id}`,
      category: 'expertise',
      keywords: [
        item.title.toLowerCase(),
        ...item.title.toLowerCase().split(/\W+/).filter(Boolean),
        'expertise',
        'skills',
        'specialize',
      ],
      question: `What is your expertise in ${item.title}?`,
      answer: item.description,
      links: [{ label: 'Expertise section', href: '#expertise' }],
      relatedEntryIds: ['faq-1', 'nda-summary'],
    });
  }

  const servicesList = CONTACT_ENGAGEMENTS.map(
    (e) => `${e.title}: ${e.description}`
  ).join(' ');
  entries.push({
    id: 'services',
    category: 'services',
    keywords: ['consulting', 'services', 'hire', 'hire you', 'engagement', 'pentest', 'vapt'],
    question: 'What consulting services do you offer?',
    answer: `${SITE_CONFIG.name} offers: ${servicesList}`,
    links: [{ label: 'Get in touch', href: '#contact' }],
    relatedEntryIds: ['availability', 'contact-summary'],
  });

  entries.push({
    id: 'availability',
    category: 'services',
    keywords: ['available', 'availability', 'consulting', 'full-time', 'hire', 'open to'],
    question: 'Are you available for consulting or full-time roles?',
    answer: FAQ_ITEMS.find((f) => f.id === '4')?.answer ?? '',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
    ],
    relatedEntryIds: ['services', 'contact-summary'],
  });

  entries.push({
    id: 'testimonials',
    category: 'general',
    keywords: ['testimonials', 'reviews', 'feedback', 'recommendation', 'clients'],
    question: 'What do clients say about your work?',
    answer: `Colleagues and clients highlight ${SITE_CONFIG.name}'s pragmatic offensive security approach:\n\n${TESTIMONIALS.slice(0, 3).map((t) => `• ${t.name} (${t.role}, ${t.company}): "${t.quote.slice(0, 120)}…"`).join('\n')}`,
    links: [{ label: 'Contact for references', href: '#contact' }],
    relatedEntryIds: ['nda-summary', 'availability'],
  });

  entries.push({
    id: 'ctf-hint',
    category: 'general',
    keywords: ['easter egg', 'hidden', 'challenge', 'ctf', 'secret', 'puzzle', 'void999', 'operation void'],
    question: CTF_CHAT_HINT_QUESTION,
    answer: CTF_CHAT_HINT_ANSWER,
    links: [
      { label: 'Start at /void', href: '/void' },
      { label: 'View robots.txt', href: '/robots.txt' },
    ],
    relatedEntryIds: ['projects-overview'],
  });

  return entries;
}

const CHAT_KNOWLEDGE = buildChatKnowledge();
const ENTRY_BY_ID = new Map(CHAT_KNOWLEDGE.map((e) => [e.id, e]));

const fuseOptions: IFuseOptions<ChatEntry> = {
  keys: [
    { name: 'question', weight: 0.4 },
    { name: 'answer', weight: 0.3 },
    { name: 'keywords', weight: 0.3 },
  ],
  threshold: 0.35,
  includeScore: true,
};

const fuse = new Fuse(CHAT_KNOWLEDGE, fuseOptions);

type IntentMatcher = {
  id: string;
  entryId: string;
  weight: number;
  patterns: RegExp[];
  getAnswer: () => ChatAnswer;
};

const INTENT_MATCHERS: IntentMatcher[] = [
  {
    id: 'email',
    entryId: 'contact-email',
    weight: 3,
    patterns: [/\b(email|e-mail|mail)\b/i, /\bhow (can|do) i (reach|contact)\b/i],
    getAnswer: () => ({
      text: `You can reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email}.`,
      links: [
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
        { label: 'Contact section', href: '#contact' },
      ],
      entryId: 'contact-email',
    }),
  },
  {
    id: 'phone',
    entryId: 'contact-phone',
    weight: 3,
    patterns: [/\b(phone|call|number)\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name}'s phone number is ${SITE_CONFIG.phone}.`,
      links: [{ label: 'Call', href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}` }],
      entryId: 'contact-phone',
    }),
  },
  {
    id: 'linkedin',
    entryId: 'contact-linkedin',
    weight: 3,
    patterns: [/\blinkedin\b/i],
    getAnswer: () => ({
      text: `Connect with ${SITE_CONFIG.name} on LinkedIn.`,
      links: [{ label: 'LinkedIn profile', href: SITE_CONFIG.linkedin }],
      entryId: 'contact-linkedin',
    }),
  },
  {
    id: 'github',
    entryId: 'contact-github',
    weight: 3,
    patterns: [/\bgithub\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name} publishes open-source security tools on GitHub.`,
      links: [{ label: 'GitHub profile', href: SITE_CONFIG.github }],
      entryId: 'contact-github',
    }),
  },
  {
    id: 'projects',
    entryId: 'projects-overview',
    weight: 4,
    patterns: [
      /\b(projects?|portfolio|tools you built|open source tools)\b/i,
      /\bwhat (have you|did you) build\b/i,
    ],
    getAnswer: () => ({
      text: `Featured public projects: ${PUBLIC_PROJECTS.filter((p) => p.featured).map((p) => p.title).join(', ')}. Plus ${CONFIDENTIAL_STATS.displayLabel} professional engagements under NDAs.`,
      links: [
        { label: 'All projects', href: '/projects' },
        { label: 'Featured work', href: '#projects' },
      ],
      entryId: 'projects-overview',
    }),
  },
  {
    id: 'location',
    entryId: 'location',
    weight: 2,
    patterns: [/\b(where are you based|your location|based in)\b/i, /\b(where|location|based|city)\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name} is based in ${SITE_CONFIG.location}.`,
      entryId: 'location',
    }),
  },
  {
    id: 'certifications',
    entryId: 'faq-1',
    weight: 3,
    patterns: [/\b(certs?|certifications?|oscp|crta|offsec)\b/i],
    getAnswer: () => ({
      text: FAQ_ITEMS[0].answer,
      links: [{ label: 'About section', href: '#about' }],
      entryId: 'faq-1',
    }),
  },
  {
    id: 'nda',
    entryId: 'nda-summary',
    weight: 3,
    patterns: [/\b(nda|confidential|50\+?|50 plus)\b/i],
    getAnswer: () => ({
      text: `${CONFIDENTIAL_STATS.summary} Engagement categories span web VAPT, mobile, AD/red team, API, network, critical infrastructure, cloud, wireless/IoT, phishing simulation, and compliance support.`,
      links: [
        { label: 'View projects', href: '/projects' },
        { label: 'Contact for scoping', href: '#contact' },
      ],
      entryId: 'nda-summary',
    }),
  },
  {
    id: 'availability',
    entryId: 'availability',
    weight: 3,
    patterns: [/\b(available|availability|hire|consulting|full-time|open to work)\b/i],
    getAnswer: () => ({
      text: FAQ_ITEMS[3].answer,
      links: [
        { label: 'Contact', href: '#contact' },
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      ],
      entryId: 'availability',
    }),
  },
  {
    id: 'experience',
    entryId: 'experience',
    weight: 2,
    patterns: [/\b(experience|years|how long)\b/i],
    getAnswer: () => ({
      text: SITE_CONFIG.bio.short,
      links: [{ label: 'About section', href: '#about' }],
      entryId: 'experience',
    }),
  },
  {
    id: 'contact',
    entryId: 'contact-summary',
    weight: 3,
    patterns: [/\b(contact|get in touch|reach out)\b/i],
    getAnswer: () => ({
      text: `Reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email} or ${SITE_CONFIG.phone}. Based in ${SITE_CONFIG.location}.`,
      links: [
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
        { label: 'Contact section', href: '#contact' },
        { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
      ],
      entryId: 'contact-summary',
    }),
  },
  {
    id: 'tech-stack',
    entryId: 'tech-stack',
    weight: 3,
    patterns: [/\b(tech stack|technology stack|automation stack)\b/i],
    getAnswer: () => ({
      text: FAQ_ITEMS[2].answer,
      links: [{ label: 'View Vulnessus', href: '/projects/vulnessus' }],
      entryId: 'tech-stack',
    }),
  },
  {
    id: 'testimonials',
    entryId: 'testimonials',
    weight: 3,
    patterns: [/\b(testimonials?|reviews?|feedback|recommendations?)\b/i],
    getAnswer: () => {
      const entry = ENTRY_BY_ID.get('testimonials');
      return {
        text: entry?.answer ?? '',
        links: entry?.links,
        entryId: 'testimonials',
      };
    },
  },
  {
    id: 'ctf-hint',
    entryId: 'ctf-hint',
    weight: 3,
    patterns: [/\b(easter egg|hidden challenge|ctf|secret challenge)\b/i],
    getAnswer: () => {
      return {
        text: CTF_CHAT_HINT_ANSWER,
        links: [
          { label: 'Start at /void', href: '/void' },
          { label: 'View robots.txt', href: '/robots.txt' },
        ],
        entryId: 'ctf-hint',
      };
    },
  },
  ...PUBLIC_PROJECTS.map(
    (project): IntentMatcher => ({
      id: `project-${project.slug}`,
      entryId: `project-${project.slug}`,
      weight: 5,
      patterns: [
        new RegExp(`\\b${project.slug.replace(/-/g, '[\\s-]?')}\\b`, 'i'),
        new RegExp(`\\b${project.title.split(/\s+/)[0]}\\b`, 'i'),
      ],
      getAnswer: () => ({
        text: project.description,
        links: [{ label: `View ${project.title}`, href: `/projects/${project.slug}` }],
        entryId: `project-${project.slug}`,
      }),
    })
  ),
];

function scoreIntentMatcher(matcher: IntentMatcher, query: string): number {
  const matchCount = matcher.patterns.filter((p) => p.test(query)).length;
  if (matchCount === 0) return 0;

  let score = matcher.weight * matchCount;

  if (matcher.id.startsWith('project-') && matcher.id !== 'projects-overview') {
    score += 2;
  }

  if (matcher.id === 'location' && /\bprojects?\b/i.test(query)) {
    score -= 3;
  }

  if (matcher.id === 'projects' && /\bprojects?\b/i.test(query)) {
    score += 2;
  }

  return score;
}

function matchIntent(query: string): ChatAnswer | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  let best: { matcher: IntentMatcher; score: number } | null = null;

  for (const matcher of INTENT_MATCHERS) {
    const score = scoreIntentMatcher(matcher, trimmed);
    if (score <= 0) continue;
    if (!best || score > best.score) {
      best = { matcher, score };
    }
  }

  if (!best) return null;
  return best.matcher.getAnswer();
}

function buildFollowUpQuestions(entryId: string): string[] {
  const entry = ENTRY_BY_ID.get(entryId);
  const questions: string[] = [];

  if (entry?.relatedEntryIds) {
    for (const relatedId of entry.relatedEntryIds) {
      const related = ENTRY_BY_ID.get(relatedId);
      if (related && !questions.includes(related.question)) {
        questions.push(related.question);
      }
      if (questions.length >= 2) break;
    }
  }

  if (entry?.category) {
    for (const fallback of CATEGORY_FOLLOW_UPS[entry.category]) {
      if (!questions.includes(fallback)) {
        questions.push(fallback);
      }
      if (questions.length >= 3) break;
    }
  }

  return questions.slice(0, 3);
}

function enrichAnswer(answer: ChatAnswer): ChatAnswer {
  if (answer.isFallback || !answer.entryId) {
    return answer;
  }

  return {
    ...answer,
    followUpQuestions: answer.followUpQuestions ?? buildFollowUpQuestions(answer.entryId),
  };
}

function entryToAnswer(entry: ChatEntry): ChatAnswer {
  return enrichAnswer({
    text: entry.answer,
    links: entry.links,
    entryId: entry.id,
  });
}

function getShortQueryAnswer(): ChatAnswer {
  return {
    text: 'Could you add a bit more detail? Try asking about certifications, projects, NDA work, or contact info.',
    followUpQuestions: [...SUGGESTED_QUESTIONS].slice(0, 3),
    isFallback: true,
  };
}

function getFallbackAnswer(): ChatAnswer {
  return {
    text: "I'm not sure about that. Try asking about certifications, public projects, NDA engagements, or contact info — or browse the FAQ and projects pages.",
    links: [
      { label: 'FAQ section', href: '#faq' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '#contact' },
    ],
    followUpQuestions: [...SUGGESTED_QUESTIONS],
    isFallback: true,
  };
}

function getNearMissAnswer(entry: ChatEntry): ChatAnswer {
  return enrichAnswer({
    text: `Did you mean to ask about "${entry.question}"?\n\n${entry.answer}`,
    links: entry.links,
    entryId: entry.id,
    followUpQuestions: buildFollowUpQuestions(entry.id),
  });
}

function searchFuse(query: string, lastEntryId?: string) {
  const results = fuse.search(query);

  if (!lastEntryId) return results;

  const lastEntry = ENTRY_BY_ID.get(lastEntryId);
  if (!lastEntry) return results;

  return results
    .map((result) => {
      const categoryBoost =
        result.item.category === lastEntry.category ? -0.08 : 0;
      const relatedBoost = lastEntry.relatedEntryIds?.includes(result.item.id)
        ? -0.12
        : 0;
      return {
        ...result,
        score: (result.score ?? 1) + categoryBoost + relatedBoost,
      };
    })
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
}

export function findChatAnswer(
  query: string,
  options: FindChatAnswerOptions = {}
): ChatAnswer {
  const trimmed = query.trim();
  if (!trimmed) return getFallbackAnswer();

  if (trimmed.toLowerCase() === CTF_CHAT_SECRET_PHRASE) {
    return {
      text: `Enumeration token retrieved. Payload (encoded): ${CTF_CHAT_ENCODED_TOKEN}\n\nDecode: Base64 first, then ROT13. Export via terminal: export TOKEN=<flag>`,
    };
  }

  if (trimmed.length < 3) {
    return getShortQueryAnswer();
  }

  const normalized = normalizeQuery(trimmed);

  const suggestedMatch = matchSuggestedQuestion(trimmed);
  if (suggestedMatch) return enrichAnswer(suggestedMatch);

  const intentMatch = matchIntent(trimmed);
  if (intentMatch) return enrichAnswer(intentMatch);

  const results = searchFuse(normalized, options.lastEntryId);
  const best = results[0];
  const bestScore = best?.score ?? 1;

  if (best && bestScore < 0.45) {
    return entryToAnswer(best.item);
  }

  if (best && bestScore >= 0.45 && bestScore < 0.6) {
    return getNearMissAnswer(best.item);
  }

  return getFallbackAnswer();
}

export function getPageAwareSuggestions(pathname: string): string[] {
  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const project = getPublicProjectBySlug(projectMatch[1]);
    if (project) {
      return [
        `Tell me about ${project.title}`,
        'Tell me about your public projects',
        'What NDA work have you done?',
      ];
    }
  }

  if (pathname.startsWith('/projects')) {
    return [
      'Tell me about Vulnessus',
      'Tell me about AD-Void',
      'What NDA work have you done?',
    ];
  }

  if (pathname === '/void') {
    return [
      CTF_CHAT_HINT_QUESTION,
      'What certifications do you hold?',
      'How can I contact you?',
    ];
  }

  if (pathname === '/') {
    return [CTF_CHAT_HINT_QUESTION, ...SUGGESTED_QUESTIONS];
  }

  return [...SUGGESTED_QUESTIONS];
}

export function getEntryQuestion(entryId: string): string | undefined {
  return ENTRY_BY_ID.get(entryId)?.question;
}

export { CHAT_KNOWLEDGE, ENTRY_BY_ID };
