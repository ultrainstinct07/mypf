import Fuse, { type IFuseOptions } from 'fuse.js';
import {
  SITE_CONFIG,
  FAQ_ITEMS,
  EXPERTISE_ITEMS,
  CONTACT_ENGAGEMENTS,
} from '@/lib/constants';
import {
  CONFIDENTIAL_STATS,
  CONFIDENTIAL_ENGAGEMENTS,
} from '@/lib/confidential-engagements';
import {
  CTF_CHAT_ENCODED_TOKEN,
  CTF_CHAT_SECRET_PHRASE,
} from '@/lib/ctf/challenges';

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  links?: ChatLink[];
}

export interface ChatAnswer {
  text: string;
  links?: ChatLink[];
  isFallback?: boolean;
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
  },
  'Tell me about your public projects': {
    text: `${SITE_CONFIG.name} builds and maintains open security tools you can explore publicly:\n\n• Vulnessus — enterprise vulnerability management (Rust/Axum, Python plugins, Elasticsearch)\n• DPDP Act Compliance Scanner — automated privacy compliance with 23-rule coverage\n• Phishing Detection System — multi-factor URL analysis (~95% accuracy)\n\nMore tools and write-ups are on the projects page.`,
    links: [
      { label: 'All projects', href: '/projects' },
      { label: 'Featured work', href: '#projects' },
      { label: 'GitHub', href: SITE_CONFIG.github },
    ],
  },
  'What NDA work have you done?': {
    text: `${SITE_CONFIG.name} has delivered ${CONFIDENTIAL_STATS.displayLabel} professional security engagements under client NDAs — scope, findings, and deliverables stay confidential. Work spans web & API VAPT, mobile pentesting, Active Directory/red team ops, network pentests, critical infrastructure audits, cloud assessments, wireless/IoT reviews, phishing simulation, and compliance-aligned reporting. Categories are anonymized by sector and engagement type; detailed case studies are shared during scoping calls.`,
    links: [
      { label: 'Confidential work', href: '/projects' },
      { label: 'Contact for scoping', href: '#contact' },
    ],
  },
  'How can I contact you?': {
    text: `Reach ${SITE_CONFIG.name} directly:\n\n• Email: ${SITE_CONFIG.email}\n• Phone: ${SITE_CONFIG.phone}\n• Location: ${SITE_CONFIG.location}\n• LinkedIn & GitHub links are on the contact section.`,
    links: [
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Contact section', href: '#contact' },
      { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
    ],
  },
  'Are you available for consulting?': {
    text: `Yes — ${SITE_CONFIG.name} is open to security consulting and full-time offensive security roles. Services include web/API pentesting, mobile assessments, AD/red team operations, critical infrastructure VAPT, cloud reviews, and security automation. Email ${SITE_CONFIG.email} to request reports or schedule a scoping call.`,
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Services offered', href: '#contact' },
    ],
  },
};

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

function matchSuggestedQuestion(query: string): ChatAnswer | null {
  const normalized = normalizeQuery(query);

  if (normalized in SUGGESTED_ANSWERS) {
    return SUGGESTED_ANSWERS[normalized as keyof typeof SUGGESTED_ANSWERS];
  }

  return null;
}

const FEATURED_PROJECTS = [
  {
    slug: 'vulnessus',
    title: 'Vulnessus',
    description:
      'Enterprise-grade vulnerability management platform with a Rust (Axum) backend, Python plugin execution, Elasticsearch, and AES-256-GCM credential encryption.',
  },
  {
    slug: 'dpdp-scanner',
    title: 'DPDP Act Compliance Scanner',
    description:
      'Automated privacy scanner with a 23-rule coverage matrix, CVSS-like scoring, and Vulnessus plugin integration.',
  },
  {
    slug: 'phishing-detector',
    title: 'Phishing Detection System',
    description:
      'Multi-factor phishing URL detector using URL heuristics, WHOIS analysis, and threat intelligence feeds (~95% accuracy).',
  },
] as const;

