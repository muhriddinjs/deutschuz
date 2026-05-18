import { numberToGerman } from './numberUtils';

export const generateRandomPrice = () => {
  const euros = Math.floor(Math.random() * 200);
  const cents = Math.random() > 0.5 ? Math.floor(Math.random() * 99) + 1 : 0;
  
  return {
    euros,
    cents,
    formatted: `€${euros}.${cents.toString().padStart(2, '0')}`
  };
};

export const priceToGerman = (euros: number, cents: number): string => {
  if (euros === 0 && cents > 0) return `${numberToGerman(cents)} Cent`;
  if (cents === 0) return `${numberToGerman(euros)} Euro`;
  
  return `${numberToGerman(euros)} Euro ${numberToGerman(cents)}`;
};
