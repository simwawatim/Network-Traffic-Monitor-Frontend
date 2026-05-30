"use client";

import { useState, useEffect } from "react";
import Layout from "../Layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Normal Traffic",
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" />
        </svg>
      ),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Suspicious Traffic",
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "DDoS Attacks",
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.8} d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
        </svg>
      ),
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Missing Data",
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]);

  const [loading, setLoading] = useState(true);

  // Mock data for alert trends (Recent Alerts graph)
  const alertTrendData = [
    { time: "00:00", alerts: 2 },
    { time: "04:00", alerts: 5 },
    { time: "08:00", alerts: 12 },
    { time: "12:00", alerts: 18 },
    { time: "16:00", alerts: 25 },
    { time: "20:00", alerts: 16 },
    { time: "23:00", alerts: 8 },
  ];

  // Mock data for top attack sources (bar chart)
  const topAttackSources = [
    { ip: "203.0.113.5", attacks: 47 },
    { ip: "198.51.100.7", attacks: 23 },
    { ip: "192.0.2.44", attacks: 19 },
    { ip: "185.130.5.253", attacks: 12 },
  ];

  useEffect(() => {
    // Simulate API call to fetch real stats
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats([
        {
          title: "Normal Traffic",
          value: 1248,
          change: 12.5,
          icon: stats[0].icon,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Suspicious Traffic",
          value: 347,
          change: -8.2,
          icon: stats[1].icon,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        },
        {
          title: "DDoS Attacks",
          value: 89,
          change: 23.1,
          icon: stats[2].icon,
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
        {
          title: "Missing Data",
          value: 156,
          change: -4.7,
          icon: stats[3].icon,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time overview of network traffic and security events</p>
        </div>

        {/* Cards Grid */}
        <div className="px-6 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {stat.change > 0 ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                          <span className={`text-sm font-medium ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {Math.abs(stat.change)}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">vs last week</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphs Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts - Line Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={alertTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        labelStyle={{ color: "#374151" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="alerts"
                        name="Alert Count"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Last 24 hours (hourly aggregated)
                  </div>
                </div>

                {/* Top Attack Sources - Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Attack Sources</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topAttackSources} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} />
                      <YAxis type="category" dataKey="ip" stroke="#6b7280" fontSize={12} width={100} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        labelStyle={{ color: "#374151" }}
                      />
                      <Bar dataKey="attacks" name="Attack Count" fill="#ef4444" radius={[0, 4, 4, 0]}>
                        {topAttackSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#dc2626" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Most active malicious IPs in last 7 days
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;