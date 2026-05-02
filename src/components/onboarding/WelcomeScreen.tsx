'use client';

import { Vote } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-8 transform -rotate-6">
        <Vote className="w-12 h-12 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
        Vote<span className="text-blue-600">Smart</span>
      </h1>
      
      <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
        Your voice matters. <br className="hidden sm:block" />
        We make voting simple, secure, and stress-free.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={onStart}
          className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Get Started
        </button>
        <button className="flex-1 bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all">
          Sign In
        </button>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        Takes less than 60 seconds to set up.
      </p>
    </div>
  );
}
