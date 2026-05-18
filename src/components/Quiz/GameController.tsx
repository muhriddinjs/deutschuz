import React, { useState, useEffect, useCallback } from 'react';
import { QuizLayout } from './QuizLayout';
import type { Question } from './types';
import { generateRandomTime, timeToFormell, timeToInformell, padZero } from '../../utils/timeUtils';
import { generateRandomNumber, numberToGerman } from '../../utils/numberUtils';
import { generateRandomPhone, phoneToGermanSingleDigits, phoneToGermanPairs } from '../../utils/phoneUtils';
import { generateRandomPrice, priceToGerman } from '../../utils/priceUtils';
import { useStore } from '../../store/useStore';

interface GameControllerProps {
  moduleId: string;
  onExit: () => void;
}

export const GameController: React.FC<GameControllerProps> = ({ moduleId, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const { incrementStreak } = useStore();

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = [];
    const seenDisplays = new Set<string>();

    while (newQuestions.length < 10) {
      let display = '';
      let expectedAnswer: string | string[] = '';
      let feedbackType: Question['feedbackType'] = 'none';
      let meta: any = undefined;

      if (moduleId === 'time') {
        const { hours, minutes } = generateRandomTime();
        const mode = Math.random() > 0.5 ? 'formell' : 'informell';
        display = `${padZero(hours)}:${padZero(minutes)} (${mode})`;
        if (seenDisplays.has(display)) continue;
        
        expectedAnswer = mode === 'formell' ? timeToFormell(hours, minutes) : timeToInformell(hours, minutes);
        feedbackType = mode === 'informell' ? 'informell' : 'none';
        meta = { hours, minutes };
      } else if (moduleId === 'numbers') {
        // Balanced distribution: 33% single digit, 33% double digit, 34% triple digit
        const rand = Math.random();
        let num;
        if (rand < 0.33) {
          num = generateRandomNumber(1, 9);
        } else if (rand < 0.66) {
          num = generateRandomNumber(10, 99);
        } else {
          num = generateRandomNumber(100, 999);
        }
        
        display = num.toString();
        if (seenDisplays.has(display)) continue;
        
        expectedAnswer = numberToGerman(num);
        feedbackType = 'number';
      } else if (moduleId === 'phone') {
        const phone = generateRandomPhone();
        display = phone.formatted;
        if (seenDisplays.has(display)) continue;
        
        expectedAnswer = [phoneToGermanSingleDigits(phone.raw), phoneToGermanPairs(phone.raw)];
      } else if (moduleId === 'prices') {
        const price = generateRandomPrice();
        display = price.formatted;
        if (seenDisplays.has(display)) continue;
        
        expectedAnswer = priceToGerman(price.euros, price.cents);
      }

      seenDisplays.add(display);
      newQuestions.push({
        id: `${moduleId}-${newQuestions.length}`,
        display,
        expectedAnswer,
        feedbackType,
        meta
      });
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setIsFinished(false);
    setScore(0);
  }, [moduleId]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const handleNext = () => {
    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      incrementStreak();
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Session Complete!</h2>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
          <p className="text-6xl font-extrabold text-blue-600 mb-4">{score} / 10</p>
          <p className="text-lg text-slate-600">Great job! Keep practicing to improve your German.</p>
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={generateQuestions} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Play Again
          </button>
          <button onClick={onExit} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizLayout 
      question={questions[currentIndex]}
      currentIndex={currentIndex}
      totalQuestions={10}
      onNext={handleNext}
      onExit={onExit}
      onScoreUpdate={(isCorrect) => setScore(s => s + (isCorrect ? 1 : 0))}
    />
  );
};
