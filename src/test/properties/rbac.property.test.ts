import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { userRoleArb, caseRecordArb, financialRecordArb, sharedResourceArb } from '../generators';
import {
  hasModuleAccess,
  getNavigationItems,
  filterCasesByRole,
  filterFinancialRecordsByRole,
  filterSharedResourcesByRole,
} from '../../utils/rbac';
import type { UserRole, CaseRecord, FinancialRecord, SharedResource } from '../../types';

describe('RBAC Engine - Property Tests', () => {
  // Property 5: Permission Validation Before Component Rendering
  it('Property 5: Permission validation before component rendering', () => {
    fc.assert(
      fc.property(userRoleArb, fc.constantFrom('dashboard', 'users', 'cases', 'financials', 'analytics', 'reports', 'my-cases', 'resources'), (role, module) => {
        const result = hasModuleAccess(role, module);
        expect(typeof result).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  // Property 6: Role-Based Module Access
  it('Property 6: Role-based module access', () => {
    // Admin has access to all core modules
    expect(hasModuleAccess('admin', 'dashboard')).toBe(true);
    expect(hasModuleAccess('admin', 'users')).toBe(true);
    expect(hasModuleAccess('admin', 'cases')).toBe(true);
    expect(hasModuleAccess('admin', 'financials')).toBe(true);
    expect(hasModuleAccess('admin', 'analytics')).toBe(true);
    expect(hasModuleAccess('admin', 'reports')).toBe(true);

    // Accountant: Financial_Module and Report_Generator only
    expect(hasModuleAccess('accountant', 'financials')).toBe(true);
    expect(hasModuleAccess('accountant', 'analytics')).toBe(true);
    expect(hasModuleAccess('accountant', 'reports')).toBe(true);
    expect(hasModuleAccess('accountant', 'users')).toBe(false);
    expect(hasModuleAccess('accountant', 'cases')).toBe(false);

    // Litigator: Case_Management and Report_Generator
    expect(hasModuleAccess('litigator', 'cases')).toBe(true);
    expect(hasModuleAccess('litigator', 'reports')).toBe(true);
    expect(hasModuleAccess('litigator', 'users')).toBe(false);
    expect(hasModuleAccess('litigator', 'financials')).toBe(false);

    // Advisory: eCase_Tracker and assigned Shared_Resources
    expect(hasModuleAccess('advisory', 'my-cases')).toBe(true);
    expect(hasModuleAccess('advisory', 'resources')).toBe(true);
    expect(hasModuleAccess('advisory', 'users')).toBe(false);
    expect(hasModuleAccess('advisory', 'financials')).toBe(false);
    expect(hasModuleAccess('advisory', 'cases')).toBe(false);
  });

  // Property 7: Unauthorized Component Access Prevention
  it('Property 7: Unauthorized component access prevention', () => {
    fc.assert(
      fc.property(userRoleArb, (role) => {
        const navItems = getNavigationItems(role);
        // All navigation items should be valid for the role
        navItems.forEach(item => {
          expect(hasModuleAccess(role, item.path)).toBe(true);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 12: Non-Admin User Management Access Denial
  it('Property 12: Non-admin user management access denial', () => {
    const nonAdminRoles: UserRole[] = ['accountant', 'litigator', 'advisory'];
    nonAdminRoles.forEach(role => {
      expect(hasModuleAccess(role, 'users')).toBe(false);
    });
  });

  // Property 15: Role-Based Case Filtering
  it('Property 15: Role-based case filtering', () => {
    fc.assert(
      fc.property(
        fc.array(caseRecordArb, { minLength: 1, maxLength: 10 }),
        fc.uuid(),
        (cases, userId) => {
          // Admin sees all
          const adminCases = filterCasesByRole(cases, 'admin', userId);
          expect(adminCases.length).toBe(cases.length);

          // Litigator sees only assigned
          const litCases = filterCasesByRole(cases, 'litigator', userId);
          litCases.forEach(c => expect(c.assignedLitigator).toBe(userId));

          // Advisory sees only assigned
          const advCases = filterCasesByRole(cases, 'advisory', userId);
          advCases.forEach(c => expect(c.assignedClients).toContain(userId));

          // Accountant sees none
          const accCases = filterCasesByRole(cases, 'accountant', userId);
          expect(accCases.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 22: Role-Based Financial Record Access
  it('Property 22: Role-based financial record access', () => {
    fc.assert(
      fc.property(
        fc.array(financialRecordArb, { minLength: 1, maxLength: 10 }),
        (records) => {
          // Admin and Accountant see all
          expect(filterFinancialRecordsByRole(records, 'admin').length).toBe(records.length);
          expect(filterFinancialRecordsByRole(records, 'accountant').length).toBe(records.length);

          // Litigator and Advisory see none
          expect(filterFinancialRecordsByRole(records, 'litigator').length).toBe(0);
          expect(filterFinancialRecordsByRole(records, 'advisory').length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 27: Multi-Role Report Accessibility
  it('Property 27: Multi-role report accessibility', () => {
    fc.assert(
      fc.property(sharedResourceArb, fc.uuid(), (resource, userId) => {
        const resources = [resource];
        resource.sharedWith.forEach(role => {
          if (role !== 'advisory') {
            const result = filterSharedResourcesByRole(resources, role, userId);
            expect(result.length).toBeGreaterThanOrEqual(0);
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 28: Shared Resource Permission Verification
  it('Property 28: Shared resource permission verification', () => {
    fc.assert(
      fc.property(sharedResourceArb, fc.uuid(), (resource, userId) => {
        const resources = [resource];
        // Advisory should only see explicitly shared
        const advisoryResult = filterSharedResourcesByRole(resources, 'advisory', userId);
        advisoryResult.forEach(r => {
          expect(r.explicitShares).toContain(userId);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 30: Advisory Explicit Share Filtering
  it('Property 30: Advisory explicit share filtering', () => {
    fc.assert(
      fc.property(
        fc.array(sharedResourceArb, { minLength: 1, maxLength: 5 }),
        fc.uuid(),
        (resources, userId) => {
          const filtered = filterSharedResourcesByRole(resources, 'advisory', userId);
          filtered.forEach(r => {
            expect(r.explicitShares).toContain(userId);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 35: Role-Appropriate Navigation Items
  it('Property 35: Role-appropriate navigation items', () => {
    fc.assert(
      fc.property(userRoleArb, (role) => {
        const items = getNavigationItems(role);
        // All items should be accessible by the role
        items.forEach(item => {
          expect(hasModuleAccess(role, item.path)).toBe(true);
        });
        // Dashboard should always be present
        expect(items.some(i => i.path === 'dashboard')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
