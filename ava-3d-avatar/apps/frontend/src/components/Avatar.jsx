import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useSpeech } from "../hooks/useSpeech";
import { useVapiAudio } from "../hooks/useVapiAudio";
import facialExpressions from "../constants/facialExpressions";
import visemesMapping from "../constants/visemesMapping";
import morphTargets from "../constants/morphTargets";

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/avatar.glb");
  const { animations } = useGLTF("/models/animations.glb");
  const { message, onMessagePlayed, setCurrentAudio } = useSpeech();
  const { vapiMessage, isVapiActive } = useVapiAudio();
  const [lipsync, setLipsync] = useState();
  const [setupMode, setSetupMode] = useState(false);
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const currentMessageIdRef = useRef(null);

  // Use Vapi message if active, otherwise use regular message
  const activeMessage = isVapiActive && vapiMessage ? vapiMessage : message;

  useEffect(() => {
    // Cleanup function to stop any playing audio on unmount
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        console.log("🧹 Component unmounting - cleaning up audio");
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeMessage) {
      setAnimation("Idle");
      if (audioRef.current && !audioRef.current.paused) {
        console.log("🛑 Stopping previous audio - no message");
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = null;
      isPlayingRef.current = false;
      currentMessageIdRef.current = null;
      setAudio(null);
      return;
    }
    
    // For Vapi messages, just set animation and lipsync
    if (activeMessage.isVapi) {
      console.log("🎤 Vapi message - setting animation:", activeMessage.animation);
      setAnimation(activeMessage.animation);
      setFacialExpression(activeMessage.facialExpression);
      setLipsync(activeMessage.lipsync);
      // Vapi handles audio playback, we just animate
      return;
    }
    
    // Regular message handling (existing code)
    const messageId = `${activeMessage.animation}_${activeMessage.audio?.substring(0, 50)}`;
    
    if (currentMessageIdRef.current === messageId) {
      console.log("⚠️ Already processing this message, skipping duplicate");
      return;
    }
    
    if (isPlayingRef.current && audioRef.current) {
      console.log("🛑 Stopping previous message to play new one");
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
    
    currentMessageIdRef.current = messageId;
    
    setAnimation(activeMessage.animation);
    setFacialExpression(activeMessage.facialExpression);
    setLipsync(activeMessage.lipsync);
    
    if (activeMessage.audio && activeMessage.audio.length > 0) {
      const audio = new Audio("data:audio/mp3;base64," + activeMessage.audio);
      audioRef.current = audio;
      isPlayingRef.current = true;
      
      audio.onended = () => {
        console.log("🔊 Audio playback ended");
        audioRef.current = null;
        isPlayingRef.current = false;
        currentMessageIdRef.current = null;
        setAudio(null);
        onMessagePlayed();
      };
      
      audio.onerror = (error) => {
        console.error("❌ Audio error:", error);
        audioRef.current = null;
        isPlayingRef.current = false;
        currentMessageIdRef.current = null;
        setAudio(null);
        setTimeout(onMessagePlayed, 1000);
      };
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🔊 Audio playback started successfully");
            setAudio(audio);
            
            if (setCurrentAudio) {
              setCurrentAudio(audio);
            }
          })
          .catch((error) => {
            console.warn("Audio playback failed:", error.message);
            isPlayingRef.current = false;
            currentMessageIdRef.current = null;
            if (error.name !== 'AbortError') {
              setTimeout(onMessagePlayed, 2000);
            }
          });
      }
    } else {
      console.warn("⚠️ No audio data available");
      currentMessageIdRef.current = null;
      setTimeout(onMessagePlayed, 2000);
    }
  }, [activeMessage]);


  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name);
  useEffect(() => {
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
      return () => {
        if (actions[animation]) {
          actions[animation].fadeOut(0.5);
        }
      };
    }
  }, [animation]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
      }
    });
  };

  const [blink, setBlink] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();

  useFrame(() => {
    !setupMode &&
      morphTargets.forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return; // eyes wink/blink are handled separately
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    if (setupMode) {
      return;
    }

    const appliedMorphTargets = [];
    if (activeMessage && lipsync && audio) {
      const currentAudioTime = audio.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(visemesMapping[mouthCue.value]);
          lerpMorphTarget(visemesMapping[mouthCue.value], 1, 0.2);
          break;
        }
      }
    } else if (activeMessage && activeMessage.isVapi && lipsync && activeMessage.isSpeaking) {
      // For Vapi, use real-time audio-reactive lip-sync
      if (lipsync.mouthCues && lipsync.mouthCues.length > 0) {
        // Use the current mouth cue
        const mouthCue = lipsync.mouthCues[0];
        const morphTarget = visemesMapping[mouthCue.value];
        
        if (morphTarget) {
          appliedMorphTargets.push(morphTarget);
          // Use volume-based intensity for more natural movement
          const intensity = activeMessage.audioVolume || 0.8;
          lerpMorphTarget(morphTarget, intensity, 0.4);
        }
      }
    }

    Object.values(visemesMapping).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  useControls("FacialExpressions", {
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    setupMode: button(() => {
      setSetupMode(!setupMode);
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {};
      Object.values(nodes).forEach((node) => {
        if (node.morphTargetInfluences && node.morphTargetDictionary) {
          morphTargets.forEach((key) => {
            if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
              return;
            }
            const value = node.morphTargetInfluences[node.morphTargetDictionary[key]];
            if (value > 0.01) {
              emotionValues[key] = value;
            }
          });
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...morphTargets.map((key) => {
        return {
          [key]: {
            label: key,
            value: 0,
            min: 0,
            max: 1,
            onChange: (val) => {
              lerpMorphTarget(key, val, 0.1);
            },
          },
        };
      })
    )
  );

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Headwear.geometry}
        material={materials.Wolf3D_Headwear}
        skeleton={nodes.Wolf3D_Headwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
