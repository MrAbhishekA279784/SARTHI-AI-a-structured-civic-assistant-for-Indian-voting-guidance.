'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Bot, Send, User, Sparkles, ExternalLink, ShieldCheck, FileText, Info } from 'lucide-react';
import { askSarthi, SarthiResponse } from '@/engine/sarthi-explainer';
import { useSearchParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sarthi?: SarthiResponse;
}

function AIPageInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! I'm SARTHI, your election assistant. Ask me anything about voting — registration, lost voter ID, polling booth, NRI voting, and more."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedQuery = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle query param from dashboard redirect
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !hasProcessedQuery.current) {
      hasProcessedQuery.current = true;
      processQuery(q);
    }
  }, [searchParams]);

  const processQuery = (query: string) => {
    const userMessage = query.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Use the SARTHI explainer layer (wraps rule-based resolver)
    const result = askSarthi(userMessage);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: result.explanation,
      sarthi: result,
    }]);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    processQuery(userMessage);
  };

  const confidenceColor = (c: string) => {
    switch (c) {
      case 'high': return 'bg-green-50 text-green-700 border-green-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200';
    }
  };

  const confidenceLabel = (c: string) => {
    switch (c) {
      case 'high': return '✓ Verified';
      case 'medium': return '~ General Info';
      case 'low': return '⚠ Unverified';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SARTHI AI</h1>
          <p className="text-zinc-500 text-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Verified ECI dataset · Rule-based intelligence
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4 scrollbar-thin scrollbar-thumb-zinc-200">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-zinc-100 text-zinc-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="space-y-3 min-w-0">
                {/* Main message bubble */}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                }`}>
                  {m.content}
                </div>

                {/* SARTHI structured response */}
                {m.sarthi && (
                  <div className="space-y-3 animate-in zoom-in-95 duration-300">
                    {/* Confidence + Source badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border ${confidenceColor(m.sarthi.confidence)}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {confidenceLabel(m.sarthi.confidence)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-500 bg-zinc-50 rounded-full border border-zinc-200">
                        <FileText className="w-3 h-3" />
                        {m.sarthi.source.length > 50 ? m.sarthi.source.slice(0, 47) + '...' : m.sarthi.source}
                      </span>
                    </div>

                    {/* Action Steps */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
                      <p className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Action Steps</p>
                      <div className="space-y-2.5">
                        {m.sarthi.steps.map((step, j) => (
                          <div key={j} className="flex gap-3 text-sm text-zinc-700">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {j + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alternate Documents (if any) */}
                    {m.sarthi.documents && m.sarthi.documents.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-2">Accepted Documents</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.sarthi.documents.map((doc, j) => (
                            <span key={j} className="px-2.5 py-1 bg-white text-blue-700 text-xs font-medium rounded-lg border border-blue-200">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    {m.sarthi.note && (
                      <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">{m.sarthi.note}</p>
                      </div>
                    )}

                    {/* Official Links */}
                    {m.sarthi.links && m.sarthi.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.sarthi.links.map((link, k) => (
                          <a
                            key={k}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                          >
                            {link.label}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          placeholder="Ask about voting, registration, polling booths..."
          className="w-full pl-6 pr-16 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          'I lost my voter ID',
          'Am I registered?',
          'How to register online?',
          'I moved to a new city',
          'NRI voting process',
          'What documents do I need?',
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-medium rounded-full active:scale-95 transition-all duration-200 border border-zinc-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-180px)]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AIPageInner />
    </Suspense>
  );
}
