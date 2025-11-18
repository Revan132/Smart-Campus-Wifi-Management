import React, { useEffect, useRef, useState } from 'react';
import { 
  FiUsers, 
  FiWifi, 
  FiActivity, 
  FiAlertTriangle, 
  FiArrowUp, 
  FiArrowDown,
  FiLoader 
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../stores/useDataStore';

/**
 * Simple chart sizer that waits for valid dimensions
 */
const ChartSizer = ({ children, minHeight = 300 }) => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      const rect = ref.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) {
        setSize({ width: w, height: h });
      }
    };

    // Initial measurement
    updateSize();

    // Use ResizeObserver if available
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(ref.current);
      return () => ro.disconnect();
    }

    // Fallback to window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', height: minHeight }}>
      {size.width > 10 && size.height > 10 ? (
        children({ width: size.width, height: size.height })
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
          <FiLoader className="h-6 w-6 mb-2 animate-spin text-blue-500" />
          <p className="text-sm">Loading chart...</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 1. Get all data from store, including trafficLogs
  const { devices, alerts, trafficLogs, fetchDevices, fetchAlerts, fetchTrafficLogs } = useDataStore();

  // 2. Auto-Refresh Logic (Same as Analytics Page)
  useEffect(() => {
    const fetchData = () => {
      fetchDevices();
      fetchAlerts();
      fetchTrafficLogs();
    };

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [fetchDevices, fetchAlerts, fetchTrafficLogs]);

  // --- Calculations ---
  const totalUsers = devices.reduce((acc, device) => acc + (device.clients || 0), 0);
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;
  const criticalAlerts = alerts.filter(a => a.severity === 'high').length;

  // Calculate latest Network Load from the most recent log
  const currentLoad = trafficLogs.length > 0 
    ? trafficLogs[0].totalBandwidth.toFixed(0) 
    : 0;

  // Format Data for Chart (Reverse so time flows Left->Right)
  const chartData = trafficLogs.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }),
    upload: (log.totalBandwidth * 0.4).toFixed(0), // Simulated Upload (40% of total)
    download: (log.totalBandwidth * 0.6).toFixed(0) // Simulated Download (60% of total)
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Overview</h1>
          <p className="text-gray-500 text-sm">Real-time performance metrics across campus</p>
        </div>
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-green-700 font-medium">Live</span>
        </div>
      </div>

      {/* --- Dynamic Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <StatCard 
          title="Active Users" 
          value={totalUsers} 
          change="+12%" 
          icon={<FiUsers className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        
        <StatCard 
          title="Active APs" 
          value={`${onlineDevices}/${totalDevices}`} 
          subtext={`${totalDevices - onlineDevices} Offline`} 
          icon={<FiWifi className="text-green-600" />} 
          color="bg-green-50" 
        />
        
        {/* Updated: Shows Real Bandwidth */}
        <StatCard 
          title="Network Load" 
          value={`${currentLoad} Mbps`} 
          change={currentLoad > 800 ? "High" : "Normal"} 
          isNegative={currentLoad > 800} 
          icon={<FiActivity className="text-orange-600" />} 
          color="bg-orange-50" 
        />
        
        <StatCard 
          title="Active Alerts" 
          value={alerts.length} 
          subtext={`${criticalAlerts} Critical`} 
          icon={<FiAlertTriangle className="text-red-600" />} 
          color="bg-red-50" 
        />
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Live Traffic Chart --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bandwidth Usage (Live)</h3>
          
          {chartData.length > 0 ? (
            <ChartSizer minHeight={300}>
              {({ width, height }) => (
                <ResponsiveContainer width={width} height={height}>
                  <AreaChart data={chartData} width={width} height={height}>
                    <defs>
                      <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="download" 
                      stroke="#3B82F6" 
                      fill="url(#colorDown)" 
                      name="Download"
                      isAnimationActive={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="upload" 
                      stroke="#10B981" 
                      dot={false}
                      strokeWidth={2}
                      name="Upload"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartSizer>
          ) : (
            <div style={{ height: 300 }} className="w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <FiLoader className="h-6 w-6 mb-2 animate-spin text-blue-500" />
              <p className="text-sm">Waiting for traffic data...</p>
            </div>
          )}
        </div>

        {/* --- Real Alerts Widget --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <button onClick={() => navigate('/alerts')} className="text-sm text-blue-600 hover:underline">
              View All
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto flex-1">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-500' : 
                    alert.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                     {alert.zone && (
                         <span className="text-[10px] uppercase font-bold text-gray-400 border px-1 rounded">
                             {alert.zone}
                         </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-10">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, subtext, icon, color, isNegative }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <div className="flex items-center mt-2 text-xs font-medium">
        {change && <span className={`flex items-center ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {isNegative ? <FiArrowUp className="mr-1" /> : <FiArrowUp className="mr-1" />}{change}
        </span>}
        {subtext && <span className="text-gray-400 ml-1">{subtext}</span>}
      </div>
    </div>
    <div className={`p-3 rounded-lg h-fit ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;