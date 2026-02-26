function EmotionBadge({ emotion }) {
  const getEmotionStyle = () => {
    switch(emotion) {
      case 'angry':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'happy':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'concerned':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className={`px-6 py-2 rounded-full text-sm font-semibold mt-6 border-2 ${getEmotionStyle()} transition-all duration-300`}>
      {emotion.toUpperCase()}
    </div>
  );
}

export default EmotionBadge;
