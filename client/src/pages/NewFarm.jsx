import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { farmService } from '../services/farms';
import { Card, Button, Input, Select } from '../components/common/UI';
import { Wheat, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NewFarm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    district: '',
    village: '',
    area: '',
    area_unit: 'acre',
    soil_type: 'Loamy',
    soil_ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organic_carbon: '',
    soil_moisture: '',
    irrigation_available: true,
    irrigation_method: 'Drip',
    water_source: 'Borewell',
    previous_crop: '',
    current_crop: '',
    farming_method: 'Integrated farming',
    season: 'Rabi'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Farm name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
        state: formData.state.trim() || undefined,
        district: formData.district.trim() || undefined,
        village: formData.village.trim() || undefined,
        area: formData.area ? Number(formData.area) : undefined,
        area_unit: formData.area_unit,
        soil_type: formData.soil_type || undefined,
        soil_ph: formData.soil_ph ? Number(formData.soil_ph) : undefined,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : undefined,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : undefined,
        potassium: formData.potassium ? Number(formData.potassium) : undefined,
        organic_carbon: formData.organic_carbon ? Number(formData.organic_carbon) : undefined,
        soil_moisture: formData.soil_moisture ? Number(formData.soil_moisture) : undefined,
        irrigation_available: Boolean(formData.irrigation_available),
        irrigation_method: formData.irrigation_method || undefined,
        water_source: formData.water_source || undefined,
        previous_crop: formData.previous_crop.trim() || undefined,
        current_crop: formData.current_crop.trim() || undefined,
        farming_method: formData.farming_method || undefined,
        season: formData.season || undefined
      };

      await farmService.createFarm(payload);
      navigate('/farms');
    } catch (err) {
      setError(err.message || 'Failed to create farm');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link to="/farms" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Farms
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Farm Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Store your land size, soil attributes, and irrigation infrastructure for automated advisory calculations.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-900 border-b border-slate-100 pb-2">
            1. Farm Identity & Size
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Farm Name *"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Green Valley Farm #1"
            />
            <Input
              label="General Location / Address"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Near Canal Road, Babai"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Madhya Pradesh"
            />
            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Hoshangabad"
            />
            <Input
              label="Village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="e.g. Babai"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Farm Area"
              name="area"
              type="number"
              step="any"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g. 4.5"
            />
            <Select
              label="Unit of Measurement"
              name="area_unit"
              value={formData.area_unit}
              onChange={handleChange}
              options={[
                { value: 'acre', label: 'Acres' },
                { value: 'hectare', label: 'Hectares' },
                { value: 'bigha', label: 'Bigha' },
                { value: 'guntha', label: 'Guntha' }
              ]}
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-900 border-b border-slate-100 pb-2">
            2. Soil Parameters & Crops
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Soil Type"
              name="soil_type"
              value={formData.soil_type}
              onChange={handleChange}
              options={[
                { value: 'Alluvial', label: 'Alluvial' },
                { value: 'Black (Regur)', label: 'Black (Regur)' },
                { value: 'Red', label: 'Red' },
                { value: 'Laterite', label: 'Laterite' },
                { value: 'Sandy', label: 'Sandy' },
                { value: 'Clay', label: 'Clay' },
                { value: 'Loamy', label: 'Loamy' },
                { value: 'Sandy Loam', label: 'Sandy Loam' },
                { value: 'Clay Loam', label: 'Clay Loam' },
                { value: 'Unknown', label: 'Unknown' }
              ]}
            />
            <Input
              label="Soil pH"
              name="soil_ph"
              type="number"
              step="0.1"
              value={formData.soil_ph}
              onChange={handleChange}
              placeholder="6.5"
            />
            <Input
              label="Organic Carbon (%)"
              name="organic_carbon"
              type="number"
              step="0.01"
              value={formData.organic_carbon}
              onChange={handleChange}
              placeholder="0.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Crop"
              name="current_crop"
              value={formData.current_crop}
              onChange={handleChange}
              placeholder="e.g. Wheat, Mustard"
            />
            <Input
              label="Previous Crop"
              name="previous_crop"
              value={formData.previous_crop}
              onChange={handleChange}
              placeholder="e.g. Soybean, Rice"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-900 border-b border-slate-100 pb-2">
            3. Irrigation & Farming Practice
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="irrigation_available"
              name="irrigation_available"
              checked={formData.irrigation_available}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="irrigation_available" className="text-sm font-medium text-slate-700">
              Irrigation source is available
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Irrigation Method"
              name="irrigation_method"
              value={formData.irrigation_method}
              onChange={handleChange}
              options={[
                { value: 'Drip', label: 'Drip' },
                { value: 'Sprinkler', label: 'Sprinkler' },
                { value: 'Flood', label: 'Flood / Surface' },
                { value: 'Furrow', label: 'Ridge & Furrow' },
                { value: 'Rainfed', label: 'Rainfed' }
              ]}
            />
            <Input
              label="Water Source"
              name="water_source"
              value={formData.water_source}
              onChange={handleChange}
              placeholder="e.g. Canal, Tube well, Pond"
            />
          </div>
        </Card>

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Save Farm Record
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </div>
  );
}
