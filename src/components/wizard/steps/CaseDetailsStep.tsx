import React, { useState, useEffect } from 'react';
import { Card } from '../../ui';
import { cn } from '../../ui';
import { AlertCircle } from 'lucide-react';

interface CaseDetailsStepProps {
  data: any;
  updateData: (data: any) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

const courtTypes = [
  { value: 'high-court', label: 'High Court' },
  { value: 'magistrate-court', label: 'Magistrate Court' },
  { value: 'district-court', label: 'District Court' },
  { value: 'supreme-court', label: 'Supreme Court' },
];

const highCourtNames = [
  { value: 'dar-es-salaam', label: 'Dar es Salaam' },
  { value: 'mwanza', label: 'Mwanza' },
  { value: 'arusha', label: 'Arusha' },
  { value: 'mbeya', label: 'Mbeya' },
];

const magistrateCourtNames = [
  { value: 'kinondoni', label: 'Kinondoni' },
  { value: 'ilala', label: 'Ilala' },
  { value: 'temeke', label: 'Temeke' },
  { value: 'ubungo', label: 'Ubungo' },
];

const caseTypes = [
  { value: 'civil', label: 'Civil Case' },
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'commercial', label: 'Commercial Case' },
  { value: 'family', label: 'Family Case' },
];

export const CaseDetailsStep: React.FC<CaseDetailsStepProps> = ({
  data,
  updateData,
  isValid,
  setIsValid,
}) => {
  const [formData, setFormData] = useState({
    caseTitle: data.caseTitle || '',
    caseType: data.caseType || '',
    courtType: data.courtType || '',
    courtName: data.courtName || '',
    caseDescription: data.caseDescription || '',
    urgencyLevel: data.urgencyLevel || 'normal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFilteredCourtNames = () => {
    switch (formData.courtType) {
      case 'high-court':
        return highCourtNames;
      case 'magistrate-court':
        return magistrateCourtNames;
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.caseTitle.trim()) {
      newErrors.caseTitle = 'Case title is required';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }

    if (!formData.courtType) {
      newErrors.courtType = 'Court type is required';
    }

    if (!formData.courtName) {
      newErrors.courtName = 'Court name is required';
    }

    if (!formData.caseDescription.trim()) {
      newErrors.caseDescription = 'Case description is required';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    updateData(formData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear court name when court type changes
    if (field === 'courtType') {
      setFormData(prev => ({ ...prev, courtName: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">Case Details</h2>
        <p className="text-sm text-slate-500">Provide the basic information about your case</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Case Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.caseTitle}
            onChange={(e) => handleInputChange('caseTitle', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
              errors.caseTitle ? 'border-red-500' : 'border-slate-200'
            )}
            placeholder="Enter case title"
          />
          {errors.caseTitle && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.caseTitle}
            </div>
          )}
        </div>

        {/* Case Type */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Case Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.caseType}
            onChange={(e) => handleInputChange('caseType', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
              errors.caseType ? 'border-red-500' : 'border-slate-200'
            )}
          >
            <option value="">Select case type</option>
            {caseTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.caseType && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.caseType}
            </div>
          )}
        </div>

        {/* Court Type */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Court Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.courtType}
            onChange={(e) => handleInputChange('courtType', e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
              errors.courtType ? 'border-red-500' : 'border-slate-200'
            )}
          >
            <option value="">Select court type</option>
            {courtTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.courtType && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.courtType}
            </div>
          )}
        </div>

        {/* Court Name */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Court Name <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.courtName}
            onChange={(e) => handleInputChange('courtName', e.target.value)}
            disabled={!formData.courtType}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all',
              errors.courtName ? 'border-red-500' : 'border-slate-200',
              !formData.courtType && 'bg-slate-50 cursor-not-allowed'
            )}
          >
            <option value="">Select court name</option>
            {getFilteredCourtNames().map(court => (
              <option key={court.value} value={court.value}>
                {court.label}
              </option>
            ))}
          </select>
          {errors.courtName && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.courtName}
            </div>
          )}
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Urgency Level
          </label>
          <div className="flex gap-3">
            {[
              { value: 'normal', label: 'Normal' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'emergency', label: 'Emergency' },
            ].map(level => (
              <label
                key={level.value}
                className={cn(
                  'flex-1 px-4 py-3 border-2 rounded-lg text-sm font-medium cursor-pointer transition-all text-center',
                  formData.urgencyLevel === level.value
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="urgencyLevel"
                  value={level.value}
                  checked={formData.urgencyLevel === level.value}
                  onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                  className="sr-only"
                />
                {level.label}
              </label>
            ))}
          </div>
        </div>

        {/* Case Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">
            Case Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.caseDescription}
            onChange={(e) => handleInputChange('caseDescription', e.target.value)}
            rows={6}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all resize-none',
              errors.caseDescription ? 'border-red-500' : 'border-slate-200'
            )}
            placeholder="Provide a detailed description of the case..."
          />
          {errors.caseDescription && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.caseDescription}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
