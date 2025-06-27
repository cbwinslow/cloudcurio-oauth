import React, { useEffect, useState } from "react";

export function AuditLogTable() {
  const [logs, setLogs] = useState([]);
  const [sort, setSort] = useState("timestamp");

  useEffect(() => {
    fetch("/api/admin/audit-log-json")
      .then(res => res.json())
      .then(setLogs);
  }, []);

  const sorted = [...logs].sort((a, b) => (b[sort] || "") > (a[sort] || "") ? 1 : -1);

  return (
    <div>
      <h3 className="font-bold mb-2">Audit Log</h3>
      <table className="w-full text-xs border">
        <thead>
          <tr>
            {["timestamp", "user_id", "action", "status", "details"].map(col =>
              <th key={col} onClick={() => setSort(col)} className="cursor-pointer border px-2">{col}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border">
              <td className="border px-2">{row.timestamp}</td>
              <td className="border px-2">{row.user_id}</td>
              <td className="border px-2">{row.action}</td>
              <td className="border px-2">{row.status}</td>
              <td className="border px-2">{row.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}