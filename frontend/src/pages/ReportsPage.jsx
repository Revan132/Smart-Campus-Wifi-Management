import React, { useEffect } from 'react';
import { FiDownload, FiFileText, FiMap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDataStore } from '../stores/useDataStore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const ReportsPage = () => {
  const { devices, fetchDevices } = useDataStore();

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const generateZoneReport = () => {
    try {
        if (!devices || devices.length === 0) {
            toast.error("No device data available to report");
            return;
        }

        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        // --- 1. Header ---
        doc.setFontSize(18);
        doc.text("Campus Network Capacity & Health Report", 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${date} | Scope: All Zones`, 14, 28);
        doc.line(14, 35, 196, 35);

        // --- 2. Data Aggregation ---
        const zoneStats = devices.reduce((acc, device) => {
            const zone = device.zone || 'Unassigned';
            if (!acc[zone]) {
                acc[zone] = { total: 0, offline: 0, clients: 0 };
            }
            acc[zone].total += 1;
            if (device.status === 'offline') acc[zone].offline += 1;
            acc[zone].clients += (Number(device.clients) || 0);
            return acc;
        }, {});

        const tableRows = Object.keys(zoneStats).map(zone => {
            const stats = zoneStats[zone];
            const healthRaw = stats.total > 0 ? (1 - (stats.offline / stats.total)) * 100 : 0;
            const health = healthRaw.toFixed(0) + '%';
            const avgLoadRaw = stats.total > 0 ? (stats.clients / stats.total) : 0;
            const avgLoad = avgLoadRaw.toFixed(1);
            
            return [
                zone,
                stats.total,
                stats.clients,
                avgLoad,
                stats.offline,
                health
            ];
        });

        // --- 3. Generate Table ---
        autoTable(doc, {
            startY: 45,
            head: [['Zone Name', 'Total APs', 'Active Users', 'Avg Load/AP', 'Offline APs', 'Health Score']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: {
                0: { fontStyle: 'bold' },
                5: { halign: 'center' }
            },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 5) {
                    const score = parseInt(data.cell.raw);
                    if (score < 70) {
                        data.cell.styles.textColor = [231, 76, 60];
                    } else {
                        data.cell.styles.textColor = [39, 174, 96];
                    }
                }
            }
        });

        // --- 4. Summary ---
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 150;
        
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("Executive Summary:", 14, finalY + 10);
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text([
            "- 'Avg Load/AP' indicates user density. Values > 50 suggest need for additional hardware.",
            "- 'Health Score' reflects device uptime. Zones below 90% require immediate maintenance."
        ], 14, finalY + 16);

        // --- 5. Save ---
        doc.save(`Zone_Capacity_Report_${Date.now()}.pdf`);
        toast.success("Capacity Report Downloaded");

    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF. Check console.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">Generate insights based on current network snapshots.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-50 rounded-xl">
             <FiMap className="w-10 h-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">Zone Health & Capacity Report</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Generates a PDF summarizing the operational status of every campus zone. 
              Calculates router density (Avg Load) and reliability scores (Health %) 
              to assist in infrastructure planning.
            </p>
            
            <button 
              onClick={generateZoneReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <FiDownload /> Download PDF Analysis
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Source Data Preview</h4>
            <div className="flex gap-4 text-sm">
                <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="font-bold text-gray-700">{devices.length}</span> Devices
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="font-bold text-gray-700">
                        {new Set(devices.map(d => d.zone)).size}
                    </span> Zones Found
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


export default ReportsPage;
