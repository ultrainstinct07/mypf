/**
 * Canonical public project metadata for chat + UI.
 * Keep in sync with content/projects/*.mdx frontmatter when adding projects.
 */
export interface PublicProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export const PUBLIC_PROJECTS: PublicProject[] = [
  {
    slug: 'vulnessus',
    title: 'Vulnessus',
    description:
      'Enterprise-grade vulnerability management platform with a Rust (Axum) backend, Python plugin execution via PyO3, Elasticsearch, and AES-256-GCM credential encryption.',
    tags: ['Security', 'VAPT', 'Rust', 'Next.js'],
    featured: true,
  },
  {
    slug: 'dpdp-scanner',
    title: 'DPDP Act Compliance Scanner',
    description:
      'Automated privacy scanner with a 23-rule coverage matrix, CVSS-like scoring, and Vulnessus plugin integration.',
    tags: ['Compliance', 'Privacy', 'Python', 'Security'],
    featured: true,
  },
  {
    slug: 'phishing-detector',
    title: 'Phishing Detection System',
    description:
      'Multi-factor phishing URL detector using URL heuristics, WHOIS analysis, and threat intelligence feeds (~95% accuracy).',
    tags: ['Security', 'Detection', 'Python'],
    featured: true,
  },
  {
    slug: 'ad-void',
    title: 'AD-Void',
    description:
      'Active Directory offensive security knowledge base — Kerberos/LDAP abuse paths, attack notes, and red team scenario walkthroughs.',
    tags: ['Active Directory', 'Red Team', 'Offensive Security'],
    featured: true,
  },
  {
    slug: 'offensive-toolkit',
    title: 'Offensive Security Automation Toolkit',
    description:
      'Python and Bash reconnaissance and vulnerability correlation modules that reduce manual VAPT triage effort by ~30%.',
    tags: ['Automation', 'Security', 'Python', 'Bash'],
    featured: false,
  },
  {
    slug: 'mobile-pentest',
    title: 'Mobile App Penetration Testing',
    description:
      'Mobile application security assessments for Android and iOS — methodologies, findings, and remediation for common mobile vulnerabilities.',
    tags: ['Pentesting', 'Mobile', 'Security'],
    featured: false,
  },
  {
    slug: 'windows-internals',
    title: 'Windows Internals Research',
    description:
      'Research notes and tooling experiments on Windows kernel architecture, security mechanisms, and low-level system programming.',
    tags: ['Research', 'Windows', 'Kernel'],
    featured: false,
  },
];

export function getPublicProjectBySlug(slug: string): PublicProject | undefined {
  return PUBLIC_PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): PublicProject[] {
  return PUBLIC_PROJECTS.filter((p) => p.featured);
}
