'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Lang = 'en' | 'zh';

type Dict = {
  nav: Record<string, string>;
  hero: Record<string, string>;
  features: Record<string, string>;
  stats: Record<string, string>;
  cta: Record<string, string>;
  footer: Record<string, string>;
};

const dict = {
  en: {
    nav: {
      home: 'Home',
      therapists: 'Find a Therapist',
      insurance: 'Insurance',
      billing: 'Billing',
      dashboard: 'Dashboard',
      switchTo: '中文',
    },
    hero: {
      title: 'Mental Health Care That Grows With You',
      desc: 'Connect with licensed therapists who specialize in your needs. Book appointments, verify insurance, and manage your care — all in one place.',
      primary: 'Find a Therapist',
      secondary: 'Verify Insurance',
    },
    features: {
      title: 'Everything You Need for Your Mental Health Journey',
      smartTitle: 'Smart Matching',
      smartDesc: 'Find therapists by specialty, insurance, and availability. Our intelligent matching helps you find the right fit.',
      scheduleTitle: 'Easy Scheduling',
      scheduleDesc: 'Book, reschedule, or cancel appointments with ease. Manage your care on your schedule.',
      insuranceTitle: 'Insurance Verification',
      insuranceDesc: 'Instantly verify if your insurance covers therapy services. Know your costs upfront.',
    },
    stats: {
      therapists: 'Licensed Therapists',
      appointments: 'Appointments Booked',
      plans: 'Insurance Plans Accepted',
      rating: 'Average Rating',
    },
    cta: {
      title: 'Ready to Start Your Journey?',
      desc: 'Join thousands of people who have found the right therapist through Grow Therapy.',
      button: 'Browse Therapists',
    },
    footer: {
      copy: '© 2024 Grow Therapy. All rights reserved.',
      sub: 'Your path to wellness starts here.',
    },
  },
  zh: {
    nav: {
      home: '首頁',
      therapists: '尋找治療師',
      insurance: '保險',
      billing: '帳單',
      dashboard: '儀表板',
      switchTo: 'EN',
    },
    hero: {
      title: '陪你一起成長的心理健康照護',
      desc: '連結符合你需求的持照治療師，預約、驗證保險、管理療程，一站完成。',
      primary: '尋找治療師',
      secondary: '驗證保險',
    },
    features: {
      title: '心理健康旅程所需的一切',
      smartTitle: '智慧配對',
      smartDesc: '依專長、保險與可預約時間找治療師，快速找到最適合的人選。',
      scheduleTitle: '輕鬆預約',
      scheduleDesc: '快速預約、改期或取消，依你的節奏管理療程。',
      insuranceTitle: '保險驗證',
      insuranceDesc: '即時確認你的保險是否涵蓋治療服務，費用一目了然。',
    },
    stats: {
      therapists: '持照治療師',
      appointments: '已預約次數',
      plans: '接受的保險方案',
      rating: '平均評分',
    },
    cta: {
      title: '準備好開始你的旅程了嗎？',
      desc: '加入已透過 Grow Therapy 找到合適治療師的數千人。',
      button: '瀏覽治療師',
    },
    footer: {
      copy: '© 2024 Grow Therapy. 版權所有。',
      sub: '你的療癒旅程，從這裡開始。',
    },
  },
} as const;

const I18nContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const value = useMemo(() => ({ lang, setLang, t: dict[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
