'use client';
import { useI18n } from '@/lib/i18n';

export default function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const next = lang === 'en' ? 'zh' : 'en';

  return (
    <button
      onClick={() => setLang(next)}
      className="px-3 py-1.5 rounded-md text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
    >
      {t.nav.switchTo}
    </button>
  );
}
