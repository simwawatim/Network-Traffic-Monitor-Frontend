"use client";

import { useState, useMemo } from "react";
import Layout from "../Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

// Extended traffic data for full week
const trafficData = [
  { name: "Mon", traffic: 4200 },
  { name: "Tue", traffic: 5800 },
  { name: "Wed", traffic: 7200 },
  { name: "Thu", traffic: 8900 },
  { name: "Fri", traffic: 10400 },
  { name: "Sat", traffic: 6300 },
  { name: "Sun", traffic: 4800 },
];

// Sample table data with more records
const initialTableData = [
  { id: 1, ip: "192.168.1.1", status: "Blocked", level: "High", time: "2 min ago" },
  { id: 2, ip: "10.0.0.5", status: "Safe", level: "Low", time: "10 min ago" },
  { id: 3, ip: "172.16.0.4", status: "Suspicious", level: "Medium", time: "25 min ago" },
  { id: 4, ip: "203.0.113.8", status: "Blocked", level: "Critical", time: "1 hour ago" },
  { id: 5, ip: "192.168.1.100", status: "Safe", level: "Low", time: "2 hours ago" },
  { id: 6, ip: "10.10.10.2", status: "Investigating", level: "High", time: "3 hours ago" },
  { id: 7, ip: "8.8.8.8", status: "Safe", level: "Low", time: "5 hours ago" },
  { id: 8, ip: "192.168.2.45", status: "Blocked", level: "High", time: "yesterday" },
  { id: 9, ip: "34.120.8.72", status: "Suspicious", level: "Medium", time: "yesterday" },
  { id: 10, ip: "142.250.185.46", status: "Safe", level: "Low", time: "2 days ago" },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    Blocked: "bg-red-100 text-red-800 ring-1 ring-red-600/20",
    Safe: "bg-green-100 text-green-800 ring-1 ring-green-600/20",
    Suspicious: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20",
    Investigating: "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

// Level badge component
const LevelBadge = ({ level }: { level: string }) => {
  const levelStyles: Record<string, string> = {
    High: "bg-red-100 text-red-800 ring-1 ring-red-600/20",
    Medium: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20",
    Low: "bg-green-100 text-green-800 ring-1 ring-green-600/20",
    Critical: "bg-purple-100 text-purple-800 ring-1 ring-purple-600/20",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelStyles[level] || "bg-gray-100 text-gray-800"}`}>
      {level}
    </span>
  );
};

// Custom tooltip for chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-indigo-600">
          Traffic: {payload[0].value.toLocaleString()} packets
        </p>
      </div>
    );
  }
  return null;
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter table data based on search term
  const filteredTableData = useMemo(() => {
    if (!searchTerm.trim()) return initialTableData;
    return initialTableData.filter(
      (row) =>
        row.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.level.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto space-y-8 p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Network Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Real-time security monitoring & analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Monitoring
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Traffic Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm font-medium">Total Traffic</p>
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-3">1.28M</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-600 font-medium">↑ 12.5%</span>
                  <span className="text-xs text-gray-400">vs last week</span>
                </div>
              </div>
            </div>

            {/* Threats Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm font-medium">Active Threats</p>
                  <div className="p-2 bg-red-50 rounded-xl">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-red-600 mt-3">23</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-red-600 font-medium">↑ 8.2%</span>
                  <span className="text-xs text-gray-400">vs last week</span>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm font-medium">System Status</p>
                  <div className="p-2 bg-green-50 rounded-xl">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mt-3">Protected</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-600 font-medium">All systems operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
                <p className="text-sm text-gray-500 mt-0.5">Weekly packet analysis</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                Packets (thousands)
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fill="url(#colorTraffic)"
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Monitor real-time security events</p>
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Filter by IP, status, or level..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Threat Level</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900">{row.ip}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-6 py-4">
                          <LevelBadge level={row.level} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{row.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No matching records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Showing {filteredTableData.length} of {initialTableData.length} entries</span>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Real-time updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;