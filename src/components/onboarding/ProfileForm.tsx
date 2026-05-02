'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import { detectSegment } from '@/engine/profile-manager';
import { generateJourney } from '@/engine/journey-generator';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  onBack: () => void;
}

const STATES = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'DL', name: 'Delhi' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'UP', name: 'Uttar Pradesh' },
];

export default function ProfileForm({ onBack }: ProfileFormProps) {
  const router = useRouter();
  const { setProfile, setSteps } = useAppStore();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    state: '',
    voterStatus: 'not_registered' as 'registered' | 'not_registered' | 'unknown',
    hasRelocated: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const age = parseInt(formData.age);
    const segment = detectSegment(age, formData.voterStatus, formData.hasRelocated);
    
    const profile = {
      id: crypto.randomUUID(),
      name: formData.name,
      age: age,
      state: formData.state,
      voterStatus: formData.voterStatus,
      segment: segment,
      language: 'en' as const,
      isComplete: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProfile(profile);
    
    const journey = generateJourney({ userId: profile.id, segment });
    setSteps(journey);
    
    addToast('Your voting journey has been generated!', 'success');
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-2">Create your profile</h2>
      <p className="text-gray-500 mb-8">We use this to personalize your voting journey.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
            <input 
              required
              type="number" 
              min="18"
              placeholder="e.g. 18"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 transition-colors"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 transition-colors appearance-none bg-white"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            >
              <option value="">Select State</option>
              {STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">Voter Status</label>
          <div className="space-y-3">
            {[
              { id: 'registered', label: 'I am a registered voter', value: 'registered' },
              { id: 'not_registered', label: 'I am not registered yet', value: 'not_registered' },
              { id: 'relocated', label: 'I have shifted to a new city', value: 'registered', relocated: true },
            ].map((option) => (
              <label 
                key={option.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  (option.relocated ? formData.hasRelocated : (formData.voterStatus === option.value && !formData.hasRelocated))
                    ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <input 
                  type="radio" 
                  className="hidden"
                  name="voterStatus"
                  onChange={() => setFormData({ 
                    ...formData, 
                    voterStatus: option.value as any, 
                    hasRelocated: !!option.relocated 
                  })}
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                   (option.relocated ? formData.hasRelocated : (formData.voterStatus === option.value && !formData.hasRelocated))
                    ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {(option.relocated ? formData.hasRelocated : (formData.voterStatus === option.value && !formData.hasRelocated)) && 
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                  }
                </div>
                <span className="font-bold text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center group"
        >
          Generate My Journey
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
