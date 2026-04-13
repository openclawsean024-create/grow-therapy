'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">{t.hero.desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/therapists" className="px-8 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">{t.hero.primary}</Link>
            <Link href="/insurance" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">{t.hero.secondary}</Link>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">{t.features.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} title={t.features.smartTitle} description={t.features.smartDesc} />
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} title={t.features.scheduleTitle} description={t.features.scheduleDesc} />
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title={t.features.insuranceTitle} description={t.features.insuranceDesc} />
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard value="500+" label={t.stats.therapists} />
            <StatCard value="10K+" label={t.stats.appointments} />
            <StatCard value="50+" label={t.stats.plans} />
            <StatCard value="4.9★" label={t.stats.rating} />
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.cta.title}</h2>
          <p className="text-lg text-slate-600 mb-8">{t.cta.desc}</p>
          <Link href="/therapists" className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">{t.cta.button}</Link>
        </div>
      </section>
      <footer className="bg-slate-100 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>{t.footer.copy}</p>
          <p className="mt-2 text-sm">{t.footer.sub}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-emerald-400">{value}</div>
      <div className="text-slate-400 mt-1">{label}</div>
    </div>
  );
}
