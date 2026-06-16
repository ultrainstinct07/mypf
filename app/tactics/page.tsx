import { Metadata } from 'next';
import { getCategoryInfo, getAllTactics } from '@/lib/tactics';
import TacticsPageClient from './TacticsPageClient';

export const metadata: Metadata = {
  title: 'Security Tactics — Pentesting, Hardening & Tools | Kshitiz Kumar',
  description:
    'Curated cybersecurity reference guides for penetration testing, system hardening, and security tooling — built from real-world offensive security engagements.',
};

export default function TacticsPage() {
  const categories = getCategoryInfo();
  const allTactics = getAllTactics();

  return <TacticsPageClient categories={categories} allTactics={allTactics} />;
}
