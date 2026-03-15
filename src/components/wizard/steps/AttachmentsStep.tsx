import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../ui';
import { Upload, File, X, AlertCircle, Check } from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface AttachmentsStepProps {
  data: any;
  updateData: (data: any) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
  data,
  updateData,
  isValid,
  setIsValid,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    data.attachments || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    // Attachments are optional, so always valid
    setIsValid(newErrors.length === 0);
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [attachments]);

  useEffect(() => {
    updateData({ attachments });
  }, [attachments]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return '.' + filename.split('.').pop()?.toLowerCase();
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} exceeds 10MB limit`;
    }

    // Check file type
    const extension = getFileExtension(file.name);
    if (!ALLOWED_TYPES.includes(extension)) {
      return `File ${file.name} is not an allowed type. Allowed: ${ALLOWED_TYPES.join(', ')}`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newErrors: string[] = [];
    const newAttachments: Attachment[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        const attachment: Attachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          status: 'pending',
        };
        newAttachments.push(attachment);
      }
    });

    setErrors(prev => [...prev, ...newErrors]);
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const simulateUpload = (attachment: Attachment) => {
    setAttachments(prev => prev.map(a => 
      a.id === attachment.id ? { ...a, status: 'uploading' as const } : a
    ));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setAttachments(prev => prev.map(a => 
          a.id === attachment.id ? { ...a, status: 'completed' as const, uploadProgress: 100 } : a
        ));
      } else {
        setAttachments(prev => prev.map(a => 
          a.id === attachment.id ? { ...a, uploadProgress: progress } : a
        ));
      }
    }, 200);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">Attachments</h2>
        <p className="text-sm text-slate-500">
          Upload supporting documents (PDF, DOC, DOCX, JPG, PNG - Max 10MB per file)
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-slate-300 hover:border-gold hover:bg-gold/5'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            'p-4 rounded-full transition-colors',
            isDragging ? 'bg-gold text-white' : 'bg-slate-100 text-slate-400'
          )}>
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium text-navy">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-navy">Uploaded Files</h3>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div>
                    <p className="font-medium text-navy">{attachment.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(attachment.size)}
                      {attachment.uploadProgress !== undefined && (
                        <span className="ml-2">
                          {attachment.status === 'completed' ? (
                            <span className="text-emerald-600">✓ Uploaded</span>
                          ) : (
                            <span className="text-amber-600">
                              {attachment.uploadProgress.toFixed(0)}%
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {attachment.status === 'pending' && (
                    <button
                      onClick={() => simulateUpload(attachment)}
                      className="px-3 py-1 text-sm bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
                    >
                      Upload
                    </button>
                  )}
                  {attachment.status === 'uploading' && (
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-300"
                        style={{ width: `${attachment.uploadProgress || 0}%` }}
                      />
                    </div>
                  )}
                  {attachment.status === 'completed' && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">File Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Maximum file size: 10MB per file</li>
          <li>• Allowed formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• Upload all relevant supporting documents</li>
        </ul>
      </div>
    </div>
  );
};
