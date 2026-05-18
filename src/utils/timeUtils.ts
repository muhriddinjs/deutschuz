export const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return { hours, minutes };
};

export const padZero = (num: number) => num.toString().padStart(2, '0');

import { numberToGerman } from './numberUtils';

export const timeToFormell = (hours: number, minutes: number): string => {
  if (minutes === 0) return `${numberToGerman(hours)} Uhr`;
  // e.g. 14:30 -> vierzehn Uhr dreißig
  return `${numberToGerman(hours)} Uhr ${numberToGerman(minutes)}`;
};

export const timeToInformell = (hours: number, minutes: number): string => {
  let nextHour = (hours + 1) % 24;
  if (nextHour === 0) nextHour = 24;
  
  // informell uses 12-hour format mostly
  const current12 = hours % 12 === 0 ? 12 : hours % 12;
  const next12 = nextHour % 12 === 0 ? 12 : nextHour % 12;

  if (minutes === 0) return `${numberToGerman(current12)}`;
  if (minutes === 15) return `Viertel nach ${numberToGerman(current12)}`;
  if (minutes === 30) return `halb ${numberToGerman(next12)}`;
  if (minutes === 45) return `Viertel vor ${numberToGerman(next12)}`;

  if (minutes < 30) {
    return `${numberToGerman(minutes)} nach ${numberToGerman(current12)}`;
  } else {
    return `${numberToGerman(60 - minutes)} vor ${numberToGerman(next12)}`;
  }
};

export const checkInformellFeedback = (userInput: string, hours: number, minutes: number): string | null => {
  // Simple heuristic: if they used the current hour when they should have used next hour (like for halb)
  if (minutes > 20) {
    const current12 = hours % 12 === 0 ? 12 : hours % 12;
    const currentHourStr = numberToGerman(current12);
    if (userInput.toLowerCase().includes(currentHourStr)) {
      return "Remember: in German informal time, for minutes past 20 (like 'halb' or 'vor'), we usually count towards the NEXT hour.";
    }
  }
  return null;
};
