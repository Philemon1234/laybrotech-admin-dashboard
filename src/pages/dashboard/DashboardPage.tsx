import { useEffect, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiEdit3, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/ui/PageHeader';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types/blog';
import { formatDate } from '../../utils/blog';

type DashboardStats = { totalPosts: number; publishedPosts: number; drafts: number; scheduled: number; pendingComments: number };
const emptyStats: DashboardStats = { totalPosts: 0, publishedPosts: 0, drafts: 0, scheduled: 0, pendingComments: 0 };

async function getCount(table: string, filter?: { column: string; value: string }) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

const statMeta = [
  { key: 'totalPosts', label: 'Total Posts', icon: FiFileText, tone: 'bg-[#fff4ec] text-brand-orange' },
  { key: 'publishedPosts', label: 'Published', icon: FiCheckCircle, tone: 'bg-green-50 text-brand-success' },
  { key: 'drafts', label: 'Drafts', icon: FiEdit3, tone: 'bg-blue-50 text-blue-600' },
  { key: 'scheduled', label: 'Scheduled', icon: FiCalendar, tone: 'bg-orange-50 text-brand-orange' },
  { key: 'pendingComments', label: 'Pending Comments', icon: FiMessageSquare, tone: 'bg-amber-50 text-amber-700' },
] as const;

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      try {
        const [totalPosts, publishedPosts, drafts, scheduled, pendingComments] = await Promise.all([
          getCount('blog_posts'),
          getCount('blog_posts', { column: 'status', value: 'published' }),
          getCount('blog_posts', { column: 'status', value: 'draft' }),
          getCount('blog_posts', { column: 'status', value: 'scheduled' }),
          getCount('blog_comments', { column: 'status', value: 'pending' }),
        ]);
        const { data, error: postsError } = await supabase.from('blog_posts').select('id,title,slug,excerpt,featured_image_url,featured_image_alt,status,author_name,published_at,scheduled_at,created_at,updated_at').order('updated_at', { ascending: false }).limit(5);
        if (postsError) throw postsError;
        if (mounted) { setStats({ totalPosts, publishedPosts, drafts, scheduled, pendingComments }); setRecentPosts((data ?? []) as BlogPost[]); }
      } catch (_error) { if (mounted) setError('Could not load dashboard data from Supabase.'); }
      finally { if (mounted) setLoading(false); }
    }
    loadDashboard();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Admin Overview" title="Dashboard" description="Manage Laybrotech website content and administration from one workspace." />

      {error ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{error}</p> : null}

      <section className="grid overflow-hidden rounded-lg border border-brand-border bg-white sm:grid-cols-2 xl:grid-cols-5" aria-label="Blog summary statistics">
        {statMeta.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.key} className="flex items-center gap-3 border-b border-brand-border p-4 last:border-b-0 sm:odd:border-r xl:border-b-0 xl:border-r xl:last:border-r-0 sm:[&:nth-child(4)]:border-r-0 xl:[&:nth-child(4)]:border-r">
              <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${item.tone}`}><Icon className="size-5" /></div>
              <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-brand-softText">{item.label}</p><p className="mt-0.5 text-2xl font-extrabold text-brand-charcoal">{loading ? '-' : stats[item.key]}</p></div>
            </article>
          );
        })}
      </section>

      <section className="pt-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-charcoal">Recent Blog Activity</h2>
        </div>
        <div className="divide-y divide-brand-border border-y border-brand-border">
          {recentPosts.length ? recentPosts.map((post) => (
            <Link to={`/blog/${post.id}/edit`} key={post.id} className="flex flex-col gap-3 py-4 transition hover:bg-brand-muted/70 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 px-1">
                {post.featured_image_url ? <img src={post.featured_image_url} alt={post.featured_image_alt ?? ''} className="h-12 w-[72px] rounded-lg object-cover" /> : <div className="grid h-12 w-[72px] place-items-center rounded-lg bg-brand-muted text-brand-softText"><FiFileText /></div>}
                <div>
                  <p className="font-bold text-brand-charcoal">{post.title}</p>
                  <p className="mt-1 text-sm text-brand-softText">{formatDate(post.updated_at)} · {post.author_name ?? 'Laybrotech Team'}</p>
                </div>
              </div>
              <span className={`mx-1 w-fit rounded-full px-2.5 py-1 text-xs font-bold capitalize ${post.status === 'published' ? 'bg-green-50 text-brand-success' : post.status === 'scheduled' ? 'bg-orange-50 text-brand-orange' : post.status === 'archived' ? 'bg-zinc-100 text-zinc-600' : 'bg-blue-50 text-blue-600'}`}>{post.status}</span>
            </Link>
          )) : <p className="py-6 text-sm text-brand-softText">No recent posts yet.</p>}
        </div>
      </section>
    </div>
  );
}

