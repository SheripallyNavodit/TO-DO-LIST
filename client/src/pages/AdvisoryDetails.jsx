import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { advisoryService } from '../services/advisories';
import { Card, Button, LoadingSpinner } from '../components/common/UI';
import {
  Sparkles,
  Wheat,
  Droplets,
  Layers,
  Bug,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  ArrowLeft,
  ShieldAlert,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AdvisoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function loadAdvisory() {
      try {
        const res = await advisoryService.getAdvisoryById(id);
        setData(res.advisory);
        setActions(res.actions || []);
      } catch (err) {
        setError(err.message || 'Failed to load advisory');
      } finally {
        setLoading(false);
      }
    }
    loadAdvisory();
  }, [id]);

  const handleToggleActionStatus = async (actionId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setActionLoading(actionId);
    try {
      const updated = await advisoryService.updateActionStatus(actionId, nextStatus);
      setActions(prev => prev.map(a => a.id === actionId ? updated : a));
    } catch (err) {
      console.error('Failed to update action status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this advisory report?')) return;
    try {
      await advisoryService.deleteAdvisory(id);
      navigate('/advisories');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-24" />;
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm">
          {error || 'Advisory not found.'}
        </div>
        <Link to="/advisories">
          <Button variant="outline">Back to Advisories</Button>
        </Link>
      </div>
    );
  }

  const ai = data.ai_response || {};
  const input = data.input_data || {};
  const dateFormatted = new Date(data.created_at).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 print:py-0">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link to="/advisories" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Advisory History
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Advisory Report Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {data.advisory_type.replace('_', ' ')} Advisory
              </span>
              <span className="text-xs text-slate-400">
                Model: {data.model_name || 'Gemini'} ({data.model_version || '2.5-flash'})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.crop || 'Comprehensive Agricultural Advisory'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Generated on {dateFormatted}
            </p>
          </div>

          {data.suitability_score !== null && data.suitability_score !== undefined && (
            <div className="text-center sm:text-right bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                AI Suitability Score
              </span>
              <span className="text-3xl font-black text-emerald-700">
                {data.suitability_score} / 100
              </span>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-emerald-600" />
            Executive Summary
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {ai.summary || 'Custom agronomic guidance evaluated according to soil and environmental parameters.'}
          </p>
        </div>

        {/* Farmer Query Reference */}
        {input.primaryQuestion && (
          <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/70 p-3 rounded-xl">
            <span className="font-bold text-amber-900">Farmer Question: </span>
            "{input.primaryQuestion}"
          </div>
        )}
      </div>

      {/* Advisory Type 1 & 2: Crop Recommendations List */}
      {ai.recommendations && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Wheat className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Recommended Crops & Suitability</h2>
          </div>
          {ai.location_assessment && (
            <p className="text-xs text-slate-600 italic">{ai.location_assessment}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ai.recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">{rec.crop}</h3>
                  <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800">
                    {rec.suitability_score}% Suitability
                  </span>
                </div>
                <p className="text-xs text-slate-700">{rec.reason}</p>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div><strong>Soil Fit:</strong> {rec.soil_fit}</div>
                  <div><strong>Water Need:</strong> <span className="capitalize">{rec.water_requirement}</span></div>
                  <div><strong>Climate Fit:</strong> {rec.climate_fit}</div>
                </div>
                {rec.advantages && rec.advantages.length > 0 && (
                  <div className="pt-2 text-[11px] text-emerald-800">
                    <span className="font-bold">Advantages:</span> {rec.advantages.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Complete Advisory: Crop Assessment & Soil Assessment */}
      {ai.crop_assessment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-slate-100 pb-2">
              <Wheat className="h-5 w-5" />
              <h2 className="text-sm uppercase tracking-wider text-slate-900">Crop Feasibility</h2>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">{ai.crop_assessment.crop}</span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {ai.crop_assessment.suitability_level} Fit
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{ai.crop_assessment.reason}</p>
          </Card>

          {ai.soil_assessment && (
            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold border-b border-slate-100 pb-2">
                <Layers className="h-5 w-5" />
                <h2 className="text-sm uppercase tracking-wider text-slate-900">Soil Analysis & Soil Health</h2>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-700">Observations:</span>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {ai.soil_assessment.observations?.map((obs, i) => <li key={i}>{obs}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Soil Management:</span>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {ai.soil_assessment.recommendations?.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Complete Advisory: Irrigation & Nutrition */}
      {(ai.irrigation || ai.nutrition) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ai.irrigation && (
            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-2">
                <Droplets className="h-5 w-5" />
                <h2 className="text-sm uppercase tracking-wider text-slate-900">Irrigation Protocol</h2>
              </div>
              <div className="text-xs space-y-2 text-slate-700">
                <div><strong>Requirement:</strong> {ai.irrigation.requirement}</div>
                <div><strong>Recommended Frequency:</strong> {ai.irrigation.frequency}</div>
                <div><strong>Method:</strong> {ai.irrigation.method}</div>
                {ai.irrigation.warnings && ai.irrigation.warnings.length > 0 && (
                  <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900">
                    <span className="font-bold block mb-1">Irrigation Warnings:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {ai.irrigation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {ai.nutrition && (
            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-slate-100 pb-2">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-sm uppercase tracking-wider text-slate-900">Nutrition & Fertilizer Guidance</h2>
              </div>
              <div className="text-xs space-y-2 text-slate-700">
                <div>
                  <span className="font-bold block mb-1">Recommended Dosages & Nutrients:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {ai.nutrition.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                {ai.nutrition.timing && ai.nutrition.timing.length > 0 && (
                  <div>
                    <span className="font-bold block mb-1">Split Application Timing:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {ai.nutrition.timing.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Disease Diagnosis Conditions */}
      {ai.possible_conditions && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bug className="h-5 w-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Diagnostic Assessment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ai.possible_conditions.map((cond, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900">{cond.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                    cond.likelihood === 'likely' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cond.likelihood}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{cond.reason}</p>
                {cond.supporting_signs && (
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold">Supporting signs:</span> {cond.supporting_signs.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pest & Disease Warnings */}
      {ai.pest_and_disease && ai.pest_and_disease.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bug className="h-5 w-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Integrated Pest & Disease Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ai.pest_and_disease.map((pest, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">{pest.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    pest.risk === 'high' ? 'bg-rose-100 text-rose-800' :
                    pest.risk === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pest.risk} Risk
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Warning Signs:</strong> {pest.signs?.join(', ')}</p>
                  <p><strong>Non-Chemical / Preventive Strategy:</strong> {pest.prevention?.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Crop Management Timeline */}
      {ai.crop_management && ai.crop_management.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Crop Stage Workplan</h2>
          </div>
          <div className="space-y-3">
            {ai.crop_management.map((cm, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-7 w-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{cm.stage}</h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                    {cm.actions?.map((act, j) => <li key={j}>{act}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Plan Tasks (Interactive) */}
      {actions.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Priority Action Items</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click checkbox when completed</span>
          </div>

          <div className="space-y-2">
            {actions.map((act) => {
              const isDone = act.status === 'completed';
              return (
                <div
                  key={act.id}
                  onClick={() => handleToggleActionStatus(act.id, act.status)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-slate-50/80 border-slate-200 opacity-60 line-through'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    disabled={actionLoading === act.id}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{act.title}</span>
                      <span className={`px-2 py-0.2 text-[10px] uppercase font-bold rounded-full ${
                        act.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {act.priority}
                      </span>
                    </div>
                    {act.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Harvest Guidance */}
      {ai.harvest && (
        <Card className="space-y-3 bg-linear-to-r from-amber-50/50 to-orange-50/40 border-amber-200/80">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <Wheat className="h-4 w-4 text-amber-700" />
            Harvest Timing & Indicators
          </h2>
          <p className="text-xs text-amber-900">{ai.harvest.general_guidance}</p>
          {ai.harvest.indicators && (
            <ul className="list-disc list-inside text-xs text-amber-800 space-y-0.5">
              {ai.harvest.indicators.map((ind, i) => <li key={i}>{ind}</li>)}
            </ul>
          )}
        </Card>
      )}

      {/* Transparency, Assumptions & Safety Disclosures */}
      <div className="space-y-4">
        {ai.assumptions && ai.assumptions.length > 0 && (
          <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">AI Agronomic Assumptions:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {ai.assumptions.map((ass, i) => <li key={i}>{ass}</li>)}
            </ul>
          </div>
        )}

        {ai.professional_help_required && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
            <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold block">Certified Agronomist Consultation Recommended</span>
              <p>{ai.professional_help_reason || 'Severe infestation or critical nutrient depletion necessitates physical lab inspection.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
