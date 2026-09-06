'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automatically recover from stale chunks when the app is rebuilt or restarted
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-stone-50">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h2 className="text-xl font-bold font-serif text-charcoal-900">
          Page Update Available
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          The website specifications or resources have been updated. Please reload the page to continue.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
