import React, { useEffect, useState } from "react";

export function UserSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch("/api/user/sessions")
      .then(res => res.json())
      .then(setSessions);
  }, []);

  const revoke = async (id) => {
    await fetch(`/api/user/sessions/${id}`, { method: "DELETE" });
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div>
      <h3 className="font-bold mb-2">Your Active Sessions</h3>
      <ul>
        {sessions.map(s => (
          <li key={s.id} className="mb-2 flex items-center justify-between">
            <span>{s.device} ({new Date(s.created_at).toLocaleString()})</span>
            <button onClick={() => revoke(s.id)} className="text-red-500">Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
}