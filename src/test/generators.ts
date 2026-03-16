import fc from 'fast-check';
import type { UserRole, UserStatus, CaseStatus, TransactionType, ResourceType } from '../types';

// --- User Generators ---
export const userRoleArb = fc.constantFrom<UserRole>('admin', 'accountant', 'litigator', 'advisory');
export const userStatusArb = fc.constantFrom<UserStatus>('active', 'inactive', 'suspended');

export const userProfileArb = fc.record({
  id: fc.uuid(),
  username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
  email: fc.emailAddress(),
  name: fc.string({ minLength: 2, maxLength: 40 }).filter(s => s.trim().length >= 2),
  role: userRoleArb,
  status: userStatusArb,
  password: fc.string({ minLength: 6, maxLength: 20 }),
  canShareDocuments: fc.boolean(),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }),
  updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }),
});

// --- Case Generators ---
export const caseStatusArb = fc.constantFrom<CaseStatus>('filed', 'active', 'pending', 'closed', 'archived');

export const keyDateArb = fc.record({
  label: fc.string({ minLength: 3, maxLength: 30 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
});

export const caseUpdateArb = fc.record({
  id: fc.uuid(),
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
  author: fc.string({ minLength: 2, maxLength: 30 }),
  content: fc.string({ minLength: 5, maxLength: 200 }),
});

export const caseRecordArb = fc.record({
  id: fc.uuid(),
  caseNumber: fc.stringMatching(/^LEX-\d{4}-\d{3}$/),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5),
  description: fc.string({ minLength: 10, maxLength: 300 }),
  status: caseStatusArb,
  assignedLitigator: fc.uuid(),
  assignedClients: fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }),
  filedDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
  lastUpdated: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
  keyDates: fc.array(keyDateArb, { minLength: 0, maxLength: 3 }),
  updates: fc.array(caseUpdateArb, { minLength: 0, maxLength: 5 }),
});

// --- Financial Generators ---
export const transactionTypeArb = fc.constantFrom<TransactionType>('revenue', 'expense', 'refund', 'adjustment');

export const financialRecordArb = fc.record({
  id: fc.uuid(),
  transactionDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
  type: transactionTypeArb,
  category: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length >= 3),
  amount: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
  description: fc.string({ minLength: 5, maxLength: 200 }),
  createdBy: fc.uuid(),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
});

// --- Shared Resource Generators ---
export const resourceTypeArb = fc.constantFrom<ResourceType>('report', 'document', 'template', 'analysis');

export const sharedResourceArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 300 }),
  type: resourceTypeArb,
  createdBy: fc.uuid(),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-12-31') }),
  sharedWith: fc.array(userRoleArb, { minLength: 1, maxLength: 4 }),
  explicitShares: fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }),
});

// --- Credentials Generator ---
export const credentialsArb = fc.record({
  username: fc.string({ minLength: 3, maxLength: 20 }),
  password: fc.string({ minLength: 6, maxLength: 30 }),
});

// --- Session Generator ---
export const sessionArb = fc.record({
  token: fc.uuid(),
  expiry: fc.date({ min: new Date(), max: new Date(Date.now() + 86400000) }),
});
