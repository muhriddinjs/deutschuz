import React, { useState, useEffect, useRef } from 'react';
import type { Question } from './types';
import { playGermanTTS } from '../../utils/ttsUtils';
import { Volume2, ArrowRight, Check, X, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { checkInformellFeedback } from '../../utils/timeUtils';

interface QuizLayoutProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onExit: () => void;
  onScoreUpdate: (isCorrect: boolean) => void;
}

export const QuizLayout: React.FC<QuizLayoutProps> = ({ 
  question, currentIndex, totalQuestions, onNext, onExit, onScoreUpdate 
}) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recordAnswer } = useStore();

  useEffect(() => {
    setInput('');
    setStatus('idle');
    setFeedback(null);
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [question]);

  const handleCheck = () => {
    if (!input.trim() || status !== 'idle') return;

    const normalizedInput = input.trim().toLowerCase();
    
    let isCorrect = false;
    if (Array.isArray(question.expectedAnswer)) {
      isCorrect = question.expectedAnswer.some(ans => ans.toLowerCase() === normalizedInput);
    } else {
      isCorrect = question.expectedAnswer.toLowerCase() === normalizedInput;
    }

    if (isCorrect) {
      setStatus('correct');
      onScoreUpdate(true);
      recordAnswer(true);
      
      // Auto play TTS on correct answer for reinforcement
      const textToSpeak = Array.isArray(question.expectedAnswer) ? question.expectedAnswer[0] : question.expectedAnswer;
      playGermanTTS(textToSpeak);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    } else {
      setStatus('incorrect');
      recordAnswer(false);
      
      // Generate intelligent feedback
      if (question.feedbackType === 'informell') {
        const fb = checkInformellFeedback(input, question.meta.hours, question.meta.minutes);
        if (fb) setFeedback(fb);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (status === 'idle') {
        handleCheck();
      } else if (status === 'incorrect') {
        onNext();
      }
    }
  };

  const progress = ((currentIndex) / totalQuestions) * 100;
  const expectedText = Array.isArray(question.expectedAnswer) ? question.expectedAnswer[0] : question.expectedAnswer;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={onExit} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium text-sm">
        <ArrowLeft size={18} className="mr-2" /> Back to Menu
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => playGermanTTS(expectedText)}
              className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 hover:text-blue-600 transition-all shadow-sm"
              title="Listen to German pronunciation"
            >
              <Volume2 size={24} />
            </button>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight text-center">
            {question.display}
          </h2>

          <div className="w-full max-w-md relative">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === 'correct'}
              placeholder="Type your answer in German..."
              className={`w-full text-lg sm:text-xl p-4 pr-12 rounded-xl border-2 outline-none caret-slate-800 transition-all ${
                status === 'idle' ? 'border-slate-300 focus:border-blue-500 shadow-sm' :
                status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                'border-red-500 bg-red-50 text-red-800'
              }`}
            />
            {status === 'correct' && <Check className="absolute right-4 top-4 text-emerald-500" size={24} />}
            {status === 'incorrect' && <X className="absolute right-4 top-4 text-red-500" size={24} />}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full">
          {status === 'incorrect' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm">
              <p className="font-bold text-base mb-1 flex items-center gap-2">
                <X size={20} /> Incorrect
              </p>
              <p className="text-sm mb-1">The correct answer is: <strong className="font-bold text-base">{expectedText}</strong></p>
              {feedback && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg text-xs border border-red-200">
                  <span className="font-semibold block mb-0.5">Grammar Tip:</span>
                  {feedback}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="w-full sm:w-auto">
          {status === 'idle' ? (
            <button 
              onClick={handleCheck}
              disabled={!input.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Check Answer
            </button>
          ) : (
            <button 
              onClick={onNext}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-base hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Next <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
