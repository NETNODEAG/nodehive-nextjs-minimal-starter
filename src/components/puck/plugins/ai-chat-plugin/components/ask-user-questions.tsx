'use client';

import { useMemo, useState } from 'react';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Option = { label: string; value: string; recommended?: boolean };

export type AskUserQuestion = {
  title?: string;
  question: string;
  options: Option[];
};

type QuestionState = {
  selectedValue: string | null; // selected option value, or '__free__' for free-text
  freeText: string;
};

export type AskUserAnswers = {
  question: string;
  /** Human-readable text the user saw (radio label or free-text typed). */
  label: string;
  /** Structured value for the AI to act on (option value or free-text). */
  value: string;
}[];

type Props = {
  questions: AskUserQuestion[];
  disabled?: boolean;
  onSubmit: (answers: AskUserAnswers) => void;
};

const FREE_VALUE = '__free__';

function isAnswered(state: QuestionState): boolean {
  if (state.selectedValue === null) return false;
  if (state.selectedValue === FREE_VALUE) return state.freeText.trim() !== '';
  return true;
}

function resolveAnswer(
  question: AskUserQuestion,
  state: QuestionState
): { label: string; value: string } {
  if (state.selectedValue === FREE_VALUE) {
    const text = state.freeText.trim();
    return { label: text, value: text };
  }
  const option = question.options.find((o) => o.value === state.selectedValue);
  return { label: option?.label ?? '', value: option?.value ?? '' };
}

export function AskUserQuestionsTool({ questions, disabled, onSubmit }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [states, setStates] = useState<QuestionState[]>(() =>
    questions.map(() => ({ selectedValue: null, freeText: '' }))
  );

  const allAnswered = states.every(isAnswered);
  const current = questions[activeTab];
  const currentState = states[activeTab];
  const currentAnswered = isAnswered(currentState);

  const updateState = (partial: Partial<QuestionState>) => {
    setStates((prev) =>
      prev.map((s, i) => (i === activeTab ? { ...s, ...partial } : s))
    );
  };

  const findNextUnanswered = (from: number): number => {
    const n = questions.length;
    for (let step = 1; step <= n; step++) {
      const idx = (from + step) % n;
      if (!isAnswered(states[idx])) return idx;
    }
    return -1;
  };

  const handleSubmit = () => {
    if (!allAnswered || disabled) return;
    const answers = questions.map((q, i) => ({
      question: q.question,
      ...resolveAnswer(q, states[i]),
    }));
    onSubmit(answers);
  };

  const handlePrimary = () => {
    if (!currentAnswered || disabled) return;
    if (allAnswered) {
      handleSubmit();
      return;
    }
    const next = findNextUnanswered(activeTab);
    if (next !== -1) setActiveTab(next);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      {/* Tabs (if more than one question) */}
      {questions.length > 1 && (
        <div className="mb-3 flex items-center gap-1 overflow-x-auto">
          {questions.map((q, idx) => {
            const answered = isAnswered(states[idx]);
            const isActive = idx === activeTab;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  'flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {answered && (
                  <CheckIcon
                    className={cn(
                      'h-3 w-3',
                      isActive ? 'text-white' : 'text-green-600'
                    )}
                  />
                )}
                <span>{q.title?.trim() || `Q${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Current question */}
      <p className="mb-3 text-sm font-medium text-gray-900">
        {current.question}
      </p>

      <div className="space-y-1.5">
        {current.options.map((option) => {
          const isSelected = currentState.selectedValue === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors',
                isSelected
                  ? 'border-gray-900 bg-gray-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <input
                type="radio"
                name={`q-${activeTab}`}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => updateState({ selectedValue: option.value })}
                className="h-3.5 w-3.5 accent-gray-900"
              />
              <span className="flex-1">{option.label}</span>
              {option.recommended && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                  recommended
                </span>
              )}
            </label>
          );
        })}

        <label
          className={cn(
            'flex cursor-pointer flex-col gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            currentState.selectedValue === FREE_VALUE
              ? 'border-gray-900 bg-gray-50 text-gray-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
            disabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="radio"
              name={`q-${activeTab}`}
              value={FREE_VALUE}
              checked={currentState.selectedValue === FREE_VALUE}
              disabled={disabled}
              onChange={() => updateState({ selectedValue: FREE_VALUE })}
              className="h-3.5 w-3.5 accent-gray-900"
            />
            <span>Other</span>
          </div>
          {currentState.selectedValue === FREE_VALUE && (
            <input
              type="text"
              value={currentState.freeText}
              onChange={(e) => updateState({ freeText: e.target.value })}
              placeholder="Type your answer..."
              disabled={disabled}
              autoFocus
              className="ml-6 rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:border-gray-900 focus:outline-none disabled:bg-gray-50"
            />
          )}
        </label>
      </div>

      {/* Footer: primary action */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handlePrimary}
          disabled={disabled || !currentAnswered}
          className="cursor-pointer rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {allAnswered ? 'Submit answers' : 'Weiter'}
        </button>
      </div>
    </div>
  );
}
