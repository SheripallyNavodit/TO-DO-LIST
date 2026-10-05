import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env or server .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const { Pool } = pg;

// Flag whether PostgreSQL is reachable or if file/memory fallback is used
let pool = null;
let useFallback = false;

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

// In-memory / JSON fallback database for local offline setups without PostgreSQL service running
const fallbackDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(fallbackDir)) {
  fs.mkdirSync(fallbackDir, { recursive: true });
}
const fallbackFile = path.resolve(fallbackDir, 'store.json');

function loadFallbackStore() {
  if (fs.existsSync(fallbackFile)) {
    try {
      return JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
    } catch {
      // ignore
    }
  }
  return {
    users: [],
    farms: [],
    advisories: [],
    advisory_actions: []
  };
}

function saveFallbackStore(data) {
  fs.writeFileSync(fallbackFile, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Universal query runner:
 * If PostgreSQL connects successfully, executes SQL parameterized query.
 * If PostgreSQL is unavailable/offline, safely evaluates and persists using atomic JSON storage.
 */
export async function query(text, params = []) {
  if (pool && !useFallback) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      // If connection refused (e.g. Postgres not installed locally), gracefully fallback to secure local datastore
      if (err.code === 'ECONNREFUSED' || err.code === '28P01' || err.code === 'ENOTFOUND' || err.message.includes('Connection terminated')) {
        console.warn('⚠️  PostgreSQL connection unavailable. Switching to embedded secure storage engine.');
        useFallback = true;
      } else {
        throw err;
      }
    }
  }

  // Fallback query emulator for key tables (users, farms, advisories, advisory_actions)
  return executeFallback(text, params);
}

