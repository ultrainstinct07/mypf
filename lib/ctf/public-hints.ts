import { CTF_STAGES, CTF_CHAT_SECRET_PHRASE } from '@/lib/ctf/challenges';
import type { CtfStageId } from '@/types/ctf';

export const CTF_TITLE = 'Operation VOID999';

export const CTF_TAGLINE =
  'Hidden 5-stage infiltration challenge embedded in this portfolio. Can you reach domain admin?';

export const CTF_START_HINT =
  'Start with /robots.txt — find the disallowed path, visit it manually, then view the page source for recon intel.';

export const CTF_FOOTER_HINT = 'Hidden 5-stage CTF — start with robots.txt';

export const CTF_CALLOUT_DISMISS_KEY = 'void999-ctf-callout-dismissed';

export const CTF_OPEN_CHAT_EVENT = 'void999:open-chat';

export const CTF_STAGE_HINTS: Record<CtfStageId, string> = {
  1: `Stage 1 — Recon: ${CTF_STAGES[0].hint} Submit flags in the VOID terminal (Ctrl+Shift+\` after discovery).`,
  2: `Stage 2 — Initial Access: ${CTF_STAGES[1].hint} Decode the Base64 payload in the HTML comments.`,
  3: `Stage 3 — Enumeration: ${CTF_STAGES[2].hint} Type the exact phrase in the FAQ chatbot.`,
  4: `Stage 4 — Privilege Escalation: ${CTF_STAGES[3].hint} Run export TOKEN=<decoded_flag>, then cat shadow in the terminal. Check Hero stat cards for the cipher shift.`,
  5: `Stage 5 — Domain Admin: ${CTF_STAGES[4].hint} Use submit --final <flag> in the terminal.`,
};

export const CTF_FAQ_ANSWER = `Yes — ${CTF_TITLE} is a five-stage security challenge hidden across this site. ${CTF_START_HINT} After reaching the void sector, open the infiltration terminal with Ctrl+Shift+\` and submit flags to advance. The FAQ chatbot can also help mid-mission — try asking about hidden challenges or type "${CTF_CHAT_SECRET_PHRASE}" during enumeration.`;

export const CTF_CHAT_HINT_ANSWER = `${CTF_TITLE} — five-stage infiltration challenge:

1. Recon: Read /robots.txt, visit the disallowed path (/void), view page source for the stage 1 flag.
2. Initial Access: On /void, inspect HTML comments for a Base64 payload — decode it for stage 2.
3. Enumeration: Ask this bot the exact phrase "${CTF_CHAT_SECRET_PHRASE}" — decode the token (Base64, then ROT13) and run export TOKEN=<flag> in the terminal.
4. Privilege Escalation: Run cat shadow in the terminal. Decode the cipher using the shift hinted on Hero stat cards.
5. Domain Admin: Submit the root flag with submit --final <flag> in the terminal.

Open the VOID terminal with Ctrl+Shift+\` after discovering /void. Good luck, operator.`;

export const CTF_CHAT_HINT_QUESTION = 'Are there hidden challenges on this site?';

export function getStageHintList(): string[] {
  return (Object.keys(CTF_STAGE_HINTS) as unknown as CtfStageId[]).map(
    (id) => CTF_STAGE_HINTS[id]
  );
}
