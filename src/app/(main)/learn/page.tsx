'use client';

import { GraduationCap } from 'lucide-react';
import DocumentGame from '@/components/learn/DocumentGame';
import JourneyGame from '@/components/learn/JourneyGame';

export default function LearnPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SARTHI Learn Mode</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Test your election knowledge with interactive challenges
          </p>
        </div>
      </div>

      {/* Games */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DocumentGame />
        <JourneyGame />
      </div>
    </div>
  );
}
