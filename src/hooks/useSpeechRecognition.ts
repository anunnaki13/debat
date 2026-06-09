"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  0: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error?: string;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useSpeechRecognition({
  onFinalTranscript,
  enabled = true,
}: {
  onFinalTranscript: (text: string) => void;
  enabled?: boolean;
}) {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    queueMicrotask(() => setIsSupported(Boolean(Recognition)));

    if (!Recognition || !enabled) {
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim.trim());

      if (finalText.trim()) {
        onFinalTranscript(finalText.trim());
      }
    };
    recognition.onerror = (event) => {
      setError(
        event.error
          ? `Mikrofon gagal: ${event.error}`
          : "Mikrofon gagal digunakan.",
      );
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [enabled, onFinalTranscript]);

  const startListening = useCallback(() => {
    if (!enabled || !recognitionRef.current) {
      setError("Pengenalan suara tidak tersedia di browser ini.");
      return;
    }

    try {
      setError("");
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setError("Mikrofon belum bisa dimulai.");
      setIsListening(false);
    }
  }, [enabled]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isSupported: isSupported && enabled,
    isListening,
    interimTranscript,
    error,
    startListening,
    stopListening,
  };
}
