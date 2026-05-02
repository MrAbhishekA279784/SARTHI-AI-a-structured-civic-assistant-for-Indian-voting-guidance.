'use client';

import { useAppStore } from '@/store/useAppStore';
import JourneyStepper from '@/components/dashboard/JourneyStepper';
import StepDetailCard from '@/components/dashboard/StepDetailCard';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JourneyPage() {
  const { steps = [], currentStepId } = useAppStore();
  const router = useRouter();

  // SAFE: prevent crash if steps not ready
  if (!steps || steps.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-zinc-500 animate-pulse">
          Loading your journey...
        </div>
      </div>
    );
  }

  const step =
    steps.find((s) => s.id === currentStepId) ||
    steps.find((s) => s.status === 'in_progress') ||
    steps[0];

  // EXTRA SAFE: still check
  if (!step) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        Unable to load journey step.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          Election Cycle 2024
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-zinc-900">Your Voting Journey</h1>
        <p className="text-zinc-600">
          Track your progress and complete all requirements to become a ready voter.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm overflow-x-auto">
        <JourneyStepper />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StepDetailCard stepId={step.id} />
      </div>
    </div>
  );
}