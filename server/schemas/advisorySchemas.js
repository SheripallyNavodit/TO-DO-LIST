import { z } from 'zod';

// Input request from farmer
export const advisoryRequestSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  crop: z.string().min(1, 'Crop name is required').max(150).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  farmArea: z.number().positive().optional().nullable(),
  areaUnit: z.string().max(30).optional().nullable(),
  soilType: z.string().max(100).optional().nullable(),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  organicCarbon: z.number().nonnegative().optional().nullable(),
  soilMoisture: z.number().min(0).max(100).optional().nullable(),
  irrigationAvailable: z.boolean().optional().default(false),
  irrigationMethod: z.string().max(100).optional().nullable(),
  waterSource: z.string().max(100).optional().nullable(),
  growthStage: z.string().max(100).optional().nullable(),
  sowingDate: z.string().optional().nullable(),
  previousCrop: z.string().max(150).optional().nullable(),
  farmingMethod: z.string().max(100).optional().nullable(),
  season: z.string().max(100).optional().nullable(),
  symptoms: z.string().max(5000).optional().nullable(),
  weatherConcerns: z.string().max(1000).optional().nullable(),
  primaryQuestion: z.string().min(1, 'Primary question or farming objective is required').max(5000),
  advisoryType: z.enum([
    'complete',
    'crop_selection',
    'diagnosis',
    'fertilizer',
    'irrigation',
    'pest_disease'
  ]).default('complete')
});

// 1. Complete Advisory Output Schema
export const completeAdvisoryOutputSchema = z.object({
  summary: z.string(),
  crop_assessment: z.object({
    crop: z.string(),
    suitability_score: z.number().min(0).max(100),
    suitability_level: z.string(),
    reason: z.string()
  }).optional(),
  soil_assessment: z.object({
    status: z.string(),
    observations: z.array(z.string()).default([]),
    recommendations: z.array(z.string()).default([])
  }).optional(),
  irrigation: z.object({
    requirement: z.string(),
    frequency: z.string(),
    method: z.string(),
    warnings: z.array(z.string()).default([])
  }).optional(),
  nutrition: z.object({
    recommendations: z.array(z.string()).default([]),
    timing: z.array(z.string()).default([]),
    notes: z.array(z.string()).default([])
  }).optional(),
  pest_and_disease: z.array(z.object({
    name: z.string(),
    type: z.string(),
    risk: z.string(),
    signs: z.array(z.string()).default([]),
    prevention: z.array(z.string()).default([])
  })).default([]),
  crop_management: z.array(z.object({
    stage: z.string(),
    actions: z.array(z.string()).default([])
  })).default([]),
  risk_assessment: z.array(z.object({
    risk: z.string(),
    level: z.string(),
    reason: z.string(),
    mitigation: z.string()
  })).default([]),
  harvest: z.object({
    general_guidance: z.string(),
    indicators: z.array(z.string()).default([])
  }).optional(),
  priority_actions: z.array(z.object({
    priority: z.string(),
    action: z.string(),
    reason: z.string()
  })).default([]),
  assumptions: z.array(z.string()).default([]),
  uncertainties: z.array(z.string()).default([]),
  professional_help_required: z.boolean().default(false),
  professional_help_reason: z.string().optional().nullable()
});

// 2. Crop Selection Output Schema
export const cropSelectionOutputSchema = z.object({
  location_assessment: z.string(),
  recommendations: z.array(z.object({
    crop: z.string(),
    suitability_score: z.number().min(0).max(100),
    reason: z.string(),
    soil_fit: z.string(),
    water_requirement: z.string(),
    climate_fit: z.string(),
    major_risks: z.array(z.string()).default([]),
    advantages: z.array(z.string()).default([])
  })),
  important_assumptions: z.array(z.string()).default([])
});

// 3. Diagnosis Output Schema
export const diagnosisOutputSchema = z.object({
  summary: z.string(),
  observations_used: z.array(z.string()).default([]),
  possible_conditions: z.array(z.object({
    name: z.string(),
    category: z.string(),
    likelihood: z.enum(['likely', 'possible', 'unlikely', 'unknown']),
    reason: z.string(),
    supporting_signs: z.array(z.string()).default([]),
    contradicting_signs: z.array(z.string()).default([])
  })),
  immediate_actions: z.array(z.string()).default([]),
  preventive_actions: z.array(z.string()).default([]),
  what_to_monitor: z.array(z.string()).default([]),
  additional_information_needed: z.array(z.string()).default([]),
  professional_assistance_recommended: z.boolean().default(false)
});

// 4. Fertilizer Advisory Output Schema
export const fertilizerOutputSchema = z.object({
  summary: z.string(),
  soil_information_quality: z.string(),
  nutrient_assessment: z.array(z.object({
    nutrient: z.string(),
    status: z.string(),
    reason: z.string()
  })).default([]),
  recommendations: z.array(z.object({
    nutrient: z.string(),
    recommendation: z.string(),
    timing: z.string(),
    caution: z.string()
  })).default([]),
  soil_testing_recommended: z.boolean().default(true),
  notes: z.array(z.string()).default([])
});

// 5. Irrigation Advisory Output Schema
export const irrigationOutputSchema = z.object({
  summary: z.string(),
  water_requirement: z.string(),
  irrigation_strategy: z.array(z.object({
    growth_stage: z.string(),
    guidance: z.string()
  })).default([]),
  water_stress_signs: z.array(z.string()).default([]),
  overwatering_signs: z.array(z.string()).default([]),
  water_conservation_actions: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([])
});

export const updateActionSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled'])
});
