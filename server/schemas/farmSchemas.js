import { z } from 'zod';

export const farmSchema = z.object({
  name: z.string().min(1, 'Farm name is required').max(150),
  location: z.string().max(255).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  village: z.string().max(150).optional().nullable(),
  area: z.number().positive('Farm area must be positive').optional().nullable(),
  area_unit: z.enum(['acre', 'hectare', 'bigha', 'guntha', 'sq_meter']).default('acre'),
  soil_type: z.string().max(100).optional().nullable(),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  organic_carbon: z.number().nonnegative().optional().nullable(),
  soil_moisture: z.number().min(0).max(100).optional().nullable(),
  irrigation_available: z.boolean().default(false),
  irrigation_method: z.string().max(100).optional().nullable(),
  water_source: z.string().max(100).optional().nullable(),
  previous_crop: z.string().max(150).optional().nullable(),
  current_crop: z.string().max(150).optional().nullable(),
  farming_method: z.string().max(100).optional().nullable(),
  season: z.string().max(100).optional().nullable()
});

export const updateFarmSchema = farmSchema.partial();
