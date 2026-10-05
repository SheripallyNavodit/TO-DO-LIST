import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farms';
import { Card, Button, LoadingSpinner, EmptyState } from '../components/common/UI';
import { Wheat, Plus, MapPin, ArrowRight, Trash2, Droplets, Layers } from 'lucide-react';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = async () => {
    try {
      const data = await farmService.getFarms();
      setFarms(data || []);
    } catch (err) {
      console.error('Failed to load farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleDelete = async (id, name, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await farmService.deleteFarm(id);
      setFarms(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farm Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain land parcel records, baseline soil characteristics, and irrigation infrastructure.
          </p>
        </div>
        <Link to="/farms/new">
          <Button size="md">
            <Plus className="h-4 w-4 mr-1" />
            Add New Farm
          </Button>
        </Link>
      </div>

      {farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((f) => (
            <Card key={f.id} hover className="flex flex-col justify-between p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{f.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {f.location || `${f.district || ''}, ${f.state || ''}`.replace(/^, /, '') || 'Location unset'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-emerald-50 text-emerald-800">
                    {f.area || 0} {f.area_unit || 'acre'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Soil</span>
                    <span className="font-semibold text-slate-800">{f.soil_type || 'Unknown'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Soil pH</span>
                    <span className="font-semibold text-slate-800">{f.soil_ph ?? 'Untested'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Crop</span>
                    <span className="font-semibold text-slate-800">{f.current_crop || 'None'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase">Irrigation</span>
                    <span className="font-semibold text-slate-800">
                      {f.irrigation_available ? f.irrigation_method || 'Yes' : 'Rainfed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <Link to={`/farms/${f.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Configure
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
                <button
                  onClick={(e) => handleDelete(f.id, f.name, e)}
                  className="ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Farm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wheat}
          title="No Farms Added Yet"
          description="Register your land parcels to auto-fill future AI crop advisories."
          action={
            <Link to="/farms/new">
              <Button size="sm">Create First Farm</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
