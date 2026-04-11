'use client';

import { Suspense } from 'react';
import TherapistsPage from '@/app/therapists/page';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <TherapistsPage />
    </Suspense>
  );
}
