function StatCard({ title, value, color = 'cyan' }) {
  const getColorClass = () => {
    switch(color) {
      case 'red':
        return 'text-red-400';
      case 'green':
        return 'text-green-400';
      case 'yellow':
        return 'text-yellow-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-center border border-white/10 hover:border-white/20 transition">
      <h2 className="text-lg text-gray-300 mb-2">{title}</h2>
      <p className={`text-4xl font-bold ${getColorClass()}`}>{value}</p>
    </div>
  );
}

export default StatCard;
