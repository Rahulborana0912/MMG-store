'use client';

import { useEffect } from 'react';

/**
 * AdminSessionGuard
 * 
 * Prevents browser bfcache (Back/Forward Cache) and history navigation vulnerabilities:
 * 1. If a user logs out or switches accounts and clicks the browser's Back button,
 *    `pageshow` with `event.persisted` will fire. We force a hard reload from the server.
 * 2. On mount and on `popstate` (history navigation), verifies session with `/api/auth/me`.
 *    If the active user is not ADMIN or STAFF, immediately redirects to `/account` or `/login`.
 */
export default function AdminSessionGuard() {
  useEffect(() => {
    // 1. Guard against bfcache restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    // 2. Client-side authentication and role guard
    let isCancelled = false;
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (isCancelled) return;
        if (!data.user) {
          window.location.replace('/login');
        } else if (data.user.role !== 'ADMIN' && data.user.role !== 'STAFF') {
          // If a customer lands here via back button or history, redirect to customer portal immediately
          window.location.replace('/account');
        }
      } catch {
        // network issue: server-side layout handles it
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', verifySession);

    // Initial check
    verifySession();

    return () => {
      isCancelled = true;
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', verifySession);
    };
  }, []);

  return null;
}
