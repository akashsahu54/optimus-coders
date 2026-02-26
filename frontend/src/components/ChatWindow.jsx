function ChatWindow({ messages }) {
  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 h-80 overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-white">💬 Conversation</h3>
      
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-center">
            Click "Speak Now" to start conversation...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">
                    {msg.sender === 'user' ? '👤 You' : '🤖 AVA'}
                  </span>
                  {msg.emotion && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {msg.emotion}
                    </span>
                  )}
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
