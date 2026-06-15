import type { ConfidentialEngagement } from '@/types';

export const CONFIDENTIAL_STATS = {
  totalCount: 50,
  displayLabel: '50+',
  summary:
    'Professional security engagements delivered under client NDAs — scope, findings, and deliverables are confidential.',
};

export const CONFIDENTIAL_ENGAGEMENTS: ConfidentialEngagement[] = [
  {
    id: 'web-vapt',
    title: 'Enterprise Web Application VAPT',
    sector: 'Enterprise',
    description:
      'Full-scope black-box and grey-box penetration testing for business-critical web platforms, covering authentication, authorization, injection, and business logic flaws.',
    tags: ['VAPT', 'Web', 'OWASP'],
    techStack: ['Burp Suite', 'SQLMap', 'Custom Scripts'],
    count: 12,
  },
  {
    id: 'mobile-pentest',
    title: 'Mobile Application Security Assessments',
    sector: 'Enterprise & FinTech',
    description:
      'Static and dynamic analysis of Android and iOS applications — insecure storage, certificate pinning bypass, API abuse, and runtime manipulation.',
    tags: ['Mobile', 'VAPT', 'Android', 'iOS'],
    techStack: ['Frida', 'MobSF', 'Burp Suite', 'Objection'],
    count: 8,
  },
  {
    id: 'ad-redteam',
    title: 'Active Directory & Red Team Operations',
    sector: 'Enterprise',
    description:
      'Multi-stage internal network assessments with privilege escalation, lateral movement, and domain compromise paths mapped to MITRE ATT&CK.',
    tags: ['Red Team', 'Active Directory', 'Internal'],
    techStack: ['BloodHound', 'Cobalt Strike', 'Impacket', 'Mimikatz'],
    count: 6,
  },
  {
    id: 'api-security',
    title: 'API & Microservices Security Testing',
    sector: 'Enterprise & SaaS',
    description:
      'REST and GraphQL API assessments — broken object-level authorization, mass assignment, rate limiting gaps, and token lifecycle issues.',
    tags: ['API', 'VAPT', 'Microservices'],
    techStack: ['Burp Suite', 'Postman', 'jwt_tool', 'Custom Fuzzers'],
    count: 5,
  },
  {
    id: 'network-pentest',
    title: 'Internal & External Network Pentests',
    sector: 'Enterprise',
    description:
      'Perimeter and internal network testing — service enumeration, misconfigurations, segmentation bypass, and credential exposure.',
    tags: ['Network', 'VAPT', 'Infrastructure'],
    techStack: ['Nmap', 'Nessus', 'Metasploit', 'Responder'],
    count: 5,
  },
  {
    id: 'critical-infra',
    title: 'Critical Infrastructure Security Audits',
    sector: 'Government',
    description:
      'High-criticality infrastructure assessments for national-scale systems — compliance-aligned reporting without disclosing system identifiers.',
    tags: ['Government', 'Critical Infra', 'Compliance'],
    techStack: ['Manual Testing', 'Custom Automation', 'STQC Reporting'],
    count: 4,
  },
  {
    id: 'cloud-assessment',
    title: 'Cloud & Container Security Assessments',
    sector: 'Enterprise',
    description:
      'Misconfiguration reviews across cloud workloads — IAM policies, exposed storage, container escape paths, and secrets management gaps.',
    tags: ['Cloud', 'DevSecOps', 'Containers'],
    techStack: ['ScoutSuite', 'Prowler', 'kubectl', 'Trivy'],
    count: 4,
  },
  {
    id: 'wireless-iot',
    title: 'Wireless & IoT Security Reviews',
    sector: 'Enterprise & Industrial',
    description:
      'Wireless protocol analysis and embedded device testing — default credentials, firmware extraction, and communication channel weaknesses.',
    tags: ['Wireless', 'IoT', 'Hardware'],
    techStack: ['Aircrack-ng', 'Wireshark', 'Binwalk', 'UART'],
    count: 3,
  },
  {
    id: 'phishing-sim',
    title: 'Phishing Simulation & Social Engineering',
    sector: 'Enterprise',
    description:
      'Controlled adversary emulation campaigns to measure organizational resilience and drive security awareness improvements.',
    tags: ['Social Engineering', 'Red Team', 'Awareness'],
    techStack: ['GoPhish', 'Custom Lures', 'OSINT'],
    count: 2,
  },
  {
    id: 'compliance-support',
    title: 'Compliance-Aligned Audit Support',
    sector: 'Government & Enterprise',
    description:
      'Technical assessment support for regulatory and industry compliance frameworks — structured findings mapped to required control sets.',
    tags: ['Compliance', 'Audit', 'Reporting'],
    techStack: ['MITRE ATT&CK', 'CVSS', 'Custom Report Templates'],
    count: 1,
  },
];
