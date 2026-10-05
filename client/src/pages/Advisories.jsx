import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { advisoryService } from '../services/advisories';
import { Card, Button, Input, Select, LoadingSpinner, EmptyState } from '../components/common/UI';
import {
  History,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Trash2,
  Wheat
} from 'lucide-react';

export default function Advisories() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const res = await advisoryService.getAdvisories({
        crop: searchTerm,
        type: typeFilter,
        page,
        limit: 10
      });
      setAdvisories(res.advisories || []);
      setPagination(res.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to fetch advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [page, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdvisories();
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this advisory permanently?')) return;
    try {
      await advisoryService.deleteAdvisory(id);
      setAdvisories(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Crop Advisory History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review past agronomic consultations, track seasonal advice, and check historical suitability scores.
          </p>
        </div>
        <Link to="/advisory/new">
          <Button size="md">
            <Sparkles className="h-4 w-4 mr-1 text-emerald-200" />
            New Advisory
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <Input
            placeholder="Search by crop name (e.g. Wheat, Rice, Tomato)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="md">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="sm:w-64">
          <Select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Advisory Types' },
              { value: 'complete', label: 'Complete Advisory' },
              { value: 'crop_selection', label: 'Crop Selection' },
              { value: 'diagnosis', label: 'Diagnosis' },
              { value: 'fertilizer', label: 'Fertilizer' },
              { value: 'irrigation', label: 'Irrigation' },
              { value: 'pest_disease', label: 'Pest & Disease' }
            ]}
          />
        </div>
      </div>

      {/* Advisories List */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : advisories.length > 0 ? (
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                        {adv.advisory_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dateStr}
                      </span>
                      {adv.location && (
                        <span className="text-xs text-slate-500">
                          • {adv.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {adv.crop || 'General Agricultural Advisory'}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {aiData.summary || 'Agronomic recommendation evaluated by Google Gemini.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {adv.suitability_score !== null && adv.suitability_score !== undefined && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Suitability</span>
                        <span className="text-base font-black text-emerald-700">{adv.suitability_score}%</span>
                      </div>
                    )}
                    <Link to={`/advisory/${adv.id}`}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(adv.id, e)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Advisory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-600 font-medium px-2">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No Advisories Matched"
          description="Try clearing your search query or generate a new AI crop advisory now."
          action={
            <Link to="/advisory/new">
              <Button size="sm">Generate Advisory</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
