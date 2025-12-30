'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeeklyReport } from '@/lib/supabase';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function ReportsPageWrapper() {
  // Use a client component for the button and feedback
  return <ReportsPageClient />;
}

function ReportsPageClient() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchReports() {
    const res = await fetch('/api/reports');
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports || data || []);
    }
  }

  // Fetch reports on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchReports();
  }, []);

  async function handleGenerateReport() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/weekly-review?manual=true', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Report generated!');
        fetchReports();
      } else {
        setMessage(data?.error || 'Failed to generate report.');
      }
    } catch (e) {
      setMessage('Failed to generate report.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Weekly Reports</h1>
          <p className="text-gray-400">Past reviews and insights</p>
        </header>

        <nav className="flex gap-4 mb-12 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
          <Link href="/entries" className="text-gray-400 hover:text-white">Entries</Link>
          <Link href="/reports" className="text-white font-semibold">Reports</Link>
        </nav>

        <div className="mb-8 flex flex-col items-center">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-6 py-2 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report Now'}
          </button>
          {message && <div className="mt-2 text-sm text-amber-300">{message}</div>}
        </div>

        {!reports || reports.length === 0 ? (
          <div className="text-center py-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-gray-400">No reports yet. First review generates next Sunday.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    Week of {formatDate(report.week_start)}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Generated {formatDate(report.created_at)}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">
                      Summary
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      {report.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">
                      Patterns
                    </h3>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {report.patterns}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">
                      Strategy for Next Week
                    </h3>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {report.strategy}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">
                      Drop List
                    </h3>
                    <div className="text-red-400 leading-relaxed whitespace-pre-line">
                      {report.drop_list}
                    </div>
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
