function UrgentList({ alerts }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">🚨 Urgent Alerts</h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-black/30 backdrop-blur-lg rounded-2xl p-6 border-l-4 ${
              alert.emotion === 'angry' ? 'border-red-500' : 'border-yellow-500'
            } hover:bg-black/40 transition`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-white">User {alert.user}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.emotion === 'angry'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {alert.emotion.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-400">{alert.time}</span>
            </div>
            <p className="text-gray-300 italic">"{alert.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UrgentList;
