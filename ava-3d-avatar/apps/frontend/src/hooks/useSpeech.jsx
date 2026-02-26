import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useVoiceActivityDetection } from "./useVoiceActivityDetection";

const backendUrl = "http://localhost:3000";

const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  const [conversationMode, setConversationMode] = useState(false); // Main toggle
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent overlapping requests
  
  const chunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const lastRequestTimeRef = useRef(0); // Debounce requests

  // Voice Activity Detection - only active when conversation mode is ON
  const { isSpeaking: vadIsSpeaking } = useVoiceActivityDetection({
    enabled: conversationMode,
    silenceDelay: 1500,
    volumeThreshold: -50,
    onSpeechStart: () => {
      console.log('🎤 VAD: User started speaking');
      
      // If avatar is speaking, interrupt it
      if (currentAudio) {
        console.log('⏸️ Interrupting avatar speech');
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setMessages([]); // Clear message queue
        setMessage(null);
      }
      
      // Start recording automatically
      if (!recording && !loading) {
        startRecording();
      }
    },
    onSpeechEnd: () => {
      console.log('⏹️ VAD: User stopped speaking');
      
      // Stop recording automatically after silence
      if (recording) {
        // Add small delay to ensure we captured everything
        recordingTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, 500);
      }
    }
  });

  const initiateRecording = () => {
    chunksRef.current = [];
  };

  const onDataAvailable = (e) => {
    chunksRef.current.push(e.data);
  };

  const sendAudioData = async (audioBlob) => {
    // Prevent overlapping requests
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 1000) {
      console.log("⚠️ Request too soon, debouncing...");
      return;
    }
    lastRequestTimeRef.current = now;
    
    if (isProcessing) {
      console.log("⚠️ Already processing a request, skipping...");
      return;
    }
    
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const base64Audio = reader.result.split(",")[1];
      setLoading(true);
      console.log("🎤 Sending audio to backend for speech-to-speech processing...");
      
      try {
        const startTime = Date.now();
        const data = await fetch(`${backendUrl}/sts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audio: base64Audio }),
        });
        
        if (!data.ok) {
          throw new Error(`Backend returned ${data.status}: ${data.statusText}`);
        }
        
        const response = (await data.json()).messages;
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`✅ Speech-to-speech completed in ${duration}s`);
        console.log(`📨 Received ${response.length} message(s) from AI`);
        
        setMessages((messages) => [...messages, ...response]);
      } catch (error) {
        console.error("❌ Speech-to-speech error:", error.message);
        alert(`Speech processing failed: ${error.message}\n\nPlease check:\n- Backend server is running\n- API keys are configured\n- Network connection is stable`);
      } finally {
        setLoading(false);
        setIsProcessing(false);
      }
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = initiateRecording;
          newMediaRecorder.ondataavailable = onDataAvailable;
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
            try {
              await sendAudioData(audioBlob);
            } catch (error) {
              console.error(error);
              alert(error.message);
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder && !recording) {
      console.log("🎙️ Starting voice recording...");
      
      // Clear any pending timeout
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
      
      mediaRecorder.start();
      setRecording(true);
    } else if (!mediaRecorder) {
      console.error("❌ MediaRecorder not initialized. Check microphone permissions.");
      alert("Microphone not available. Please allow microphone access and refresh the page.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      console.log("⏹️ Stopping voice recording...");
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const toggleConversationMode = () => {
    const newMode = !conversationMode;
    setConversationMode(newMode);
    console.log(`🗣️ Conversation Mode: ${newMode ? 'ENABLED' : 'DISABLED'}`);
    
    if (!newMode) {
      // When disabling, stop any ongoing recording
      if (recording) {
        stopRecording();
      }
      // Don't interrupt audio playback when disabling conversation mode
      // Just clear the message queue for future messages
      setMessages([]);
    }
  };

  const tts = async (message) => {
    // Prevent overlapping requests
    if (isProcessing || loading) {
      console.log("⚠️ Already processing, skipping request...");
      return;
    }
    
    setIsProcessing(true);
    setLoading(true);
    console.log(`💬 Sending text message: "${message}"`);
    
    try {
      const startTime = Date.now();
      const data = await fetch(`${backendUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      if (!data.ok) {
        throw new Error(`Backend returned ${data.status}: ${data.statusText}`);
      }
      
      const response = (await data.json()).messages;
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log(`✅ Text-to-speech completed in ${duration}s`);
      console.log(`📨 Received ${response.length} message(s) from AI`);
      
      setMessages((messages) => [...messages, ...response]);
    } catch (error) {
      console.error("❌ Text-to-speech error:", error.message);
      alert(`Message processing failed: ${error.message}\n\nPlease check:\n- Backend server is running\n- API keys are configured\n- Network connection is stable`);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const onMessagePlayed = () => {
    console.log("📤 Message played, advancing queue");
    setMessages((messages) => messages.slice(1));
    setCurrentAudio(null);
  };

  useEffect(() => {
    if (messages.length > 0) {
      // Only set message if there isn't one currently playing
      if (!message || message !== messages[0]) {
        console.log("📨 Setting next message from queue");
        setMessage(messages[0]);
      }
    } else {
      if (message) {
        console.log("📭 Queue empty, clearing message");
        setMessage(null);
      }
    }
  }, [messages]);

  return (
    <SpeechContext.Provider
      value={{
        startRecording,
        stopRecording,
        recording,
        tts,
        message,
        onMessagePlayed,
        loading,
        conversationMode,
        toggleConversationMode,
        vadIsSpeaking,
        currentAudio,
        setCurrentAudio
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};
