'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type EntryType = 'win' | 'problem' | 'money' | 'avoidance';

interface Entry {
  id: string;
  created_at: string;
  type: EntryType;
  content: string;
}

const TYPE_COLORS: Record<EntryType, string> = {
  win: 'bg-green-900/20 border-green-900/50 text-green-400',
  problem: 'bg-red-900/20 border-red-900/50 text-red-400',
  money: 'bg-blue-900/20 border-blue-900/50 text-blue-400',
  avoidance: 'bg-yellow-900/20 border-yellow-900/50 text-yellow-400',
};

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<EntryType | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/entries' 
        : `/api/entries?type=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
      setLoading(false);
    }

    loadEntries();
  }, [filter]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Entries</h1>
          <p className="text-gray-400">All logged events</p>
        </header>

        <nav className="flex gap-4 mb-12 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
          <Link href="/entries" className="text-white font-semibold">Entries</Link>
          <Link href="/reports" className="text-gray-400 hover:text-white">Reports</Link>
        </nav>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('win')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'win'
                ? 'bg-green-900/50 text-green-400 border-green-900'
                : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Wins
          </button>
          <button
            onClick={() => setFilter('problem')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'problem'
                ? 'bg-red-900/50 text-red-400 border-red-900'
                : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setFilter('money')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'money'
                ? 'bg-blue-900/50 text-blue-400 border-blue-900'
                : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Money
          </button>
          <button
            onClick={() => setFilter('avoidance')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'avoidance'
                ? 'bg-yellow-900/50 text-yellow-400 border-yellow-900'
                : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Avoidance
          </button>
        </div>

        {/* Entries list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No entries yet. Start logging via Telegram bot.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      TYPE_COLORS[entry.type]
                    }`}
                  >
                    {entry.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-200">{entry.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
