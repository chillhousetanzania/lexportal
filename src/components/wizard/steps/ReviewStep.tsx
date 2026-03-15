import React, { useEffect } from 'react';
import { Card, Button } from '../../ui';
import { cn } from '../../ui';
import { 
  FileText, Users, User, Paperclip, Check, AlertCircle, Edit,
  MapPin, Phone, Mail, Calendar, Building
} from 'lucide-react';

interface ReviewStepProps {
  data: any;
  updateData: (data: any) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  updateData,
  isValid,
  setIsValid,
}) => {
  useEffect(() => {
    // Review step is always valid as it's just for review
    setIsValid(true);
  }, []);

  const caseDetails = data['case-details'] || {};
  const plaintiffs = data.plaintiffs?.plaintiffs || [];
  const defendants = data.defendants?.defendants || [];
  const attachments = data.attachments?.attachments || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-amber-600 bg-amber-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">Review & Submit</h2>
        <p className="text-sm text-slate-500">
          Please review all information before submitting your case
        </p>
      </div>

      {/* Case Details Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">Case Details</h3>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Case Title</p>
            <p className="font-medium text-navy">{caseDetails.caseTitle}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Case Type</p>
            <p className="font-medium text-navy capitalize">{caseDetails.caseType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Court Type</p>
            <p className="font-medium text-navy capitalize">{caseDetails.courtType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Court Name</p>
            <p className="font-medium text-navy capitalize">{caseDetails.courtName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Urgency Level</p>
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getUrgencyColor(caseDetails.urgencyLevel)
            )}>
              {caseDetails.urgencyLevel?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Submission Date</p>
            <p className="font-medium text-navy">{formatDate(new Date())}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-slate-500 mb-2">Case Description</p>
            <p className="text-navy bg-slate-50 p-3 rounded-lg text-sm">
              {caseDetails.caseDescription}
            </p>
          </div>
        </div>
      </Card>

      {/* Plaintiffs Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">
              Plaintiffs ({plaintiffs.length})
            </h3>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="space-y-3">
          {plaintiffs.map((plaintiff: any, index: number) => (
            <div key={plaintiff.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-navy">
                  Plaintiff {index + 1}
                  {plaintiff.type === 'organization' && (
                    <Building className="w-4 h-4 ml-2 text-slate-400" />
                  )}
                </h4>
                <span className="text-sm text-slate-500 capitalize">{plaintiff.type}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{plaintiff.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{plaintiff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{plaintiff.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{plaintiff.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Defendants Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">
              Defendants ({defendants.length})
            </h3>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="space-y-3">
          {defendants.map((defendant: any, index: number) => (
            <div key={defendant.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-navy">
                  Defendant {index + 1}
                  {defendant.type === 'organization' && (
                    <Building className="w-4 h-4 ml-2 text-slate-400" />
                  )}
                </h4>
                <span className="text-sm text-slate-500 capitalize">{defendant.type}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{defendant.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{defendant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{defendant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-navy">{defendant.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Attachments Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">
              Attachments ({attachments.length})
            </h3>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment: any) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {attachment.type.includes('pdf') ? '📄' : 
                     attachment.type.includes('word') ? '📝' : 
                     attachment.type.includes('image') ? '🖼️' : '📎'}
                  </div>
                  <div>
                    <p className="font-medium text-navy text-sm">{attachment.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {attachment.status === 'completed' && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Uploaded</span>
                    </div>
                  )}
                  {attachment.status === 'pending' && (
                    <span className="text-xs text-amber-600">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No attachments uploaded</p>
          </div>
        )}
      </Card>

      {/* Final Confirmation */}
      <Card className="p-6 border-gold bg-gold/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gold mt-0.5" />
          <div>
            <h4 className="font-semibold text-navy mb-2">Submission Confirmation</h4>
            <p className="text-sm text-slate-600 mb-3">
              By submitting this case, you confirm that all information provided is accurate and complete. 
              You will receive a confirmation email with your case number and next steps.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>I have reviewed all information and confirm its accuracy</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
