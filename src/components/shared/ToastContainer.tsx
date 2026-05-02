'use client';

import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border min-w-[300px] animate-in slide-in-from-right-8 duration-300 ${
            toast.type === 'success' ? 'bg-green-600 border-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-600 border-red-500 text-white' :
            'bg-gray-900 border-gray-800 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Info className="w-5 h-5" />}
          
          <p className="flex-1 text-sm font-bold">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