function buildChatKnowledge(): ChatEntry[] {
  const entries: ChatEntry[] = [];

  for (const faq of FAQ_ITEMS) {
    entries.push({
      id: `faq-${faq.id}`,
      keywords: faq.question.toLowerCase().split(/\W+/).filter(Boolean),
      question: faq.question,
      answer: faq.answer,
    });
  }

  entries.push({
    id: 'bio-short',
    keywords: ['about', 'bio', 'background', 'who', 'introduction', 'summary'],
    question: `Who is ${SITE_CONFIG.name}?`,
    answer: SITE_CONFIG.bio.short,
    links: [{ label: 'About section', href: '#about' }],
  });

  entries.push({
    id: 'contact-email',
    keywords: ['email', 'mail', 'reach', 'write'],
    question: 'What is your email address?',
    answer: `You can reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email}.`,
    links: [
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Contact section', href: '#contact' },
    ],
  });

  entries.push({
    id: 'contact-phone',
    keywords: ['phone', 'call', 'number', 'mobile'],
    question: 'What is your phone number?',
    answer: `${SITE_CONFIG.name}'s phone number is ${SITE_CONFIG.phone}.`,
    links: [{ label: 'Call', href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}` }],
  });

  entries.push({
    id: 'contact-linkedin',
    keywords: ['linkedin', 'social', 'profile'],
    question: 'Do you have LinkedIn?',
    answer: `Yes — connect with ${SITE_CONFIG.name} on LinkedIn.`,
    links: [{ label: 'LinkedIn profile', href: SITE_CONFIG.linkedin }],
  });

  entries.push({
    id: 'contact-github',
    keywords: ['github', 'code', 'repository', 'repos', 'open source'],
    question: 'Do you have GitHub?',
    answer: `${SITE_CONFIG.name} publishes open-source security tools on GitHub.`,
    links: [{ label: 'GitHub profile', href: SITE_CONFIG.github }],
  });

  entries.push({
    id: 'location',
    keywords: ['location', 'where', 'based', 'city', 'country', 'faridabad', 'india'],
    question: 'Where are you based?',
    answer: `${SITE_CONFIG.name} is based in ${SITE_CONFIG.location}.`,
  });

  entries.push({
    id: 'company',
    keywords: ['company', 'employer', 'work', 'job', 'levithan'],
    question: 'Where do you work?',
    answer: `${SITE_CONFIG.name} is ${SITE_CONFIG.employmentStatus.toLowerCase()} at ${SITE_CONFIG.company} as an ${SITE_CONFIG.role}.`,
  });

  entries.push({
    id: 'experience',
    keywords: ['experience', 'years', 'career', 'background'],
    question: 'How much experience do you have?',
    answer: SITE_CONFIG.bio.paragraph1,
  });

  entries.push({
    id: 'nda-summary',
    keywords: ['nda', 'confidential', 'engagements', '50', 'private', 'client'],
    question: 'Tell me about confidential / NDA work',
    answer: `${CONFIDENTIAL_STATS.summary} Categories include web VAPT, mobile pentesting, AD/red team, API security, network pentests, critical infrastructure audits, cloud assessments, and more — all anonymized by sector and engagement type.`,
    links: [
      { label: 'View projects', href: '/projects' },
      { label: 'Contact for scoping', href: '#contact' },
    ],
  });

  const topCategories = CONFIDENTIAL_ENGAGEMENTS.slice(0, 4)
    .map((e) => `${e.title} (${e.count})`)
    .join('; ');
  entries.push({
    id: 'nda-categories',
    keywords: ['categories', 'types', 'engagement types', 'scope'],
    question: 'What types of NDA engagements have you done?',
    answer: `Top engagement categories include: ${topCategories}. Full breakdown is on the projects page under the Confidential tab.`,
    links: [{ label: 'Confidential work', href: '/projects' }],
  });

  for (const project of FEATURED_PROJECTS) {
    entries.push({
      id: `project-${project.slug}`,
      keywords: [
        project.slug,
        project.title.toLowerCase(),
        ...project.title.toLowerCase().split(/\W+/).filter(Boolean),
      ],
      question: `Tell me about ${project.title}`,
      answer: project.description,
      links: [{ label: `View ${project.title}`, href: `/projects/${project.slug}` }],
    });
  }

  entries.push({
    id: 'projects-overview',
    keywords: ['projects', 'portfolio', 'tools', 'work', 'public'],
    question: 'What projects have you built?',
    answer: `Featured public projects: ${FEATURED_PROJECTS.map((p) => p.title).join(', ')}. ${SITE_CONFIG.name} has also delivered ${CONFIDENTIAL_STATS.displayLabel} professional engagements under NDAs.`,
    links: [
      { label: 'All projects', href: '/projects' },
      { label: 'Featured work', href: '#projects' },
    ],
  });

  for (const item of EXPERTISE_ITEMS) {
    entries.push({
      id: `expertise-${item.id}`,
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
    });
  }

  const servicesList = CONTACT_ENGAGEMENTS.map(
    (e) => `${e.title}: ${e.description}`
  ).join(' ');
  entries.push({
    id: 'services',
    keywords: ['consulting', 'services', 'hire', 'hire you', 'engagement', 'pentest', 'vapt'],
    question: 'What consulting services do you offer?',
    answer: `${SITE_CONFIG.name} offers: ${servicesList}`,
    links: [{ label: 'Get in touch', href: '#contact' }],
  });

  entries.push({
    id: 'availability',
    keywords: ['available', 'availability', 'consulting', 'full-time', 'hire', 'open to'],
    question: 'Are you available for consulting or full-time roles?',
    answer: FAQ_ITEMS.find((f) => f.id === '4')?.answer ?? '',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
    ],
  });

  return entries;
}

const CHAT_KNOWLEDGE = buildChatKnowledge();

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
  patterns: RegExp[];
  getAnswer: () => ChatAnswer;
};

const INTENT_MATCHERS: IntentMatcher[] = [
  {
    id: 'email',
    patterns: [/\b(email|e-mail|mail)\b/i, /\bhow (can|do) i (reach|contact)\b/i],
    getAnswer: () => ({
      text: `You can reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email}.`,
      links: [
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
        { label: 'Contact section', href: '#contact' },
      ],
    }),
  },
  {
    id: 'phone',
    patterns: [/\b(phone|call|number)\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name}'s phone number is ${SITE_CONFIG.phone}.`,
      links: [{ label: 'Call', href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}` }],
    }),
  },
  {
    id: 'linkedin',
    patterns: [/\blinkedin\b/i],
    getAnswer: () => ({
      text: `Connect with ${SITE_CONFIG.name} on LinkedIn.`,
      links: [{ label: 'LinkedIn profile', href: SITE_CONFIG.linkedin }],
    }),
  },
  {
    id: 'github',
    patterns: [/\bgithub\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name} publishes open-source security tools on GitHub.`,
      links: [{ label: 'GitHub profile', href: SITE_CONFIG.github }],
    }),
  },
  {
    id: 'location',
    patterns: [/\b(where|location|based|city)\b/i],
    getAnswer: () => ({
      text: `${SITE_CONFIG.name} is based in ${SITE_CONFIG.location}.`,
    }),
  },
  {
    id: 'certifications',
    patterns: [/\b(certs?|certifications?|oscp|crta|offsec)\b/i],
    getAnswer: () => ({
      text: FAQ_ITEMS[0].answer,
      links: [{ label: 'About section', href: '#about' }],
    }),
  },
  {
    id: 'nda',
    patterns: [/\b(nda|confidential|50\+?|50 plus)\b/i],
    getAnswer: () => ({
      text: `${CONFIDENTIAL_STATS.summary} Engagement categories span web VAPT, mobile, AD/red team, API, network, critical infrastructure, cloud, wireless/IoT, phishing simulation, and compliance support.`,
      links: [
        { label: 'View projects', href: '/projects' },
        { label: 'Contact for scoping', href: '#contact' },
      ],
    }),
  },
  {
    id: 'vulnessus',
    patterns: [/\bvulnessus\b/i],
    getAnswer: () => {
      const p = FEATURED_PROJECTS[0];
      return {
        text: p.description,
        links: [{ label: 'View Vulnessus', href: `/projects/${p.slug}` }],
      };
    },
  },
  {
    id: 'dpdp',
    patterns: [/\b(dpdp|privacy scanner|compliance scanner)\b/i],
    getAnswer: () => {
      const p = FEATURED_PROJECTS[1];
      return {
        text: p.description,
        links: [{ label: 'View DPDP Scanner', href: `/projects/${p.slug}` }],
      };
    },
  },
  {
    id: 'phishing',
    patterns: [/\bphishing\b/i],
    getAnswer: () => {
      const p = FEATURED_PROJECTS[2];
      return {
        text: p.description,
        links: [{ label: 'View Phishing Detector', href: `/projects/${p.slug}` }],
      };
    },
  },
  {
    id: 'projects',
    patterns: [/\b(projects?|portfolio|tools you built)\b/i],
    getAnswer: () => ({
      text: `Featured public projects: ${FEATURED_PROJECTS.map((p) => p.title).join(', ')}. Plus ${CONFIDENTIAL_STATS.displayLabel} professional engagements under NDAs.`,
      links: [
        { label: 'All projects', href: '/projects' },
        { label: 'Featured work', href: '#projects' },
      ],
    }),
  },
  {
    id: 'availability',
    patterns: [/\b(available|availability|hire|consulting|full-time|open to work)\b/i],
    getAnswer: () => ({
      text: FAQ_ITEMS[3].answer,
      links: [
        { label: 'Contact', href: '#contact' },
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
      ],
    }),
  },
  {
    id: 'experience',
    patterns: [/\b(experience|years|how long)\b/i],
    getAnswer: () => ({
      text: SITE_CONFIG.bio.short,
      links: [{ label: 'About section', href: '#about' }],
    }),
  },
  {
    id: 'contact',
    patterns: [/\b(contact|get in touch|reach out)\b/i],
    getAnswer: () => ({
      text: `Reach ${SITE_CONFIG.name} at ${SITE_CONFIG.email} or ${SITE_CONFIG.phone}. Based in ${SITE_CONFIG.location}.`,
      links: [
        { label: 'Send email', href: `mailto:${SITE_CONFIG.email}` },
        { label: 'Contact section', href: '#contact' },
        { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
      ],
    }),
  },
];

function matchIntent(query: string): ChatAnswer | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  for (const matcher of INTENT_MATCHERS) {
    if (matcher.patterns.some((p) => p.test(trimmed))) {
      return matcher.getAnswer();
    }
  }

  return null;
}

function getFallbackAnswer(): ChatAnswer {
  return {
    text: "I'm not sure about that. Try asking about certifications, public projects, NDA engagements, or contact info — or browse the FAQ and projects pages.",
    links: [
      { label: 'FAQ section', href: '#faq' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '#contact' },
    ],
    isFallback: true,
  };
}

export function findChatAnswer(query: string): ChatAnswer {
  const trimmed = query.trim();
  if (!trimmed) return getFallbackAnswer();

  if (trimmed.toLowerCase() === CTF_CHAT_SECRET_PHRASE) {
    return {
      text: `Enumeration token retrieved. Payload (encoded): ${CTF_CHAT_ENCODED_TOKEN}\n\nDecode: Base64 first, then ROT13. Export via terminal: export TOKEN=<flag>`,
    };
  }

  const suggestedMatch = matchSuggestedQuestion(trimmed);
  if (suggestedMatch) return suggestedMatch;

  const intentMatch = matchIntent(trimmed);
  if (intentMatch) return intentMatch;

  const results = fuse.search(trimmed);
  if (results.length > 0 && (results[0].score ?? 1) < 0.45) {
    const entry = results[0].item;
    return {
      text: entry.answer,
      links: entry.links,
    };
  }

  return getFallbackAnswer();
}
