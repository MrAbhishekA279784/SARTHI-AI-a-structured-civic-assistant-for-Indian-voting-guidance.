'use client';

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lightbulb, RotateCcw } from 'lucide-react';

interface DocumentOption {
  id: string;
  label: string;
  valid: boolean;
}

const ALL_DOCUMENTS: DocumentOption[] = [
  { id: 'aadhaar', label: 'Aadhaar Card', valid: true },
  { id: 'pan', label: 'PAN Card', valid: true },
  { id: 'passport', label: 'Passport', valid: true },
  { id: 'driving', label: 'Driving License', valid: true },
  { id: 'fake', label: 'Fake Card', valid: false },
  { id: 'lottery', label: 'Lottery Ticket', valid: false },
];

const VALID_IDS = new Set(
  ALL_DOCUMENTS.filter(d => d.valid).map(d => d.id)
);

type GameState = 'playing' | 'correct' | 'wrong';

export default function DocumentGame() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<GameState>('playing');
  const [showHint, setShowHint] = useState(false);

  const toggle = (id: string) => {
    if (gameState !== 'playing') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const checkAnswer = () => {
    if (selected.size === 0) return;

    const allValidSelected = ALL_DOCUMENTS
      .filter(d => d.valid)
      .every(d => selected.has(d.id));

    const noInvalidSelected = ALL_DOCUMENTS
      .filter(d => !d.valid)
      .every(d => !selected.has(d.id));

    setGameState(allValidSelected && noInvalidSelected ? 'correct' : 'wrong');
  };

  const reset = () => {
    setSelected(new Set());
    setGameState('playing');
    setShowHint(false);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ready to Vote?</h2>
            <p className="text-sm text-gray-500">Select ALL valid photo IDs accepted at the polling booth</p>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_DOCUMENTS.map((doc) => {
            const isSelected = selected.has(doc.id);
            const showResult = gameState !== 'playing';
            const isCorrectPick = showResult && doc.valid && isSelected;
            const isWrongPick = showResult && !doc.valid && isSelected;
            const isMissed = showResult && doc.valid && !isSelected;

            let borderColor = 'border-gray-200 hover:border-blue-300';
            let bgColor = 'bg-white';
            let textColor = 'text-gray-700';

            if (isSelected && !showResult) {
              borderColor = 'border-blue-500 ring-2 ring-blue-100';
              bgColor = 'bg-blue-50';
              textColor = 'text-blue-700';
            } else if (isCorrectPick) {
              borderColor = 'border-emerald-500 ring-2 ring-emerald-100';
              bgColor = 'bg-emerald-50';
              textColor = 'text-emerald-700';
            } else if (isWrongPick) {
              borderColor = 'border-red-500 ring-2 ring-red-100';
              bgColor = 'bg-red-50';
              textColor = 'text-red-700';
            } else if (isMissed) {
              borderColor = 'border-amber-400 ring-2 ring-amber-100';
              bgColor = 'bg-amber-50';
              textColor = 'text-amber-700';
            }

            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggle(doc.id)}
                disabled={gameState !== 'playing'}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none ${borderColor} ${bgColor} ${textColor} ${
                  gameState !== 'playing' ? 'cursor-default' : 'active:scale-95'
                }`}
              >
                <span className="text-2xl">
                  {doc.id === 'aadhaar' && '🪪'}
                  {doc.id === 'pan' && '💳'}
                  {doc.id === 'passport' && '📕'}
                  {doc.id === 'driving' && '🚗'}
                  {doc.id === 'fake' && '❌'}
                  {doc.id === 'lottery' && '🎰'}
                </span>
                <span className="text-sm font-semibold text-center leading-tight">{doc.label}</span>

                {isSelected && !showResult && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </span>
                )}
                {isCorrectPick && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </span>
                )}
                {isWrongPick && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </span>
                )}
                {isMissed && (
                  <span className="absolute top-2 right-2 text-xs font-bold text-amber-600">missed</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result Banners */}
        {gameState === 'correct' && (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-emerald-800">✅ You are a Jagruk Nagrik!</p>
              <p className="text-sm text-emerald-600 mt-0.5">You correctly identified all valid photo IDs.</p>
            </div>
          </div>
        )}

        {gameState === 'wrong' && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <p className="text-base font-bold text-red-800">❌ Incorrect selection</p>
                <p className="text-sm text-red-600 mt-0.5">Review the highlighted cards above, then try again.</p>
              </div>
            </div>

            {!showHint && (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 active:scale-95 transition-all duration-200"
              >
                <Lightbulb className="w-4 h-4" />
                Show Hint
              </button>
            )}

            {showHint && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  You don&apos;t need a voter ID card if your name is in the voter list. Carry any valid photo ID — Aadhaar, PAN, Passport, or Driving License are all accepted by the Election Commission.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {gameState === 'playing' && (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={selected.size === 0}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Check Answer
            </button>
          )}
          {gameState !== 'playing' && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
