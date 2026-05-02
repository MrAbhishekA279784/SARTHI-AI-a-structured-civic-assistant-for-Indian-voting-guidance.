'use client';

import { HelpCircle, MapPin, Bell, ChevronRight, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';

export default function QuickActions() {
  const router = useRouter();
  const { language } = useAppStore();
  const t = translations[language];
  const actions = [
    {
      title: t.askAI,
      desc: t.askAIDesc,
      icon: HelpCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/ai'
    },
    {
      title: t.findBooth,
      desc: t.findBoothDesc,
      icon: MapPin,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/booth'
    },
    {
      title: t.reminders,
      desc: t.remindersDesc,
      icon: Bell,
      color: 'text-red-500',
      bg: 'bg-red-50',
      href: '/reminders'
    },
    {
      title: t.learnMode,
      desc: t.learnModeDesc,
      icon: BookOpen,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/learn'
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:translate-y-[-2px] hover:shadow-md transition-all duration-200 ease-out">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">{t.quickActions}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={() => router.push(act.href)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-out group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${act.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${act.color}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                  <p className="text-xs text-gray-500">{act.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
