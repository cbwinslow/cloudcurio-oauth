import React from "react";
import { motion } from "framer-motion";

export function OAuthLoginCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Sign in to CloudCurio</h2>
      <p className="mb-6 text-gray-600">Choose a provider to continue:</p>
      <a
        href="/api/oauth/start"
        className="block w-full py-2 mb-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-center font-semibold"
      >
        Sign in with GitHub
      </a>
    </motion.div>
  );
}