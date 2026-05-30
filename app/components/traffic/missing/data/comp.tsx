"use client";

import React, { useState, useEffect, useMemo, useCallback, JSX } from "react";
import { useParams, useRouter } from "next/navigation";

// ---------- Types ----------
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

// Mock data with sufficient variety to demonstrate hierarchy
const MOCK_LOGS: DetailLog[] = [
  {
    uuid: "log-001",
    timestamp: "2025-02-20T08:23:10Z",
    srcIp: "192.168.1.100",
    dstIp: "10.0.0.5",
    protocol: "TCP",
    packetSize: 1420,
    status: "normal",
  },
  {
    uuid: "log-002",
    timestamp: "2025-02-20T08:24:15Z",
    srcIp: "192.168.1.100",
    dstIp: "10.0.0.5",
    protocol: "TCP",
    packetSize: 840,
    status: "normal",
  },
  {
    uuid: "log-003",
    timestamp: "2025-02-20T08:25:42Z",
    srcIp: "192.168.1.100",
    dstIp: "172.31.0.22",
    protocol: "UDP",
    packetSize: 512,
    status: "suspicious",
    attackType: "scanning",
    severity: "high",
    reason: "Multiple ports probed",
  },
  {
    uuid: "log-004",
    timestamp: "2025-02-20T09:05:03Z",
    srcIp: "10.10.10.10",
    dstIp: "192.168.1.100",
    protocol: "ICMP",
    packetSize: 98,
    status: "ddos",
    attackType: "ddos",
    severity: "critical",
    missingFields: ["dstIp"],
    reason: "ICMP flood detected",
  },
  {
    uuid: "log-005",
    timestamp: "2025-02-20T09:07:21Z",
    srcIp: "10.10.10.10",
    dstIp: "192.168.1.100",
    protocol: "ICMP",
    packetSize: 102,
    status: "ddos",
    attackType: "ddos",
    severity: "critical",
    reason: "High rate of ICMP echo requests",
  },
  {
    uuid: "log-006",
    timestamp: "2025-02-20T10:12:44Z",
    srcIp: "192.168.1.200",
    dstIp: "8.8.8.8",
    protocol: "DNS",
    packetSize: 78,
    status: "normal",
  },
  {
    uuid: "log-007",
    timestamp: "2025-02-20T11:30:11Z",
    srcIp: "192.168.1.200",
    dstIp: "8.8.8.8",
    protocol: "DNS",
    packetSize: 82,
    status: "suspicious",
    attackType: "exploit",
    severity: "high",
    missingFields: ["packetSize"],
    reason: "Malformed DNS query",
  },
];

interface TableRowData {
  id: string;
  name: string;
  type: "source" | "destination" | "protocol" | "log";
  level: number;
  logData?: DetailLog;
  children?: TableRowData[];
}

// The ExpandableRow component has been removed in favor of the renderRows function below,
// which provides cleaner recursive rendering with proper state management.

// ---------- Main Page Component ----------
const InsightDetailsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  const [log, setLog] = useState<DetailLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLogUuid, setSelectedLogUuid] = useState<string>(uuid);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Load initial log based on URL uuid
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

  const handleSelectLog = useCallback(
    (newUuid: string) => {
      if (newUuid === selectedLogUuid) return;
      setSelectedLogUuid(newUuid);
      const foundLog = MOCK_LOGS.find((l) => l.uuid === newUuid);
      if (foundLog) {
        setLog(foundLog);
        router.push(`/insight/${newUuid}`, { scroll: false });
      }
    },
    [router, selectedLogUuid]
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build hierarchy: source -> destination -> protocol -> log
  const tableRows = useMemo(() => {
    const sourceMap = new Map<string, TableRowData>();
    MOCK_LOGS.forEach((logEntry) => {
      const src = logEntry.srcIp || "unknown";
      const dst = logEntry.dstIp || "unknown";
      const proto = logEntry.protocol || "unknown";

      if (!sourceMap.has(src)) {
        sourceMap.set(src, {
          id: `src-${src}`,
          name: src,
          type: "source",
          level: 0,
          children: [],
        });
      }
      const sourceNode = sourceMap.get(src)!;

      let destNode = sourceNode.children?.find(
        (c) => c.type === "destination" && c.name === dst
      );
      if (!destNode) {
        destNode = {
          id: `src-${src}-dst-${dst}`,
          name: dst,
          type: "destination",
          level: 1,
          children: [],
        };
        sourceNode.children!.push(destNode);
      }

      let protoNode = destNode.children?.find(
        (c) => c.type === "protocol" && c.name === proto
      );
      if (!protoNode) {
        protoNode = {
          id: `src-${src}-dst-${dst}-proto-${proto}`,
          name: proto,
          type: "protocol",
          level: 2,
          children: [],
        };
        destNode.children!.push(protoNode);
      }

      protoNode.children!.push({
        id: `log-${logEntry.uuid}`,
        name: logEntry.uuid.slice(0, 8),
        type: "log",
        level: 3,
        logData: logEntry,
      });
    });
    return Array.from(sourceMap.values());
  }, []);

  // Recursive render function using expandedRows state
  const renderRows = useCallback(
    (rows: TableRowData[]): JSX.Element[] => {
      return rows.flatMap((row) => {
        const isOpen = expandedRows.has(row.id);
        const hasChildren = row.children && row.children.length > 0;
        const isLogRow = row.type === "log";
        const isSelected = isLogRow && row.logData?.uuid === selectedLogUuid;
        const indentPadding = row.level * 1.5; // rem

        const mainRow = (
          <tr
            key={row.id}
            className={`border-b border-gray-100 hover:bg-gray-50 transition ${
              isSelected ? "bg-emerald-50" : ""
            }`}
            onClick={() => {
              if (isLogRow && row.logData) {
                handleSelectLog(row.logData.uuid);
              }
            }}
          >
            {/* Node column with expand/collapse */}
            <td className="py-2.5" style={{ paddingLeft: `${indentPadding}rem` }}>
              <div className="flex items-center gap-1">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(row.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {isOpen ? (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                )}
                {!hasChildren && <span className="w-6"></span>}
                <span
                  className={`text-sm ${
                    isLogRow
                      ? "font-mono text-emerald-700 cursor-pointer hover:underline"
                      : "font-medium text-gray-800"
                  }`}
                >
                  {row.name}
                </span>
                {isLogRow && <span className="ml-2 text-xs text-gray-400">(log)</span>}
              </div>
            </td>
            <td className="py-2.5 text-sm text-gray-600">
              {isLogRow ? row.logData?.timestamp || "-" : "-"}
            </td>
            <td className="py-2.5 text-sm text-gray-600">
              {isLogRow ? row.logData?.protocol || "-" : "-"}
            </td>
            <td className="py-2.5 text-sm text-gray-600">
              {isLogRow
                ? row.logData?.packetSize
                  ? `${row.logData.packetSize} bytes`
                  : "-"
                : "-"}
            </td>
          </tr>
        );

        // If row has children and is expanded, render children recursively
        if (isOpen && hasChildren) {
          return [mainRow, ...renderRows(row.children!)];
        }
        return [mainRow];
      });
    },
    [expandedRows, selectedLogUuid, handleSelectLog, toggleRow]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !log) {
    return <div className="text-center py-16 text-gray-500">Log not found</div>;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full px-4 sm:px-6 py-6">
        {/* Full-width expandable tree table - only section */}
        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
            Traffic Hierarchy Tree
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Node
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packet Size
                  </th>
                </tr>
              </thead>
              <tbody>{renderRows(tableRows)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDetailsPage;