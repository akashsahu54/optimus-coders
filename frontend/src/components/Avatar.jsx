import { avatarImages } from '../data/dummyData';

function Avatar({ emotion, isSpeaking }) {
  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (emotion === 'angry') return 'animate-bounce';
    return '';
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className={`w-64 h-64 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${getAnimationClass()}`}>
        <span className="text-9xl">{avatarImages[emotion]}</span>
      </div>
      
      {isSpeaking && (
        <div className="absolute bottom-4 flex gap-2">
          <div className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-12 bg-cyan-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
        </div>
      )}
    </div>
  );
}

export default Avatar;
