"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../Layout";
import GoBackComp from "../nav/header/Back"

interface DetailLog {
  uuid: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  protocol: string;
  packetSize: number | null;
  status?: "normal" | "suspicious" | "ddos";
  attackType?: "ddos" | "malicious" | "scanning" | "exploit";
  severity?: "high" | "critical";
  missingFields?: string[];
  reason?: string;
}

const MOCK_LOGS: DetailLog[] = [
  { uuid: "550e8400-e29b-41d4-a716-446655440000", timestamp: "2025-02-18 08:23:12", srcIp: "192.168.1.10", dstIp: "10.0.0.5", protocol: "TCP", packetSize: 1460, status: "normal" },
  { uuid: "550e8400-e29b-41d4-a716-446655440001", timestamp: "2025-02-18 08:23:15", srcIp: "192.168.1.22", dstIp: "10.0.0.8", protocol: "UDP", packetSize: 512, status: "normal" },
  { uuid: "660e8400-e29b-41d4-a716-446655441001", timestamp: "2025-02-18 09:18:45", srcIp: "198.51.100.7", dstIp: "10.0.0.15", protocol: "UDP", packetSize: 1024, status: "suspicious" },
  { uuid: "660e8400-e29b-41d4-a716-446655441003", timestamp: "2025-02-18 09:30:33", srcIp: "192.0.2.44", dstIp: "10.0.0.8", protocol: "ICMP", packetSize: 1500, status: "suspicious" },
  { uuid: "770e8400-e29b-41d4-a716-446655442000", timestamp: "2025-02-18 14:23:11", srcIp: "45.33.22.11", dstIp: "10.0.0.2", protocol: "TCP", packetSize: 65535, attackType: "ddos", severity: "critical" },
  { uuid: "770e8400-e29b-41d4-a716-446655442001", timestamp: "2025-02-18 14:25:37", srcIp: "185.130.5.253", dstIp: "10.0.0.15", protocol: "TCP", packetSize: 512, attackType: "malicious", severity: "high" },
  { uuid: "880e8400-e29b-41d4-a716-446655443000", timestamp: "2025-02-18 16:12:34", srcIp: "192.168.1.10", dstIp: "", protocol: "TCP", packetSize: null, missingFields: ["dstIp", "packetSize"], reason: "Incomplete packet capture" },
  { uuid: "880e8400-e29b-41d4-a716-446655443001", timestamp: "2025-02-18 16:15:22", srcIp: "", dstIp: "10.0.0.5", protocol: "", packetSize: 512, missingFields: ["srcIp", "protocol"], reason: "Corrupted header" },
  { uuid: "990e8400-e29b-41d4-a716-446655444000", timestamp: "2025-02-18 10:05:22", srcIp: "192.168.1.10", dstIp: "10.0.0.20", protocol: "TCP", packetSize: 1280, status: "normal" },
  { uuid: "990e8400-e29b-41d4-a716-446655444001", timestamp: "2025-02-18 11:12:44", srcIp: "192.168.1.10", dstIp: "10.0.0.21", protocol: "UDP", packetSize: 256, status: "normal" },
  { uuid: "aa0e8400-e29b-41d4-a716-446655445000", timestamp: "2025-02-18 12:30:11", srcIp: "192.168.1.10", dstIp: "10.0.0.5", protocol: "TCP", packetSize: 1460, status: "normal" },
  { uuid: "bb0e8400-e29b-41d4-a716-446655446000", timestamp: "2025-02-18 13:45:33", srcIp: "198.51.100.7", dstIp: "10.0.0.99", protocol: "ICMP", packetSize: 84, status: "suspicious" },
];

const getTrafficStatsForSource = (sourceIp: string) => {
  if (!sourceIp) return null;
  const relatedLogs = MOCK_LOGS.filter(log => log.srcIp === sourceIp);
  if (relatedLogs.length === 0) return null;
  const uniqueDests = new Set(relatedLogs.map(log => log.dstIp).filter(Boolean));
  const threatLogs = relatedLogs.filter(log => 
    log.status === "suspicious" || log.attackType === "ddos" || log.attackType === "malicious"
  );
  const threatLevel = threatLogs.length === 0 ? "Low" : threatLogs.length <= 2 ? "Medium" : "High";
  const avgPacketSize = relatedLogs
    .filter(log => log.packetSize !== null)
    .reduce((sum, log) => sum + (log.packetSize || 0), 0) / relatedLogs.filter(log => log.packetSize !== null).length || 0;
  return {
    totalEvents: relatedLogs.length,
    uniqueDestinations: uniqueDests.size,
    threatLevel,
    threatCount: threatLogs.length,
    avgPacketSize: Math.round(avgPacketSize),
  };
};

