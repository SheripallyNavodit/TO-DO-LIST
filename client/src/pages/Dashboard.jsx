import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { farmService } from '../services/farms';
import { advisoryService } from '../services/advisories';
import { Card, Button, LoadingSpinner, EmptyState } from '../components/common/UI';
import {
  Wheat,
  Sparkles,
  History,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [farmsData, advData] = await Promise.all([
          farmService.getFarms(),
          advisoryService.getAdvisories({ limit: 5 })
        ]);
        setFarms(farmsData || []);
        setAdvisories(advData?.advisories || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  const primaryFarm = farms[0];
  const latestAdvisory = advisories[0];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Farmer Dashboard
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.village ? `${user.village}, ` : ''}{user?.district ? `${user.district}, ` : ''}{user?.state || 'Farm Advisor Platform'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/farms/new">
            <Button variant="outline" size="md">
              <Wheat className="h-4 w-4" />
              Add Farm
            </Button>
          </Link>
          <Link to="/advisory/new">
            <Button size="md" className="shadow-emerald-700/20 shadow-md">
              <Sparkles className="h-4 w-4 text-emerald-200" />
              Generate AI Advisory
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Wheat className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Registered Farms</p>
            <p className="text-2xl font-bold text-slate-900">{farms.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">AI Advisories</p>
            <p className="text-2xl font-bold text-slate-900">{advisories.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Primary Crop</p>
            <p className="text-base font-bold text-slate-900 truncate max-w-[150px]">
              {primaryFarm?.current_crop || 'Not specified'}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Suitability Score</p>
            <p className="text-2xl font-bold text-slate-900">
              {latestAdvisory?.suitability_score ? `${latestAdvisory.suitability_score}%` : 'N/A'}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Active Farm & Recent Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Farm Summary (1 col) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Farm Profile</h2>
            <Link to="/farms" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View All ({farms.length})
            </Link>
          </div>

          {primaryFarm ? (
            <Card className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{primaryFarm.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {primaryFarm.location || `${primaryFarm.district || ''}, ${primaryFarm.state || ''}`}
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700">
                  {primaryFarm.area || 0} {primaryFarm.area_unit || 'acre'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Soil Type</span>
                  <span className="font-semibold text-slate-800">{primaryFarm.soil_type || 'Unknown'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Soil pH</span>
                  <span className="font-semibold text-slate-800">{primaryFarm.soil_ph ?? 'Untested'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Irrigation</span>
                  <span className="font-semibold text-slate-800">
                    {primaryFarm.irrigation_available ? primaryFarm.irrigation_method || 'Available' : 'Rainfed'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Current Crop</span>
                  <span className="font-semibold text-slate-800">{primaryFarm.current_crop || 'None'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to={`/farms/${primaryFarm.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Farm Details
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={Wheat}
              title="No Farm Configured"
              description="Add your first farm to unlock automated field and soil intelligence."
              action={
                <Link to="/farms/new">
                  <Button size="sm">Create Farm Record</Button>
                </Link>
              }
            />
          )}

          {/* Agricultural Safety Reminder */}
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Smart Soil Tip</span>
            </div>
            <p className="leading-relaxed text-emerald-800">
              Split application of Nitrogen reduces volatilization and ground runoff by up to 35%. Always test soil every 2 years.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Advisories (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent AI Crop Advisories</h2>
            <Link to="/advisories" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View History
            </Link>
          </div>

          {advisories.length > 0 ? (
            <div className="space-y-3">
              {advisories.map((adv) => {
                const aiData = adv.ai_response || {};
                const dateStr = new Date(adv.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <Card key={adv.id} hover className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                            {adv.advisory_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dateStr}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {adv.crop || 'Comprehensive Crop Guidance'}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {aiData.summary || 'Custom agronomic guidance evaluated by Google Gemini.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {adv.suitability_score !== null && adv.suitability_score !== undefined && (
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Suitability</span>
                            <span className="text-sm font-extrabold text-emerald-700">{adv.suitability_score}%</span>
                          </div>
                        )}
                        <Link to={`/advisory/${adv.id}`}>
                          <Button variant="outline" size="sm">
                            Inspect
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No Advisories Generated Yet"
              description="Provide your soil, crop, and irrigation details to receive a customized AI advisory."
              action={
                <Link to="/advisory/new">
                  <Button size="sm">
                    <Sparkles className="h-4 w-4 mr-1 text-emerald-200" />
                    Generate First Advisory
                  </Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
