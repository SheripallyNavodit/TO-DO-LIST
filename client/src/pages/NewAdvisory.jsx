import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmService } from '../services/farms';
import { advisoryService } from '../services/advisories';
import { Card, Button, Input, Select, Textarea } from '../components/common/UI';
import {
  Sparkles,
  Wheat,
  Droplets,
  Layers,
  ThermometerSun,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function NewAdvisory() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    advisoryType: 'complete',
    crop: '',
    location: '',
    farmArea: '',
    areaUnit: 'acre',
    soilType: 'Loamy',
    soilPh: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicCarbon: '',
    soilMoisture: '',
    irrigationAvailable: true,
    irrigationMethod: 'Drip',
    waterSource: 'Borewell',
    growthStage: 'Vegetative',
    sowingDate: '',
    previousCrop: '',
    farmingMethod: 'Integrated farming',
    season: 'Rabi',
    symptoms: '',
    weatherConcerns: '',
    primaryQuestion: ''
  });

  // Pre-load farms
  useEffect(() => {
    async function loadFarms() {
      try {
        const list = await farmService.getFarms();
        setFarms(list);
        if (list.length > 0) {
          applyFarmToForm(list[0]);
        }
      } catch (err) {
        console.error('Error fetching farms:', err);
      } finally {
        setLoadingFarms(false);
      }
    }
    loadFarms();
  }, []);

  const applyFarmToForm = (farm) => {
    setSelectedFarmId(farm.id);
    setFormData(prev => ({
      ...prev,
      crop: farm.current_crop || prev.crop,
      location: farm.location || `${farm.district || ''}, ${farm.state || ''}`.replace(/^, /, ''),
      farmArea: farm.area !== null && farm.area !== undefined ? String(farm.area) : prev.farmArea,
      areaUnit: farm.area_unit || prev.areaUnit,
      soilType: farm.soil_type || prev.soilType,
      soilPh: farm.soil_ph !== null && farm.soil_ph !== undefined ? String(farm.soil_ph) : prev.soilPh,
      nitrogen: farm.nitrogen !== null && farm.nitrogen !== undefined ? String(farm.nitrogen) : prev.nitrogen,
      phosphorus: farm.phosphorus !== null && farm.phosphorus !== undefined ? String(farm.phosphorus) : prev.phosphorus,
      potassium: farm.potassium !== null && farm.potassium !== undefined ? String(farm.potassium) : prev.potassium,
      organicCarbon: farm.organic_carbon !== null && farm.organic_carbon !== undefined ? String(farm.organic_carbon) : prev.organicCarbon,
      soilMoisture: farm.soil_moisture !== null && farm.soil_moisture !== undefined ? String(farm.soil_moisture) : prev.soilMoisture,
      irrigationAvailable: farm.irrigation_available ?? prev.irrigationAvailable,
      irrigationMethod: farm.irrigation_method || prev.irrigationMethod,
      waterSource: farm.water_source || prev.waterSource,
      previousCrop: farm.previous_crop || prev.previousCrop,
      farmingMethod: farm.farming_method || prev.farmingMethod,
      season: farm.season || prev.season
    }));
  };

  const handleFarmSelect = (e) => {
    const fid = e.target.value;
    setSelectedFarmId(fid);
    const chosen = farms.find(f => f.id === fid);
    if (chosen) {
      applyFarmToForm(chosen);
    }
  };

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

    if (!formData.primaryQuestion.trim()) {
      setError('Please provide your farming objective or primary question.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        farmId: selectedFarmId || undefined,
        advisoryType: formData.advisoryType,
        crop: formData.crop.trim() || undefined,
        location: formData.location.trim() || undefined,
        farmArea: formData.farmArea ? Number(formData.farmArea) : undefined,
        areaUnit: formData.areaUnit || undefined,
        soilType: formData.soilType || undefined,
        soilPh: formData.soilPh ? Number(formData.soilPh) : undefined,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : undefined,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : undefined,
        potassium: formData.potassium ? Number(formData.potassium) : undefined,
        organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : undefined,
        soilMoisture: formData.soilMoisture ? Number(formData.soilMoisture) : undefined,
        irrigationAvailable: Boolean(formData.irrigationAvailable),
        irrigationMethod: formData.irrigationMethod || undefined,
        waterSource: formData.waterSource || undefined,
        growthStage: formData.growthStage || undefined,
        sowingDate: formData.sowingDate || undefined,
        previousCrop: formData.previousCrop || undefined,
        farmingMethod: formData.farmingMethod || undefined,
        season: formData.season || undefined,
        symptoms: formData.symptoms.trim() || undefined,
        weatherConcerns: formData.weatherConcerns.trim() || undefined,
        primaryQuestion: formData.primaryQuestion.trim()
      };

      const result = await advisoryService.createAdvisory(payload);
      navigate(`/advisory/${result.id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate advisory');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          AI Advisory Generator
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Request Crop Guidance
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete the field parameters below. Our Google Gemini model evaluates soil, nutrition, and environmental factors to produce structured recommendations.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {/* Advisory Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Farm Auto-Populate Selector */}
        {farms.length > 0 && (
          <Card className="bg-emerald-50/60 border-emerald-200/80 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-900 tracking-wider">Fast Fill From Saved Farm</span>
                <p className="text-xs text-emerald-800">Select an existing farm to automatically fill location, soil, and irrigation data.</p>
              </div>
              <div className="sm:w-64">
                <select
                  value={selectedFarmId}
                  onChange={handleFarmSelect}
                  className="w-full text-xs font-medium rounded-lg border border-emerald-300 bg-white px-3 py-2 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Manual Entry --</option>
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.area || 0} {f.area_unit})</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Section 1: Advisory Goal & Objective */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">1. Advisory Goal & Objective</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Advisory Type"
              name="advisoryType"
              value={formData.advisoryType}
              onChange={handleChange}
              options={[
                { value: 'complete', label: 'Complete Full Crop Advisory' },
                { value: 'crop_selection', label: 'Crop Suitability & Selection' },
                { value: 'diagnosis', label: 'Problem & Disease Diagnosis' },
                { value: 'fertilizer', label: 'Nutrient & Fertilizer Strategy' },
                { value: 'irrigation', label: 'Irrigation & Moisture Management' },
                { value: 'pest_disease', label: 'Pest & Fungal Risk Analysis' }
              ]}
            />

            <Input
              label="Crop Name (or target crops)"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              placeholder="e.g. Wheat, Tomato, Soybean, Rice"
              helperText="Leave empty if seeking crop recommendations"
            />
          </div>

          <Textarea
            label="Your Primary Question or Farming Challenge *"
            name="primaryQuestion"
            required
            rows={3}
            value={formData.primaryQuestion}
            onChange={handleChange}
            placeholder="e.g. My wheat crop is at CRI stage and lower leaves show light yellowing. How much fertilizer and irrigation should I apply this week?"
            helperText="The more specific your question, the more actionable Gemini's advice will be."
          />
        </Card>

        {/* Section 2: Farm Location & Dimensions */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Wheat className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">2. Farm & Location Context</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location / District / State"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Karnal, Haryana"
            />
            <Input
              label="Farm Area"
              name="farmArea"
              type="number"
              step="any"
              value={formData.farmArea}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
            <Select
              label="Area Unit"
              name="areaUnit"
              value={formData.areaUnit}
              onChange={handleChange}
              options={[
                { value: 'acre', label: 'Acres' },
                { value: 'hectare', label: 'Hectares' },
                { value: 'bigha', label: 'Bigha' },
                { value: 'guntha', label: 'Guntha' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Current Season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              options={[
                { value: 'Kharif', label: 'Kharif (Monsoon / Autumn)' },
                { value: 'Rabi', label: 'Rabi (Winter / Spring)' },
                { value: 'Zaid', label: 'Zaid (Summer)' },
                { value: 'Perennial', label: 'Perennial / Year-Round' }
              ]}
            />
            <Select
              label="Growth Stage"
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              options={[
                { value: 'Pre-Sowing / Field Prep', label: 'Pre-Sowing / Field Prep' },
                { value: 'Germination & Seedling', label: 'Germination & Seedling' },
                { value: 'Vegetative', label: 'Vegetative' },
                { value: 'Tillering / Branching', label: 'Tillering / Branching' },
                { value: 'Flowering & Booting', label: 'Flowering & Booting' },
                { value: 'Grain Filling / Pod Setting', label: 'Grain Filling / Pod Setting' },
                { value: 'Maturity / Pre-Harvest', label: 'Maturity / Pre-Harvest' }
              ]}
            />
            <Input
              label="Sowing Date"
              name="sowingDate"
              type="date"
              value={formData.sowingDate}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Section 3: Soil Parameters */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="h-5 w-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900">3. Soil Test & Physical Properties (Optional)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Soil Type"
              name="soilType"
              value={formData.soilType}
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
                { value: 'Unknown', label: 'Unknown / Not Tested' }
              ]}
            />
            <Input
              label="Soil pH (0-14)"
              name="soilPh"
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={formData.soilPh}
              onChange={handleChange}
              placeholder="e.g. 6.8"
            />
            <Input
              label="Organic Carbon (%)"
              name="organicCarbon"
              type="number"
              step="0.01"
              value={formData.organicCarbon}
              onChange={handleChange}
              placeholder="e.g. 0.55"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Nitrogen (kg/ha)"
              name="nitrogen"
              type="number"
              value={formData.nitrogen}
              onChange={handleChange}
              placeholder="e.g. 260"
            />
            <Input
              label="Phosphorus (kg/ha)"
              name="phosphorus"
              type="number"
              value={formData.phosphorus}
              onChange={handleChange}
              placeholder="e.g. 22"
            />
            <Input
              label="Potassium (kg/ha)"
              name="potassium"
              type="number"
              value={formData.potassium}
              onChange={handleChange}
              placeholder="e.g. 195"
            />
          </div>
        </Card>

        {/* Section 4: Water & Irrigation */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Droplets className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">4. Water & Irrigation Details</h2>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="irrigationAvailable"
              name="irrigationAvailable"
              checked={formData.irrigationAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="irrigationAvailable" className="text-sm font-medium text-slate-700">
              Irrigation source is available on this land (uncheck for completely rainfed)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Irrigation Method"
              name="irrigationMethod"
              value={formData.irrigationMethod}
              onChange={handleChange}
              options={[
                { value: 'Drip', label: 'Drip Irrigation (Micro)' },
                { value: 'Sprinkler', label: 'Sprinkler System' },
                { value: 'Flood', label: 'Surface / Flood' },
                { value: 'Furrow', label: 'Ridge & Furrow' },
                { value: 'Canal', label: 'Canal Turn' },
                { value: 'Rainfed', label: 'Rainfed' }
              ]}
            />
            <Input
              label="Water Source"
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              placeholder="e.g. Tube well, Canal, Farm pond"
            />
          </div>
        </Card>

        {/* Section 5: Symptoms & Environmental Concerns */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">5. Crop Symptoms & Weather Concerns (Optional)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Visible Symptoms / Pests"
              name="symptoms"
              rows={2}
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="e.g. Brown circular spots on lower leaves; minor aphid clustering under foliage."
            />
            <Textarea
              label="Weather Concerns / Rainfall"
              name="weatherConcerns"
              rows={2}
              value={formData.weatherConcerns}
              onChange={handleChange}
              placeholder="e.g. Unseasonal rain forecasted in 3 days; temperatures dropping below 8°C."
            />
          </div>
        </Card>

        {/* Confirmation & Submit Box */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your agricultural input will be validated and analyzed using <strong>Google Gemini</strong> through the server-side GenAI SDK. 
              The resulting advice is intended as informational decision support and does not replace official soil testing laboratories.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={submitting}
            className="w-full text-base font-bold shadow-md shadow-emerald-700/20"
          >
            {submitting ? (
              'Analyzing Farm Conditions & Consulting Gemini AI...'
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2 text-emerald-200" />
                Generate AI Crop Advisory
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          {submitting && (
            <div className="text-center text-xs text-slate-500 animate-pulse pt-1">
              Evaluating crop suitability • Estimating nutrient requirements • Generating risk assessment...
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
