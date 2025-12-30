import { getSupabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import DashboardCharts from '@/components/DashboardCharts';

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

  // Fetch latest check-in
  const { data: latestCheckin } = await getSupabaseAdmin()
    .from('checkins')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  // Fetch recent pattern alerts (undismissed)
  const { data: patternAlerts } = await getSupabaseAdmin()
    .from('pattern_alerts')
    .select('*')
    .is('dismissed_at', null)
    .order('created_at', { ascending: false })
    .limit(3);

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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            <div className="p-4 bg-purple-900/20 border border-purple-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.energy || 0}</div>
              <div className="text-sm text-gray-400">Energy</div>
            </div>
            <div className="p-4 bg-indigo-900/20 border border-indigo-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.workout || 0}</div>
              <div className="text-sm text-gray-400">Workouts</div>
            </div>
            <div className="p-4 bg-pink-900/20 border border-pink-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.focus || 0}</div>
              <div className="text-sm text-gray-400">Focus</div>
            </div>
            <div className="p-4 bg-orange-900/20 border border-orange-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.learn || 0}</div>
              <div className="text-sm text-gray-400">Learning</div>
            </div>
            <div className="p-4 bg-cyan-900/20 border border-cyan-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.connection || 0}</div>
              <div className="text-sm text-gray-400">Connections</div>
            </div>
            <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.insight || 0}</div>
              <div className="text-sm text-gray-400">Insights</div>
            </div>
            <div className="p-4 bg-rose-900/20 border border-rose-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.distraction || 0}</div>
              <div className="text-sm text-gray-400">Distractions</div>
            </div>
            <div className="p-4 bg-violet-900/20 border border-violet-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.mood || 0}</div>
              <div className="text-sm text-gray-400">Mood</div>
            </div>
            <div className="p-4 bg-teal-900/20 border border-teal-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.sleep || 0}</div>
              <div className="text-sm text-gray-400">Sleep</div>
            </div>
            <div className="p-4 bg-lime-900/20 border border-lime-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.food || 0}</div>
              <div className="text-sm text-gray-400">Food</div>
            </div>
            <div className="p-4 bg-amber-900/20 border border-amber-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.substance || 0}</div>
              <div className="text-sm text-gray-400">Substances</div>
            </div>
            <div className="p-4 bg-slate-900/20 border border-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.conflict || 0}</div>
              <div className="text-sm text-gray-400">Conflicts</div>
            </div>
            <div className="p-4 bg-stone-900/20 border border-stone-900/50 rounded-lg">
              <div className="text-2xl font-bold">{entryCounts.procrastination || 0}</div>
              <div className="text-sm text-gray-400">Procrastination</div>
            </div>
          </div>
        </section>

        {/* Latest Check-in */}
        {latestCheckin && latestCheckin.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Latest Check-in</h2>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-4">
                {formatDate(latestCheckin[0].created_at)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">{latestCheckin[0].energy_score}/10</div>
                  <div className="text-sm text-gray-400">Energy Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">{latestCheckin[0].win_today}</div>
                  <div className="text-sm text-gray-400">Win Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-400">{latestCheckin[0].avoided_today}</div>
                  <div className="text-sm text-gray-400">Avoided Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-400">{latestCheckin[0].mood}</div>
                  <div className="text-sm text-gray-400">Current Mood</div>
                </div>
                <div className="text-center md:col-span-2 lg:col-span-1">
                  <div className="text-lg font-semibold text-purple-400">{latestCheckin[0].grateful_for}</div>
                  <div className="text-sm text-gray-400">Grateful For</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pattern Alerts */}
        {patternAlerts && patternAlerts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">⚠️ Pattern Alerts</h2>
            <div className="space-y-4">
              {patternAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${
                    alert.severity === 'critical'
                      ? 'bg-red-900/20 border-red-900/50'
                      : alert.severity === 'warning'
                      ? 'bg-yellow-900/20 border-yellow-900/50'
                      : 'bg-blue-900/20 border-blue-900/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-200">{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(alert.created_at)} • {alert.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dashboard Charts */}
        <DashboardCharts />

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