'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Route, HelpCircle, CheckSquare, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/dashboard' },
    { name: 'Journey', icon: Route, href: '/journey' },
    { name: 'SARTHI AI', icon: HelpCircle, href: '/ai' },
    { name: 'Checklists', icon: CheckSquare, href: '/checklists' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${
                pathname === item.href ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${pathname === item.href ? 'fill-blue-50/50' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
