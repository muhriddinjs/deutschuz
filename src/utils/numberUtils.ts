const ones = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
const tens = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];

export const numberToGerman = (num: number): string => {
  if (num < 0) return "minus " + numberToGerman(Math.abs(num));
  if (num < 20) return ones[num];
  
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (one === 0) return tens[ten];
    if (one === 1) return "einund" + tens[ten];
    return ones[one] + "und" + tens[ten];
  }
  
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    const hundredStr = hundred === 1 ? "einhundert" : ones[hundred] + "hundert";
    if (rest === 0) return hundredStr;
    return hundredStr + numberToGerman(rest);
  }
  
  if (num < 1000000) {
    // If it's a year between 1100 and 1999, it's often said as X-hundert (e.g. 1995 -> neunzehnhundertfünfundneunzig)
    // We will provide a strict number representation here and maybe a separate func for years.
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    const thousandStr = thousand === 1 ? "eintausend" : numberToGerman(thousand) + "tausend";
    if (rest === 0) return thousandStr;
    return thousandStr + numberToGerman(rest);
  }
  
  return num.toString();
};

export const yearToGerman = (year: number): string => {
  if (year >= 1100 && year <= 1999) {
    const hundreds = Math.floor(year / 100);
    const rest = year % 100;
    const hundredStr = numberToGerman(hundreds) + "hundert";
    if (rest === 0) return hundredStr;
    return hundredStr + numberToGerman(rest);
  }
  return numberToGerman(year);
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
