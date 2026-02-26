import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Voice Activity Detection (VAD) Hook
 * Automatically detects when user starts/stops speaking
 */
export const useVoiceActivityDetection = ({ 
  onSpeechStart, 
  onSpeechEnd,
  enabled = true,
  silenceDelay = 1500, // ms of silence before considering speech ended
  volumeThreshold = -50 // dB threshold for voice detection
}) => {
  const [isDetectingSpeech, setIsDetectingSpeech] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize audio context and analyser
  const initializeVAD = useCallback(async () => {
    if (!enabled) return;

    try {
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      micStreamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      console.log('✅ Voice Activity Detection initialized');
      setIsDetectingSpeech(true);

      // Start monitoring
      monitorAudioLevel();
    } catch (error) {
      console.error('❌ Failed to initialize VAD:', error);
    }
  }, [enabled]);

  // Monitor audio level for voice activity
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Convert to decibels
      const db = 20 * Math.log10(average / 255);

      // Check if speaking
      const isSpeakingNow = db > volumeThreshold;

      if (isSpeakingNow && !isSpeaking) {
        // User started speaking
        console.log('🎤 Voice detected - User started speaking');
        setIsSpeaking(true);
        
        // Clear any existing silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        
        if (onSpeechStart) {
          onSpeechStart();
        }
      } else if (!isSpeakingNow && isSpeaking) {
        // Potential silence - start timer
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            // User stopped speaking
            console.log('⏹️ Silence detected - User stopped speaking');
            setIsSpeaking(false);
            silenceTimerRef.current = null;
            
            if (onSpeechEnd) {
              onSpeechEnd();
            }
          }, silenceDelay);
        }
      } else if (isSpeakingNow && isSpeaking) {
        // Still speaking - clear silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }

      // Continue monitoring
      animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  };

  // Cleanup
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up VAD...');
    
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clear silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsDetectingSpeech(false);
    setIsSpeaking(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      initializeVAD();
    }

    return cleanup;
  }, [enabled, initializeVAD, cleanup]);

  return {
    isDetectingSpeech,
    isSpeaking,
    cleanup
  };
};
