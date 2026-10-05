import { query } from './connection.js';

export const migrationSQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    state VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(150),
    preferred_language VARCHAR(50) DEFAULT 'English',
    farming_experience_years INTEGER CHECK (farming_experience_years >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(150),
    area NUMERIC(12,2),
    area_unit VARCHAR(30) DEFAULT 'acre',
    soil_type VARCHAR(100),
    soil_ph NUMERIC(4,2),
    nitrogen NUMERIC(12,4),
    phosphorus NUMERIC(12,4),
    potassium NUMERIC(12,4),
    organic_carbon NUMERIC(12,4),
    soil_moisture NUMERIC(6,2),
    irrigation_available BOOLEAN DEFAULT FALSE,
    irrigation_method VARCHAR(100),
    water_source VARCHAR(100),
    previous_crop VARCHAR(150),
    current_crop VARCHAR(150),
    farming_method VARCHAR(100),
    season VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,

    advisory_type VARCHAR(100) NOT NULL,
    crop VARCHAR(150),
    location VARCHAR(255),

    input_data JSONB NOT NULL,
    ai_response JSONB NOT NULL,

    overall_risk VARCHAR(30),
    suitability_score NUMERIC(5,2),

    model_name VARCHAR(100),
    model_version VARCHAR(100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisory_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisory_id UUID NOT NULL REFERENCES advisories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'medium',
    status VARCHAR(30) DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farm_id ON advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisories_crop ON advisories(crop);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON advisories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_advisory_actions_advisory_id ON advisory_actions(advisory_id);
`;

export async function runMigrations() {
  try {
    await query(migrationSQL);
    console.log('✅ PostgreSQL Schema migrations verified/executed.');
  } catch (err) {
    console.warn('⚠️ Migration notice (falling back gracefully if offline):', err.message);
  }
}
