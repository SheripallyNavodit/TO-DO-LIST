import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Card } from '../components/common/UI';
import { Sprout, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    preferred_language: 'English',
    farming_experience_years: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'farming_experience_years' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-3">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create Farmer Account</h2>
          <p className="text-sm text-slate-500 mt-1">
            Join thousands of growers leveraging AI for precision agriculture
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patel"
            />
            <Input
              label="Email Address *"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="farmer@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password (min 6 chars) *"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Punjab, MP"
            />
            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Ludhiana"
            />
            <Input
              label="Village / Tehsil"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="e.g. Raikot"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Preferred Language"
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Hindi', label: 'Hindi' },
                { value: 'Punjabi', label: 'Punjabi' },
                { value: 'Marathi', label: 'Marathi' },
                { value: 'Gujarati', label: 'Gujarati' },
                { value: 'Telugu', label: 'Telugu' },
                { value: 'Tamil', label: 'Tamil' },
                { value: 'Kannada', label: 'Kannada' }
              ]}
            />
            <Input
              label="Farming Experience (Years)"
              name="farming_experience_years"
              type="number"
              min="0"
              value={formData.farming_experience_years}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" loading={loading} className="w-full mt-4" size="lg">
            Complete Registration
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
