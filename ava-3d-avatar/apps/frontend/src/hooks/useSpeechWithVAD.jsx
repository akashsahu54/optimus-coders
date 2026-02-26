import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useVoiceActivityDetection } from "./useVoiceActivityDetection";

const backendUrl = "http://localhost:3000";

const SpeechContext = createContext();

export const SpeechProviderWithVAD = ({ children }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [vadEnabled, setVadEnabled] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  const chunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);

  // Voice Activity Detection
  const { isSpeaking: vadIsSpeaking } = useVoiceActivityDetection({
    enabled: vadEnabled,
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
      }
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
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

  const toggleVAD = () => {
    setVadEnabled(!vadEnabled);
    console.log(`🎤 Voice Activity Detection: ${!vadEnabled ? 'ENABLED' : 'DISABLED'}`);
  };

  const tts = async (message) => {
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
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
    setCurrentAudio(null);
  };

  const interruptAvatar = () => {
    console.log('⏸️ Manually interrupting avatar');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setMessages([]);
    setMessage(null);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
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
        vadEnabled,
        toggleVAD,
        vadIsSpeaking,
        currentAudio,
        setCurrentAudio,
        interruptAvatar
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeechWithVAD = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeechWithVAD must be used within a SpeechProviderWithVAD");
  }
  return context;
};
