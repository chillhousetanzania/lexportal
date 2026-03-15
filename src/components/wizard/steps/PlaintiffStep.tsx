import React, { useState, useEffect } from 'react';
import { cn } from '../../ui';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface Plaintiff {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  type: 'individual' | 'organization';
}

interface PlaintiffStepProps {
  data: any;
  updateData: (data: any) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

export const PlaintiffStep: React.FC<PlaintiffStepProps> = ({
  data,
  updateData,
  isValid,
  setIsValid,
}) => {
  const [plaintiffs, setPlaintiffs] = useState<Plaintiff[]>(
    data.plaintiffs || [
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

    plaintiffs.forEach((plaintiff, index) => {
      const plaintiffErrors: Record<string, string> = {};

      if (!plaintiff.name.trim()) {
        plaintiffErrors.name = 'Name is required';
      }

      if (!plaintiff.email.trim()) {
        plaintiffErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(plaintiff.email)) {
        plaintiffErrors.email = 'Invalid email format';
      }

      if (!plaintiff.phone.trim()) {
        plaintiffErrors.phone = 'Phone number is required';
      }

      if (!plaintiff.address.trim()) {
        plaintiffErrors.address = 'Address is required';
      }

      if (!plaintiff.idNumber.trim()) {
        plaintiffErrors.idNumber = 'ID number is required';
      }

      if (Object.keys(plaintiffErrors).length > 0) {
        newErrors[index.toString()] = plaintiffErrors;
      }
    });

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  useEffect(() => {
    validateForm();
  }, [plaintiffs]);

  useEffect(() => {
    updateData({ plaintiffs });
  }, [plaintiffs]);

  const addPlaintiff = () => {
    const newPlaintiff: Plaintiff = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      address: '',
      idNumber: '',
      type: 'individual',
    };
    setPlaintiffs([...plaintiffs, newPlaintiff]);
  };

  const removePlaintiff = (id: string) => {
    if (plaintiffs.length > 1) {
      setPlaintiffs(plaintiffs.filter(p => p.id !== id));
    }
  };

  const updatePlaintiff = (id: string, field: keyof Plaintiff, value: string) => {
    setPlaintiffs(plaintiffs.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">Plaintiff Information</h2>
        <p className="text-sm text-slate-500">Add details for all plaintiffs in this case</p>
      </div>

      <div className="space-y-6">
        {plaintiffs.map((plaintiff, index) => (
          <div key={plaintiff.id} className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">
                Plaintiff {index + 1}
              </h3>
              {plaintiffs.length > 1 && (
                <button
                  onClick={() => removePlaintiff(plaintiff.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plaintiff Type */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Plaintiff Type
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
                        plaintiff.type === type.value
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <input
                        type="radio"
                        name={`plaintiff-type-${plaintiff.id}`}
                        value={type.value}
                        checked={plaintiff.type === type.value}
                        onChange={(e) => updatePlaintiff(plaintiff.id, 'type', e.target.value as 'individual' | 'organization')}
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
                  {plaintiff.type === 'organization' ? 'Organization Name' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plaintiff.name}
                  onChange={(e) => updatePlaintiff(plaintiff.id, 'name', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.name ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder={plaintiff.type === 'organization' ? 'Enter organization name' : 'Enter full name'}
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
                  value={plaintiff.email}
                  onChange={(e) => updatePlaintiff(plaintiff.id, 'email', e.target.value)}
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
                  value={plaintiff.phone}
                  onChange={(e) => updatePlaintiff(plaintiff.id, 'phone', e.target.value)}
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
                  {plaintiff.type === 'organization' ? 'Registration Number' : 'ID Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plaintiff.idNumber}
                  onChange={(e) => updatePlaintiff(plaintiff.id, 'idNumber', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
                    errors[index]?.idNumber ? 'border-red-500' : 'border-slate-200'
                  )}
                  placeholder={plaintiff.type === 'organization' ? 'Enter registration number' : 'Enter ID number'}
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
                  value={plaintiff.address}
                  onChange={(e) => updatePlaintiff(plaintiff.id, 'address', e.target.value)}
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

      {/* Add Another Plaintiff Button */}
      <button
        onClick={addPlaintiff}
        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Another Plaintiff
      </button>
    </div>
  );
};
