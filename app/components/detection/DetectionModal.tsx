"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface TrafficLog {
  uuid: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  protocol: string;
  packetSize: number;
  status: "normal" | "suspicious" | "ddos";
}

interface DetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectionComplete: (newLogs: TrafficLog[]) => void;
}

type Step = "upload" | "treeView" | "submit";

const DetectionModal = ({ isOpen, onClose, onDetectionComplete }: DetectionModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [rawLogs, setRawLogs] = useState<TrafficLog[]>([]);
  const [cleanedLogs, setCleanedLogs] = useState<TrafficLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && step === "upload" && !isProcessing) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, step, isProcessing, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const parseCSVLenient = (csvText: string): any[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const records: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length !== headers.length) continue;
      const record: any = {};
      headers.forEach((h, idx) => { record[h] = values[idx]; });
      records.push(record);
    }
    return records;
  };

  const rawToTrafficLogs = (records: any[]): TrafficLog[] => {
    return records.map((rec, idx) => {
      const timestamp = rec.timestamp || new Date().toISOString().replace("T", " ").slice(0, 19);
      const srcIp = rec.srcip || rec.srcIp || "0.0.0.0";
      const dstIp = rec.dstip || rec.dstIp || "0.0.0.0";
      const protocol = (rec.protocol || "TCP").toUpperCase();
      const packetSize = rec.packetsize || rec.packetSize ? parseInt(rec.packetsize || rec.packetSize, 10) : 0;
      const status = (rec.status || "normal").toLowerCase();
      return {
        uuid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${idx}-${Math.random()}`,
        timestamp,
        srcIp,
        dstIp,
        protocol,
        packetSize,
        status: ["normal", "suspicious", "ddos"].includes(status) ? status as any : "normal",
      };
    });
  };

  const generateMockLogs = (): TrafficLog[] => {
    return [
      { uuid: "mock-1", timestamp: "2025-03-01 10:00:00", srcIp: "192.168.1.10", dstIp: "10.0.0.5", protocol: "TCP", packetSize: 1460, status: "normal" },
      { uuid: "mock-2", timestamp: "2025-03-01 10:00:05", srcIp: "192.168.1.10", dstIp: "10.0.0.6", protocol: "UDP", packetSize: 0, status: "normal" },
      { uuid: "mock-3", timestamp: "2025-03-01 10:00:10", srcIp: "172.16.0.4", dstIp: "10.0.0.2", protocol: "ICMP", packetSize: 84, status: "suspicious" },
      { uuid: "mock-4", timestamp: "2025-03-01 10:00:15", srcIp: "192.168.1.10", dstIp: "8.8.8.8", protocol: "TCP", packetSize: 1500, status: "ddos" },
      { uuid: "mock-5", timestamp: "2025-03-01 10:00:20", srcIp: "10.10.10.7", dstIp: "10.0.0.1", protocol: "UDP", packetSize: 512, status: "normal" },
    ];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setError(null);
  };

  const handleStartDetection = async () => {
    setIsProcessing(true);
    setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const records = parseCSVLenient(csvText);
        if (records.length === 0) {
          setRawLogs(generateMockLogs());
        } else {
          setRawLogs(rawToTrafficLogs(records));
        }
        setIsProcessing(false);
        setStep("treeView");
      };
      reader.onerror = () => {
        setError("Failed to read file. Using mock data.");
        setRawLogs(generateMockLogs());
        setIsProcessing(false);
        setStep("treeView");
      };
      reader.readAsText(file);
    } else {
      setRawLogs(generateMockLogs());
      setIsProcessing(false);
      setStep("treeView");
    }
  };

  const handleCleanData = () => {
    const cleaned = rawLogs.map(log => ({
      ...log,
      packetSize: log.packetSize === 0 ? 64 : log.packetSize,
    }));
    setCleanedLogs(cleaned);
    setStep("submit");
  };

  const handleSubmit = async () => {
    const logsToSubmit = cleanedLogs.length ? cleanedLogs : rawLogs;
    onDetectionComplete(logsToSubmit);

    await Swal.fire({
      title: "Submitted!",
      text: `${logsToSubmit.length} traffic logs have been added.`,
      icon: "success",
      confirmButtonColor: "#16a34a",
      timer: 2000,
      showConfirmButton: false,
      backdrop: true,
      heightAuto: false,
    });

    onClose();
    setStep("upload");
    setFile(null);
    setRawLogs([]);
    setCleanedLogs([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderTreeView = (logs: TrafficLog[]) => {
    const groups: Record<string, Record<string, TrafficLog[]>> = {};
    logs.forEach(log => {
      if (!groups[log.protocol]) groups[log.protocol] = {};
      if (!groups[log.protocol][log.srcIp]) groups[log.protocol][log.srcIp] = [];
      groups[log.protocol][log.srcIp].push(log);
    });

    return (
      <ul className="pl-4 space-y-2 text-sm">
        {Object.entries(groups).map(([protocol, srcGroups]) => (
          <li key={protocol}>
            <details open>
              <summary className="font-semibold text-gray-800 cursor-pointer hover:text-green-700 transition">{protocol}</summary>
              <ul className="pl-4 mt-1 space-y-1">
                {Object.entries(srcGroups).map(([srcIp, logsList]) => (
                  <li key={srcIp}>
                    <details open>
                      <summary className="text-gray-700 font-mono text-sm cursor-pointer hover:text-green-600">Source: {srcIp}</summary>
                      <ul className="pl-4 mt-1 space-y-1">
                        {logsList.map((log) => (
                          <li key={log.uuid} className="border-l-2 border-green-200 pl-2 text-xs text-gray-600 py-1">
                            <span className="font-mono">{log.timestamp}</span> → {log.dstIp} | size: {log.packetSize || "?"} | status:{" "}
                            <span className={`font-medium ${log.status === "normal" ? "text-green-600" : log.status === "suspicious" ? "text-yellow-600" : "text-red-600"}`}>
                              {log.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    );
  };

  const renderContent = () => {
    switch (step) {
      case "upload":
        return (
          <>
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Start Traffic Detection</h3>
              <p className="text-sm text-gray-500 mt-1">Upload any CSV file (no strict validation) – or start with mock data.</p>
            </div>
            <div className="flex-1 px-6 py-8 overflow-y-auto flex flex-col justify-center items-center">
              <div className="w-full max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">CSV File (optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition cursor-pointer"
                  />
                  {file && <p className="mt-3 text-xs text-gray-500">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>}
                </div>
                {error && <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 flex flex-row-reverse gap-3 rounded-b-xl">
              <button
                onClick={handleStartDetection}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition"
              >
                {isProcessing ? "Processing..." : "Start Detection"}
              </button>
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </>
        );

      case "treeView":
        return (
          <>
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Log Tree View</h3>
              <p className="text-sm text-gray-500">Some packets have missing data (size=0). Click "Clean Data" to fix defaults.</p>
            </div>
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {renderTreeView(rawLogs)}
            </div>
            <div className="px-6 py-4 bg-gray-100 flex flex-row-reverse gap-3 rounded-b-xl">
              <button onClick={handleCleanData} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Clean Data
              </button>
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </>
        );

      case "submit":
        return (
          <>
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Ready to Submit</h3>
              <p className="text-sm text-gray-500">Cleaned logs are ready. Submit them to the main table.</p>
            </div>
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-800 mb-3">Cleaned logs summary:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Total logs: {cleanedLogs.length}</li>
                  <li>Protocols: {[...new Set(cleanedLogs.map(l => l.protocol))].join(", ")}</li>
                  <li>Missing values fixed: packetSize defaulted to 64 where missing.</li>
                </ul>
                <details className="mt-4">
                  <summary className="cursor-pointer text-green-600 font-medium">Preview cleaned logs</summary>
                  <div className="mt-2 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 font-mono border border-gray-200">
                    {cleanedLogs.slice(0, 10).map(log => (
                      <div key={log.uuid} className="border-b py-1">{log.timestamp} {log.srcIp}→{log.dstIp} {log.protocol} size:{log.packetSize} status:{log.status}</div>
                    ))}
                    {cleanedLogs.length > 10 && <div className="pt-1 text-gray-500">... and {cleanedLogs.length - 10} more</div>}
                  </div>
                </details>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 flex flex-row-reverse gap-3 rounded-b-xl">
              <button onClick={handleSubmit} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Submit
              </button>
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={step === "upload" ? onClose : undefined}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10 overflow-hidden border border-gray-200">
        {renderContent()}
      </div>
    </div>
  );
};

export default DetectionModal;