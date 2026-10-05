import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/common/UI';
import { Settings, Shield, Bell, Database, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure security, notifications, and account credentials.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Shield className="h-5 w-5 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase text-slate-900">Security & Authentication</h2>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            <strong>Account Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Password Security:</strong> Passwords are cryptographically salted and hashed using bcrypt.
          </p>
          <p>
            <strong>Session Lifetime:</strong> 7 days with stateless cryptographically signed JWT.
          </p>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Database className="h-5 w-5 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase text-slate-900">Data Isolation & RLS</h2>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            All crop advisories and farm plots are strictly linked to your user UUID. 
            Backend endpoints enforce ownership verification on every database query.
          </p>
        </div>
      </Card>

      <Card className="p-4 border-rose-200 bg-rose-50/50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-rose-900">Session Management</h3>
            <p className="text-xs text-rose-700">End your current session on this device.</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
