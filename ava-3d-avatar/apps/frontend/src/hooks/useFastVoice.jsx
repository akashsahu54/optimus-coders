import { useState, useRef, useCallback } from "react";
import { useVoiceActivityDetection } from "./useVoiceActivityDetection";
import { useSession } from "./useSession";

const BACKEND_URL = "http://localhost:3000";

/**
 * Optimized voice-to-voice hook with session management
 * Fast response ke liye optimized with context awareness
 */
export const useFastVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const abortControllerRef = useRef(null);

  // Session management
  const {
    sessionId,
    conversationHistory,
    sessionStats,
    addMessageToHistory,
    clearConversation,
    refreshStats,
  } = useSession();

  // Voice Activity Detection
  const { startDetection, stopDetection } = useVoiceActivityDetection({
    onSpeechStart: () => {
      console.log("🎤 Speech detected - starting recording");
      startRecording();
    },
    onSpeechEnd: () => {
      console.log("🔇 Silence detected - stopping recording");
      stopRecording();
    },
  });

  /**
   * Start recording with optimized settings
   */
  const startRecording = useCallback(async () => {
    try {
      if (isListening) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100, // Optimized sample rate
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000, // Optimized bitrate
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Microphone access denied");
    }
  }, [isListening]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  /**
   * Process audio with fast endpoint
   */
  const processAudio = async (audioBlob) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Convert to base64
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Call fast endpoint with session
      const response = await fetch(`${BACKEND_URL}/fast-v2v`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          audio: base64Audio,
          sessionId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(data.messages || []);
      setProcessingTime(data.processingTime);
      
      // Update session stats
      if (data.sessionStats) {
        refreshStats();
      }
      
      const clientTime = Date.now() - startTime;
      console.log(`⚡ Client-side time: ${clientTime}ms`);
      console.log(`🚀 Server processing: ${data.processingTime}ms`);
      console.log(`📊 Session: ${data.sessionId}`);
      console.log(`💬 Messages in conversation: ${data.sessionStats?.conversationMessages || 0}`);

    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Processing error:", err);
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Toggle conversation mode with VAD
   */
  const toggleConversation = useCallback(() => {
    if (isListening) {
      stopDetection();
      stopRecording();
    } else {
      startDetection();
    }
  }, [isListening, startDetection, stopDetection, stopRecording]);

  /**
   * Manual recording control
   */
  const toggleRecording = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  return {
    isListening,
    isProcessing,
    messages,
    error,
    processingTime,
    sessionId,
    conversationHistory,
    sessionStats,
    startRecording,
    stopRecording,
    toggleRecording,
    toggleConversation,
    clearConversation,
  };
};
