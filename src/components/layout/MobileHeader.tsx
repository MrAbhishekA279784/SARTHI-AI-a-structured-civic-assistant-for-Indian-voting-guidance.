'use client';

import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function MobileHeader() {
  const { reminders } = useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [eciUpdates, setEciUpdates] = useState<string[] | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fallback = [
      "Voter registration deadline extended",
      "New guidelines for voter ID correction",
      "Polling booth updates announced",
    ];

    async function fetchECI() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://eci.gov.in/files/category/100-news/",
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const titles = data?.items?.slice(0, 5).map((item: any) => item.title);

        if (isMounted) {
          if (titles && titles.length > 0) {
            setEciUpdates(titles);
          } else {
            setEciUpdates(fallback);
          }
        }
      } catch {
        if (isMounted) setEciUpdates(fallback);
      }
    }
    fetchECI();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-100 w-full fixed top-0 left-0 z-50">
      <button className="p-2 text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
      
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <span className="text-lg font-bold text-blue-600">S</span>
        </div>
        <span className="text-lg font-bold text-gray-900">SARTHI</span>
      </Link>

      <div className="relative" ref={panelRef}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setNotifOpen(prev => !prev);
          }}
          className="relative p-2 text-gray-600"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-xl shadow-lg p-4 space-y-4 max-h-[24rem] overflow-y-auto z-50">
            {/* Reminders */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-900">Reminders</p>
              {(!reminders || reminders.length === 0) ? (
                <p className="text-xs text-gray-500">No reminders</p>
              ) : (
                reminders.map((item, i) => (
                  <div key={i} className="text-sm mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {item.date}</p>
                  </div>
                ))
              )}
            </div>

            {/* ECI Updates */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-900">ECI Updates</p>
              {!eciUpdates ? (
                 <p className="text-xs text-gray-500">Loading updates...</p>
              ) : (
                <div className="space-y-2">
                  {eciUpdates.map((u, i) => (
                    <div key={i} className="text-sm p-2 bg-blue-50/50 rounded-lg border border-blue-100/50 text-gray-700">
                      • {u}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
