'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

const team = [
  { name: 'Dr. Sarah Chen', role: 'Clinical Director, PhD', bio: '15+ years in cognitive behavioral therapy and trauma recovery.' },
  { name: 'Dr. Michael Torres', role: 'Lead Psychiatrist, MD', bio: 'Specializes in anxiety, depression, and psychopharmacology.' },
  { name: 'Dr. Emily Watson', role: 'Senior Psychologist, PsyD', bio: 'Expert in relationship counseling and family systems therapy.' },
];

const values = [
  { title: 'Confidentiality', desc: 'Your privacy is paramount. All sessions are HIPAA-compliant.' },
  { title: 'Accessibility', desc: 'Virtual and in-person options available across 50+ locations.' },
  { title: 'Evidence-Based', desc: 'We only use therapies backed by clinical research.' },
  { title: 'Personalized Care', desc: 'Every treatment plan is tailored to your unique needs.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Grow Therapy</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Connecting people with compassionate, licensed mental health professionals since 2018.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Grow Therapy was founded on the belief that mental health care should be accessible, affordable, and judgment-free.
              We have served over 50,000 patients and built a network of 500+ licensed therapists across the United States.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Meet Our Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4A90D9&color=fff&size=128`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-slate-800">{member.name}</h3>
                <p className="text-blue-500 text-sm font-medium">{member.role}</p>
                <p className="text-slate-600 text-sm mt-3">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8">Find a therapist who understands your needs.</p>
          <Link href="/search" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Browse Therapists
          </Link>
        </div>
      </section>
    </div>
  );
}
