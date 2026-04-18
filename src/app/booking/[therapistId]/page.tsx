'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { formatDate } from '@/lib/utils';
import { addDays, format } from 'date-fns';

interface Therapist {
  id: string;
  name: string;
  hourlyRate: number;
  profileImage: string | null;
}

interface Patient {
  id: string;
  name: string;
  email: string;
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function BookingPage() {
  const params = useParams<{ therapistId?: string }>();
  const therapistId = typeof params.therapistId === 'string' ? params.therapistId : '';
  const searchParams = useSearchParams();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [sessionType, setSessionType] = useState('therapy');

  const bookedSlots = ['10:00 AM', '2:00 PM'];

  // Set default date only on client to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(addDays(new Date(), 1));
  }, []);

  const fetchTherapist = useCallback(async () => {
    try {
      if (!therapistId) throw new Error('Missing therapist id');
      const res = await fetch(`/api/therapists/${therapistId}`);
      const data = await res.json();
      if (data && typeof data === 'object' && !Array.isArray(data) && 'name' in data) {
        setTherapist(data);
      }
    } catch {
      console.error('Failed to fetch therapist');
    } finally {
      setLoading(false);
    }
  }, [therapistId]);

  useEffect(() => {
    fetchTherapist();
    fetchPatients();
    const slot = searchParams.get('slot');
    if (slot) {
      const d = new Date(slot);
      setSelectedDate(d);
    }
  }, [fetchTherapist, searchParams, therapistId]);

  async function fetchPatients() {
    setPatients([
      { id: 'patient-1', name: 'Alex Rivera', email: 'alex.rivera@email.com' },
      { id: 'patient-2', name: 'Jordan Kim', email: 'jordan.kim@email.com' },
      { id: 'patient-3', name: 'Taylor Morgan', email: 'taylor.morgan@email.com' },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime || !selectedPatient) return;

    setSubmitting(true);
    try {
      const dateTime = new Date(`${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}T${convertTo24Hour(selectedTime)}:00`);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId,
          patientId: selectedPatient,
          dateTime: dateTime.toISOString(),
          durationMins: 50,
          type: sessionType,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      console.error('Booking failed');
    } finally {
      setSubmitting(false);
    }
  }

  function convertTo24Hour(time: string): string {
    const [hourMin, period] = time.split(' ');
    const [hourStr, minStr] = hourMin.split(':');
    let hour = parseInt(hourStr, 10);
    const min = minStr;
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${min}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-500">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h2>
            <p className="text-slate-600 mb-6">
              Your appointment with {therapist?.name} has been scheduled for {formatDate(selectedDate ?? new Date())} at {selectedTime}.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/therapists/${therapistId}`} className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-flex items-center gap-1">
          ← Back to Profile
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <img
                src={therapist?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist?.name || '')}&background=10b981&color=fff`}
                alt={therapist?.name || ''}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-slate-800">{therapist?.name}</h2>
                <p className="text-blue-600">${therapist?.hourlyRate}/session · 50 min</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 px-4 py-3 rounded-lg border text-center transition-colors ${
                      format(date, 'yyyy-MM-dd') === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs text-slate-500">{format(date, 'EEE')}</div>
                    <div className="font-semibold">{format(date, 'MMM d')}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isBooked
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="therapy">Therapy Session</option>
                <option value="intake">Initial Intake</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                ))}
              </select>
            </div>

            {selectedTime && selectedPatient && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-800 mb-2">Booking Summary</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium">Date:</span> {formatDate(selectedDate ?? new Date())}</p>
                  <p><span className="font-medium">Time:</span> {selectedTime}</p>
                  <p><span className="font-medium">Session:</span> {sessionType}</p>
                  <p><span className="font-medium">Cost:</span> ${therapist?.hourlyRate}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTime || !selectedPatient || submitting}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
