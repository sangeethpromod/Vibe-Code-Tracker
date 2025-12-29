import { getSupabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getNextSunday() {
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  return formatDate(nextSunday.toISOString());
}

export default async function Home() {
  // Fetch latest report
  const { data: reports } = await getSupabaseAdmin()
    .from('weekly_reports')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1);

  const latestReport = reports?.[0];

  // Fetch this week's entries count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: entries } = await getSupabaseAdmin()
    .from('entries')
    .select('id, type')
    .gte('created_at', sevenDaysAgo.toISOString());

  const entryCounts = entries?.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl shadow-amber-500/50">
              <Image
                src="/dpImage.png"
                alt="Ramavarma Thampuran"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            Ramavarma Thampuran AI
          </h1>
          <p className="text-gray-400 text-lg">Custodian of the Ancestral Estates</p>
        </header>

        <nav className="flex gap-4 mb-12 text-sm justify-center">
          <Link href="/" className="text-white font-semibold">Home</Link>
          <Link href="/entries" className="text-gray-400 hover:text-white">Entries</Link>
          <Link href="/reports" className="text-gray-400 hover:text-white">Reports</Link>
        </nav>

        {/* Next Review */}
        <section className="mb-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-sm uppercase text-gray-400 mb-2">Next Durbar</h2>
          <p className="text-2xl font-bold">{getNextSunday()}</p>
          <p className="text-gray-400 mt-2">Court convenes every Sunday at 8th hour of evening</p>
        </section>

        {/* This Week's Activity */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">This Week&apos;s Accounts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-900/20 border border-green-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.win || 0}</div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.problem || 0}</div>
              <div className="text-sm text-gray-400">Problems</div>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.money || 0}</div>
              <div className="text-sm text-gray-400">Money</div>
            </div>
            <div className="p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.avoidance || 0}</div>
              <div className="text-sm text-gray-400">Avoidance</div>
            </div>
          </div>
        </section>

        {/* Latest Report */}
        {latestReport && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Latest Decree</h2>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-4">
                Week of {formatDate(latestReport.week_start)}
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm uppercase text-gray-400 mb-2">Summary</h3>
                <p className="text-gray-200">{latestReport.summary}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm uppercase text-gray-400 mb-2">Patterns Observed</h3>
                <p className="text-gray-200 whitespace-pre-line">{latestReport.patterns}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm uppercase text-gray-400 mb-2">Strategic Counsel</h3>
                <p className="text-gray-200 whitespace-pre-line">{latestReport.strategy}</p>
              </div>

              <div>
                <h3 className="text-sm uppercase text-gray-400 mb-2">To Be Abolished</h3>
                <p className="text-red-400 whitespace-pre-line">{latestReport.drop_list}</p>
              </div>

              <Link 
                href="/reports" 
                className="mt-4 inline-block text-sm text-gray-400 hover:text-white"
              >
                View all decrees →
              </Link>
            </div>
          </section>
        )}

        {!latestReport && (
          <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
            <p className="text-gray-400">No decrees yet. Begin thy reports via Royal Messenger.</p>
          </section>
        )}
      </div>
    </div>
  );
}