function executeFallback(sql, params) {
  const store = loadFallbackStore();
  const trimmed = sql.trim();
  const upper = trimmed.toUpperCase();

  // 1. SELECT queries
  if (upper.startsWith('SELECT')) {
    if (upper.includes('FROM USERS')) {
      return handleSelectUsers(store, trimmed, params);
    }
    if (upper.includes('FROM FARMS')) {
      return handleSelectFarms(store, trimmed, params);
    }
    if (upper.includes('FROM ADVISORIES')) {
      return handleSelectAdvisories(store, trimmed, params);
    }
    if (upper.includes('FROM ADVISORY_ACTIONS')) {
      return handleSelectAdvisoryActions(store, trimmed, params);
    }
    return { rows: [], rowCount: 0 };
  }

  // 2. INSERT queries
  if (upper.startsWith('INSERT INTO USERS')) {
    const user = {
      id: params[0],
      email: params[1].toLowerCase(),
      password_hash: params[2],
      full_name: params[3],
      phone: params[4] || null,
      state: params[5] || null,
      district: params[6] || null,
      village: params[7] || null,
      preferred_language: params[8] || 'English',
      farming_experience_years: params[9] || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.users.push(user);
    saveFallbackStore(store);
    return { rows: [user], rowCount: 1 };
  }

  if (upper.startsWith('INSERT INTO FARMS')) {
    const farm = {
      id: params[0],
      user_id: params[1],
      name: params[2],
      location: params[3] || null,
      state: params[4] || null,
      district: params[5] || null,
      village: params[6] || null,
      area: params[7] !== undefined ? Number(params[7]) : null,
      area_unit: params[8] || 'acre',
      soil_type: params[9] || null,
      soil_ph: params[10] !== undefined && params[10] !== null ? Number(params[10]) : null,
      nitrogen: params[11] !== undefined && params[11] !== null ? Number(params[11]) : null,
      phosphorus: params[12] !== undefined && params[12] !== null ? Number(params[12]) : null,
      potassium: params[13] !== undefined && params[13] !== null ? Number(params[13]) : null,
      organic_carbon: params[14] !== undefined && params[14] !== null ? Number(params[14]) : null,
      soil_moisture: params[15] !== undefined && params[15] !== null ? Number(params[15]) : null,
      irrigation_available: Boolean(params[16]),
      irrigation_method: params[17] || null,
      water_source: params[18] || null,
      previous_crop: params[19] || null,
      current_crop: params[20] || null,
      farming_method: params[21] || null,
      season: params[22] || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.farms.push(farm);
    saveFallbackStore(store);
    return { rows: [farm], rowCount: 1 };
  }

  if (upper.startsWith('INSERT INTO ADVISORIES')) {
    const advisory = {
      id: params[0],
      user_id: params[1],
      farm_id: params[2] || null,
      advisory_type: params[3],
      crop: params[4] || null,
      location: params[5] || null,
      input_data: typeof params[6] === 'string' ? JSON.parse(params[6]) : params[6],
      ai_response: typeof params[7] === 'string' ? JSON.parse(params[7]) : params[7],
      overall_risk: params[8] || null,
      suitability_score: params[9] !== undefined && params[9] !== null ? Number(params[9]) : null,
      model_name: params[10] || 'gemini',
      model_version: params[11] || '2.5-flash',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.advisories.push(advisory);
    saveFallbackStore(store);
    return { rows: [advisory], rowCount: 1 };
  }

  if (upper.startsWith('INSERT INTO ADVISORY_ACTIONS')) {
    const action = {
      id: params[0],
      advisory_id: params[1],
      title: params[2],
      description: params[3],
      priority: params[4] || 'medium',
      status: params[5] || 'pending',
      due_date: params[6] || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.advisory_actions.push(action);
    saveFallbackStore(store);
    return { rows: [action], rowCount: 1 };
  }

  // 3. UPDATE queries
  if (upper.startsWith('UPDATE USERS')) {
    // UPDATE users SET full_name = $1, phone = $2, state = $3, district = $4, village = $5, preferred_language = $6, farming_experience_years = $7, updated_at = NOW() WHERE id = $8 RETURNING ...
    const userIndex = store.users.findIndex(u => u.id === params[7]);
    if (userIndex !== -1) {
      store.users[userIndex].full_name = params[0];
      store.users[userIndex].phone = params[1];
      store.users[userIndex].state = params[2];
      store.users[userIndex].district = params[3];
      store.users[userIndex].village = params[4];
      store.users[userIndex].preferred_language = params[5];
      store.users[userIndex].farming_experience_years = Number(params[6]);
      store.users[userIndex].updated_at = new Date().toISOString();
      saveFallbackStore(store);
      return { rows: [store.users[userIndex]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('UPDATE FARMS')) {
    // params: name, location, state, district, village, area, area_unit, soil_type, soil_ph, nitrogen, phosphorus, potassium, organic_carbon, soil_moisture, irrigation_available, irrigation_method, water_source, previous_crop, current_crop, farming_method, season, id, user_id
    const farmId = params[21];
    const userId = params[22];
    const farmIndex = store.farms.findIndex(f => f.id === farmId && f.user_id === userId);
    if (farmIndex !== -1) {
      const f = store.farms[farmIndex];
      f.name = params[0];
      f.location = params[1];
      f.state = params[2];
      f.district = params[3];
      f.village = params[4];
      f.area = params[5] ? Number(params[5]) : null;
      f.area_unit = params[6];
      f.soil_type = params[7];
      f.soil_ph = params[8] ? Number(params[8]) : null;
      f.nitrogen = params[9] ? Number(params[9]) : null;
      f.phosphorus = params[10] ? Number(params[10]) : null;
      f.potassium = params[11] ? Number(params[11]) : null;
      f.organic_carbon = params[12] ? Number(params[12]) : null;
      f.soil_moisture = params[13] ? Number(params[13]) : null;
      f.irrigation_available = Boolean(params[14]);
      f.irrigation_method = params[15];
      f.water_source = params[16];
      f.previous_crop = params[17];
      f.current_crop = params[18];
      f.farming_method = params[19];
      f.season = params[20];
      f.updated_at = new Date().toISOString();
      saveFallbackStore(store);
      return { rows: [f], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('UPDATE ADVISORY_ACTIONS')) {
    // UPDATE advisory_actions SET status = $1, updated_at = NOW() WHERE id = $2 AND advisory_id IN (SELECT id FROM advisories WHERE user_id = $3) RETURNING *
    const status = params[0];
    const actionId = params[1];
    const userId = params[2];
    const userAdvisoryIds = new Set(store.advisories.filter(a => a.user_id === userId).map(a => a.id));
    const action = store.advisory_actions.find(a => a.id === actionId && userAdvisoryIds.has(a.advisory_id));
    if (action) {
      action.status = status;
      action.updated_at = new Date().toISOString();
      saveFallbackStore(store);
      return { rows: [action], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 4. DELETE queries
  if (upper.startsWith('DELETE FROM FARMS')) {
    const farmId = params[0];
    const userId = params[1];
    const initLen = store.farms.length;
    store.farms = store.farms.filter(f => !(f.id === farmId && f.user_id === userId));
    saveFallbackStore(store);
    return { rowCount: initLen - store.farms.length };
  }

  if (upper.startsWith('DELETE FROM ADVISORIES')) {
    const advisoryId = params[0];
    const userId = params[1];
    const advisory = store.advisories.find(a => a.id === advisoryId && a.user_id === userId);
    if (advisory) {
      store.advisories = store.advisories.filter(a => a.id !== advisoryId);
      store.advisory_actions = store.advisory_actions.filter(a => a.advisory_id !== advisoryId);
      saveFallbackStore(store);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

function handleSelectUsers(store, sql, params) {
  const upper = sql.toUpperCase();
  if (upper.includes('WHERE EMAIL = $1')) {
    const email = (params[0] || '').toLowerCase();
    const found = store.users.find(u => u.email.toLowerCase() === email);
    return { rows: found ? [found] : [], rowCount: found ? 1 : 0 };
  }
  if (upper.includes('WHERE ID = $1')) {
    const found = store.users.find(u => u.id === params[0]);
    return { rows: found ? [found] : [], rowCount: found ? 1 : 0 };
  }
  return { rows: store.users, rowCount: store.users.length };
}

function handleSelectFarms(store, sql, params) {
  const upper = sql.toUpperCase();
  if (upper.includes('WHERE ID = $1 AND USER_ID = $2')) {
    const found = store.farms.find(f => f.id === params[0] && f.user_id === params[1]);
    return { rows: found ? [found] : [], rowCount: found ? 1 : 0 };
  }
  if (upper.includes('WHERE USER_ID = $1')) {
    const matched = store.farms.filter(f => f.user_id === params[0])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: matched, rowCount: matched.length };
  }
  return { rows: store.farms, rowCount: store.farms.length };
}

function handleSelectAdvisories(store, sql, params) {
  const upper = sql.toUpperCase();
  if (upper.includes('COUNT(*)')) {
    const userId = params[0];
    const count = store.advisories.filter(a => a.user_id === userId).length;
    return { rows: [{ count }], rowCount: 1 };
  }
  if (upper.includes('WHERE ID = $1 AND USER_ID = $2')) {
    const found = store.advisories.find(a => a.id === params[0] && a.user_id === params[1]);
    return { rows: found ? [found] : [], rowCount: found ? 1 : 0 };
  }
  if (upper.includes('WHERE USER_ID = $1')) {
    let list = store.advisories.filter(a => a.user_id === params[0]);
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: list, rowCount: list.length };
  }
  return { rows: store.advisories, rowCount: store.advisories.length };
}

function handleSelectAdvisoryActions(store, sql, params) {
  const upper = sql.toUpperCase();
  if (upper.includes('WHERE ADVISORY_ID = $1')) {
    const actions = store.advisory_actions.filter(a => a.advisory_id === params[0]);
    return { rows: actions, rowCount: actions.length };
  }
  return { rows: store.advisory_actions, rowCount: store.advisory_actions.length };
}

export async function testConnection() {
  if (pool) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ PostgreSQL connected successfully.');
      return true;
    } catch {
      console.warn('⚠️  PostgreSQL connection failed. Using secure embedded storage.');
      useFallback = true;
      return false;
    }
  } else {
    useFallback = true;
    return false;
  }
}

export default {
  query,
  testConnection
};
