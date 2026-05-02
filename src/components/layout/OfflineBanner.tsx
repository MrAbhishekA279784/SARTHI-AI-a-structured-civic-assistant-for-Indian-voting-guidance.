'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff, AlertTriangle } from 'lucide-react';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-600 text-white py-2 px-4 flex items-center justify-center gap-3 sticky top-0 z-[60] animate-in slide-in-from-top duration-300">
      <WifiOff className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-wide">
        You are currently offline. Core journey and checklists are still available.
      </span>
      <div className="hidden sm:flex items-center gap-1 ml-4 bg-yellow-700 px-2 py-0.5 rounded text-[10px] font-black">
        <AlertTriangle className="w-3 h-3" />
        OFFLINE MODE
      </div>
    </div>
  );
}
