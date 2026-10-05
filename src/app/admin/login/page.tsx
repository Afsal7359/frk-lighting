'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('frk_admin_auth', 'true');
          localStorage.setItem('frk_admin_email', data.email);
        }
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid email address or password.');
      }
    } catch (err: any) {
      // Fallback verification for client offline
      const expectedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@frklighting.com';
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

      if (email.trim().toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('frk_admin_auth', 'true');
          localStorage.setItem('frk_admin_email', expectedEmail);
        }
        router.push('/admin');
      } else {
        setError('Authentication error. Please check your credentials in .env.local');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#f6f4ee]">
      <div className="w-full max-w-md bg-white border border-[#e4e2da] rounded-xl p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#E4B241]/20 text-[#9a6f0c] border border-[#E4B241] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#1f2220]">FRK Admin Portal</h1>
          <p className="text-xs text-[#5b605b]">
            Protected Login. Enter your authorized admin email & password from <code className="font-mono text-[#9a6f0c]">.env.local</code>.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Admin Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. admin@frklighting.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#c9c7bd] rounded-md pl-9 pr-3.5 py-2.5 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
              />
              <Mail className="w-4 h-4 text-[#5b605b] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Admin Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#c9c7bd] rounded-md pl-9 pr-3.5 py-2.5 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
              />
              <Lock className="w-4 h-4 text-[#5b605b] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold py-2.5 rounded-md text-sm cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
          >
            {loading ? 'Authenticating...' : 'Secure Admin Login'}
          </button>
        </form>

        <div className="bg-[#f6f4ee] p-3.5 rounded-lg border border-[#e4e2da] text-xs text-[#5b605b] space-y-1">
          <span className="font-semibold text-[#1f2220] block">Default Admin Credentials (.env.local):</span>
          <p>Email: <code className="text-[#9a6f0c] font-mono">admin@frklighting.com</code></p>
          <p>Password: <code className="text-[#9a6f0c] font-mono">admin</code></p>
        </div>
      </div>
    </div>
  );
}
