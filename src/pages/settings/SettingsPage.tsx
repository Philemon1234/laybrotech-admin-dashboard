import { EmptyState, PageHeader } from '../../components/ui/PageHeader';

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="Admin Settings" description="Current setup uses Supabase Auth. Admin users should be created manually inside Supabase Authentication." />
      <EmptyState title="No extra settings yet" description="This dashboard is intentionally focused on blog management only. Broader admin modules are outside the current scope." />
    </div>
  );
}
