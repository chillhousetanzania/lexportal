import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../ui';
import { 
  ShieldAlert, Lock, Key, User, Fingerprint, 
  CheckCircle2, Scale, AlertTriangle, Shield 
} from 'lucide-react';

const LoginHeader = () => (
  <div className="flex items-center justify-between w-full px-6 py-4 absolute top-0 left-0 z-10">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 gradient-gold rounded-xl flex items-center justify-center shadow-gold">
        <Scale className="w-5 h-5 text-navy-dark" />
      </div>
      <div>
        <h1 className="text-sm font-black text-white uppercase tracking-tighter leading-none">
          LexPortal
        </h1>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Legal Management System</span>
      </div>
    </div>
    <div className="flex items-center gap-2 text-slate-400 group cursor-default">
      <Lock className="w-3 h-3 transition-colors duration-300" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-gold transition-colors duration-300">Secure Access</span>
    </div>
  </div>
);

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await login({ username: formData.username, password: formData.password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Header Area */}
      <LoginHeader />

      <div className="w-full max-w-lg animate-slide-up">
        {/* Security Notice */}
        <div className="p-4 bg-white/5 backdrop-blur-md flex items-start gap-4 rounded-3xl border border-white/10 mb-6 animate-fade-in shadow-premium">
          <div className="mt-1 p-2 bg-gold/10 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-tight mb-1">Authorized Access Only</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              This system is restricted to authorized firm personnel. Unauthorized access is prohibited and subject to monitoring.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-dark rounded-[2.5rem] overflow-hidden shadow-premium-lg animate-scale-in delay-1 border border-white/5 relative">
          <div className="p-8 sm:p-12">
            {/* Logo/Icon Area */}
            <div className="text-center mb-10">
              <div className="h-20 w-20 gradient-gold rounded-[2rem] flex items-center justify-center shadow-gold mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500 relative">
                <Key className="w-10 h-10 text-navy-dark" />
                <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 rounded-xl border-4 border-navy flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">Secure Login</h2>
              <p className="text-[13px] text-slate-400 font-medium">Access your legal workspace</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 animate-shake">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:bg-white/10 transition-all duration-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 gradient-gold text-navy-dark font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-gold hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-4 h-4 border-2 border-navy-dark border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating</span>
                  </div>
                ) : (
                  'Enter Portal'
                )}
              </button>
            </form>

            {/* Security Footer */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Shield, text: 'AES-256' },
                  { icon: Lock, text: 'MFA Ready' },
                  { icon: Fingerprint, text: 'ISO Compliant' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <item.icon className="w-4 h-4 text-gold/40" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-8 glass-dark rounded-3xl p-6 border border-white/5 animate-slide-up delay-2">
          <h3 className="text-xs font-black text-slate-300 mb-5 text-center uppercase tracking-[0.15em]">Quick Access / Demo Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { role: 'Administrator', username: 'admin_tz', pass: 'admin123', color: 'bg-white/5 hover:bg-white/10' },
              { role: 'Senior Litigator', username: 'lit_musa', pass: 'lit123', color: 'bg-white/5 hover:bg-white/10' },
              { role: 'Financial Officer', username: 'acc_juma', pass: 'acc123', color: 'bg-white/5 hover:bg-white/10' },
              { role: 'Advisory Client', username: 'adv_kibo', pass: 'adv123', color: 'bg-white/5 hover:bg-white/10' },
            ].map(acct => (
              <button
                key={acct.role}
                type="button"
                onClick={() => setFormData({ username: acct.username, password: acct.pass })}
                className={`p-4 rounded-2xl border border-white/5 ${acct.color} transition-all duration-300 text-left group active:scale-[0.95]`}
              >
                <div className="text-[10px] font-black text-gold/80 uppercase tracking-wider mb-1">{acct.role}</div>
                <div className="font-bold text-white text-sm">{acct.username}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-[10px] text-slate-600 animate-fade-in delay-3 uppercase tracking-widest font-bold">
          <p>© 2024 LexPortal Legal Management. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="hover:text-gold transition-colors cursor-pointer">Security Policy</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span className="hover:text-gold transition-colors cursor-pointer">Legal Notice</span>
          </div>
        </div>
      </div>
    </div>
  );
};
