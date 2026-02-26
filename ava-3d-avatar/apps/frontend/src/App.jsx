import { useState, useEffect } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { CyberpunkLayout } from "./components/layout/CyberpunkLayout";
import { AIReactor } from "./components/core/AIReactor";
import { TopHUD } from "./components/hud/TopHUD";
import { HUDPanel } from "./components/hud/HUDPanel";
import { CommandConsole } from "./components/console/CommandConsole";
import { VoiceVisualizer } from "./components/effects/VoiceVisualizer";
import { BootSequence } from "./components/effects/BootSequence";
import { useSpeech } from "./hooks/useSpeech";

function App() {
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();
  const [sessionTime, setSessionTime] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (text) => {
    if (!loading && !message) {
      tts(text);
    }
  };

  const leftStats = [
    { label: 'AI STATUS', value: loading ? 'PROCESSING' : 'ONLINE', status: loading ? 'warning' : 'active' },
    { label: 'CPU LOAD', value: loading ? '87%' : '23%', status: loading ? 'warning' : 'active' },
    { label: 'NETWORK', value: 'STABLE', status: 'success' },
    { label: 'VOICE INPUT', value: recording ? 'ACTIVE' : 'STANDBY', status: recording ? 'active' : 'success' },
  ];

  const rightStats = [
    { label: 'USER ID', value: 'USR_001', status: 'active' },
    { label: 'SESSION TIME', value: formatTime(sessionTime), status: 'active' },
    { label: 'ENERGY LEVEL', value: '98%', status: 'success' },
    { label: 'MODE', value: recording ? 'VOICE' : 'CHAT', status: 'active' },
  ];

  const getStatus = () => {
    if (loading) return 'NEURAL PROCESSING...';
    if (recording) return 'VOICE INPUT ACTIVE';
    if (message) return 'TRANSMITTING DATA';
    return 'SYSTEM READY';
  };

  return (
    <>
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      
      <CyberpunkLayout>
        <Loader />
        <Leva collapsed hidden />
      
      {/* Top HUD */}
      <TopHUD status={getStatus()} isThinking={loading} />
      
      {/* Side HUD Panels */}
      <HUDPanel position="left" stats={leftStats} />
      <HUDPanel position="right" stats={rightStats} />
      
      {/* AI Reactor with 3D Avatar */}
      <AIReactor isActive={loading || message || recording} isThinking={loading}>
        <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
          <Scenario />
        </Canvas>
      </AIReactor>
      
      {/* Voice Visualizer */}
      <VoiceVisualizer isActive={recording} />
      
      {/* Command Console */}
      <CommandConsole
        onSend={handleSend}
        onVoiceStart={startRecording}
        onVoiceStop={stopRecording}
        isRecording={recording}
        isLoading={loading}
        isProcessing={!!message}
      />
      </CyberpunkLayout>
    </>
  );
}

export default App;
