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
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  assignedLitigator: string;
  assignedClients: string[];
}
