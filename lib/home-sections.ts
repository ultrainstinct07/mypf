export const HOME_RAIL_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;

export const HOME_SECTION_IDS = [
  'hero',
  ...HOME_RAIL_SECTIONS.map((section) => section.id),
] as const;
