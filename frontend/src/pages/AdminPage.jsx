import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import UrgentList from '../components/UrgentList';
import { initialStats, urgentAlerts } from '../data/dummyData';

function AdminPage() {
  const [stats, setStats] = useState(initialStats);
  const [alerts, setAlerts] = useState(urgentAlerts);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalCalls: prev.totalCalls + Math.floor(Math.random() * 2),
        angryCalls: prev.angryCalls + (Math.random() > 0.7 ? 1 : 0),
        neutralCalls: prev.neutralCalls + (Math.random() > 0.5 ? 1 : 0),
        urgentEscalations: prev.urgentEscalations + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Calls" 
            value={stats.totalCalls} 
            color="cyan"
          />
          <StatCard 
            title="Angry Calls" 
            value={stats.angryCalls} 
            color="red"
          />
          <StatCard 
            title="Neutral Calls" 
            value={stats.neutralCalls} 
            color="green"
          />
          <StatCard 
            title="Urgent Escalations" 
            value={stats.urgentEscalations} 
            color="yellow"
          />
        </div>

        {/* Urgent List */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
          <UrgentList alerts={alerts} />
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">📈 Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Resolution Rate</span>
                <span className="text-green-400 font-bold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Response Time</span>
                <span className="text-cyan-400 font-bold">2.3s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Customer Satisfaction</span>
                <span className="text-green-400 font-bold">4.5/5</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">🌍 Language Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Hindi</span>
                <span className="text-cyan-400 font-bold">65%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">English</span>
                <span className="text-cyan-400 font-bold">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Others</span>
                <span className="text-cyan-400 font-bold">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
