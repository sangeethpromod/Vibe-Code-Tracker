'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type EntryType = 
  | 'win' | 'problem' | 'money' | 'avoidance'
  | 'energy' | 'mood' | 'sleep'
  | 'workout' | 'food' | 'substance'
  | 'connection' | 'conflict'
  | 'focus' | 'distraction' | 'procrastination'
  | 'learn' | 'insight';

interface Entry {
  id: string;
  created_at: string;
  type: EntryType;
  content: string;
  metadata?: Record<string, unknown>;
}

const TYPE_COLORS: Record<EntryType, string> = {
  win: 'bg-green-900/20 border-green-900/50 text-green-400',
  problem: 'bg-red-900/20 border-red-900/50 text-red-400',
  money: 'bg-blue-900/20 border-blue-900/50 text-blue-400',
  avoidance: 'bg-yellow-900/20 border-yellow-900/50 text-yellow-400',
  energy: 'bg-purple-900/20 border-purple-900/50 text-purple-400',
  mood: 'bg-violet-900/20 border-violet-900/50 text-violet-400',
  sleep: 'bg-teal-900/20 border-teal-900/50 text-teal-400',
  workout: 'bg-indigo-900/20 border-indigo-900/50 text-indigo-400',
  food: 'bg-lime-900/20 border-lime-900/50 text-lime-400',
  substance: 'bg-amber-900/20 border-amber-900/50 text-amber-400',
  connection: 'bg-cyan-900/20 border-cyan-900/50 text-cyan-400',
  conflict: 'bg-slate-900/20 border-slate-900/50 text-slate-400',
  focus: 'bg-pink-900/20 border-pink-900/50 text-pink-400',
  distraction: 'bg-rose-900/20 border-rose-900/50 text-rose-400',
  procrastination: 'bg-stone-900/20 border-stone-900/50 text-stone-400',
  learn: 'bg-orange-900/20 border-orange-900/50 text-orange-400',
  insight: 'bg-emerald-900/20 border-emerald-900/50 text-emerald-400',
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
        <div className="mb-8">
          <div className="flex gap-2 mb-4 flex-wrap">
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
          </div>
          
          <div className="text-sm text-gray-400 mb-2">Original Types:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
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

          <div className="text-sm text-gray-400 mb-2">Emotional & Mental:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('energy')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'energy'
                  ? 'bg-purple-900/50 text-purple-400 border-purple-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Energy
            </button>
            <button
              onClick={() => setFilter('mood')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'mood'
                  ? 'bg-violet-900/50 text-violet-400 border-violet-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Mood
            </button>
            <button
              onClick={() => setFilter('sleep')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'sleep'
                  ? 'bg-teal-900/50 text-teal-400 border-teal-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Sleep
            </button>
          </div>

          <div className="text-sm text-gray-400 mb-2">Habits & Health:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('workout')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'workout'
                  ? 'bg-indigo-900/50 text-indigo-400 border-indigo-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Workouts
            </button>
            <button
              onClick={() => setFilter('food')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'food'
                  ? 'bg-lime-900/50 text-lime-400 border-lime-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Food
            </button>
            <button
              onClick={() => setFilter('substance')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'substance'
                  ? 'bg-amber-900/50 text-amber-400 border-amber-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Substances
            </button>
          </div>

          <div className="text-sm text-gray-400 mb-2">Relationships:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('connection')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'connection'
                  ? 'bg-cyan-900/50 text-cyan-400 border-cyan-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Connections
            </button>
            <button
              onClick={() => setFilter('conflict')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'conflict'
                  ? 'bg-slate-900/50 text-slate-400 border-slate-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Conflicts
            </button>
          </div>

          <div className="text-sm text-gray-400 mb-2">Work & Productivity:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('focus')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'focus'
                  ? 'bg-pink-900/50 text-pink-400 border-pink-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setFilter('distraction')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'distraction'
                  ? 'bg-rose-900/50 text-rose-400 border-rose-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Distractions
            </button>
            <button
              onClick={() => setFilter('procrastination')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'procrastination'
                  ? 'bg-stone-900/50 text-stone-400 border-stone-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Procrastination
            </button>
          </div>

          <div className="text-sm text-gray-400 mb-2">Learning & Growth:</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('learn')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'learn'
                  ? 'bg-orange-900/50 text-orange-400 border-orange-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Learning
            </button>
            <button
              onClick={() => setFilter('insight')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'insight'
                  ? 'bg-emerald-900/50 text-emerald-400 border-emerald-900'
                  : 'bg-transparent text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              Insights
            </button>
          </div>
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
                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {Object.entries(entry.metadata).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
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
