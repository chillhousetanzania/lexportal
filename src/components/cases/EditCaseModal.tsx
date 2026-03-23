import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../ui';
import { useApp } from '../../context/AppContext';
import { X, Save } from 'lucide-react';
import type { CaseRecord } from '../../types';
import { PlaintiffStep } from '../wizard/steps/PlaintiffStep';
import { DefendantStep } from '../wizard/steps/DefendantStep';
import { AttachmentsStep } from '../wizard/steps/AttachmentsStep';

interface EditCaseModalProps {
  initialCase: CaseRecord;
  onSave: (updatedCase: CaseRecord) => void;
  onClose: () => void;
}

export const EditCaseModal: React.FC<EditCaseModalProps> = ({ initialCase, onSave, onClose }) => {
  const { users } = useApp();
  const litigators = users.filter(u => u.role === 'admin' || u.role === 'litigator');
  const clients = users.filter(u => u.role === 'advisory');

  const [title, setTitle] = useState(initialCase.title);
  const [description, setDescription] = useState(initialCase.description);
  const [assignedLitigator, setAssignedLitigator] = useState(initialCase.assignedLitigator);
  const [assignedClients, setAssignedClients] = useState<string[]>(initialCase.assignedClients);

  const [plaintiffsData, setPlaintiffsData] = useState({ plaintiffs: initialCase.plaintiffs || [] });
  const [defendantsData, setDefendantsData] = useState({ defendants: initialCase.defendants || [] });
  const [attachmentsData, setAttachmentsData] = useState({ attachments: initialCase.attachments || [] });

  const [isPlaintiffsValid, setIsPlaintiffsValid] = useState(true);
  const [isDefendantsValid, setIsDefendantsValid] = useState(true);
  const [isAttachmentsValid, setIsAttachmentsValid] = useState(true);

  const handleClientToggle = (clientId: string) => {
    setAssignedClients(prev => 
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  const handleSave = () => {
    if (!isPlaintiffsValid || !isDefendantsValid || !isAttachmentsValid) {
      alert("Please ensure all fields are valid before saving.");
      return;
    }
    
    onSave({
      ...initialCase,
      title,
      description,
      assignedLitigator,
      assignedClients,
      plaintiffs: plaintiffsData.plaintiffs,
      defendants: defendantsData.defendants,
      attachments: attachmentsData.attachments,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-4xl bg-white shadow-premium-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-navy uppercase tracking-tight">Edit Case: {initialCase.caseNumber}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight border-b-2 border-slate-100 pb-2">Basic Case Details</h3>
            <Input 
            label="Case Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-navy uppercase tracking-wider">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-gold focus:outline-none transition-colors resize-y min-h-[100px] text-sm text-navy"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          
          <Select
            label="Assigned Litigator"
            value={assignedLitigator}
            onChange={e => setAssignedLitigator(e.target.value)}
            options={[
              { value: '', label: 'Unassigned' },
              ...litigators.map(l => ({ value: l.id, label: l.name }))
            ]}
          />

          <div className="space-y-3">
            <label className="block text-xs font-bold text-navy uppercase tracking-wider">Assigned Clients</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clients.map(client => (
                <label key={client.id} className="flex items-center gap-3 p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-gold/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={assignedClients.includes(client.id)}
                    onChange={() => handleClientToggle(client.id)}
                    className="w-4 h-4 text-gold rounded border-slate-300 focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-navy">{client.name}</span>
                </label>
              ))}
            </div>
            {clients.length === 0 && <p className="text-xs text-slate-500 italic">No clients available.</p>}
          </div>
        </div>

          <div className="pt-6 border-t-2 border-slate-100">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4 border-b-2 border-slate-100 pb-2">Plaintiffs</h3>
            <PlaintiffStep 
              data={plaintiffsData} 
              updateData={setPlaintiffsData} 
              isValid={isPlaintiffsValid} 
              setIsValid={setIsPlaintiffsValid} 
            />
          </div>

          <div className="pt-6 border-t-2 border-slate-100">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4 border-b-2 border-slate-100 pb-2">Defendants</h3>
            <DefendantStep 
              data={defendantsData} 
              updateData={setDefendantsData} 
              isValid={isDefendantsValid} 
              setIsValid={setIsDefendantsValid} 
            />
          </div>

          <div className="pt-6 border-t-2 border-slate-100">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4 border-b-2 border-slate-100 pb-2">Attachments</h3>
            <AttachmentsStep 
              data={attachmentsData} 
              updateData={setAttachmentsData} 
              isValid={isAttachmentsValid} 
              setIsValid={setIsAttachmentsValid} 
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="accent" onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
