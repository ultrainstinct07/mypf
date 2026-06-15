'use client';

import { useEffect, useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/ctf';
import { useCtf } from '@/app/components/CtfProvider';

export default function CtfLeaderboard() {
  const { progress } = useCtf();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [online, setOnline] = useState(false);
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isComplete = progress.completedStages.includes(5);

  useEffect(() => {
    void fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ctf/leaderboard');
      const data = await res.json();
      setEntries(data.entries ?? []);
      setOnline(Boolean(data.online));
    } catch {
      setEntries([]);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progress.proofToken) {
      setError('Completion proof missing. Clear stage 5 in the terminal first.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/ctf/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, proofToken: progress.proofToken }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage('Handle registered. Welcome to the hall of fame.');
        setEntries(data.entries ?? []);
        setHandle('');
      } else {
        setError(data.message ?? 'Registration failed.');
      }
    } catch {
      setError('Could not reach leaderboard service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-2 border-crimson bg-black/80 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="text-crimson" size={24} />
        <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-white">
          Hall of Fame
        </h2>
      </div>

      {!online && (
        <p className="text-xs font-mono text-amber-400 uppercase tracking-wide">
          Global rankings offline — add Vercel Postgres and set DATABASE_URL to enable the hall of fame.
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
          <Loader2 size={16} className="animate-spin" />
          Loading operators...
        </div>
      ) : entries.length > 0 ? (
        <ol className="space-y-2 font-mono text-sm">
          {entries.map((entry, index) => (
            <li
              key={`${entry.handle}-${entry.completedAt}`}
              className="flex items-center justify-between border border-white/10 px-3 py-2 text-gray-300"
            >
              <span>
                <span className="text-crimson mr-2">#{index + 1}</span>
                {entry.handle}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(entry.completedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500 font-mono text-sm">No operators registered yet.</p>
      )}

      {isComplete && progress.proofToken && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-white/10 pt-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
            Register your handle
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              placeholder="operator_name"
              className="flex-1 bg-black border-2 border-white/20 px-3 py-2 font-mono text-sm text-white outline-none focus:border-crimson"
            />
            <button
              type="submit"
              disabled={submitting || !handle.trim()}
              className="px-4 py-2 bg-crimson text-white font-mono text-xs uppercase tracking-wider border-2 border-crimson disabled:opacity-50"
            >
              {submitting ? '...' : 'Claim'}
            </button>
          </div>
          {message && <p className="text-green-400 font-mono text-xs">{message}</p>}
          {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
        </form>
      )}
    </section>
  );
}
