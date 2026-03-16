import type { UserRole, CaseRecord, FinancialRecord, SharedResource } from '../types';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const roleModuleAccess: Record<UserRole, string[]> = {
  admin: ['dashboard', 'users', 'cases', 'financials', 'analytics', 'reports'],
  accountant: ['dashboard', 'financials', 'analytics', 'reports'],
  litigator: ['dashboard', 'cases', 'reports'],
  advisory: ['dashboard', 'my-cases', 'resources'],
};

export const hasModuleAccess = (role: UserRole, module: string): boolean => {
  return roleModuleAccess[role]?.includes(module) ?? false;
};

export const getNavigationItems = (role: UserRole): NavItem[] => {
  const baseItems: NavItem[] = [
    { path: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  ];

  const roleItems: Record<UserRole, NavItem[]> = {
    admin: [
      { path: 'users', label: 'User Management', icon: 'Users' },
      { path: 'cases', label: 'Case Management', icon: 'Briefcase' },
      { path: 'financials', label: 'Financial Records', icon: 'Banknote' },
      { path: 'analytics', label: 'Analytics', icon: 'BarChart3' },
      { path: 'reports', label: 'Shared Reports', icon: 'FileText' },
    ],
    accountant: [
      { path: 'financials', label: 'Financial Records', icon: 'Banknote' },
      { path: 'analytics', label: 'Analytics', icon: 'BarChart3' },
      { path: 'reports', label: 'Shared Reports', icon: 'FileText' },
    ],
    litigator: [
      { path: 'cases', label: 'Case Management', icon: 'Briefcase' },
      { path: 'reports', label: 'Shared Reports', icon: 'FileText' },
    ],
    advisory: [
      { path: 'my-cases', label: 'My Cases', icon: 'Briefcase' },
      { path: 'resources', label: 'Resources', icon: 'FileText' },
    ],
  };

  return [...baseItems, ...(roleItems[role] || [])];
};

export const filterCasesByRole = (
  cases: CaseRecord[],
  role: UserRole,
  userId: string
): CaseRecord[] => {
  switch (role) {
    case 'admin':
      return cases;
    case 'litigator':
      return cases.filter(c => c.assignedLitigator === userId);
    case 'advisory':
      return cases.filter(c => c.assignedClients.includes(userId));
    default:
      return [];
  }
};

export const filterFinancialRecordsByRole = (
  records: FinancialRecord[],
  role: UserRole
): FinancialRecord[] => {
  if (role === 'admin' || role === 'accountant') {
    return records;
  }
  return [];
};

export const filterSharedResourcesByRole = (
  resources: SharedResource[],
  role: UserRole,
  userId: string
): SharedResource[] => {
  if (role === 'admin' || role === 'accountant' || role === 'litigator') {
    return resources.filter(r => r.sharedWith.includes(role));
  }
  if (role === 'advisory') {
    return resources.filter(r => r.explicitShares.includes(userId));
  }
  return [];
};

export const getAllowedRolesForModule = (module: string): UserRole[] => {
  const roles: UserRole[] = ['admin', 'accountant', 'litigator', 'advisory'];
  return roles.filter(role => hasModuleAccess(role, module));
};
