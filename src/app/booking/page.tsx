'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { formatDate, formatTime } from '@/lib/utils';

interface Appointment {
  id: string;
  dateTime: string;
  durationMins: number;
  status: string;
  type: string;
  therapist: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  patient: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BookingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('scheduled');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const upcoming = appointments.filter((apt) => apt.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-600 mt-2">
            {upcoming > 0 ? `You have ${upcoming} upcoming appointment${upcoming > 1 ? 's' : ''}` : 'No upcoming appointments'}
          </p>
        </div>

        {/* Quick Book CTA */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Find a Therapist</h3>
              <p className="text-sm text-blue-600">Browse and book a new session</p>
            </div>
            <Link
              href="/search"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Find a Therapist
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Appointments</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              {filter === 'scheduled' ? 'No upcoming appointments.' : `No ${filter} appointments.`}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={apt.therapist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.therapist.name)}&background=4A90D9&color=fff`}
                      alt={apt.therapist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{apt.therapist.name}</p>
                      <p className="text-sm text-slate-500">{apt.patient.name}</p>
                      <p className="text-sm text-slate-500">
                        {formatDate(apt.dateTime)} at {formatTime(apt.dateTime)} · {apt.durationMins} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'scheduled' && (
                      <div className="flex gap-2">
                        <Link
                          href={`/booking/${apt.therapist.id}`}
                          className="px-3 py-1.5 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                        >
                          Reschedule
                        </Link>
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    rescheduled: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
