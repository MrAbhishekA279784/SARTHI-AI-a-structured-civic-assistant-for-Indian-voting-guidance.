'use client';

import { useAppStore } from '@/store/useAppStore';
import { calculateReadiness } from '@/engine/readiness-calculator';
import { CheckCircle2, CalendarDays, Zap, ClipboardList, ChevronRight, Bot, MessageSquare, Cloud, Activity } from 'lucide-react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import QuickActions from '@/components/dashboard/QuickActions';
import JourneyStepper from '@/components/dashboard/JourneyStepper';
import StepDetailCard from '@/components/dashboard/StepDetailCard';
import TrustInfoPanel from '@/components/dashboard/TrustInfoPanel';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { resolveScenario } from '@/engine/what-if-resolver';
import { translations } from '@/lib/translations';
import { fetchUserProgress } from '@/lib/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const { profile, steps, reminders, language } = useAppStore();
  const t = translations[language];
  const readinessResult = calculateReadiness({
    steps,
    boothLocated: steps.find(s => s.id.includes('booth'))?.status === 'completed' || false,
    remindersSet: (reminders || []).length > 0
  });
  const readiness = readinessResult.score;

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const currentStep = steps.find(s => s.status === 'in_progress') || steps[0];

  // What-if Scenario Simulator state
  const [whatIfQuery, setWhatIfQuery] = useState('');

  const handleWhatIf = () => {
    if (!whatIfQuery.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(whatIfQuery)}`);
  };

  // Upcoming task
  const nextPendingStep = steps.find(s => s.status === 'in_progress' || s.status === 'pending');

  const [cloudSynced, setCloudSynced] = useState(false);
  const [analyticsCount, setAnalyticsCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUserProgress().then(data => {
        if (data && (data.savedSteps.length > 0 || data.savedChecks.length > 0)) {
          setCloudSynced(true);
          import('@/lib/analytics').then(({ trackEvent }) => {
            trackEvent("firestore_data_loaded", {
              steps_count: data.savedSteps.length,
              checklist_count: data.savedChecks.length
            });
          }).catch(() => {});
        }
      });
      
      import('@/lib/analytics').then(({ trackEvent }) => {
        trackEvent('dashboard_viewed');
        setAnalyticsCount(prev => prev + 1);
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 4 Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Readiness Score"
          value={`${readiness}%`}
          icon={Zap}
          trend="You are on the right track!"
          color="text-blue-600"
        />
        <SummaryCard
          title="Completed Steps"
          value={`${completedSteps} / ${steps.length}`}
          icon={CheckCircle2}
          trend="Steps completed"
          color="text-green-600"
        />
        <SummaryCard
          title="Upcoming Task"
          value={nextPendingStep?.title || 'All done!'}
          icon={ClipboardList}
          trend={nextPendingStep ? 'Due in 3 days' : 'Great job!'}
          color="text-orange-600"
        />
        <SummaryCard
          title="Election Date"
          value="May 03, 2026"
          icon={CalendarDays}
          trend="Mark your calendar!"
          color="text-zinc-900"
        />
      </div>

      {/* Main 3-column grid: Content (2 cols) + Right Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Personalized Voting Journey */}
          <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Personalized Voting Journey</h2>
                <p className="text-sm text-gray-500 mt-0.5">Based on your profile and inputs</p>
              </div>
              <button
                onClick={() => router.push('/journey')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200"
              >
                Continue Journey
              </button>
            </div>
            <JourneyStepper />
          </section>

          {/* Cloud & Analytics Visibility Panel */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm mt-6">
            <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Cloud className="w-4 h-4" /> Google Services Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-50">
                <p className="text-xs text-gray-500 mb-1">Database Sync</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cloudSynced ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {cloudSynced ? 'Data synced with Firebase ☁️' : 'Local Mode'}
                  </span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-50">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Telemetry
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${analyticsCount > 0 ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {analyticsCount > 0 ? 'Active Tracking' : 'Analytics Setup'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Step Detail Card */}
          {currentStep && (
            <StepDetailCard stepId={currentStep.id} />
          )}

          {/* What-if Scenario Simulator */}
          <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-blue-700 mb-1">SARTHI AI</h2>
            <p className="text-sm text-gray-500 mb-4">Not sure about your situation? Get clarity here.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={whatIfQuery}
                onChange={(e) => setWhatIfQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleWhatIf()}
                placeholder='Example: "I lost my voter ID", "I have shifted my city", "Last date missed"'
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleWhatIf}
                className="px-6 py-3 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                Get Answer
              </button>
              <button
                onClick={() => router.push('/ai')}
                className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 active:scale-95 transition-all duration-200"
                title="Open AI Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Bottom Feature Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🟢', title: 'Works Offline', desc: 'Access essential features anytime' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and safe' },
              { icon: '🌐', title: 'Multilingual Support', desc: 'Available in 12+ languages' },
              { icon: '⚡', title: 'Lightweight', desc: 'Optimized for low internet and data usage' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <span className="text-lg">{feature.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT: Side Panel (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Trusted Information */}
          <TrustInfoPanel />

          {/* Need Help AI Card */}
          <section className="bg-zinc-900 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1">Need help understanding something?</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                Ask our AI assistant any election related question.
              </p>
              <button
                onClick={() => router.push('/ai')}
                className="px-4 py-2 border border-blue-500 text-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-600 hover:text-white active:scale-95 transition-all duration-200"
              >
                Ask SARTHI
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20">
              <Bot className="w-full h-full text-blue-400" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}