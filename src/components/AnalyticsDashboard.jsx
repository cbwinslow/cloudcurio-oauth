import React, { useEffect, useState } from "react";

export function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="bg-white rounded shadow-lg p-6 my-8">
      <h2 className="text-xl font-bold mb-4">Real-Time Analytics</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <span className="text-2xl font-bold">{stats.active_sessions}</span>
          <p className="text-gray-600">Active Sessions</p>
        </div>
        <div>
          <span className="text-2xl font-bold">{stats.recent_users}</span>
          <p className="text-gray-600">Unique Users (24h)</p>
        </div>
        <div>
          <span className="text-2xl font-bold">{stats.failed_logins}</span>
          <p className="text-gray-600">Failed Logins (24h)</p>
        </div>
        <div>
          <span className="text-2xl font-bold">{stats.top_countries.map(c => c.country).join(", ")}</span>
          <p className="text-gray-600">Top Countries</p>
        </div>
      </div>
    </div>
  );
}