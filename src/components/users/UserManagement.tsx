import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, Button, Badge, Input, Select, cn } from '../ui';
import { PageHeader, AccessDenied, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { UserProfile, UserRole, UserStatus } from '../../types';
import { UserPlus, Edit2, UserX, Search, Users } from 'lucide-react';

const statusBadgeVariant = (status: UserStatus) => {
  const map: Record<UserStatus, 'success' | 'error' | 'warning'> = {
    active: 'success',
    inactive: 'error',
    suspended: 'warning',
  };
  return map[status];
};

const roleBadgeVariant = (role: UserRole) => {
  const map: Record<UserRole, 'info' | 'success' | 'warning' | 'default'> = {
    admin: 'info',
    accountant: 'success',
    litigator: 'warning',
    advisory: 'default',
  };
  return map[role];
};

const roleColors: Record<UserRole, string> = {
  admin: 'from-red-400 to-red-500',
  accountant: 'from-emerald-400 to-emerald-500',
  litigator: 'from-blue-400 to-blue-500',
  advisory: 'from-purple-400 to-purple-500',
};

const UserForm: React.FC<{
  onSubmit: (data: { name: string; email: string; username: string; password: string; role: UserRole }) => void;
  onCancel: () => void;
  initial?: Partial<UserProfile>;
  mode: 'create' | 'edit';
}> = ({ onSubmit, onCancel, initial, mode }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    username: initial?.username || '',
    password: '',
    role: initial?.role || ('litigator' as UserRole),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card className="p-8 animate-scale-in">
      <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Full Name" required placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Username" required placeholder="johndoe" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <Input label="Email" type="email" required placeholder="john@justice.gov.tz" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {mode === 'create' && (
            <Input label="Password" type="password" required placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          )}
          <Select label="Role" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })} options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'accountant', label: 'Accountant' },
            { value: 'litigator', label: 'Litigator' },
            { value: 'advisory', label: 'Advisory Client' },
          ]} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="accent">{mode === 'create' ? 'Create User' : 'Save Changes'}</Button>
        </div>
      </form>
    </Card>
  );
};

const UserManagementContent: React.FC = () => {
  const { users, setUsers, authState, addNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );

  const handleCreateUser = (data: { name: string; email: string; username: string; password: string; role: UserRole }) => {
    if (users.some(u => u.email === data.email)) {
      addNotification('error', 'A user with this email already exists.');
      return;
    }
    const newUser: UserProfile = {
      id: 'u' + Date.now(),
      username: data.username,
      email: data.email,
      name: data.name,
      role: data.role,
      status: 'active',
      password: data.password,
      canShareDocuments: data.role !== 'advisory',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    setShowForm(false);
    addNotification('success', `User "${data.name}" created successfully.`);
  };

  const handleUpdateUser = (data: { name: string; email: string; username: string; role: UserRole }) => {
    if (!editingUser) return;
    setUsers(prev =>
      prev.map(u =>
        u.id === editingUser.id
          ? { ...u, name: data.name, email: data.email, username: data.username, role: data.role, updatedAt: new Date() }
          : u
      )
    );
    setEditingUser(null);
    addNotification('success', `User "${data.name}" updated successfully.`);
  };

  const handleDeactivateUser = (user: UserProfile) => {
    if (user.id === authState.user?.id) {
      addNotification('error', 'You cannot deactivate your own account.');
      return;
    }
    const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: newStatus, updatedAt: new Date() } : u))
    );
    addNotification('success', `User "${user.name}" ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
  };

  if (showForm) {
    return (
      <div className="p-6 lg:p-8">
        <UserForm mode="create" onSubmit={handleCreateUser} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  if (editingUser) {
    return (
      <div className="p-6 lg:p-8">
        <UserForm mode="edit" initial={editingUser} onSubmit={handleUpdateUser} onCancel={() => setEditingUser(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="User Management" subtitle="Manage all portal users and access" icon={<Users className="w-6 h-6 text-white" />}>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </PageHeader>

      <Card className="mb-6 p-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            className="flex-1 text-sm outline-none text-navy bg-transparent placeholder:text-slate-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden animate-slide-up delay-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-premium">
            <thead>
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm',
                        roleColors[user.role]
                      )}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{user.name}</p>
                        <p className="text-slate-400 text-[10px] font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={roleBadgeVariant(user.role)} size="sm">{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusBadgeVariant(user.status)} size="sm">{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-200"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivateUser(user)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-200"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <EmptyState title="No users found" description="No users match your search criteria." />
        )}
      </Card>
    </div>
  );
};

export const UserManagement: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleGuard allowedRoles={['admin']} fallback={<AccessDenied module="User Management" />}>
        <UserManagementContent />
      </RoleGuard>
    </ErrorBoundary>
  );
};
