import { useState, useEffect, useRef } from 'react';

// Simple hook for Vapi lip-sync - generates continuous animation when assistant is speaking
export const useVapiAudio = () => {
  const [vapiMessage, setVapiMessage] = useState(null);
  const animationFrameRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const currentAnimationRef = useRef('TalkingOne');
  const currentExpressionRef = useRef('default');
  const shapeIndexRef = useRef(0);

  useEffect(() => {
    if (!window.vapiGlobalInstance) {
      return;
    }

    const vapiInstance = window.vapiGlobalInstance;

    const handleMessage = (message) => {
      // When assistant starts speaking
      if (message.type === 'speech-update' && message.role === 'assistant' && message.status === 'started') {
        console.log('🎤 AVA started speaking - starting lip-sync');
        startLipsyncAnimation();
      }

      // When assistant stops speaking
      if (message.type === 'speech-update' && message.role === 'assistant' && message.status === 'stopped') {
        console.log('🎤 AVA stopped speaking - stopping lip-sync');
        stopLipsyncAnimation();
      }

      // Get transcript for animation selection
      if (message.type === 'transcript' && message.role === 'assistant') {
        if (message.transcriptType === 'partial' || message.transcriptType === 'final') {
          const text = message.transcript;
          currentTranscriptRef.current = text;
          
          // Select animation based on content
          let animation = 'TalkingOne';
          let facialExpression = 'default';
          
          if (text.includes('?')) {
            animation = 'ThoughtfulHeadShake';
          } else if (text.includes('!')) {
            animation = 'TalkingThree';
            facialExpression = 'smile';
          }

          currentAnimationRef.current = animation;
          currentExpressionRef.current = facialExpression;
        }
      }
    };

    // Handle call end - stop all animations
    const handleCallEnd = () => {
      console.log('📞 Call ended - stopping all lip-sync');
      stopLipsyncAnimation();
    };

    // Start continuous lip-sync animation
    const startLipsyncAnimation = () => {
      // Stop any existing animation first
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const shapes = ['A', 'E', 'I', 'O', 'U'];
      let frameCount = 0;

      const animate = () => {
        // Change mouth shape every 5 frames (approximately 80ms at 60fps)
        if (frameCount % 5 === 0) {
          shapeIndexRef.current = (shapeIndexRef.current + 1) % shapes.length;
        }

        const currentShape = shapes[shapeIndexRef.current];
        
        setVapiMessage({
          text: currentTranscriptRef.current,
          animation: currentAnimationRef.current,
          facialExpression: currentExpressionRef.current,
          lipsync: {
            mouthCues: [{
              start: 0,
              end: 0.1,
              value: currentShape
            }]
          },
          audio: null,
          isVapi: true,
          isSpeaking: true,
          audioVolume: 0.8
        });

        frameCount++;
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    // Stop lip-sync animation
    const stopLipsyncAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setVapiMessage(null);
      shapeIndexRef.current = 0;
      currentTranscriptRef.current = '';
    };

    vapiInstance.on('message', handleMessage);
    vapiInstance.on('call-end', handleCallEnd);

    return () => {
      if (vapiInstance) {
        vapiInstance.off('message', handleMessage);
        vapiInstance.off('call-end', handleCallEnd);
      }
      stopLipsyncAnimation();
    };
  }, []);

  return {
    vapiMessage,
    isVapiActive: !!window.vapiGlobalInstance
  };
};
