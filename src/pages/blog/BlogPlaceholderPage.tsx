import { Link } from 'react-router-dom';

import { Button, EmptyState, PageHeader } from '../../components/ui/PageHeader';

export function BlogPlaceholderPage({ mode }: { mode: 'new' | 'edit' }) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Blog Posts" title={mode === 'new' ? 'Create New Post' : 'Edit Blog Post'} description="This route is protected and reserved for the full blog editor in the next implementation phase." />
      <EmptyState title="Editor not built yet" description="Per the current scope, this foundation stops before full blog CRUD. The route is prepared and protected for the next phase." />
      <Link to="/blog"><Button>Back to Blog Posts</Button></Link>
    </div>
  );
}
