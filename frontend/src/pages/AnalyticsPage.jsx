import React, { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { FiActivity, FiMap, FiWifi, FiLoader } from 'react-icons/fi';
import { useDataStore } from '../stores/useDataStore';


const VisibleChartSizer = ({ style = {}, children, placeholder = null }) => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0, visible: false });

  useEffect(() => {
    let mounted = true;
    const el = ref.current;
    if (!el) return;

    const readRect = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(0, Math.floor(rect.width));
      const h = Math.max(0, Math.floor(rect.height));

      const visible = el.offsetParent !== null && w > 0 && h > 0;
      return { w, h, visible };
    };


    const updateIfDifferent = (w, h, visible) => {
      setSize(prev => (prev.width !== w || prev.height !== h || prev.visible !== visible) ? { width: w, height: h, visible } : prev);
    };


    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        const { w, h, visible } = readRect();
        updateIfDifferent(w, h, visible);
      });
      ro.observe(el);

      const { w, h, visible } = readRect();
      updateIfDifferent(w, h, visible);
      return () => { mounted = false; ro.disconnect(); };
    }


    let attempts = 0;
    const MAX_ATTEMPTS = 60; 
    const tick = () => {
      if (!mounted) return;
      attempts++;
      const { w, h, visible } = readRect();
      updateIfDifferent(w, h, visible);
      if ((w <= 0 || h <= 0 || !visible) && attempts < MAX_ATTEMPTS) {
        requestAnimationFrame(tick);
      }
    };
    tick();
    const onResize = () => {
      const { w, h, visible } = readRect();
      updateIfDifferent(w, h, visible);
    };
    window.addEventListener('resize', onResize);
    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
    };
  }, [ref.current]);

  const positiveAndVisible = size.width > 0 && size.height > 0 && size.visible;

  return (
    <div ref={ref} style={{ width: '100%', minWidth: 0, ...style }}>
      {positiveAndVisible ? children({ width: size.width, height: size.height }) : (placeholder || (
        <div
          className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg"
          style={{ minHeight: style.height || 300 }}
        >
          <FiLoader className="h-8 w-8 mb-2 animate-spin text-blue-500" />
          <p className="text-sm">Preparing chart layout...</p>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const { devices, trafficLogs, fetchDevices, fetchTrafficLogs } = useDataStore();

  // --- Auto-Refresh Logic ---
  useEffect(() => {
    fetchDevices();
    fetchTrafficLogs();

    // Poll every 3 seconds to keep the chart "alive"
    const interval = setInterval(() => {
      fetchTrafficLogs();
      fetchDevices();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchDevices, fetchTrafficLogs]);

  // --- 1. Zone Distribution Logic ---
  const zoneStats = devices.reduce((acc, device) => {
    const zone = device.zone || 'Unknown';
    const clients = Number(device.clients) || 0;
    acc[zone] = (acc[zone] || 0) + clients;
    return acc;
  }, {});

  const zoneDistribution = Object.keys(zoneStats).map(zone => ({
    name: zone,
    value: zoneStats[zone]
  }));

  const finalZoneData = zoneDistribution.length > 0 ? zoneDistribution : [{ name: 'No Data', value: 1 }];
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // --- 2. Traffic Data Formatting ---
  const chartData = trafficLogs.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    bandwidth: log.totalBandwidth,
    users: log.activeUsers
  }));

  
  const heatmapData = [
    { zone: 'Lib-1', signal: 95 }, { zone: 'Lib-2', signal: 88 }, { zone: 'Lib-3', signal: 45 },
    { zone: 'BH-1', signal: 92 }, { zone: 'BH-2', signal: 76 }, { zone: 'BH-3', signal: 30 },
    { zone: 'Acad-A', signal: 98 }, { zone: 'Acad-B', signal: 99 }, { zone: 'Acad-C', signal: 60 },
  ];

  const getSignalColor = (strength) => {
    if (strength > 80) return 'bg-green-500';
    if (strength > 50) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Analytics</h1>
          <p className="text-gray-500 text-sm">Real-time traffic simulation and coverage analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-green-700 font-medium">Live Updates Active</span>
        </div>
      </div>

      {/* Top Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Live Traffic (Area) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiActivity className="text-blue-600" /> Live Bandwidth Usage (Mbps)
          </h3>

          <VisibleChartSizer style={{ height: 300, minHeight: 300 }}>
            {({ width, height }) => (
              <ResponsiveContainer width={width} height={height}>
                <AreaChart data={chartData} width={width} height={height}>
                  <defs>
                    <linearGradient id="colorBw" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="bandwidth"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorBw)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </VisibleChartSizer>
        </div>

        {/* Chart 2: User Distribution (Pie) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiWifi className="text-purple-600" /> Active Clients by Zone
          </h3>

          <VisibleChartSizer style={{ height: 300, minHeight: 300 }}>
            {({ width, height }) => (
              <ResponsiveContainer width={width} height={height}>
                <PieChart width={width} height={height}>
                  <Pie
                    data={finalZoneData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {finalZoneData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </VisibleChartSizer>
        </div>
      </div>

      {/* Bottom Row: Heatmap (Static) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiMap className="text-orange-600" /> Signal Coverage Heatmap
          </h3>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
          {heatmapData.map((node, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all cursor-default">
              <div className={`w-12 h-12 rounded-full mb-3 shadow-sm flex items-center justify-center text-white text-sm font-bold ${getSignalColor(node.signal)}`}>
                {node.signal}%
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{node.zone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AnalyticsPage;
