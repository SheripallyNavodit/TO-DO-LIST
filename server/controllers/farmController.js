import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';

export async function getFarms(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        farms: result.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getFarmById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT * FROM farms WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        farm: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function createFarm(req, res, next) {
  try {
    const farmId = uuidv4();
    const {
      name,
      location,
      state,
      district,
      village,
      area,
      area_unit,
      soil_type,
      soil_ph,
      nitrogen,
      phosphorus,
      potassium,
      organic_carbon,
      soil_moisture,
      irrigation_available,
      irrigation_method,
      water_source,
      previous_crop,
      current_crop,
      farming_method,
      season
    } = req.body;

    const result = await query(
      `INSERT INTO farms (
        id, user_id, name, location, state, district, village, area, area_unit,
        soil_type, soil_ph, nitrogen, phosphorus, potassium, organic_carbon,
        soil_moisture, irrigation_available, irrigation_method, water_source,
        previous_crop, current_crop, farming_method, season
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19,
        $20, $21, $22, $23
      ) RETURNING *`,
      [
        farmId,
        req.user.id,
        name.trim(),
        location || null,
        state || null,
        district || null,
        village || null,
        area ?? null,
        area_unit || 'acre',
        soil_type || null,
        soil_ph ?? null,
        nitrogen ?? null,
        phosphorus ?? null,
        potassium ?? null,
        organic_carbon ?? null,
        soil_moisture ?? null,
        Boolean(irrigation_available),
        irrigation_method || null,
        water_source || null,
        previous_crop || null,
        current_crop || null,
        farming_method || null,
        season || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: {
        farm: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req, res, next) {
  try {
    const { id } = req.params;

    // Check ownership
    const check = await query('SELECT * FROM farms WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or access denied'
      });
    }

    const current = check.rows[0];
    const b = req.body;

    const updatedResult = await query(
      `UPDATE farms SET
        name = $1, location = $2, state = $3, district = $4, village = $5,
        area = $6, area_unit = $7, soil_type = $8, soil_ph = $9,
        nitrogen = $10, phosphorus = $11, potassium = $12, organic_carbon = $13,
        soil_moisture = $14, irrigation_available = $15, irrigation_method = $16,
        water_source = $17, previous_crop = $18, current_crop = $19,
        farming_method = $20, season = $21, updated_at = NOW()
      WHERE id = $22 AND user_id = $23
      RETURNING *`,
      [
        b.name !== undefined ? b.name : current.name,
        b.location !== undefined ? b.location : current.location,
        b.state !== undefined ? b.state : current.state,
        b.district !== undefined ? b.district : current.district,
        b.village !== undefined ? b.village : current.village,
        b.area !== undefined ? b.area : current.area,
        b.area_unit !== undefined ? b.area_unit : current.area_unit,
        b.soil_type !== undefined ? b.soil_type : current.soil_type,
        b.soil_ph !== undefined ? b.soil_ph : current.soil_ph,
        b.nitrogen !== undefined ? b.nitrogen : current.nitrogen,
        b.phosphorus !== undefined ? b.phosphorus : current.phosphorus,
        b.potassium !== undefined ? b.potassium : current.potassium,
        b.organic_carbon !== undefined ? b.organic_carbon : current.organic_carbon,
        b.soil_moisture !== undefined ? b.soil_moisture : current.soil_moisture,
        b.irrigation_available !== undefined ? b.irrigation_available : current.irrigation_available,
        b.irrigation_method !== undefined ? b.irrigation_method : current.irrigation_method,
        b.water_source !== undefined ? b.water_source : current.water_source,
        b.previous_crop !== undefined ? b.previous_crop : current.previous_crop,
        b.current_crop !== undefined ? b.current_crop : current.current_crop,
        b.farming_method !== undefined ? b.farming_method : current.farming_method,
        b.season !== undefined ? b.season : current.season,
        id,
        req.user.id
      ]
    );

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data: {
        farm: updatedResult.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteFarm(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM farms WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Farm deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}
