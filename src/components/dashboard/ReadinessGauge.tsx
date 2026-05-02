'use client';

import { Zap } from 'lucide-react';

interface ReadinessGaugeProps {
  readiness: number;
}

export default function ReadinessGauge({ readiness }: ReadinessGaugeProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (readiness / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm text-center">
      <h3 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest">Voter Readiness</h3>
      
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-100"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-blue-600 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-zinc-900">{readiness}%</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Ready</span>
        </div>
      </div>

      <p className="text-sm text-zinc-500 leading-relaxed">
        {readiness < 100 
          ? `Complete ${Math.ceil((100 - readiness) / 10)} more tasks to reach full voting readiness.` 
          : "You're 100% ready for the polls! Great job."}
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 py-2 rounded-xl border border-blue-100">
        <Zap className="w-3.5 h-3.5" />
        {readiness < 50 ? 'Novice Voter' : readiness < 80 ? 'Active Voter' : 'Elite Voter'}
      </div>
    </div>
  );
}
