'use client';

import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import { Check } from 'lucide-react';
import { translations } from '@/lib/translations';

interface StepDetailCardProps {
  stepId: string;
}

export default function StepDetailCard({ stepId }: StepDetailCardProps) {
  const { steps, toggleChecklistItem, updateStepStatus, language } = useAppStore();
  const { addToast } = useToastStore();
  const t = translations[language];
  
  const step = steps.find(s => s.id === stepId);
  
  if (!step) return null;

  const handleToggle = (itemId: string) => {
    toggleChecklistItem(step.id, itemId);
    const item = step.checklistItems.find(i => i.id === itemId);
    const isNowChecked = !item?.checked; // Before the state updates locally
    
    // Save to Firestore
    if (typeof window !== 'undefined') {
      import('@/lib/firestore').then(({ saveChecklistItem }) => {
        saveChecklistItem(itemId, isNowChecked).then(() => {
          if (isNowChecked) {
            addToast('Saved to Google Cloud ☁️', 'success');
          }
        });
      }).catch(() => {});
      
      // Track Analytics
      import('@/lib/analytics').then(({ trackEvent }) => {
        trackEvent('checklist_update', { item_id: itemId, checked: isNowChecked });
      }).catch(() => {});
    }
    
    // Auto-update step status based on checklists
    setTimeout(() => {
      const updatedStep = useAppStore.getState().steps.find(s => s.id === step.id);
      if (updatedStep) {
        const allChecked = updatedStep.checklistItems.every(i => i.checked);
        if (allChecked && updatedStep.status !== 'completed') {
          updateStepStatus(step.id, 'completed');
          
          if (typeof window !== 'undefined') {
             import('@/lib/firestore').then(({ saveJourneyStep }) => {
                saveJourneyStep(step.id, step.title, true);
             }).catch(() => {});
             
             import('@/lib/analytics').then(({ trackEvent }) => {
                trackEvent('journey_step_complete', { step_id: step.id });
             }).catch(() => {});
          }
          
          // Mark next step as in_progress
          const nextStep = useAppStore.getState().steps.find(s => s.order === step.order + 1);
          if (nextStep) {
            updateStepStatus(nextStep.id, 'in_progress');
          }
        }
      }
    }, 0);
  };

  const isCompleted = step.status === 'completed';

  return (
    <div className={`bg-white border ${isCompleted ? 'border-green-200' : 'border-gray-100'} rounded-xl p-6 shadow-sm mt-4 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900">{t.step} {step.order}: {step.title}</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
          isCompleted ? 'bg-green-50 text-green-700 border-green-200' :
          step.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-gray-50 text-gray-600 border-gray-200'
        }`}>
          {isCompleted ? t.completed : step.status === 'in_progress' ? t.inProgress : t.pending}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-6 max-w-lg">{step.description}</p>
      
      <div className="mb-6 z-10 relative">
        <h4 className="text-sm font-bold text-gray-900 mb-3">{t.whatYouNeedToDo}</h4>
        <ul className="space-y-3">
          {step.checklistItems.map(item => (
            <li 
               key={item.id} 
               className="flex items-start gap-3 group cursor-pointer" 
               onClick={() => handleToggle(item.id)}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(item.id); } }}
               tabIndex={0}
               role="checkbox"
               aria-checked={item.checked}
               aria-label={item.label}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 group-hover:border-blue-400'
              }`}>
                {item.checked && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-sm select-none ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 relative z-10">
        {!isCompleted && (
          <button 
            onClick={() => {
              updateStepStatus(step.id, 'in_progress');
              addToast('Step started! Follow the checklist.', 'success');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-200 active:scale-95"
          >
            {t.startStep}
          </button>
        )}
        <a
          href="https://voters.eci.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-700 border-2 border-gray-100 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all duration-200 active:scale-95 inline-block"
        >
          {t.learnMore}
        </a>
      </div>

      <div className="absolute right-4 bottom-4 opacity-50 md:opacity-100 w-48 h-48 hidden sm:flex items-end justify-end pointer-events-none">
         <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-50' : 'bg-blue-50'}`}>
            <span className={`text-xs ${isCompleted ? 'text-green-200' : 'text-blue-200'}`}>Illustration</span>
         </div>
      </div>
    </div>
  );
}
