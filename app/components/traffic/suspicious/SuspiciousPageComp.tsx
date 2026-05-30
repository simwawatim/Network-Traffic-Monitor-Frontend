"use client";

import { useState, useEffect, useMemo } from "react";
import Layout from "../../Layout";
import { useRouter } from "next/navigation";

interface TrafficLog {
  uuid: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  protocol: string;
  packetSize: number;
  status: "suspicious" | "ddos";
}

const SuspiciousPageComp = () => {
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [protocolFilter, setProtocolFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const router = useRouter();
  // Mock suspicious + ddos traffic logs
  useEffect(() => {
    const fetchSuspiciousLogs = async () => {
      const mockLogs: TrafficLog[] = [
        { uuid: "660e8400-e29b-41d4-a716-446655441000", timestamp: "2025-02-18 09:15:22", srcIp: "203.0.113.5", dstIp: "10.0.0.2", protocol: "TCP", packetSize: 65535, status: "ddos" },
        { uuid: "660e8400-e29b-41d4-a716-446655441001", timestamp: "2025-02-18 09:18:45", srcIp: "198.51.100.7", dstIp: "10.0.0.15", protocol: "UDP", packetSize: 1024, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-446655441002", timestamp: "2025-02-18 09:22:10", srcIp: "203.0.113.5", dstIp: "10.0.0.3", protocol: "TCP", packetSize: 65535, status: "ddos" },
        { uuid: "660e8400-e29b-41d4-a716-446655441003", timestamp: "2025-02-18 09:30:33", srcIp: "192.0.2.44", dstIp: "10.0.0.8", protocol: "ICMP", packetSize: 1500, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-446655441004", timestamp: "2025-02-18 09:45:17", srcIp: "203.0.113.5", dstIp: "10.0.0.9", protocol: "TCP", packetSize: 65535, status: "ddos" },
        { uuid: "660e8400-e29b-41d4-a716-446655441005", timestamp: "2025-02-18 10:02:58", srcIp: "198.51.100.22", dstIp: "10.0.0.5", protocol: "UDP", packetSize: 512, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-446655441006", timestamp: "2025-02-18 10:11:40", srcIp: "203.0.113.5", dstIp: "10.0.0.7", protocol: "TCP", packetSize: 65535, status: "ddos" },
        { uuid: "660e8400-e29b-41d4-a716-446655441007", timestamp: "2025-02-18 10:28:03", srcIp: "192.0.2.99", dstIp: "10.0.0.1", protocol: "ICMP", packetSize: 64, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-446655441008", timestamp: "2025-02-18 10:35:22", srcIp: "198.51.100.7", dstIp: "10.0.0.4", protocol: "UDP", packetSize: 2048, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-446655441009", timestamp: "2025-02-18 10:42:55", srcIp: "203.0.113.5", dstIp: "10.0.0.11", protocol: "TCP", packetSize: 65535, status: "ddos" },
        { uuid: "660e8400-e29b-41d4-a716-44665544100a", timestamp: "2025-02-18 11:05:19", srcIp: "192.0.2.10", dstIp: "10.0.0.20", protocol: "UDP", packetSize: 1024, status: "suspicious" },
        { uuid: "660e8400-e29b-41d4-a716-44665544100b", timestamp: "2025-02-18 11:18:47", srcIp: "203.0.113.5", dstIp: "10.0.0.14", protocol: "TCP", packetSize: 65535, status: "ddos" },
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLogs(mockLogs);
      setLoading(false);
    };
    fetchSuspiciousLogs();
  }, []);

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        log.uuid.toLowerCase().includes(searchLower) ||
        log.timestamp.includes(searchTerm) ||
        log.srcIp.toLowerCase().includes(searchLower) ||
        log.dstIp.toLowerCase().includes(searchLower) ||
        log.protocol.toLowerCase().includes(searchLower) ||
        log.packetSize.toString().includes(searchTerm);
      const matchesProtocol = protocolFilter === "all" || log.protocol === protocolFilter;
      return matchesSearch && matchesProtocol;
    });
  }, [logs, searchTerm, protocolFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, protocolFilter, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setProtocolFilter("all");
  };

  const handleViewLog = (log: TrafficLog) => {
  router.push(`/insight-details/${log.uuid}`);
};

  const getStatusBadge = (status: string) => {
    if (status === "ddos") {
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">DDoS Attack</span>;
    }
    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Suspicious</span>;
  };

  return (
    <Layout>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Suspicious Traffic Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and investigate suspicious network activity and DDoS attacks</p>
        </div>

        {/* Filters section with spacing above and below */}
        <div className="px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 my-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search input */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by UUID, IP, protocol, timestamp, size..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>

              {/* Protocol filter */}
              <div className="w-full md:w-48">
                <select
                  value={protocolFilter}
                  onChange={(e) => setProtocolFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Protocols</option>
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                </select>
              </div>

              {/* Clear filters button */}
              {(searchTerm || protocolFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                  Clear filters
                </button>
              )}

              {/* Items per page */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table area */}
        <div className="px-6 py-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Record ID (UUID)</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source IP</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destination IP</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Protocol</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Packet Size (bytes)</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLogs.map((log) => (
                      <tr key={log.uuid} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-sm text-gray-900 font-mono whitespace-nowrap">{log.uuid}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-mono whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 font-mono">{log.srcIp}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 font-mono">{log.dstIp}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            log.protocol === "TCP" ? "bg-blue-100 text-blue-800" :
                            log.protocol === "UDP" ? "bg-purple-100 text-purple-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {log.protocol}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{log.packetSize}</td>
                        <td className="px-6 py-3">{getStatusBadge(log.status)}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleViewLog(log)}
                            className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={`View details for log ${log.uuid}`}
                            title="View details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {paginatedLogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No suspicious traffic logs match your filters.
                </div>
              )}

              {/* Pagination */}
              {filteredLogs.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{paginatedLogs.length}</span> of{" "}
                    <span className="font-medium text-gray-900">{filteredLogs.length}</span> logs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                          if (i === 4) pageNum = totalPages;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - (4 - i);
                        } else {
                          if (i === 0) pageNum = 1;
                          else if (i === 1) pageNum = currentPage - 1;
                          else if (i === 2) pageNum = currentPage;
                          else if (i === 3) pageNum = currentPage + 1;
                          else pageNum = totalPages;
                        }
                        if (pageNum === 2 && currentPage > 3 && i === 1) {
                          return <span key="ellipsis1" className="px-2 text-gray-500">...</span>;
                        }
                        if (pageNum === totalPages - 1 && currentPage < totalPages - 2 && i === 3) {
                          return <span key="ellipsis2" className="px-2 text-gray-500">...</span>;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 text-sm font-medium rounded-md transition ${
                              currentPage === pageNum
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SuspiciousPageComp;