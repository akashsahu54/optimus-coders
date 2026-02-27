import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVapi } from '../hooks/useVapi';

export const ChatWindow = () => {
  const messagesEndRef = useRef(null);
  const { isCallActive, toggleCall } = useVapi();
  const [chatMessages, setChatMessages] = useState([]);
  const [isAVASpeaking, setIsAVASpeaking] = useState(false);
  const [currentUserTranscript, setCurrentUserTranscript] = useState('');
  const vapiInstanceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, currentUserTranscript]);

  // Get Vapi instance and listen to events
  useEffect(() => {
    const getVapiInstance = () => {
      if (window.vapiGlobalInstance) {
        return window.vapiGlobalInstance;
      }
      return null;
    };

    const vapiInstance = getVapiInstance();
    if (!vapiInstance) {
      console.log('Waiting for Vapi instance...');
      return;
    }

    vapiInstanceRef.current = vapiInstance;

    const handleMessage = (message) => {
      console.log('📨 Chat - Vapi message:', message.type, message.role);

      // User transcript
      if (message.type === 'transcript' && message.role === 'user') {
        if (message.transcriptType === 'partial') {
          setCurrentUserTranscript(message.transcript);
        } else if (message.transcriptType === 'final') {
          const userMsg = {
            role: 'user',
            text: message.transcript,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => [...prev, userMsg]);
          setCurrentUserTranscript('');
        }
      }

      // Assistant transcript
      if (message.type === 'transcript' && message.role === 'assistant') {
        if (message.transcriptType === 'final') {
          const avaMsg = {
            role: 'assistant',
            text: message.transcript,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'assistant' && lastMsg.text === message.transcript) {
              return prev;
            }
            return [...prev, avaMsg];
          });
        }
      }

      // Speech status
      if (message.type === 'speech-update' && message.role === 'assistant') {
        setIsAVASpeaking(message.status === 'started');
      }
    };

    vapiInstance.on('message', handleMessage);

    return () => {
      if (vapiInstance) {
        vapiInstance.off('message', handleMessage);
      }
    };
  }, [isCallActive]);

  const handleCallToggle = () => {
    if (!isCallActive) {
      setChatMessages([]);
      setCurrentUserTranscript('');
    }
    toggleCall();
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[45%] z-20 pointer-events-auto p-6">
      {/* Animated scan lines overlay */}
      <div className="absolute inset-6 pointer-events-none overflow-hidden opacity-10 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-scan" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col relative rounded-3xl overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 255, 200, 0.08), transparent 40%),
            linear-gradient(145deg, #0b0f1a, #111827)
          `,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 255, 200, 0.15)',
          boxShadow: '0 0 30px rgba(0, 255, 200, 0.08), -10px 0 40px rgba(0, 255, 200, 0.1)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 relative overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-400/5 to-cyan-500/5 animate-pulse-slow" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative group flex-shrink-0">
                {/* Outer glow ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Avatar */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 via-teal-400 to-cyan-600 flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg tracking-wider">AVA</span>
                </div>
                
                {/* Status indicator */}
                {isCallActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 shadow-lg shadow-green-400/50"
                  >
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-xl tracking-wide bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent leading-tight">
                  AVA Assistant
                </h3>
                <p className="text-cyan-400/80 text-xs font-mono flex items-center gap-2 mt-1.5">
                  {isCallActive ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      <span className="font-semibold">Active Now</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 bg-gray-500 rounded-full" />
                      <span>Offline</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Enhanced Call Button */}
            <motion.button
              onClick={handleCallToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 overflow-hidden group ${
                isCallActive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                  : 'text-black'
              }`}
              style={{
                background: isCallActive 
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : 'linear-gradient(90deg, #00f5d4, #00c2ff)',
                boxShadow: isCallActive 
                  ? '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)'
                  : '0 0 15px rgba(0, 255, 212, 0.6), 0 0 30px rgba(0, 255, 212, 0.3)'
              }}
            >
              {/* Animated glow effect */}
              <div className={`absolute inset-0 ${isCallActive ? 'bg-red-400' : 'bg-teal-300'} opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
              
              {isCallActive ? (
                <>
                  <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  <span className="relative z-10">End Call</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="relative z-10">Start Call</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide relative">
          {/* Subtle particle effect background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float" />
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-teal-400 rounded-full animate-float-delayed" />
            <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-float" />
          </div>

          {chatMessages.length === 0 && !isCallActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 via-teal-400/20 to-cyan-600/20 flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-400/30 blur-xl animate-pulse" />
                  <svg className="w-12 h-12 text-cyan-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </motion.div>
                <p className="text-cyan-400/70 text-base font-mono mb-2">
                  Neural Interface Ready
                </p>
                <p className="text-cyan-400/50 text-sm font-mono">
                  Click "Start Call" to begin
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white rounded-br-md'
                      : 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-teal-900/30 text-gray-100 border border-teal-500/40 rounded-bl-md backdrop-blur-sm'
                  }`}
                  style={{
                    boxShadow: msg.role === 'user'
                      ? '0 4px 20px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 20px rgba(0, 255, 200, 0.3), inset 0 1px 0 rgba(0, 255, 200, 0.1)'
                  }}
                >
                  {/* Message glow effect on hover */}
                  <div className={`absolute inset-0 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-400' : 'bg-teal-400'} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />
                  
                  <div className="text-base leading-relaxed break-words relative z-10 font-medium">{msg.text}</div>
                  <div className={`text-xs mt-2 flex items-center gap-1.5 ${msg.role === 'user' ? 'text-cyan-100/80' : 'text-teal-300/70'} relative z-10`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {msg.timestamp}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Live user transcript with enhanced styling */}
          {isCallActive && currentUserTranscript && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex justify-end"
            >
              <div className="max-w-[80%] rounded-2xl px-5 py-3.5 bg-gradient-to-br from-cyan-400/50 to-cyan-500/50 text-white rounded-br-md border-2 border-cyan-400/70 backdrop-blur-sm relative overflow-hidden">
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                
                <div className="text-base leading-relaxed break-words relative z-10 font-medium">{currentUserTranscript}</div>
                <div className="text-xs mt-2 text-cyan-100/90 flex items-center gap-2 relative z-10">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-cyan-200 rounded-full animate-sound-wave" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-3 bg-cyan-200 rounded-full animate-sound-wave" style={{ animationDelay: '100ms' }} />
                    <div className="w-1 h-3 bg-cyan-200 rounded-full animate-sound-wave" style={{ animationDelay: '200ms' }} />
                  </div>
                  Speaking...
                </div>
              </div>
            </motion.div>
          )}

          {/* AVA speaking indicator with enhanced animation */}
          {isCallActive && isAVASpeaking && !currentUserTranscript && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-gray-800/90 via-teal-900/30 to-gray-900/90 border border-teal-500/40 rounded-2xl rounded-bl-md px-5 py-3.5 backdrop-blur-sm relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 animate-pulse-slow" />
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex gap-1">
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50" 
                    />
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50" 
                    />
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50" 
                    />
                  </div>
                  <span className="text-teal-300 text-sm font-medium">AVA is speaking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Footer */}
        <div className="px-6 py-4 border-t border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 relative overflow-hidden">
          {/* Animated background line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-cyan-400/70 font-mono text-sm">
              {isCallActive ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                  />
                  <span className="font-semibold">Voice Active</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span>Ready to Chat</span>
                </>
              )}
            </div>
            <div className="text-cyan-400/70 font-mono text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {chatMessages.length} messages
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sound-wave {
          0%, 100% { height: 0.75rem; }
          50% { height: 1.25rem; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-sound-wave {
          animation: sound-wave 0.6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
