'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Route, HelpCircle, CheckSquare, MapPin, Bell, BookOpen, Settings, WifiOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOnline } = useAppStore();

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'My Journey', icon: Route, href: '/journey' },
    { name: 'SARTHI AI', icon: HelpCircle, href: '/ai' },
    { name: 'Checklists', icon: CheckSquare, href: '/checklists' },
    { name: 'Polling Booth Locator', icon: MapPin, href: '/booth' },
    { name: 'Reminders', icon: Bell, href: '/reminders' },
    { name: 'Learn Mode', icon: BookOpen, href: '/learn' },
    { name: 'Profile', icon: Settings, href: '/profile' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-gray-200 bg-white fixed left-0 top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            {/* Using text logo placeholder as SVG requires exact matching */}
            <span className="text-xl font-bold text-blue-600">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">SARTHI</h1>
            <p className="text-xs text-gray-500">Your Election Assistant</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                pathname === item.href 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {!isOnline && (
        <div className="p-4 mt-auto mb-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <WifiOff className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Offline Mode</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              You are in offline mode.<br/>Some features may be limited.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
