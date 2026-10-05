import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { Card, Button, Input, Select, LoadingSpinner } from '../components/common/UI';
import { User, ShieldCheck, Check } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    preferred_language: 'English',
    farming_experience_years: 0
  });

  useEffect(() => {
    async function load() {
      try {
        const profile = await authService.getProfile();
        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            state: profile.state || '',
            district: profile.district || '',
            village: profile.village || '',
            preferred_language: profile.preferred_language || 'English',
            farming_experience_years: profile.farming_experience_years || 0
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    setMessage('');
    setSaving(true);

    try {
      const updated = await authService.updateProfile(formData);
      updateUser({ ...user, ...updated });
      setMessage('Farmer profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Farmer Profile & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Personalize your regional dialect, agricultural background, and contact information.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg">
              {formData.full_name ? formData.full_name[0] : 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{formData.full_name || 'Farmer'}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
            <Input
              label="Village"
              name="village"
              value={formData.village}
              onChange={handleChange}
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

          <Button type="submit" size="lg" loading={saving} className="w-full mt-4">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
