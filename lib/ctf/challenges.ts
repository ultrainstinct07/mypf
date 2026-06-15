import type { CtfStage } from '@/types/ctf';

export const CTF_STAGES: CtfStage[] = [
  {
    id: 1,
    name: 'Recon',
    hint: 'Crawl rules hide what scanners should not index. Find the disallowed path.',
  },
  {
    id: 2,
    name: 'Initial Access',
    hint: 'View-source on the void page. Decode the payload comment.',
  },
  {
    id: 3,
    name: 'Enumeration',
    hint: 'Ask the FAQ assistant: void999 enumerate',
  },
  {
    id: 4,
    name: 'Privilege Escalation',
    hint: 'Export the decoded token, then read shadow. Hero stats hint at the shift.',
  },
  {
    id: 5,
    name: 'Domain Admin',
    hint: 'Submit the root flag to claim domain dominance.',
  },
];

export const CTF_NEXT_HINTS: Record<number, string> = {
  1: 'Stage 2: Inspect the void page source for an encoded payload. Open terminal with Ctrl+Shift+`',
  2: 'Stage 3: Query the FAQ bot with the exact phrase: void999 enumerate',
  3: 'Stage 4: Decode the bot token (ROT13 → Base64). Run: export TOKEN=<flag>',
  4: 'Stage 5: Submit the root flag with: submit --final <flag>',
  5: 'Domain compromised. Visit /void to join the hall of fame.',
};

export const CTF_CHAT_SECRET_PHRASE = 'void999 enumerate';

/** ROT13 + Base64 encoded stage-3 flag for chat response */
export const CTF_CHAT_ENCODED_TOKEN = 'aWJ2cTk5OXtyYWh6X3B1bmdfZ2J4cmF9';

/** Caesar +4 ciphertext fragment shown by `cat shadow` */
export const CTF_SHADOW_CIPHER = 'void999{tvmziwgcwlehs{coi}}';

/** Caesar shift hint value (inspect Hero stat cards) */
export const CTF_CAESAR_SHIFT = 4;

/** Base64 payload embedded in /void page source for stage 2 */
export const CTF_STAGE2_BASE64 = 'dm9pZDk5OXthY2Nlc3NfYmFzZTY0X2dhdGV9';
