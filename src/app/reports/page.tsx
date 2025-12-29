import { getSupabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function ReportsPage() {
  const { data: reports } = await getSupabaseAdmin()
    .from('weekly_reports')
    .select('*')
    .order('week_start', { ascending: false });

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
