"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupClient } from '@/app/api/client/auth';


const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupClient({
        username,
        email,
        password,
      });

      if (response.status === 'success') {
        router.push('/');
      } else {

        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please check your information.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f6f9fc] to-[#eef2f8] font-sans antialiased">

      <div className="md:w-1/2 w-full min-h-[280px] md:min-h-screen bg-gray-900 relative">
        <img
          src="/system-logo.png"
          alt="DDoS cyber attack visualization"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.02)] border border-gray-100/80 transition-all duration-200 overflow-hidden">
            <div className="p-6 md:p-8">

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  Create Account
                </h1>
                <p className="text-gray-500 mt-3 text-base leading-relaxed">
                  Join us to access DDoS traffic prediction features.
                </p>
              </div>


              <form onSubmit={handleSubmit} className="space-y-5 mt-6">

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                    {error}
                  </div>
                )}
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="johndoe"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-800 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 w-full flex justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400 font-medium">or continue with</span>
                </div>
              </div>

              <div className="space-y-3">
  
                <button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/accounts/google/login/`}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/accounts/github/login/`}
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.11-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.21 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                  </svg>
                  <span>Sign in with GitHub</span>
                </button>
              </div> */}
                          

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?
                  <a href="/" className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline ml-1 transition">
                    Sign In
                  </a>
                </p>
              </div>
              <p className="text-center text-xs text-gray-400 mt-5">
                Secure signup • protect your network
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;