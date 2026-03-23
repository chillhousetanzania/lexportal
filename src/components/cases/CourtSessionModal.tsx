import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../ui';
import { X, Save, Plus, Trash2, Clock, Calendar as CalendarIcon, Scale } from 'lucide-react';
import type { CourtSessionRecord } from '../../types';

interface CourtSessionModalProps {
  onSave: (session: CourtSessionRecord) => void;
  onClose: () => void;
}

export const CourtSessionModal: React.FC<CourtSessionModalProps> = ({ onSave, onClose }) => {
  const [honorable, setHonorable] = useState('');
  const [courtClerk, setCourtClerk] = useState('');
  const [clientRole, setClientRole] = useState('Applicant');
  const [respondents, setRespondents] = useState<string[]>(['']);
  const [note, setNote] = useState('');
  const [order, setOrder] = useState('');
  
  // Format current date and time for initial values
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  const [tarehe, setTarehe] = useState(defaultDate);
  const [muda, setMuda] = useState(defaultTime);

  const roleOptions = [
    { value: 'Applicant', label: 'Applicant' },
    { value: 'Claimant', label: 'Claimant' },
    { value: 'Plaintiff', label: 'Plaintiff' },
    { value: 'Accused', label: 'Accused' },
    { value: 'Decree Holder', label: 'Decree Holder' },
  ];

  const handleAddRespondent = () => {
    setRespondents(prev => [...prev, '']);
  };

  const handleRemoveRespondent = (index: number) => {
    setRespondents(prev => prev.filter((_, i) => i !== index));
  };

  const handleRespondentChange = (index: number, value: string) => {
    const newRespondents = [...respondents];
    newRespondents[index] = value;
    setRespondents(newRespondents);
  };

  const handleSave = () => {
    const newSession: CourtSessionRecord = {
      id: 'session_' + Date.now(),
      honorable,
      courtClerk,
      clientRole,
      respondents: respondents.filter(r => r.trim() !== ''),
      note,
      order,
      tarehe,
      muda,
      createdAt: new Date(),
    };
    onSave(newSession);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-4xl bg-white shadow-premium-lg flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-navy uppercase tracking-tight">Court Session Record</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Record real-time hearing notes and orders</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-navy hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-white">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <Input 
              label="Honorable (Judge/Magistrate)" 
              placeholder="e.g. Hon. Justice Smith"
              value={honorable} 
              onChange={e => setHonorable(e.target.value)} 
            />
            <Input 
              label="Court Clerk" 
              placeholder="Clerk Name"
              value={courtClerk} 
              onChange={e => setCourtClerk(e.target.value)} 
            />
            <Select
              label="Party Role"
              value={clientRole}
              onChange={e => setClientRole(e.target.value)}
              options={roleOptions}
            />
          </div>

          {/* Respondents / Judgement Debtors */}
          <div className="space-y-3 p-5 border-2 border-slate-100 rounded-2xl">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
              <label className="text-sm font-black text-navy uppercase tracking-tight">Respondent / Judgement Debtor</label>
            </div>
            {respondents.map((resp, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter name..."
                    value={resp}
                    onChange={e => handleRespondentChange(index, e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1 mt-6">
                  {index === respondents.length - 1 && (
                    <Button variant="outline" onClick={handleAddRespondent} className="p-2 h-11 w-11 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 border-emerald-200">
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {respondents.length > 1 && (
                    <Button variant="outline" onClick={() => handleRemoveRespondent(index)} className="p-2 h-11 w-11 flex items-center justify-center text-red-500 hover:bg-red-50 border-red-200">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes Area */}
          <div className="space-y-2">
            <label className="text-sm font-black text-navy uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Note
            </label>
            <textarea
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-y min-h-[200px] text-sm text-navy shadow-inner"
              placeholder="Begin typing court proceedings..."
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ lineHeight: '1.6' }}
            />
          </div>

          {/* Orders Area */}
          <div className="space-y-2">
            <label className="text-sm font-black text-navy uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Order
            </label>
            <textarea
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white focus:outline-none transition-all resize-y min-h-[120px] text-sm text-navy shadow-inner"
              placeholder="Record the judge's orders..."
              value={order}
              onChange={e => setOrder(e.target.value)}
            />
          </div>

          {/* Timestamp Footer */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" /> Tarehe (Date)
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-gold focus:outline-none text-sm text-navy font-semibold"
                value={tarehe}
                onChange={e => setTarehe(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Muda (Time)
              </label>
              <input
                type="time"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-gold focus:outline-none text-sm text-navy font-semibold"
                value={muda}
                onChange={e => setMuda(e.target.value)}
              />
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50 rounded-b-3xl">
          <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
          <Button variant="accent" onClick={handleSave} className="flex items-center gap-2 px-8">
            <Save className="w-4 h-4" /> Save Record
          </Button>
        </div>
      </Card>
    </div>
  );
};
