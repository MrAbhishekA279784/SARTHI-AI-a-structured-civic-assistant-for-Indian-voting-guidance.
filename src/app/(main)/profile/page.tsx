'use client';

import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Shield, Download, Trash2, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

export default function ProfilePage() {
  const { profile, resetStore } = useAppStore();
  const { logout, user } = useAuth();
  const { addToast } = useToastStore();

  const handleExportData = () => {
    const data = {
      profile: profile,
      exportDate: new Date().toISOString(),
      source: 'SARTHI Election Assistant'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarthi-profile-${profile?.name || 'user'}.json`;
    a.click();
    addToast('Data exported successfully', 'success');
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Reset local store after logout
      // resetStore(); // Optional: depend on if you want to clear local storage too
      window.location.href = '/login';
    } catch (err) {
      addToast('Failed to logout', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Your Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-xl active:scale-95 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">{profile?.name || 'Citizen'}</h2>
            <p className="text-zinc-500 text-sm mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Voter
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Privacy Status
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Your data is stored locally first and synced to your private cloud only when you are online. We never share your personal data with third parties.
            </p>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full"></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <p className="font-semibold text-zinc-900">{profile?.name || 'Not provided'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <p className="font-semibold text-zinc-900">{user?.email}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Voter ID</label>
                  <p className="font-semibold text-zinc-900">{profile?.voterId || 'Not provided'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</label>
                  <p className="font-semibold text-zinc-900">{profile?.state || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900">Data & Portability</h3>
            </div>
            <div className="p-0">
              <button 
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 active:scale-[0.98] transition-all duration-200 border-b border-zinc-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-zinc-900">Export Your Data</p>
                    <p className="text-xs text-zinc-500">Download a copy of your voting profile</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                    resetStore();
                  }
                }}
                className="w-full flex items-center justify-between p-6 hover:bg-red-50 active:scale-[0.98] transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-zinc-900 text-red-600">Delete Account</p>
                    <p className="text-xs text-zinc-500">Permanently remove all your data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}