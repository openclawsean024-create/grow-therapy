'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { formatDate, formatTime } from '@/lib/utils';

interface Therapist {
  id: string;
  name: string;
  bio: string;
  specialties: string;
  insuranceAccepted: string;
  hourlyRate: number;
  profileImage: string | null;
  appointments: Array<{
    id: string;
    dateTime: string;
    durationMins: number;
    status: string;
  }>;
}

export default function TherapistProfilePage() {
  const params = useParams();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTherapist = useCallback(async () => {
    try {
      const res = await fetch(`/api/therapists/${params.id}`);
      if (!res.ok) throw new Error('Therapist not found');
      const data = await res.json();
      setTherapist(data);
    } catch {
      setError('Failed to load therapist');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTherapist();
  }, [fetchTherapist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500">
          Loading therapist profile...
        </div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-500">{error || 'Therapist not found'}</p>
          <Link href="/therapists" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
            Back to Therapists
          </Link>
        </div>
      </div>
    );
  }

  const specialties = therapist.specialties.split(',');
  const insurance = therapist.insuranceAccepted.split(',');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/therapists" className="text-emerald-600 hover:text-emerald-700 text-sm mb-4 inline-flex items-center gap-1">
          ← Back to Therapists
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <img
                src={therapist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.name)}&background=10b981&color=fff&size=128`}
                alt={therapist.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800">{therapist.name}</h1>
                <p className="text-emerald-600 font-semibold text-lg mt-1">${therapist.hourlyRate}/session</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">About</h2>
              <p className="text-slate-600">{therapist.bio}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Insurance Accepted</h2>
              <div className="flex flex-wrap gap-2">
                {insurance.map((i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    {i.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <Link
              href={`/booking/${therapist.id}`}
              className="block w-full text-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>

        {therapist.appointments && therapist.appointments.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Availability</h2>
            <div className="space-y-3">
              {therapist.appointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-800 font-medium">{formatDate(apt.dateTime)}</p>
                    <p className="text-slate-500 text-sm">{formatTime(apt.dateTime)} · {apt.durationMins} min</p>
                  </div>
                  <Link
                    href={`/booking/${therapist.id}?slot=${apt.dateTime}`}
                    className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200"
                  >
                    Book
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
