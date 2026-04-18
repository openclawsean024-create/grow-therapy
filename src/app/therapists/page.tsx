'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Therapist {
  id: string;
  name: string;
  bio: string;
  specialties: string;
  insuranceAccepted: string;
  hourlyRate: number;
  profileImage: string | null;
  languages: string;
}

const SPECIALTIES = ['Anxiety', 'Depression', 'Trauma', 'Relationships', 'OCD', 'ADHD', 'Grief', 'Family Therapy', 'Child', 'Adolescent'];
const INSURANCE_OPTIONS = ['Aetna', 'BlueCross', 'UnitedHealth', 'Cigna'];
const LOCATIONS = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'San Francisco, CA', 'Seattle, WA', 'Boston, MA'];

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchTherapists = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSpecialty) params.set('specialty', selectedSpecialty);
    if (selectedInsurance) params.set('insurance', selectedInsurance);

    try {
      const res = await fetch(`/api/therapists?${params.toString()}`);
      const data = await res.json();
      setTherapists(Array.isArray(data) ? data : []);
    } catch {
      setTherapists([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialty, selectedInsurance]);

  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Find a Therapist</h1>
          <p className="text-slate-600 mt-2">
            Browse our network of licensed mental health professionals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Insurance</label>
              <select
                value={selectedInsurance}
                onChange={(e) => setSelectedInsurance(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Insurance</option>
                {INSURANCE_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            {/* 地點（城市/州） */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Location (City/State)</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSelectedSpecialty(''); setSelectedInsurance(''); setSelectedLocation(''); }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading therapists...</div>
        ) : therapists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No therapists found matching your criteria.</p>
            <button
              onClick={() => { setSelectedSpecialty(''); setSelectedInsurance(''); setSelectedLocation(''); }}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TherapistCard({ therapist }: { therapist: Therapist }) {
  const specialties = therapist.specialties?.split(',') || [];
  const languages = therapist.languages?.split(',') || ['English'];

  return (
    <Link
      href={`/therapists/${therapist.id}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={therapist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.name)}&background=4A90D9&color=fff`}
            alt={therapist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800">{therapist.name}</h3>
            <p className="text-blue-600 font-medium">${therapist.hourlyRate}/session</p>
          </div>
        </div>
        <p className="mt-4 text-slate-600 text-sm line-clamp-3">{therapist.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.map((s) => (
            <span key={s} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              {s.trim()}
            </span>
          ))}
        </div>
        {/* 語言欄位 */}
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A5 5 0 0118 6v1a5 5 0 01-5.952 4.906M9 3v10a1 1 0 001 1h1a1 1 0 001-1V9.414" />
          </svg>
          {languages.map((l) => l.trim()).join(', ')}
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Accepts: {therapist.insuranceAccepted}
        </div>
        <div className="mt-4 w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
          View Profile & Book
        </div>
      </div>
    </Link>
  );
}
