'use client';

import { useEffect } from 'react';

/**
 * AccountSessionGuard
 * 
 * Verifies active session for the customer portal:
 * 1. If restored from bfcache after logout, reloads page to trigger server-side redirect.
 * 2. On mount and popstate, verifies /api/auth/me. If unauthenticated, redirects to /login.
 */
export default function AccountSessionGuard() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    let isCancelled = false;
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (isCancelled) return;
        if (!data.user) {
          window.location.replace('/login');
        }
      } catch {
        // network issue: server-side guard already verified
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', verifySession);

    verifySession();

    return () => {
      isCancelled = true;
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', verifySession);
    };
  }, []);

  return null;
}
