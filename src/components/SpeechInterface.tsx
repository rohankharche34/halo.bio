"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, MessageCircle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPersonalizedAdvice } from "@/lib/contextAgent";

export const SpeechInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    setTranscript("");
    setResponse(null);
    setError(null);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as any[]);
      const transcript = results.map((r: any) => r.transcript).join("");
      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        processSpeech(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processSpeech = async (text: string) => {
    setLoading(true);
    
    try {
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("advice") || lowerText.includes("recommend") || lowerText.includes("meal") || lowerText.includes("eat") || lowerText.includes("food")) {
        const advice = await getPersonalizedAdvice();
        setResponse(advice);
        speak(advice);
      } else if (lowerText.includes("score") || lowerText.includes("status") || lowerText.includes("how am i")) {
        setResponse("Your stability score is calculated from sleep quality, circadian rhythm, activity level, and meal consistency. Check your dashboard for detailed metrics.");
        speak("Your stability score is calculated from sleep quality, circadian rhythm, activity level, and meal consistency. Check your dashboard for detailed metrics.");
      } else if (lowerText.includes("sleep") || lowerText.includes("rest")) {
        setResponse("To improve sleep, aim for 7-9 hours, maintain consistent sleep times, avoid screens 2 hours before bed, and get morning bright light exposure.");
        speak("To improve sleep, aim for 7-9 hours, maintain consistent sleep times, avoid screens 2 hours before bed, and get morning bright light exposure.");
      } else if (lowerText.includes("light") || lowerText.includes("sun") || lowerText.includes("vitamin d")) {
        setResponse("Get at least 15 minutes of bright light exposure, preferably in the morning. This helps regulate your circadian rhythm and improves sleep quality.");
        speak("Get at least 15 minutes of bright light exposure, preferably in the morning. This helps regulate your circadian rhythm and improves sleep quality.");
      } else if (lowerText.includes("workout") || lowerText.includes("exercise") || lowerText.includes("activity")) {
        setResponse("For optimal energy, exercise in the morning or early afternoon. Avoid intense workouts within 3 hours of bedtime.");
        speak("For optimal energy, exercise in the morning or early afternoon. Avoid intense workouts within 3 hours of bedtime.");
      } else if (lowerText.includes("hello") || lowerText.includes("hey")) {
        setResponse("Hello! I'm Aura, your circadian assistant. Ask me about meals, sleep, exercise, or your current status.");
        speak("Hello! I'm Aura, your circadian assistant. Ask me about meals, sleep, exercise, or your current status.");
      } else {
        const advice = await getPersonalizedAdvice();
        setResponse(advice);
        speak(advice);
      }
    } catch (err) {
      console.error("Speech processing error:", err);
      setError("Failed to process speech");
    }
    
    setLoading(false);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-br from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)] shadow-lg shadow-[color:var(--color-halo-blue)]/30"
      >
        <MessageCircle size={24} className="text-black" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-80 bg-zinc-950 border border-white/10 rounded-3xl p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)] flex items-center justify-center">
                  <MessageCircle size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Talk to Aura</p>
                  <p className="text-xs text-zinc-500">Voice assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X size={16} className="text-zinc-400" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-400 text-xs">
                {error}
              </div>
            )}

            {transcript && !response && (
              <div className="mb-3 p-3 rounded-lg bg-black/40">
                <p className="text-sm text-white">{transcript}</p>
              </div>
            )}

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 rounded-lg bg-[color:var(--color-halo-blue)]/10 border border-[color:var(--color-halo-blue)]/20"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-white">{response}</p>
                  <button
                    onClick={() => speak(response)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <Volume2 size={14} className="text-[color:var(--color-halo-blue)]" />
                  </button>
                </div>
              </motion.div>
            )}

            {loading && (
              <div className="mb-3 flex items-center space-x-2 text-zinc-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}

            <button
              onClick={toggleListening}
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl transition-colors ${
                isListening
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-[color:var(--color-halo-blue)] text-black"
              }`}
            >
              {isListening ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span>Listening... Tap to stop</span>
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span>Tap to speak</span>
                </>
              )}
            </button>

            <p className="text-xs text-zinc-600 mt-3 text-center">
              Try: "What should I eat?" or "How's my sleep?"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}