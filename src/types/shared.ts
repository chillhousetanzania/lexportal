import type { UserRole } from './user';

export type ResourceType = 'report' | 'document' | 'template' | 'analysis';

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  createdBy: string;
  createdAt: Date;
  sharedWith: UserRole[];
  explicitShares: string[];
  fileUrl?: string;
}
