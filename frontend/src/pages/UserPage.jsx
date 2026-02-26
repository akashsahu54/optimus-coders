import { useState, useRef } from 'react';
import Avatar from '../components/Avatar';
import EmotionBadge from '../components/EmotionBadge';
import VoiceButton from '../components/VoiceButton';
import ChatWindow from '../components/ChatWindow';
import { emotionKeywords, responses } from '../data/dummyData';

function UserPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [urgencyCount, setUrgencyCount] = useState(0);
  const recognitionRef = useRef(null);

  // Detect emotion from text
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [emotionType, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotionType;
      }
    }
    return 'neutral';
  };

  // Generate AI response
  const generateResponse = (emotion) => {
    const emotionResponses = responses[emotion] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  // Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start listening
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        
        // Detect emotion
        const detectedEmotion = detectEmotion(userText);
        setEmotion(detectedEmotion);
        
        // Track urgency
        if (detectedEmotion === 'angry' || detectedEmotion === 'concerned') {
          setUrgencyCount(prev => prev + 1);
        }
        
        // Add user message
        const newMessages = [...messages, { 
          sender: 'user', 
          text: userText, 
          emotion: detectedEmotion 
        }];
        setMessages(newMessages);
        
        // Generate and speak response
        setTimeout(() => {
          const response = generateResponse(detectedEmotion);
          setMessages([...newMessages, { sender: 'bot', text: response }]);
          speak(response);
        }, 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported. Please use Chrome browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 mt-4">AI Voice Avatar Assistant</h1>
      
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <Avatar emotion={emotion} isSpeaking={isSpeaking} />
          <EmotionBadge emotion={emotion} />
          
          {urgencyCount >= 2 && (
            <div className="mt-4 px-6 py-3 bg-red-500/20 border-2 border-red-500 rounded-2xl animate-pulse">
              <p className="text-red-400 font-bold">🚨 HIGH URGENCY - Escalating to supervisor</p>
            </div>
          )}
        </div>

        {/* Voice Button */}
        <div className="mt-8 flex justify-center">
          <VoiceButton 
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClick={startListening}
          />
        </div>

        {/* Chat Window */}
        <div className="mt-8">
          <ChatWindow messages={messages} />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">Messages</p>
            <p className="text-2xl font-bold text-cyan-400">{messages.length}</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">Emotion</p>
            <p className="text-2xl font-bold text-cyan-400">{emotion}</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">Urgency</p>
            <p className="text-2xl font-bold text-cyan-400">{urgencyCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
