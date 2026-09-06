'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      localStorage.setItem('mmg_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('mmg_state_change'));

      if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
        window.location.replace('/admin');
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirectTarget = params.get('redirect') || '/';
        window.location.replace(redirectTarget);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-4">
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        <div className="space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-charcoal-900 text-white font-serif text-xl font-bold flex items-center justify-center mx-auto rounded border border-stone-700">
              MMG
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              {language === 'hi' ? 'खाते में साइन इन करें' : 'Sign In to MMG'}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'hi' ? 'अपने कोटेशन, पूछताछ और पसंद किए गए पत्थरों को देखने के लिए लॉगिन करें।' : 'Access your saved stones, project requirements, and formal quotations.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700">
                  {language === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded shadow-stone-sm transition-colors disabled:opacity-50"
            >
              {loading ? (language === 'hi' ? 'जाँच की जा रही है...' : 'Authenticating...') : (language === 'hi' ? 'साइन इन करें' : 'Sign In')}
            </button>
          </form>

          <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-100">
            {language === 'hi' ? 'नया ग्राहक खाता बनाना चाहते हैं?' : 'New to MMG?'}{' '}
            <Link href="/register" className="font-semibold text-bronze-600 hover:underline">
              {language === 'hi' ? 'यहाँ रजिस्टर करें' : 'Create an Account'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
