export const playGermanTTS = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Web Speech API is not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.9; // Slightly slower for learning purposes

  // Ensure voices are loaded before speaking, if not already
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(voice => voice.lang.startsWith('de'));
  
  if (germanVoice) {
    utterance.voice = germanVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};
