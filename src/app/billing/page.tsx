'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { formatDate, formatCurrency } from '@/lib/utils';

interface BillingRecord {
  id: string;
  totalAmount: number;
  copayAmount: number;
  insuranceCoverage: number;
  amountDue: number;
  status: string;
  createdAt: string;
  appointment: {
    dateTime: string;
    type: string;
    therapist: { name: string };
  };
  patient: { name: string; email: string };
  insurancePlan: { name: string; provider: string } | null;
}

export default function BillingPage() {
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillings();
  }, []);

  async function fetchBillings() {
    try {
      const res = await fetch('/api/billing');
      const data = await res.json();
      setBillings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalBilled = billings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = billings.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amountDue, 0);
  const totalPending = billings.filter((b) => b.status === 'pending').reduce((sum, b) => sum + b.amountDue, 0);
  const totalInsuranceClaims = billings.reduce((sum, b) => sum + b.insuranceCoverage, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Billing</h1>
          <p className="text-slate-600 mt-2">View and manage billing records</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Billed" value={formatCurrency(totalBilled)} color="slate" />
          <StatCard label="Collected" value={formatCurrency(totalCollected)} color="emerald" />
          <StatCard label="Pending" value={formatCurrency(totalPending)} color="yellow" />
          <StatCard label="Insurance Claims" value={formatCurrency(totalInsuranceClaims)} color="blue" />
        </div>

        {/* Billing Records */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Billing Records</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading billing records...</div>
          ) : billings.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No billing records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Therapist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Copay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Insurance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {billings.map((billing) => (
                    <tr key={billing.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{billing.patient.name}</div>
                        <div className="text-xs text-slate-500">{billing.patient.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(billing.appointment.dateTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {billing.appointment.therapist.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {formatCurrency(billing.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatCurrency(billing.copayAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        {formatCurrency(billing.insuranceCoverage)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {formatCurrency(billing.amountDue)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={billing.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sample Bill Card */}
        {billings.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-800 text-white">
              <h2 className="font-semibold">Sample Bill</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Grow Therapy</h3>
                  <p className="text-sm text-slate-500">123 Wellness Ave, Suite 100</p>
                  <p className="text-sm text-slate-500">New York, NY 10001</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Date: {formatDate(billings[0].createdAt)}</p>
                  <p className="text-sm text-slate-500">Invoice #: {billings[0].id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-medium text-slate-800">{billings[0].patient.name}</p>
                <p className="text-sm text-slate-600">{billings[0].patient.email}</p>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-sm font-medium text-slate-500">Description</th>
                    <th className="text-right py-2 text-sm font-medium text-slate-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 text-sm text-slate-700">
                      {billings[0].appointment.type.charAt(0).toUpperCase() + billings[0].appointment.type.slice(1)} Session
                    </td>
                    <td className="py-3 text-sm text-slate-700 text-right">{formatCurrency(billings[0].totalAmount)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 text-sm text-blue-600">Insurance Coverage ({billings[0].insurancePlan?.name || 'N/A'})</td>
                    <td className="py-3 text-sm text-blue-600 text-right">-{formatCurrency(billings[0].insuranceCoverage)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm font-medium text-slate-800">Patient Copay</td>
                    <td className="py-3 text-sm font-medium text-slate-800 text-right">{formatCurrency(billings[0].copayAmount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Amount Due</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(billings[0].amountDue)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'slate' }: { label: string; value: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-blue-50 text-blue-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="text-lg font-bold text-slate-800">{value}</div>
      <div className={`text-sm mt-1 px-2 py-0.5 rounded-full inline-block ${colorClasses[color]}`}>
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    submitted: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
