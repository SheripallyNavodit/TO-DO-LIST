import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/common/UI';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('farmer@agriadvisor.org');
  const [password, setPassword] = useState('Farmer@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <Card className="p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-3">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">
            Access your farm profiles and AI crop advisories
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="farmer@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
            Sign In
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create an account
            </Link>
          </p>
          <div className="mt-4 p-3 bg-emerald-50/70 rounded-lg text-xs text-emerald-800 text-left">
            <p className="font-semibold mb-1">Pre-filled Demo Credentials:</p>
            <p>Email: <code className="font-mono text-emerald-950 font-medium">farmer@agriadvisor.org</code></p>
            <p>Password: <code className="font-mono text-emerald-950 font-medium">Farmer@123</code></p>
          </div>
        </div>
      </Card>
    </div>
  );
}