interface TreeNode {
  id: string;
  name: string;
  type: "source" | "destination" | "protocol" | "log";
  children?: TreeNode[];
  logData?: DetailLog;
}

const TreeNodeItem = ({ 
  node, 
  level = 0, 
  onSelectLog,
  selectedUuid 
}: { 
  node: TreeNode; 
  level?: number; 
  onSelectLog: (uuid: string) => void;
  selectedUuid: string;
}) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.type === "log" && node.logData?.uuid === selectedUuid;

  const toggle = () => setIsOpen(!isOpen);
  const getIcon = () => {
    switch (node.type) {
      case "source":
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        );
      case "destination":
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        );
      case "protocol":
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
          isSelected ? "bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500" : "hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => {
          if (node.type === "log" && node.logData) {
            onSelectLog(node.logData.uuid);
          } else if (hasChildren) {
            toggle();
          }
        }}
      >
        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggle(); }}
            className="p-0.5 rounded hover:bg-gray-200 transition"
          >
            {isOpen ? (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        {getIcon()}
        <span className="text-sm font-medium text-gray-700">{node.name}</span>
        {node.type === "log" && node.logData && (
          <span className="text-xs text-gray-400 ml-2">
            {node.logData.timestamp.slice(0, 16)} • {node.logData.protocol || "?"}
          </span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map(child => (
            <TreeNodeItem key={child.id} node={child} level={level + 1} onSelectLog={onSelectLog} selectedUuid={selectedUuid} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Main Component ----------
const InsightDetailsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  const [log, setLog] = useState<DetailLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLogUuid, setSelectedLogUuid] = useState<string>(uuid);

  useEffect(() => {
    if (!uuid) return;
    const found = MOCK_LOGS.find((l) => l.uuid === uuid);
    if (found) {
      setLog(found);
      setError(false);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [uuid]);

  const handleSelectLog = useCallback((newUuid: string) => {
    if (newUuid === selectedLogUuid) return;
    setSelectedLogUuid(newUuid);
    const foundLog = MOCK_LOGS.find(l => l.uuid === newUuid);
    if (foundLog) {
      setLog(foundLog);
      router.push(`/insight/${newUuid}`, { scroll: false });
    }
  }, [router, selectedLogUuid]);

  // Build tree
  const trafficTree = useMemo(() => {
    const sourceMap = new Map<string, TreeNode>();
    
    MOCK_LOGS.forEach(logEntry => {
      const src = logEntry.srcIp || "unknown";
      const dst = logEntry.dstIp || "unknown";
      const proto = logEntry.protocol || "unknown";
      
      if (!sourceMap.has(src)) {
        sourceMap.set(src, {
          id: `src-${src}`,
          name: src,
          type: "source",
          children: [],
        });
      }
      const sourceNode = sourceMap.get(src)!;
      
      let destNode = sourceNode.children?.find(c => c.type === "destination" && c.name === dst);
      if (!destNode) {
        destNode = {
          id: `src-${src}-dst-${dst}`,
          name: dst,
          type: "destination",
          children: [],
        };
        sourceNode.children!.push(destNode);
      }
      
      let protoNode = destNode.children?.find(c => c.type === "protocol" && c.name === proto);
      if (!protoNode) {
        protoNode = {
          id: `src-${src}-dst-${dst}-proto-${proto}`,
          name: proto,
          type: "protocol",
          children: [],
        };
        destNode.children!.push(protoNode);
      }
      
      protoNode.children!.push({
        id: `log-${logEntry.uuid}`,
        name: logEntry.uuid.slice(0, 8),
        type: "log",
        logData: logEntry,
      });
    });
    
    return Array.from(sourceMap.values());
  }, []);

  const trafficStats = useMemo(() => {
    if (!log?.srcIp) return null;
    return getTrafficStatsForSource(log.srcIp);
  }, [log]);

  const getStatusBadge = () => {
    if (!log) return null;
    if (log.status === "normal") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Normal</span>;
    if (log.status === "suspicious") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Suspicious</span>;
    if (log.attackType === "ddos") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">DDoS Attack</span>;
    if (log.attackType === "malicious") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-700 text-white">Malicious</span>;
    if (log.attackType === "scanning") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Scanning</span>;
    if (log.missingFields?.length) return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Incomplete Data</span>;
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !log) {
    return (
      <Layout>
        <GoBackComp/>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="w-full px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-gray-600 mb-6">
            <button onClick={() => router.push("/home")} className="hover:text-emerald-600 transition flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </button>
            <span className="text-gray-400">/</span>
            <button className="hover:text-emerald-600 transition">Insights</button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{log.uuid.slice(0, 8)}...</span>
          </nav>

          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Traffic Insight Tree</h1>
              <p className="text-gray-500 text-sm mt-1">Hierarchical view of all traffic logs</p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Full-width Tree Panel */}
          <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <h2 className="font-semibold text-gray-800">Traffic Hierarchy</h2>
                <span className="text-xs text-gray-500 ml-2">click to expand/collapse</span>
              </div>
            </div>
            <div className="p-2 max-h-[70vh] overflow-y-auto">
              {trafficTree.map(sourceNode => (
                <TreeNodeItem key={sourceNode.id} node={sourceNode} onSelectLog={handleSelectLog} selectedUuid={log.uuid} />
              ))}
            </div>
          </div>

          {/* Tables Section - Full width below tree */}
          <div className="w-full space-y-6">
            {/* Traffic Statistics Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <h2 className="font-semibold text-gray-800">Traffic Overview</h2>
                  <span className="text-xs text-gray-500">Source: {log.srcIp || "Unknown"}</span>
                </div>
              </div>
              <div className="p-0">
                {!log.srcIp ? (
                  <div className="text-center py-6 text-gray-400">Source IP missing – cannot aggregate stats.</div>
                ) : trafficStats ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600 w-1/3">Total Events</td>
                        <td className="px-5 py-3 text-sm text-gray-900 font-mono">{trafficStats.totalEvents}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Unique Destinations</td>
                        <td className="px-5 py-3 text-sm text-gray-900 font-mono">{trafficStats.uniqueDestinations}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Threat Level</td>
                        <td className="px-5 py-3 text-sm font-semibold">
                          <span className={`inline-flex items-center gap-1 ${trafficStats.threatLevel === "High" ? "text-red-600" : trafficStats.threatLevel === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>
                            {trafficStats.threatLevel}
                            {trafficStats.threatCount > 0 && <span className="text-xs text-gray-500 font-normal">({trafficStats.threatCount} incidents)</span>}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Avg. Packet Size</td>
                        <td className="px-5 py-3 text-sm text-gray-900 font-mono">{trafficStats.avgPacketSize} bytes</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-6 text-gray-400">No traffic data found for this source.</div>
                )}
              </div>
            </div>

            {/* Selected Log Details Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Selected Log Details</h2>
              </div>
              <div className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600 w-1/3">UUID</td>
                      <td className="px-5 py-3 text-sm font-mono text-gray-900 break-all">{log.uuid}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600">Timestamp</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{log.timestamp}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600">Source IP</td>
                      <td className="px-5 py-3 text-sm font-mono text-gray-900">{log.srcIp || <span className="text-red-500 italic">Missing</span>}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600">Destination IP</td>
                      <td className="px-5 py-3 text-sm font-mono text-gray-900">{log.dstIp || <span className="text-red-500 italic">Missing</span>}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600">Protocol</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{log.protocol || <span className="text-red-500 italic">Missing</span>}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-600">Packet Size</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{log.packetSize !== null ? `${log.packetSize} bytes` : <span className="text-red-500 italic">Missing</span>}</td>
                    </tr>
                    {log.status && (
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Status</td>
                        <td className="px-5 py-3 text-sm capitalize text-gray-900">{log.status}</td>
                      </tr>
                    )}
                    {log.attackType && (
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Attack Type</td>
                        <td className="px-5 py-3 text-sm capitalize text-gray-900">{log.attackType}</td>
                      </tr>
                    )}
                    {log.severity && (
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600">Severity</td>
                        <td className="px-5 py-3 text-sm uppercase font-semibold text-gray-900">{log.severity}</td>
                      </tr>
                    )}
                    {log.missingFields && log.missingFields.length > 0 && (
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600 align-top">Missing Fields</td>
                        <td className="px-5 py-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {log.missingFields.map(f => (
                              <span key={f} className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">{f}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                    {log.reason && (
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-sm font-medium text-gray-600 align-top">Reason</td>
                        <td className="px-5 py-3 text-sm italic text-gray-700">{log.reason}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button onClick={() => router.back()} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Go Back
                </button>
                <button onClick={() => router.push("/home")} className="px-4 py-1.5 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-1">
                  Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m-6 6l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InsightDetailsPage;