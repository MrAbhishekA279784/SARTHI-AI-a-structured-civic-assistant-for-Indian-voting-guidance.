'use client';

import { useState } from 'react';
import { MapPin, Navigation, Search, Info, ExternalLink, ArrowRight } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

interface BoothResult {
  name: string;
  address: string;
  distance: string;
  type: string;
  mapsUrl: string;
}

export default function PollingBoothPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BoothResult[] | null>(null);
  const { addToast } = useToastStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    // Real Google Maps search logic
    const encodedSearch = encodeURIComponent(`polling booth near ${searchQuery}`);
    const mapsUrl = `https://www.google.com/maps/search/${encodedSearch}`;
    
    // Remove fake setTimeout and process immediately
    setResults([
      {
        name: `Polling Booth near ${searchQuery}`,
        address: searchQuery,
        distance: "Calculating...",
        type: "Official Polling Station",
        mapsUrl: mapsUrl
      }
    ]);
    setLoading(false);
    
    // Also open in new tab
    window.open(mapsUrl, '_blank');
    addToast('Opening Google Maps to find the nearest booth', 'success');
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/polling+booth/@${latitude},${longitude},15z`;
        
        setResults([
          {
            name: "Nearest Polling Booth",
            address: "Current Location",
            distance: "Nearby",
            type: "Official Polling Station",
            mapsUrl: mapsUrl
          }
        ]);
        setLoading(false);
        window.open(mapsUrl, '_blank');
        addToast('Location found! Opening Google Maps.', 'success');
      },
      (error) => {
        setLoading(false);
        addToast('Unable to retrieve your location', 'error');
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900">Find Your Polling Booth</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Locate your assigned polling station quickly and easily. We use official data sources and mapping tools to guide you to the right place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Search by Area</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your PIN code or area..."
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Booths"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl space-y-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
            <Navigation className="w-32 h-32" />
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
            <Navigation className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Use Current Location</h2>
          <p className="text-zinc-400">
            Automatically find the nearest polling station based on your current GPS coordinates.
          </p>
          <button
            onClick={handleUseLocation}
            disabled={loading}
            className="w-full py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Detecting..." : "Find Near Me"}
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 animate-in slide-in-from-top-4 duration-500">
          <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Search Results
          </h3>
          <div className="space-y-4">
            {results.map((booth, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-blue-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{booth.name}</p>
                    <p className="text-sm text-zinc-500">{booth.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {booth.distance}
                  </span>
                  <a
                    href={booth.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-zinc-400"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-600 shrink-0" />
        <div className="text-sm text-blue-800 leading-relaxed">
          <p className="font-bold mb-1">Official Verification Required</p>
          <p className="opacity-80">
            While we use mapping data for convenience, please always verify your booth via the official ECI Voter Portal before election day.
          </p>
          <a
            href="https://voters.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 font-bold hover:underline"
          >
            Visit Official ECI Portal
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}