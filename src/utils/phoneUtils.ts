import { numberToGerman } from './numberUtils';

export const generateRandomPhone = () => {
  const prefixes = ["0176", "0151", "0172", "0160", "0157"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const part1 = Math.floor(Math.random() * 9000) + 1000;
  const part2 = Math.floor(Math.random() * 900) + 100;
  
  return {
    raw: `${prefix}${part1}${part2}`,
    formatted: `${prefix} ${part1} ${part2}`
  };
};

export const phoneToGermanSingleDigits = (phoneRaw: string): string => {
  return phoneRaw.split('').map(digit => numberToGerman(parseInt(digit))).join(' ');
};

export const phoneToGermanPairs = (phoneRaw: string): string => {
  let result = [];
  for (let i = 0; i < phoneRaw.length; i += 2) {
    if (i + 1 < phoneRaw.length) {
      result.push(numberToGerman(parseInt(phoneRaw.substring(i, i + 2))));
    } else {
      result.push(numberToGerman(parseInt(phoneRaw[i])));
    }
  }
  return result.join(' ');
};
