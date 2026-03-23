export type CaseStatus = 'filed' | 'active' | 'pending' | 'closed' | 'archived';

export interface KeyDate {
  label: string;
  date: Date;
  description?: string;
}

export interface CaseUpdate {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
}

export interface PersonEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  type: 'individual' | 'organization';
}

export interface CaseAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface CourtSessionRecord {
  id: string;
  honorable: string;
  courtClerk: string;
  clientRole: string;
  respondents: string[];
  note: string;
  order: string;
  tarehe: string;
  muda: string;
  createdAt: Date;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  assignedLitigator: string;
  assignedClients: string[];
  filedDate: Date;
  lastUpdated: Date;
  keyDates: KeyDate[];
  updates: CaseUpdate[];
  plaintiffs?: PersonEntity[];
  defendants?: PersonEntity[];
  attachments?: CaseAttachment[];
  courtSessions?: CourtSessionRecord[];
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  assignedLitigator: string;
  assignedClients: string[];
}
