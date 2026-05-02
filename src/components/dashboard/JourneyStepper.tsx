'use client';

import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

export default function JourneyStepper() {
  const { steps } = useAppStore();

  if (!steps.length) return null;

  // Calculate progress line percentage
  const currentIndex = steps.findIndex(s => s.status === 'in_progress');
  const safeIndex = currentIndex === -1 ? steps.length - 1 : currentIndex;
  const progressPercentage = steps.length > 1 ? (safeIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full py-4 pb-12 overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between relative min-w-[600px] px-4">
        {/* Background Line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full" />
        {/* Active Line */}
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-green-500 z-0 rounded-full transition-all duration-500" 
          style={{ width: `calc(${progressPercentage}% - 16px)` }}
        />
        
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center group cursor-pointer">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
              step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
              step.status === 'in_progress' ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100' :
              'bg-white border-gray-300 text-gray-400 group-hover:border-gray-400'
            }`}>
              {step.status === 'completed' ? <Check className="w-5 h-5" /> : step.order}
            </div>
            <span className={`absolute top-10 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
              step.status === 'in_progress' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}>
              {step.order}. {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
