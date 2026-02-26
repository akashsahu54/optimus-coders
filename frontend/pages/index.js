import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [urgencyLevel, setUrgencyLevel] = useState(0);
  const recognitionRef = useRef(null);

  // Emotion detection logic
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    
    const angryKeywords = ['frustrated', 'angry', 'problem', 'nahi ho raha', 'din se', 'refund', 'complaint'];
    const happyKeywords = ['thank you', 'great', 'good', 'excellent', 'dhanyavaad', 'achha'];
    const urgentKeywords = ['urgent', 'immediately', 'abhi', 'turant', 'emergency', 'help'];
    
    let detectedEmotion = 'neutral';
    let isUrgent = false;
    
    if (angryKeywords.some(keyword => lowerText.includes(keyword))) {
      detectedEmotion = 'angry';
    } else if (happyKeywords.some(keyword => lowerText.includes(keyword))) {
      detectedEmotion = 'happy';
    } else if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
      detectedEmotion = 'concerned';
      isUrgent = true;
    }
    
    return { emotion: detectedEmotion, isUrgent };
  };

  // Generate AI response
  const generateResponse = (userText, emotion) => {
    const responses = {
      angry: [
        "Main samajh sakta hoon aap frustrated hain. Main aapki madad karne ke liye yahan hoon.",
        "Mujhe afsos hai aapko problem ho rahi hai. Main ise turant resolve karunga.",
        "Aapki pareshani samajh raha hoon. Kripya mujhe details batayein."
      ],
      happy: [
        "Bahut achha! Main khush hoon ki aap satisfied hain.",
        "Dhanyavaad! Kya main aur kuch help kar sakta hoon?",
        "Great! Aapka feedback humein motivate karta hai."
      ],
      concerned: [
        "Main aapki urgency samajh raha hoon. Turant action le raha hoon.",
        "Ye urgent matter hai. Main ise priority pe handle karunga.",
        "Aapki help ke liye main yahan hoon. Batayein kya problem hai."
      ],
      neutral: [
        "Ji, main sun raha hoon. Aap apni baat continue karein.",
        "Kripya mujhe aur details batayein.",
        "Main aapki madad ke liye ready hoon."
      ]
    };
    
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
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition
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
        setTranscript(userText);
        
        // Detect emotion
        const { emotion: detectedEmotion, isUrgent } = detectEmotion(userText);
        setEmotion(detectedEmotion);
        
        // Update urgency level
        if (detectedEmotion === 'angry' || isUrgent) {
          setUrgencyLevel(prev => prev + 1);
        }
        
        // Add user message
        const newConversation = [...conversation, { type: 'user', text: userText, emotion: detectedEmotion }];
        setConversation(newConversation);
        
        // Generate and speak response
        setTimeout(() => {
          const response = generateResponse(userText, detectedEmotion);
          setConversation([...newConversation, { type: 'bot', text: response }]);
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
      alert('Speech recognition not supported in this browser. Please use Chrome.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Get avatar emoji based on emotion
  const getAvatarEmoji = () => {
    switch(emotion) {
      case 'happy': return '😊';
      case 'angry': return '😟';
      case 'concerned': return '🤔';
      default: return '🙂';
    }
  };

  // Get emotion color
  const getEmotionColor = () => {
    switch(emotion) {
      case 'happy': return '#51cf66';
      case 'angry': return '#ff6b6b';
      case 'concerned': return '#ffa500';
      default: return '#4dabf7';
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AVA - AI Voice Avatar Assistant</h1>
        <p>Replacing Traditional IVR with Emotional AI</p>
      </header>

      <main>
        {/* Avatar Section */}
        <div className="avatar-container">
          <div className={`avatar emotion-${emotion} ${isSpeaking ? 'speaking' : ''}`}>
            <div className="avatar-face">
              <span className="avatar-emoji">{getAvatarEmoji()}</span>
            </div>
            {isSpeaking && (
              <div className="sound-waves">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
          <div className="emotion-badge" style={{ background: getEmotionColor() }}>
            {emotion.toUpperCase()}
          </div>
          {urgencyLevel >= 2 && (
            <div className="urgency-alert">
              🚨 HIGH URGENCY - Escalating to supervisor
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls">
          <button 
            className={`speak-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
          >
            {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : '🎤 Speak'}
          </button>
          {transcript && (
            <div className="transcript">
              <strong>You said:</strong> {transcript}
            </div>
          )}
        </div>

        {/* Conversation History */}
        <div className="conversation">
          <h3>💬 Conversation History</h3>
          <div className="messages">
            {conversation.length === 0 ? (
              <p className="empty">Click "Speak" button and start talking...</p>
            ) : (
              conversation.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  <div className="message-header">
                    <strong>{msg.type === 'user' ? '👤 You' : '🤖 AVA'}</strong>
                    {msg.emotion && <span className="emotion-tag">{msg.emotion}</span>}
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Messages</span>
            <span className="stat-value">{conversation.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Emotion</span>
            <span className="stat-value">{emotion}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Urgency Level</span>
            <span className="stat-value">{urgencyLevel}</span>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        header {
          text-align: center;
          margin-bottom: 3rem;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        main {
          max-width: 900px;
          margin: 0 auto;
        }
        .avatar-container {
          text-align: center;
          margin-bottom: 2rem;
        }
        .avatar {
          width: 220px;
          height: 220px;
          margin: 0 auto 1rem;
          background: rgba(255,255,255,0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 50px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
          position: relative;
        }
        .avatar.speaking {
          animation: avatarPulse 1s infinite;
        }
        @keyframes avatarPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .avatar-emoji {
          font-size: 7rem;
          transition: all 0.3s ease;
        }
        .avatar.emotion-angry .avatar-emoji {
          animation: shake 0.5s;
        }
        .avatar.emotion-happy .avatar-emoji {
          animation: bounce 0.6s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .sound-waves {
          position: absolute;
          bottom: 10px;
          display: flex;
          gap: 5px;
        }
        .sound-waves span {
          width: 4px;
          height: 20px;
          background: #4dabf7;
          border-radius: 2px;
          animation: wave 0.8s infinite ease-in-out;
        }
        .sound-waves span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .sound-waves span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }
        .emotion-badge {
          display: inline-block;
          padding: 0.6rem 1.8rem;
          border-radius: 25px;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s;
        }
        .urgency-alert {
          margin-top: 1rem;
          padding: 1rem;
          background: #ff6b6b;
          border-radius: 10px;
          font-weight: bold;
          animation: alertBlink 1s infinite;
        }
        @keyframes alertBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .controls {
          text-align: center;
          margin: 2rem 0;
        }
        .speak-btn {
          padding: 1.2rem 3.5rem;
          font-size: 1.3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          font-weight: bold;
        }
        .speak-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.4);
        }
        .speak-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .speak-btn.listening {
          background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .transcript {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .conversation {
          background: rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          margin-bottom: 2rem;
        }
        .conversation h3 {
          margin-bottom: 1rem;
        }
        .messages {
          max-height: 400px;
          overflow-y: auto;
        }
        .message {
          padding: 1rem;
          margin: 0.8rem 0;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(5px);
          transition: all 0.3s;
        }
        .message:hover {
          background: rgba(255,255,255,0.2);
          transform: translateX(5px);
        }
        .message.user {
          border-left: 4px solid #4dabf7;
        }
        .message.bot {
          border-left: 4px solid #51cf66;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .emotion-tag {
          font-size: 0.8rem;
          padding: 0.2rem 0.6rem;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .message p {
          margin: 0;
          line-height: 1.5;
        }
        .empty {
          text-align: center;
          opacity: 0.7;
          padding: 2rem;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .stat-item {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 15px;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .stat-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          display: block;
          font-size: 1.8rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
