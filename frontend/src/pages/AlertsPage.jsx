import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiLoader } from 'react-icons/fi';
import { useDataStore } from '../stores/useDataStore';

const AlertsPage = () => {
  const { alerts, fetchAlerts, loading } = useDataStore();
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Fetch Real Data on Mount
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Filter Logic
  const filteredAlerts = alerts.filter(alert => {
    const status = alert.status || 'active'; 
    if (status === 'acknowledged') return false;
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  // Helper for styling
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-100 text-red-700';
      case 'medium': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'low': return 'bg-blue-50 border-blue-100 text-blue-700';
      default: return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  };

  // Helper for formatting MongoDB Date
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Alerts</h1>
          <p className="text-gray-500 text-sm">Monitor network anomalies and critical events</p>
        </div>
        
        {/* --- Filter Controls --- */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button 
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterSeverity === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterSeverity('high')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterSeverity === 'high' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-red-600'}`}
          >
            High
          </button>
          <button 
            onClick={() => setFilterSeverity('medium')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterSeverity === 'medium' ? 'bg-orange-50 text-orange-700' : 'text-gray-500 hover:text-orange-600'}`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* --- Alerts List --- */}
      <div className="grid gap-4">
        {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <FiLoader className="animate-spin h-8 w-8 mb-2 text-blue-500" />
                <p>Loading alerts...</p>
            </div>
        ) : (
            <>
                {filteredAlerts.map((alert) => (
                <div 
                    key={alert._id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${getSeverityStyles(alert.severity)}`}
                >
                    {/* Alert Content (Full Width since button is gone) */}
                    <div className="flex items-start gap-4 w-full">
                        <div className={`p-2 rounded-full bg-white/60 flex-shrink-0`}>
                            <FiAlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{alert.message}</h3>
                            <div className="flex items-center gap-4 text-sm opacity-80 mt-1">
                                <span className="flex items-center gap-1">
                                    <FiClock className="h-4 w-4" /> {formatTime(alert.timestamp)}
                                </span>
                                {alert.zone && (
                                    <span className="px-2 py-0.5 rounded-full bg-white/50 text-xs font-semibold uppercase tracking-wider border border-black/5">
                                        {alert.zone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </>
        )}

        {/* Empty State */}
        {!loading && filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">All Systems Nominal</h3>
            <p className="text-gray-500">No active alerts matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;