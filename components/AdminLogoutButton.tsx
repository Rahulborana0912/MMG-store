'use client';

import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

interface AdminLogoutButtonProps {
  variant?: 'sidebar' | 'compact';
}

export default function AdminLogoutButton({ variant = 'sidebar' }: AdminLogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('mmg_user');
      window.dispatchEvent(new Event('mmg_state_change'));
      window.location.replace('/login');
    } catch {
      window.location.replace('/login');
    }
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Sign Out of Admin Portal"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 hover:border-rose-300 rounded text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
        )}
        <span>{loading ? 'Signing out...' : 'Logout'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-between px-3 py-2.5 text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900/40 hover:border-rose-800 rounded-lg transition-all text-xs font-semibold disabled:opacity-50"
    >
      <span className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
        )}
        <span>{loading ? 'Signing out...' : 'Sign Out / Logout'}</span>
      </span>
      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400/80">
        Exit
      </span>
    </button>
  );
}
