export type TacticCategory = 'pentesting' | 'hardening' | 'tools';

export type PentestingSubcategory = 'web' | 'services';

export interface TacticMeta {
  slug: string;
  title: string;
  category: TacticCategory;
  subcategory?: string;
  description: string;
  tags: string[];
}

export interface TacticContent {
  slug: string;
  category: TacticCategory;
  subcategory?: string;
  frontmatter: TacticMeta;
  content: string;
}

export interface TacticCategoryInfo {
  id: TacticCategory;
  label: string;
  description: string;
  icon: string;
  count: number;
  href: string;
}

export interface TacticSubcategoryInfo {
  id: string;
  label: string;
  items: TacticMeta[];
}
