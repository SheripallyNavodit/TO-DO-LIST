import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { farmService } from '../services/farms';
import { Card, Button, Input, Select, LoadingSpinner } from '../components/common/UI';
import { Wheat, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';

export default function FarmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    water_source: '',
    previous_crop: '',
    current_crop: '',
    farming_method: 'Integrated farming',
    season: 'Rabi'
  });

  useEffect(() => {
    async function loadFarm() {
      try {
        const farm = await farmService.getFarmById(id);
        if (farm) {
          setFormData({
            name: farm.name || '',
            location: farm.location || '',
            state: farm.state || '',
            district: farm.district || '',
            village: farm.village || '',
            area: farm.area !== null && farm.area !== undefined ? String(farm.area) : '',
            area_unit: farm.area_unit || 'acre',
            soil_type: farm.soil_type || 'Loamy',
            soil_ph: farm.soil_ph !== null && farm.soil_ph !== undefined ? String(farm.soil_ph) : '',
            nitrogen: farm.nitrogen !== null && farm.nitrogen !== undefined ? String(farm.nitrogen) : '',
            phosphorus: farm.phosphorus !== null && farm.phosphorus !== undefined ? String(farm.phosphorus) : '',
            potassium: farm.potassium !== null && farm.potassium !== undefined ? String(farm.potassium) : '',
            organic_carbon: farm.organic_carbon !== null && farm.organic_carbon !== undefined ? String(farm.organic_carbon) : '',
            soil_moisture: farm.soil_moisture !== null && farm.soil_moisture !== undefined ? String(farm.soil_moisture) : '',
            irrigation_available: farm.irrigation_available ?? true,
            irrigation_method: farm.irrigation_method || 'Drip',
            water_source: farm.water_source || '',
            previous_crop: farm.previous_crop || '',
            current_crop: farm.current_crop || '',
            farming_method: farm.farming_method || 'Integrated farming',
            season: farm.season || 'Rabi'
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load farm details');
      } finally {
        setLoading(false);
      }
    }
    loadFarm();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

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

      await farmService.updateFarm(id, payload);
      setSuccess('Farm updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update farm');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this farm permanently?')) return;
    try {
      await farmService.deleteFarm(id);
      navigate('/farms');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/farms" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Farms
        </Link>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete Farm
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Farm: {formData.name}</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update land area, soil chemistry, or irrigation status.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">
          {success}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
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
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
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
            <Input
              label="Farm Area"
              name="area"
              type="number"
              step="any"
              value={formData.area}
              onChange={handleChange}
            />
            <Select
              label="Area Unit"
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
            />
            <Input
              label="Organic Carbon (%)"
              name="organic_carbon"
              type="number"
              step="0.01"
              value={formData.organic_carbon}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Crop"
              name="current_crop"
              value={formData.current_crop}
              onChange={handleChange}
            />
            <Input
              label="Previous Crop"
              name="previous_crop"
              value={formData.previous_crop}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Button type="submit" size="lg" loading={saving} className="w-full">
          Update Farm Information
        </Button>
      </form>
    </div>
  );
}
