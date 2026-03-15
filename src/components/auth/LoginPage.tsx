import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../ui';
import { Shield, AlertTriangle, Lock, Key, User, Fingerprint } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern">
      {/* Government Header Bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 gradient-gold rounded-xl flex items-center justify-center shadow-gold animate-pulse-glow">
                  <Shield className="w-6 h-6 text-navy-dark" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">Judicial Management System</h1>
                  <p className="text-[11px] text-slate-400 font-medium tracking-wider">OFFICIAL GOVERNMENT PORTAL — REPUBLIC OF TANZANIA</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider uppercase">Secure Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-12">
        <div className="w-full max-w-lg animate-slide-up">
          {/* Security Notice */}
          <div className="glass-dark rounded-2xl p-4 mb-6 animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300">Authorized Personnel Only</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This system is restricted to authorized users for official government business.
                  Unauthorized access is prohibited and subject to prosecution under Tanzanian law.
                </p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="glass-dark rounded-3xl overflow-hidden shadow-premium-lg animate-scale-in delay-1">
            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-5 relative">
                  <div className="w-20 h-20 gradient-gold rounded-2xl flex items-center justify-center shadow-gold animate-pulse-glow">
                    <Key className="w-9 h-9 text-navy-dark" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-navy">
                    <Fingerprint className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Secure Login</h2>
                <p className="text-sm text-slate-400">
                  Enter your government credentials to access the system
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 animate-scale-in">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-0.5">
                    <User className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Government Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@justice.gov.tz"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl outline-none transition-all duration-300 font-medium text-white text-sm placeholder:text-slate-500 hover:border-white/20 focus:border-gold/60 focus:ring-2 focus:ring-gold/10 focus:bg-white/[0.07]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-0.5">
                    <Lock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your secure password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl outline-none transition-all duration-300 font-medium text-white text-sm placeholder:text-slate-500 hover:border-white/20 focus:border-gold/60 focus:ring-2 focus:ring-gold/10 focus:bg-white/[0.07]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 gradient-gold text-navy-dark font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-gold hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-navy-dark border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    'Access System'
                  )}
                </button>
              </form>

              {/* Security Footer */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-center space-x-8 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-3 h-3 text-gold/60" />
                    <span>AES-256 Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 text-gold/60" />
                    <span>Multi-Factor Auth</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Fingerprint className="w-3 h-3 text-gold/60" />
                    <span>Biometric Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Access */}
          <div className="mt-6 glass-dark rounded-2xl p-6 animate-slide-up delay-2">
            <h3 className="text-sm font-bold text-white/80 mb-4 text-center tracking-tight">Demo Access Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { role: 'System Administrator', email: 'admin@justice.gov.tz', pass: 'admin123', color: 'from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-400/40', iconColor: 'text-red-400' },
                { role: 'Senior Litigator', email: 'litigator@justice.gov.tz', pass: 'lit123', color: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-400/40', iconColor: 'text-blue-400' },
                { role: 'Financial Officer', email: 'accountant@justice.gov.tz', pass: 'acc123', color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/40', iconColor: 'text-emerald-400' },
                { role: 'Legal Counsel', email: 'counsel@justice.gov.tz', pass: 'client123', color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-400/40', iconColor: 'text-purple-400' },
              ].map(acct => (
                <button
                  key={acct.role}
                  type="button"
                  onClick={() => setFormData({ email: acct.email, password: acct.pass })}
                  className={`p-4 rounded-xl border bg-gradient-to-br ${acct.color} hover:shadow-lg transition-all duration-300 text-left group active:scale-[0.98]`}
                >
                  <div className="font-bold text-white/90 text-sm group-hover:text-white transition-colors">{acct.role}</div>
                  <div className="text-[11px] text-slate-400 mt-1.5 font-medium">{acct.email}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Pass: {acct.pass}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-[11px] text-slate-600 animate-fade-in delay-3">
            <p className="font-medium">© 2024 Judicial Management System — Republic of Tanzania. All rights reserved.</p>
            <p className="mt-1.5 text-slate-500">For technical support: support@justice.gov.tz | +255 22 211 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};
