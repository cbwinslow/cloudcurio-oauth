import React from 'react';

const Dashboard = ({ user }) => {
  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">You are not logged in.</h1>
        <a href="/" className="text-blue-500 hover:underline">Go to login</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-gray-500">Here's your account overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <img src={user.avatar_url} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Provider: <span className="font-medium text-gray-700">{user.provider}</span>
          </p>
        </div>

        {/* Session Information Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Session Details</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Session ID:</strong> <span className="font-mono bg-gray-100 p-1 rounded">mock_session_id</span></p>
            <p><strong>Expires:</strong> <span className="font-medium">In 7 days</span></p>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <span className="bg-green-500 w-2 h-2 rounded-full mr-3"></span>
              <span>Logged in successfully</span>
              <span className="ml-auto text-gray-400">Just now</span>
            </li>
            <li className="flex items-center">
              <span className="bg-blue-500 w-2 h-2 rounded-full mr-3"></span>
              <span>Viewed dashboard</span>
              <span className="ml-auto text-gray-400">1 min ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;