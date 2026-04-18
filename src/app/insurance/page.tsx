'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  copayAmount: number;
  coveragePercent: number;
  maxSessionsPerYear: number | null;
}

const MOCK_SERVICES = [
  'Therapy Session',
  'Psychiatric Evaluation',
  'Medication Management',
  'Family Therapy',
  'Group Therapy',
  'Psychological Testing',
];

export default function InsurancePage() {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedService, setSelectedService] = useState('Therapy Session');
  const [result, setResult] = useState<{
    covered: boolean;
    copayAmount: number | null;
    coveragePercent: number | null;
    maxSessionsPerYear: number | null;
    message: string;
    insurancePlanName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const res = await fetch('/api/insurance/verify');
      const data = await res.json();
      const plansData = Array.isArray(data) ? data : [];
      setPlans(plansData);
      if (plansData.length > 0) setSelectedPlan(plansData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlans(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/insurance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insurancePlanId: selectedPlan,
          serviceType: selectedService,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Insurance Verification</h1>
          <p className="text-slate-600 mt-2">
            Check if your insurance plan covers specific therapy services
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="font-semibold text-blue-800">Verify Your Coverage</h2>
            <p className="text-sm text-blue-600 mt-1">
              Enter your insurance details to see your estimated coverage
            </p>
          </div>

          <form onSubmit={handleVerify} className="p-6 space-y-6">
            {/* Insurance Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Plan</label>
              {loadingPlans ? (
                <div className="text-slate-500">Loading plans...</div>
              ) : (
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({plan.provider})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_SERVICES.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedPlan}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Coverage'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className={`px-6 pb-6 ${result.covered ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <div className={`p-4 rounded-lg border ${
                result.covered
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className="flex items-start gap-3">
                  {/* In-Network: green checkmark | Out-of-Network: amber ⚠️ */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.covered ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    {result.covered ? (
                      // Green checkmark SVG
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      // Amber ⚠️ SVG
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${result.covered ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {result.covered ? 'In-Network' : 'Out-of-Network'}
                    </h3>
                    <p className={`text-sm mt-1 ${result.covered ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {result.message}
                    </p>

                    {result.covered && (
                      <>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-slate-500">Copay</div>
                            <div className="font-semibold text-slate-800">${result.copayAmount}</div>
                            {/* Disclaimer */}
                            <div className="text-xs text-slate-400 mt-1">實際金額以保險公司認定為準</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-slate-500">Coverage</div>
                            <div className="font-semibold text-slate-800">{result.coveragePercent}%</div>
                          </div>
                          {result.maxSessionsPerYear && (
                            <div className="bg-white/60 rounded-lg p-3 col-span-2">
                              <div className="text-slate-500">Max Sessions/Year</div>
                              <div className="font-semibold text-slate-800">{result.maxSessionsPerYear}</div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-800">Insurance Note</h3>
              <p className="text-sm text-blue-700 mt-1">
                This is a mock verification system. Actual coverage may vary. Please contact your insurance provider for complete benefit details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
