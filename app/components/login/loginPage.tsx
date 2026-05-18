"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const navigate = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reconnect, setReconnect] = useState(false);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log({ email, password});

  navigate.push("/home");
};
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f6f9fc] to-[#eef2f8] font-sans antialiased">
      {/* Left Column: Image - 8/12 width */}
      <div className="md:w-8/12 w-full relative min-h-[280px] md:min-h-screen overflow-hidden">
          <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=1600&fit=crop"
          alt="Cyber DDoS attack visualization - digital network under threat"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Optional subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 md:from-black/10 md:to-transparent" />
      </div>

      {/* Right Column: Form - 4/12 width */}
      <div className="md:w-4/12 w-full flex items-center justify-center p-5 md:p-8">
        {/* Card container - replicates original styling */}
        <div className="bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.02)] w-full border border-gray-100/80 transition-all duration-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Hello Again!
              </h1>
              <p className="text-gray-500 mt-3 text-base leading-relaxed">
                Please log in to access DDoS traffic prediction features.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              {/* Email field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              {/* Reconnect & Recovery row */}
              <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={reconnect}
                    onChange={(e) => setReconnect(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 accent-indigo-600 transition"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 transition">
                    Reconnect Me
                  </span>
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
                >
                  Recovery Password
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="mt-4 w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-indigo-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                <span>Login</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </form>

            {/* Divider with 'or' */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 font-medium">or</span>
              </div>
            </div>

            {/* Google Sign In button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => console.log('Sign in with Google clicked')}
            >
              {/* Google SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account yet?
                <a
                  href="/signup"
                  className="font-semibold text-indigo-700 hover:text-indigo-900 hover:underline ml-1 transition"
                >
                  Sign Up
                </a>
              </p>
            </div>

            {/* Micro footer */}
            <p className="text-center text-xs text-gray-400 mt-5">
              Secure access • updated routing hub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;