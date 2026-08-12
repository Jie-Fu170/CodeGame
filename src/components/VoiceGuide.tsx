import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { LEVELS } from '../config/levels';

export const VoiceGuide: React.FC = () => {
  const { currentLevelId, voiceEnabled, toggleVoice } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!voiceEnabled || !synthRef.current) {
      if (synthRef.current) synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    const currentLevel = LEVELS.find(l => l.id === currentLevelId);
    if (currentLevel) {
      // Small delay to ensure previous speech is fully cancelled
      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.cancel();
          const textToSpeak = `欢迎来到${currentLevel.category}关卡：${currentLevel.title}。${currentLevel.description}`;
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = 'zh-CN';
          utterance.rate = 1.1; // Slightly faster for better pacing
          
          utterance.onstart = () => setIsPlaying(true);
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          
          synthRef.current.speak(utterance);
        }
      }, 100);
    }
  }, [currentLevelId, voiceEnabled]);

  return (
    <button
      onClick={toggleVoice}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg border transition-all ${
        voiceEnabled 
          ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
      }`}
      title={voiceEnabled ? "关闭语音讲解" : "开启语音讲解"}
    >
      {voiceEnabled ? (
        <div className="relative">
          <Volume2 size={24} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
            </span>
          )}
        </div>
      ) : (
        <VolumeX size={24} />
      )}
    </button>
  );
};
