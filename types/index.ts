export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  quote: string;
}

export interface Expertise {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SearchFilters {
  tags?: string[];
  techStack?: string[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}


