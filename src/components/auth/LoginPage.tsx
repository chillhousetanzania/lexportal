import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../ui';

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
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-none shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 bg-navy text-gold rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg border border-gold/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h1 className="text-3xl font-black text-navy tracking-tighter uppercase">LexPortal</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Enterprise Legal Suite
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold mb-6 text-center bg-red-50 p-3 rounded-lg border border-red-100 uppercase tracking-widest">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Secure Email"
            type="email"
            required
            placeholder="counsel@lexportal.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Access Token"
            type="password"
            required
            placeholder="Enter password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit" className="w-full py-4 text-sm" variant="accent" disabled={loading}>
            {loading ? 'Authorizing...' : 'Authorize Access'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Protected by AES-256 Encryption
          </p>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {[
              { role: 'Admin', email: 'admin@lex.com', pass: 'admin123' },
              { role: 'Accountant', email: 'accountant@lex.com', pass: 'acc123' },
              { role: 'Litigator', email: 'litigator@lex.com', pass: 'lit123' },
              { role: 'Advisory', email: 'client@lex.com', pass: 'client123' },
            ].map(acct => (
              <button
                key={acct.role}
                type="button"
                onClick={() => setFormData({ email: acct.email, password: acct.pass })}
                className="p-2 rounded-lg border border-slate-200 hover:border-gold hover:bg-gold/5 transition-all text-left"
              >
                <span className="font-black text-navy block">{acct.role}</span>
                <span className="text-slate-400">{acct.email}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
