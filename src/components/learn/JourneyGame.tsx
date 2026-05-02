'use client';

import { useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ListOrdered, RotateCcw, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

interface VotingStep {
  id: string;
  label: string;
  correctPosition: number;
}

const CORRECT_ORDER: VotingStep[] = [
  { id: 'carry_id', label: 'Carry valid ID', correctPosition: 0 },
  { id: 'reach_booth', label: 'Reach polling booth', correctPosition: 1 },
  { id: 'stand_queue', label: 'Stand in queue', correctPosition: 2 },
  { id: 'verify_name', label: 'Verify name in voter list', correctPosition: 3 },
  { id: 'vote_evm', label: 'Vote using EVM', correctPosition: 4 },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getInitialOrder(): VotingStep[] {
  let shuffled = shuffle(CORRECT_ORDER);
  while (shuffled.every((s, i) => s.correctPosition === i)) {
    shuffled = shuffle(CORRECT_ORDER);
  }
  return shuffled;
}

type GameState = 'playing' | 'correct' | 'wrong';

export default function JourneyGame() {
  const [steps, setSteps] = useState<VotingStep[]>(getInitialOrder);
  const [gameState, setGameState] = useState<GameState>('playing');

  const moveUp = useCallback((index: number) => {
    if (index === 0 || gameState !== 'playing') return;
    setSteps(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, [gameState]);

  const moveDown = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    setSteps(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, [gameState]);

  const checkOrder = () => {
    const isCorrect = steps.every((step, idx) => step.correctPosition === idx);
    setGameState(isCorrect ? 'correct' : 'wrong');
  };

  const reset = () => {
    setSteps(getInitialOrder());
    setGameState('playing');
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Voting Journey Challenge</h2>
            <p className="text-sm text-gray-500">Arrange the voting steps in the correct order</p>
          </div>
        </div>
      </div>

      {/* Step List */}
      <div className="p-6">
        <div className="space-y-2">
          {steps.map((step, index) => {
            const showResult = gameState !== 'playing';
            const isRightPlace = step.correctPosition === index;

            let itemBg = 'bg-gray-50 border-gray-200';
            let numBg = 'bg-gray-200 text-gray-700';

            if (showResult && isRightPlace) {
              itemBg = 'bg-emerald-50 border-emerald-300';
              numBg = 'bg-emerald-500 text-white';
            } else if (showResult && !isRightPlace) {
              itemBg = 'bg-red-50 border-red-300';
              numBg = 'bg-red-500 text-white';
            }

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${itemBg}`}
              >
                {/* Position Number */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${numBg}`}>
                  {index + 1}
                </span>

                {/* Label */}
                <span className="flex-1 text-sm font-semibold text-gray-800">{step.label}</span>

                {/* Result Icon */}
                {showResult && (
                  isRightPlace
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}

                {/* Move Buttons */}
                {gameState === 'playing' && (
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      aria-label={`Move ${step.label} up`}
                      className="p-1 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === steps.length - 1}
                      aria-label={`Move ${step.label} down`}
                      className="p-1 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Result Banners */}
        {gameState === 'correct' && (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-emerald-800">✅ You are a Jagruk Nagrik!</p>
              <p className="text-sm text-emerald-600 mt-0.5">You know the correct voting process.</p>
            </div>
          </div>
        )}

        {gameState === 'wrong' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold text-red-800">❌ Not quite right</p>
                <p className="text-sm text-red-600 mt-1">The correct order is:</p>
                <ol className="mt-2 space-y-1">
                  {CORRECT_ORDER.map((step, idx) => (
                    <li key={step.id} className="text-sm text-red-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                      {step.label}
                    </li>
                  ))}
                </ol>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Always carry a valid photo ID first, arrive at your assigned booth, wait in the queue, get your name verified by the polling officer, and then cast your vote on the EVM.
                </p>
              </div>
            </div>

            <a
              href="https://www.youtube.com/results?search_query=how+to+vote+india+eci"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 active:scale-95 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Watch Official Guide
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {gameState === 'playing' && (
            <button
              type="button"
              onClick={checkOrder}
              className="px-6 py-3 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 active:scale-95 transition-all duration-200"
            >
              Check Order
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
