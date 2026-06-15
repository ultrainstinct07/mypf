import { CTF_CHAT_HINT_QUESTION, CTF_FAQ_ANSWER } from '@/lib/ctf/public-hints';

export const SITE_CONFIG = {
  name: 'Kshitiz Kumar',
  role: 'Offensive Security Engineer',
  email: 'akshitizk21@gmail.com',
  phone: '+91-8178471289',
  linkedin: 'https://linkedin.com/in/kshitiz-kumar-void999',
  github: 'https://github.com/ultrainstinct07',
  website: 'https://void999.space',
  location: 'Faridabad, Haryana, India',
  company: 'Levithan Technologies',
  
  meta: {
    title: 'Kshitiz Kumar — Offensive Security Engineer | Portfolio',
    description: 'Portfolio of Kshitiz Kumar — Offensive Security Engineer & OSCP/OSCP+ Certified. Specializing in Web & Mobile Pentesting, Active Directory Attacks, Red Team Operations, and security automation.',
    siteUrl: 'https://void999.space',
  },

  bio: {
    short: "OSCP, OSCP+, and CRTA certified Offensive Security Engineer with 1.5+ years of hands-on experience in penetration testing, red team operations, and adversary simulation across web, mobile, and Active Directory environments.",
    
    paragraph1: "I'm an Offensive Security Engineer with 1.5+ years of experience at Levithan Technologies, specializing in adversary simulation, privilege escalation, and penetration testing across web, mobile, Active Directory, and cloud environments. I hold the OSCP, OSCP+, and CRTA certifications. My experience includes executing high-impact VAPT engagements for government and enterprise clients — including critical infrastructure and toll-management systems — delivering professional, STQC/IHMCL-compliant security reports.",
    
    paragraph2: "In addition to penetration testing, I focus on security engineering and automation. I design and build internal tools to streamline offensive operations, including Vulnessus (an enterprise-grade vulnerability management platform built with Rust and Axum) and a modular DPDP Act compliance scanner. I specialize in developing Python automation scripts, Cobalt Strike profiles, and custom exploit payloads that map directly to the OWASP Top 10 and MITRE ATT&CK frameworks to help organizations proactively secure their attack surface."
  },
  
  employmentStatus: 'Full-time',
};

export const CONTACT_ENGAGEMENTS = [
  {
    title: 'Web & API Pentesting',
    description: 'Black-box and grey-box testing mapped to OWASP Top 10 and business logic flaws.',
  },
  {
    title: 'Mobile App Security',
    description: 'Android and iOS assessments — runtime analysis, API abuse, and insecure storage.',
  },
  {
    title: 'Active Directory & Red Team',
    description: 'Internal network intrusion, privilege escalation, and adversary simulation.',
  },
  {
    title: 'Critical Infrastructure VAPT',
    description: 'High-criticality government and enterprise audits with compliance-aligned reporting.',
  },
  {
    title: 'Cloud & Container Reviews',
    description: 'IAM misconfigurations, exposed services, and container escape path analysis.',
  },
  {
    title: 'Security Automation',
    description: 'Custom recon pipelines, reporting workflows, and offensive tooling in Python or Rust.',
  },
];

export const EXPERTISE_ITEMS = [
  {
    id: '1',
    title: 'Web & Mobile Pentesting',
    description: 'Manual and automated penetration testing for government and enterprise applications, identifying critical OWASP Top 10 vulnerabilities.',
    icon: 'smartphone',
  },
  {
    id: '2',
    title: 'Active Directory & Red Teaming',
    description: 'Multi-stage intrusion testing, pivoting, and Active Directory attacks leveraging BloodHound, Mimikatz, Cobalt Strike, and Impacket.',
    icon: 'target',
  },
  {
    id: '3',
    title: 'Offensive Security Automation',
    description: 'Developing automated threat intelligence, reconnaissance, and vulnerability correlation pipelines in Python and Rust to reduce triage time.',
    icon: 'code',
  },
  {
    id: '4',
    title: 'Security Engineering',
    description: 'Architecting enterprise security scanners, compliance scanner modules (like DPDP Act), and internal reporting frameworks.',
    icon: 'shield',
  },
  {
    id: '5',
    title: 'Exploit Development & VAPT',
    description: 'Reconnaissance, vulnerability correlation, exploit modification, and compliance-aligned reporting under MITRE ATT&CK.',
    icon: 'search',
  },
];

export const FAQ_ITEMS = [
  {
    id: '1',
    question: 'What professional certifications do you hold?',
    answer: 'I hold three hands-on industry credentials: OffSec Certified Professional+ (OSCP+) focusing on advanced exploitation, pivoting, and AD attacks; OffSec Certified Professional (OSCP) for hands-on ethical hacking; and Certified Red Team Analyst (CRTA) for red team methodology and adversary emulation.',
  },
  {
    id: '2',
    question: 'What kind of security engagements have you delivered?',
    answer: 'I have delivered full-scope VAPT and red team engagements for government and enterprise clients — including critical infrastructure assessments — and issued STQC/IHMCL-compliant audit reports. Many engagements are under NDA; detailed case studies are available on request during scoping calls.',
  },
  {
    id: '3',
    question: 'What is your technology stack for security automation?',
    answer: 'I primarily use Python and Bash for writing automation scripts, recon tools, and integrations. For building enterprise-grade tools like Vulnessus, I use Rust (Axum framework) and Next.js, combined with Elasticsearch and MongoDB.',
  },
  {
    id: '4',
    question: 'Are you available for consulting or full-time roles?',
    answer: 'Yes! I am open to discussing security consulting opportunities or full-time offensive security engineering roles. You can contact me directly at akshitizk21@gmail.com to request detailed reports or schedule scoping calls.',
  },
  {
    id: '5',
    question: CTF_CHAT_HINT_QUESTION,
    answer: CTF_FAQ_ANSWER,
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Rahul Sharma',
    role: 'Security Lead',
    company: 'Levithan Technologies',
    quote: 'Kshitiz brings a pragmatic approach to security challenges, combining technical depth with practical solutions. His red team reports are thorough and directly actionable.',
  },
  {
    id: '2',
    name: 'Priya Patel',
    role: 'Engineering Manager',
    company: 'Tech Solutions',
    quote: 'Outstanding work on vulnerability assessments and security automation. Kshitiz identified critical issues our internal team had missed and helped us close them fast.',
  },
  {
    id: '3',
    name: 'Amit Singh',
    role: 'CTO',
    company: 'SecureStack',
    quote: 'Excellent understanding of both offensive and defensive security. Kshitiz is a strong communicator who translates complex findings into business risk clearly.',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    role: 'Product Owner',
    company: 'CloudSec',
    quote: 'Kshitiz delivered a thorough mobile app security assessment with detailed findings and clear remediation guidance. A reliable and skilled security professional.',
  },
];
