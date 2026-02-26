function VoiceButton({ isListening, isSpeaking, onClick }) {
  const getButtonStyle = () => {
    if (isSpeaking) return 'bg-purple-500 hover:bg-purple-600';
    if (isListening) return 'bg-green-500 hover:bg-green-600 animate-pulse';
    return 'bg-cyan-500 hover:bg-cyan-600';
  };

  const getButtonText = () => {
    if (isSpeaking) return '🔊 Speaking...';
    if (isListening) return '🎤 Listening...';
    return '🎤 Speak Now';
  };

  return (
    <button
      onClick={onClick}
      disabled={isSpeaking}
      className={`px-8 py-3 ${getButtonStyle()} transition rounded-full text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {getButtonText()}
    </button>
  );
}

export default VoiceButton;
