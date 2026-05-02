'use client';

import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

export default function SummaryCard({ title, value, icon: Icon, trend, color }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm flex flex-col h-full hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:scale-110 transition-transform ${color.replace('text', 'bg-opacity-10 text')}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{title}</span>
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-black text-zinc-900 mb-1">{value}</div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}
