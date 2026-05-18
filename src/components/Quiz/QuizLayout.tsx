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
    if (inputRef.current) inputRef.current.focus();
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onExit} className="flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Menu
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-10 overflow-hidden">
        <div className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 mb-8 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => playGermanTTS(expectedText)}
              className="p-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 hover:text-blue-600 transition-all shadow-sm"
              title="Listen to German pronunciation"
            >
              <Volume2 size={32} />
            </button>
          </div>

          <h2 className="text-5xl sm:text-6xl font-black text-slate-900 mb-12 tracking-tight text-center">
            {question.display}
          </h2>

          <div className="w-full max-w-lg relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === 'correct'}
              placeholder="Type your answer in German..."
              className={`w-full text-xl sm:text-2xl p-6 rounded-2xl border-2 outline-none transition-all ${
                status === 'idle' ? 'border-slate-300 focus:border-blue-500 shadow-sm' :
                status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                'border-red-500 bg-red-50 text-red-800'
              }`}
            />
            {status === 'correct' && <Check className="absolute right-6 top-6 text-emerald-500" size={32} />}
            {status === 'incorrect' && <X className="absolute right-6 top-6 text-red-500" size={32} />}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full">
          {status === 'incorrect' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl shadow-sm">
              <p className="font-bold text-lg mb-2 flex items-center gap-2">
                <X size={24} /> Incorrect
              </p>
              <p className="text-md mb-2">The correct answer is: <strong className="font-bold text-lg">{expectedText}</strong></p>
              {feedback && (
                <div className="mt-4 p-4 bg-red-100 rounded-xl text-sm border border-red-200">
                  <span className="font-semibold block mb-1">Grammar Tip:</span>
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
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-2"
            >
              Check Answer
            </button>
          ) : (
            <button 
              onClick={onNext}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
