'use client';

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

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Failed to load appointments');
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

  async function handleReschedule(id: string) {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (e.g., 10:00 AM):');
    if (!newDate || !newTime) return;

    const dateTime = new Date(`${newDate}T${newTime}`);
    if (Number.isNaN(dateTime.getTime())) return;
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime: dateTime.toISOString(), status: 'scheduled' }),
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'scheduled') return apt.status === 'scheduled';
    if (filter === 'completed') return apt.status === 'completed';
    return true;
  });

  const upcomingCount = appointments.filter((apt) => apt.status === 'scheduled').length;
  const completedCount = appointments.filter((apt) => apt.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Therapist Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage appointments and patient schedules</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Appointments" value={appointments.length} />
          <StatCard label="Upcoming" value={upcomingCount} color="emerald" />
          <StatCard label="Completed" value={completedCount} color="blue" />
          <StatCard label="Cancelled" value={appointments.filter((a) => a.status === 'cancelled').length} color="red" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'scheduled', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
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
            <div className="p-6 text-center text-slate-500">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No appointments found.</div>
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
                        <button
                          onClick={() => handleReschedule(apt.id)}
                          className="px-3 py-1.5 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                        >
                          Reschedule
                        </button>
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

function StatCard({ label, value, color = 'slate' }: { label: string; value: number; color?: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-blue-50 text-blue-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className={`text-sm mt-1 px-2 py-0.5 rounded-full inline-block ${colorClasses[color]}`}>
        {label}
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
