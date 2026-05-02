import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function TrustInfoPanel() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Trusted Information</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">All information is sourced from Election Commission of India</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-sm text-gray-600">Last updated: Apr 20, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-sm text-gray-600">Confidence: <span className="text-green-600 font-semibold">High</span></p>
        </div>
      </div>
    </div>
  );
}
