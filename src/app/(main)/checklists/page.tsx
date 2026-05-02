'use client';

import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Circle, Search, Filter, Info, ChevronRight } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

export default function ChecklistsPage() {
  const { steps, updateStepStatus } = useAppStore();
  const { addToast } = useToastStore();

  const handleToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateStepStatus(id, newStatus as any);
    addToast(`Step marked as ${newStatus}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900">Election Checklists</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Stay organized with our comprehensive checklists. Complete these tasks to ensure you're fully prepared for the upcoming election.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 active:scale-95 transition-all duration-200">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className="h-8 w-px bg-zinc-200 mx-2 hidden md:block"></div>
            <p className="text-sm font-medium text-zinc-500">
              <span className="text-blue-600 font-bold">{steps.filter(s => s.status === 'completed').length}</span>/{steps.length} Completed
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`p-6 flex items-start justify-between group transition-all ${step.status === 'completed' ? 'bg-zinc-50/30' : 'bg-white hover:bg-zinc-50/50'}`}
            >
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => handleToggle(step.id, step.status)}
                  className={`mt-1 transition-all ${step.status === 'completed' ? 'text-green-500' : 'text-zinc-300 hover:text-blue-500'}`}
                >
                  {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <div className="space-y-1">
                  <h3 className={`font-bold transition-all ${step.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-all ${step.status === 'completed' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {step.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {step.id.split('-')[0]}
                    </span>
                    {step.status === 'in_progress' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="p-2 text-zinc-300 hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Info className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold">Need official help?</h2>
          <p className="text-zinc-400 max-w-md">
            If you're stuck on a step or need official documentation, we can guide you to the right government portal.
          </p>
        </div>
        <a 
          href="https://voters.eci.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold active:scale-95 transition-all duration-200 shadow-lg shadow-blue-900/20"
        >
          Contact Help Desk
        </a>
      </div>
    </div>
  );
}