import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-brand-border pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange">{eyebrow}</p> : null}
        <h1 className="mt-1 text-[1.75rem] font-semibold leading-tight tracking-normal text-brand-charcoal md:text-[2rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-softText">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, type = 'button', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button type={type} className={`inline-flex h-10 items-center justify-center rounded-[10px] bg-brand-orange px-4 text-sm font-bold text-white hover:-translate-y-px hover:bg-brand-orangeDark disabled:cursor-not-allowed disabled:bg-brand-orange/50 disabled:hover:translate-y-0 ${className}`} {...props}>
      {children}
    </button>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-border bg-white p-6 text-center">
      <h2 className="text-base font-bold text-brand-charcoal">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-brand-softText">{description}</p>
    </div>
  );
}
