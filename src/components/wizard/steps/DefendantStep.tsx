import React, { useState, useEffect } from 'react';
import { cn } from '../../ui';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface Defendant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  type: 'individual' | 'organization';
}

interface DefendantStepProps {
  data: any;
  updateData: (data: any) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

export const DefendantStep: React.FC<DefendantStepProps> = ({
  data,
  updateData,
  isValid,
  setIsValid,
}) => {
  const [defendants, setDefendants] = useState<Defendant[]>(
    data.defendants || [
      {
        id: Date.now().toString(),
        name: '',
        email: '',
        phone: '',
        address: '',
        idNumber: '',
        type: 'individual',
      },
    ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};

    defendants.forEach((defendant, index) => {
      const defendantErrors: Record<string, string> = {};

      if (!defendant.name.trim()) {
        defendantErrors.name = 'Name is required';
      }

      if (!defendant.email.trim()) {
        defendantErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(defendant.email)) {
        defendantErrors.email = 'Invalid email format';
      }

      if (!defendant.phone.trim()) {
        defendantErrors.phone = 'Phone number is required';
      }

      if (!defendant.address.trim()) {
        defendantErrors.address = 'Address is required';
      }

      if (!defendant.idNumber.trim()) {
        defendantErrors.idNumber = 'ID number is required';
      }

      if (Object.keys(defendantErrors).length > 0) {
        newErrors[index.toString()] = defendantErrors;
      }
    });

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  useEffect(() => {
    validateForm();
  }, [defendants]);

  useEffect(() => {
    updateData({ defendants });
  }, [defendants]);

  const addDefendant = () => {
    const newDefendant: Defendant = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      address: '',
      idNumber: '',
      type: 'individual',
    };
    setDefendants([...defendants, newDefendant]);
  };

  const removeDefendant = (id: string) => {
    if (defendants.length > 1) {
      setDefendants(defendants.filter(d => d.id !== id));
    }
  };

  const updateDefendant = (id: string, field: keyof Defendant, value: string) => {
    setDefendants(defendants.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">Defendant Information</h2>
        <p className="text-sm text-slate-500">Add details for all defendants in this case</p>
      </div>

      <div className="space-y-6">
        {defendants.map((defendant, index) => (
          <div key={defendant.id} className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">
                Defendant {index + 1}
              </h3>
              {defendants.length > 1 && (
                <button
                  onClick={() => removeDefendant(defendant.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Defendant Type */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Defendant Type
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'individual', label: 'Individual' },
                    { value: 'organization', label: 'Organization' },
                  ].map(type => (
                    <label
                      key={type.value}
                      className={cn(
                        'flex-1 px-4 py-2 border-2 rounded-lg text-sm font-medium cursor-pointer transition-all text-center',
                        defendant.type === type.value
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <input
                        type="radio"
                        name={`defendant-type-${defendant.id}`}
                        value={type.value}
                        checked={defendant.type === type.value}
                        onChange={(e) => updateDefendant(defendant.id, 'type', e.target.value as 'individual' | 'organization')}
                        className="sr-only"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  {defendant.type === 'organization' ? 'Organization Name' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={defendant.name}
                  onChange={(e) => updateDefendant(defendant.id, 'name', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.name ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder={defendant.type === 'organization' ? 'Enter organization name' : 'Enter full name'}
                />
                {errors[index]?.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors[index].name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={defendant.email}
                  onChange={(e) => updateDefendant(defendant.id, 'email', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.email ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder="Enter email address"
                />
                {errors[index]?.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors[index].email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={defendant.phone}
                  onChange={(e) => updateDefendant(defendant.id, 'phone', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.phone ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder="Enter phone number"
                />
                {errors[index]?.phone && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors[index].phone}
                  </div>
                )}
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  {defendant.type === 'organization' ? 'Registration Number' : 'ID Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={defendant.idNumber}
                  onChange={(e) => updateDefendant(defendant.id, 'idNumber', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.idNumber ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder={defendant.type === 'organization' ? 'Enter registration number' : 'Enter ID number'}
                />
                {errors[index]?.idNumber && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors[index].idNumber}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={defendant.address}
                  onChange={(e) => updateDefendant(defendant.id, 'address', e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all resize-none',
                    errors[index]?.address ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder="Enter full address"
                />
                {errors[index]?.address && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors[index].address}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Another Defendant Button */}
      <button
        onClick={addDefendant}
        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Another Defendant
      </button>
    </div>
  );
};
