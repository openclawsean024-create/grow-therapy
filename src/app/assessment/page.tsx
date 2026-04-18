'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const QUESTIONS = [
  { id: 1, text: 'How often have you felt overwhelmed by daily tasks in the past two weeks?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 2, text: 'Do you experience difficulty sleeping (falling or staying asleep)?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 3, text: 'How would you rate your current stress level?', options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] },
  { id: 4, text: 'Do you feel isolated or disconnected from others?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 5, text: 'Have you noticed changes in your appetite or eating habits?', options: ['No change', 'Slight change', 'Moderate change', 'Significant change'] },
  { id: 6, text: 'How often do you feel anxious or worried?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 7, text: 'Do you find joy in activities you once enjoyed?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
  { id: 8, text: 'How would you describe your mood over the past month?', options: ['Very Good', 'Good', 'Neutral', 'Low', 'Very Low'] },
];

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setSubmitted(true);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (submitted) {
    const score = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const maxScore = QUESTIONS.length * (QUESTIONS[0].options.length - 1);
    const pct = (score / maxScore) * 100;
    const level = pct < 30 ? 'Low' : pct < 60 ? 'Moderate' : 'High';

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Assessment Complete</h1>
            <p className="text-slate-600 mb-8">
              Based on your responses, your stress and wellness level appears to be <strong className="text-blue-500">{level}</strong>.
              This is not a diagnosis — only a licensed professional can provide one.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 mb-3">Recommended Next Steps</h3>
              <ul className="text-slate-600 text-sm space-y-2">
                <li className="flex gap-2"><span className="text-blue-500">•</span> Connect with a therapist specializing in your areas of concern</li>
                <li className="flex gap-2"><span className="text-blue-500">•</span> Consider a comprehensive evaluation with our care team</li>
                <li className="flex gap-2"><span className="text-blue-500">•</span> Explore our insurance verification to reduce out-of-pocket costs</li>
              </ul>
            </div>
            <Link href="/search" className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Find a Therapist
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-6">
          <p className="text-slate-500 text-sm mb-2">Question {step + 1} of {QUESTIONS.length}</p>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQ.text}</h2>
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  answers[currentQ.id] === i
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button onClick={handleBack} className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={answers[currentQ.id] === undefined}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
