import { useEffect, useRef, useState } from "react";
import { useVapi } from "../hooks/useVapi";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * Avatar component integrated with Vapi
 * Handles lip-sync and animations based on Vapi conversation state
 */
export function VapiAvatar(props) {
  const { currentMessage, isSpeaking, onMessagePlayed } = useVapi();
  const { nodes, materials, scene } = useGLTF("/models/avatar.glb");
  const { animations } = useGLTF("/models/animations.glb");
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Idle");
  const [facialExpression, setFacialExpression] = useState("default");
  const [lipsync, setLipsync] = useState(null);
  const audioRef = useRef(null);

  // Handle Vapi speaking state
  useEffect(() => {
    if (isSpeaking) {
      setAnimation("Talking");
    } else {
      setAnimation("Idle");
    }
  }, [isSpeaking]);

  // Handle current message from Vapi
  useEffect(() => {
    if (currentMessage) {
      setFacialExpression(currentMessage.facialExpression || "default");
      setAnimation(currentMessage.animation || "Talking");
      
      // If message has audio URL (from Vapi), play it
      if (currentMessage.audioUrl) {
        playAudio(currentMessage.audioUrl);
      }
      
      // Generate lip-sync from transcript
      if (currentMessage.text) {
        generateLipsyncFromText(currentMessage.text);
      }
    }
  }, [currentMessage]);

  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      onMessagePlayed();
      setAnimation("Idle");
    };

    audio.play();
  };

  // Simple lip-sync generation from text
  // In production, you'd want to use phoneme data from Vapi
  const generateLipsyncFromText = (text) => {
    // Basic lip-sync: map words to mouth shapes
    const words = text.split(" ");
    const mouthCues = words.map((word, index) => ({
      start: index * 0.3, // Approximate timing
      end: (index + 1) * 0.3,
      value: getMouthShape(word)
    }));
    
    setLipsync({ mouthCues });
  };

  const getMouthShape = (word) => {
    // Simple mouth shape detection
    const vowels = /[aeiou]/i;
    if (vowels.test(word)) {
      return "A"; // Open mouth for vowels
    }
    return "X"; // Closed for consonants
  };

  // Animation playback
  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
      return () => actions[animation]?.fadeOut(0.5);
    }
  }, [animation, actions]);

  // Lip-sync animation
  useFrame((state) => {
    if (!lipsync || !audioRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const currentCue = lipsync.mouthCues.find(
      (cue) => currentTime >= cue.start && currentTime <= cue.end
    );

    if (currentCue && nodes.Wolf3D_Head) {
      const morphTargetIndex = nodes.Wolf3D_Head.morphTargetDictionary[
        `mouthOpen`
      ];
      if (morphTargetIndex !== undefined) {
        nodes.Wolf3D_Head.morphTargetInfluences[morphTargetIndex] =
          currentCue.value === "A" ? 0.8 : 0.1;
      }
    }
  });

  // Facial expressions
  useEffect(() => {
    if (!nodes.Wolf3D_Head) return;

    const morphTargets = nodes.Wolf3D_Head.morphTargetDictionary;
    const influences = nodes.Wolf3D_Head.morphTargetInfluences;

    // Reset all expressions
    Object.keys(morphTargets).forEach((key) => {
      if (key.includes("smile") || key.includes("sad") || key.includes("angry")) {
        influences[morphTargets[key]] = 0;
      }
    });

    // Apply current expression
    switch (facialExpression) {
      case "smile":
        if (morphTargets.mouthSmile) {
          influences[morphTargets.mouthSmile] = 0.8;
        }
        break;
      case "sad":
        if (morphTargets.mouthFrown) {
          influences[morphTargets.mouthFrown] = 0.8;
        }
        break;
      case "angry":
        if (morphTargets.browDownLeft && morphTargets.browDownRight) {
          influences[morphTargets.browDownLeft] = 0.8;
          influences[morphTargets.browDownRight] = 0.8;
        }
        break;
    }
  }, [facialExpression, nodes]);

  return (
    <group {...props} ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
useGLTF.preload("/models/animations.glb");
