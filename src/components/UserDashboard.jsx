import React from "react";

export function UserDashboard({ user }) {
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow-md">
      <div className="flex items-center space-x-4 mb-6">
        <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-2">Account Details</h4>
        <ul className="text-gray-700">
          <li><strong>Provider:</strong> {user.provider}</li>
          <li><strong>User ID:</strong> {user.id}</li>
          <li><strong>Joined:</strong> {new Date(user.created_at).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}