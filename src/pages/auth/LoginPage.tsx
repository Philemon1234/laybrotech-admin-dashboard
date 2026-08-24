import { FormEvent, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Navigate, useLocation } from 'react-router-dom';

import { Button } from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { session, isAdmin, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (session && isAdmin) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) setError(result.error);
  }

  return (
    <main className="grid min-h-screen bg-brand-muted px-4 py-10 md:place-items-center">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-brand-border bg-white p-6 shadow-soft md:p-8">
        <div>
          <p className="text-sm font-extrabold text-brand-charcoal"><span className="text-brand-orange">Laybro</span>tech Admin</p>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-brand-charcoal">Sign in to manage the blog.</h1>
          <p className="mt-3 text-sm leading-6 text-brand-softText">Use the admin account created in Supabase Authentication.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-bold text-brand-charcoal" htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-brand-border bg-white px-4 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-charcoal" htmlFor="password">Password</label>
            <div className="relative mt-2">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-brand-border bg-white px-4 pr-12 text-sm outline-none focus:border-brand-orange" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-brand-softText hover:bg-brand-muted hover:text-brand-charcoal">
                {showPassword ? <FiEyeOff className="size-4" aria-hidden="true" /> : <FiEye className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
      </section>
    </main>
  );
}
