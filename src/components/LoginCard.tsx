import React from 'react';

const LoginCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Sign In
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a>
        </div>
      </form>
      <div className="my-6 border-t border-gray-300"></div>
      <a
        href="/api/oauth/start"
        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-full text-center inline-block"
      >
        Sign in with OAuth Provider
      </a>
    </div>
  );
};

export default LoginCard;