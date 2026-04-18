'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Therapist {
  id: string;
  name: string;
  specialties: string;
  profileImage: string | null;
}

const INSURANCE_OPTIONS = ['Aetna', 'BlueCross', 'UnitedHealth', 'Cigna', 'Other'];

const TIME_SLOTS = [
  'Monday 9:00 AM',
  'Monday 2:00 PM',
  'Tuesday 10:00 AM',
  'Tuesday 3:00 PM',
  'Wednesday 11:00 AM',
  'Wednesday 4:00 PM',
  'Thursday 9:00 AM',
  'Thursday 2:00 PM',
  'Friday 10:00 AM',
  'Friday 1:00 PM',
];

export default function BookingPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    insurance: '',
    preferredTherapist: '',
    timeSlots: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/therapists')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTherapists(data);
      })
      .catch(() => {});
  }, []);

  function toggleTimeSlot(slot: string) {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(slot)
        ? prev.timeSlots.filter((s) => s !== slot)
        : [...prev.timeSlots, slot],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const booking = {
      id: `booking-${Date.now()}`,
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    const existing = JSON.parse(localStorage.getItem('grow-therapy-bookings') || '[]');
    existing.push(booking);
    localStorage.setItem('grow-therapy-bookings', JSON.stringify(existing));

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">預約請求已送出</h2>
            <p className="text-slate-600 mb-6">我們會在 24 小時內聯繫您</p>
            <Link
              href="/search"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              回到搜尋
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">預約申請</h1>
          <p className="text-slate-600 mt-2">填寫以下表單，我們的團隊將在 24 小時內與您聯繫</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="font-semibold text-blue-800">預約表單</h2>
            <p className="text-sm text-blue-600 mt-1">請提供您的聯絡資訊與偏好時段</p>
          </div>

          <div className="p-6 space-y-6">
            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的姓名"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {/* 保險公司 */}
            <div>
              <label htmlFor="insurance" className="block text-sm font-medium text-slate-700 mb-1">
                保險公司 <span className="text-red-500">*</span>
              </label>
              <select
                id="insurance"
                required
                value={formData.insurance}
                onChange={(e) => setFormData((p) => ({ ...p, insurance: e.target.value }))}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">請選擇保險公司</option>
                {INSURANCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* 指定治療師（選填） */}
            <div>
              <label htmlFor="therapist" className="block text-sm font-medium text-slate-700 mb-1">
                指定治療師（選填）
              </label>
              <select
                id="therapist"
                value={formData.preferredTherapist}
                onChange={(e) => setFormData((p) => ({ ...p, preferredTherapist: e.target.value }))}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">不指定</option>
                {therapists.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* 可預約時段（多選） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                可預約時段（多選）<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTimeSlot(slot)}
                    className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                      formData.timeSlots.includes(slot)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.insurance || formData.timeSlots.length === 0}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '提交中...' : '送出預約申請'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
