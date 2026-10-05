import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  ShieldCheck,
  Brain,
  Droplets,
  Bug,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Wheat,
  Leaf
} from 'lucide-react';
import { Button } from '../components/common/UI';

export default function Landing() {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 sm:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen Agricultural Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Precision Crop Advisory <br />
            <span className="text-emerald-300">Powered by Google Gemini</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Empower your farming decisions with instant, evidence-backed advisories. 
            Evaluate soil suitability, optimize split fertilization, forecast pest risks, and prevent crop stress with structured AI.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold shadow-lg">
                Start Free Advisory
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-emerald-400/40 text-emerald-100 hover:bg-emerald-800/50">
                Sign In to Farm Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-700/50 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Multi-Stage Crop Nutrition</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Pest & Disease Diagnosis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Actionable Workplans</span>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Value Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Comprehensive Advisory Modules
          </h2>
          <p className="text-sm text-slate-600">
            Structured agronomic recommendations designed specifically for smallholders, large farms, and progressive growers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit mb-4">
              <Wheat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Crop & Soil Compatibility</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Analyze soil pH, NPK profiles, and drainage against crop climate parameters to compute factual suitability scores.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl w-fit mb-4">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Irrigation & Nutrition</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Identify critical irrigation stages (CRI, flowering, grain dough) with split fertilizer schedules to prevent runoff loss.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl w-fit mb-4">
              <Bug className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Integrated Pest Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Early diagnosis of leaf spot, chlorosis, and insect vectors with biological trap protocols and low-toxicity interventions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Simple Farmer Workflow</span>
          <h2 className="text-2xl font-bold text-slate-900">How AgriAdvisor AI Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-lg">
              1
            </div>
            <h4 className="font-semibold text-slate-900 text-base">Profile Your Farm</h4>
            <p className="text-xs text-slate-500">Record farm acreage, soil classification, water source, and recent crops.</p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-lg">
              2
            </div>
            <h4 className="font-semibold text-slate-900 text-base">Select Advisory Goal</h4>
            <p className="text-xs text-slate-500">Choose complete season guidance, problem diagnosis, or fertilizer plans.</p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-lg">
              3
            </div>
            <h4 className="font-semibold text-slate-900 text-base">AI Analysis via Gemini</h4>
            <p className="text-xs text-slate-500">Google Gemini processes data server-side against agronomic rules.</p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-lg">
              4
            </div>
            <h4 className="font-semibold text-slate-900 text-base">Take Action</h4>
            <p className="text-xs text-slate-500">Track priority tasks, harvest indicators, and download advisory history.</p>
          </div>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="rounded-2xl bg-amber-50 border border-amber-200/80 p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-xl shrink-0">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-amber-900">Responsible Agricultural AI Safety Commitment</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Our system never hallucinates chemical dosages or fabricates soil test readings. 
            All suggestions emphasize Integrated Pest Management (IPM), soil testing verification, and caution labels.
          </p>
        </div>
      </section>
    </div>
  );
}
