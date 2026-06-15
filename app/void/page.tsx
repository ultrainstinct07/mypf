import type { Metadata } from 'next';
import VoidPageClient from './VoidPageClient';
import { CTF_STAGE2_BASE64 } from '@/lib/ctf/challenges';

export const metadata: Metadata = {
  title: '404 — Not Found',
  robots: { index: false, follow: false },
};

export default function VoidPage() {
  return (
    <>
      {/* void999{fake_decoy_flag} — ignore */}
      {/* recon complete: void999{recon_crawl_rules} */}
      {/* payload: {CTF_STAGE2_BASE64} */}
      <VoidPageClient />
    </>
  );
}
