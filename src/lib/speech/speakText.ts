export interface SpeakTextOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function speakText(text: string, options: SpeakTextOptions = {}): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onError?.();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 1;
  utterance.onstart = options.onStart ?? null;
  utterance.onend = options.onEnd ?? null;
  utterance.onerror = options.onError ?? null;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
