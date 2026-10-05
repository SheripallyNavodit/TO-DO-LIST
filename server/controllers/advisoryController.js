import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';
import { generateAdvisoryWithGemini } from '../services/geminiService.js';

export async function createAdvisory(req, res, next) {
  try {
    const input = req.body;
    let farmContext = null;

    // If farmId is supplied, verify ownership and enrich context
    if (input.farmId) {
      const farmRes = await query('SELECT * FROM farms WHERE id = $1 AND user_id = $2', [input.farmId, req.user.id]);
      if (farmRes.rows.length > 0) {
        farmContext = farmRes.rows[0];
        // Fill missing fields from farm profile
        input.crop = input.crop || farmContext.current_crop;
        input.location = input.location || farmContext.location || `${farmContext.district || ''}, ${farmContext.state || ''}`;
        input.soilType = input.soilType || farmContext.soil_type;
        input.soilPh = input.soilPh ?? (farmContext.soil_ph ? Number(farmContext.soil_ph) : undefined);
        input.nitrogen = input.nitrogen ?? (farmContext.nitrogen ? Number(farmContext.nitrogen) : undefined);
        input.phosphorus = input.phosphorus ?? (farmContext.phosphorus ? Number(farmContext.phosphorus) : undefined);
        input.potassium = input.potassium ?? (farmContext.potassium ? Number(farmContext.potassium) : undefined);
        input.organicCarbon = input.organicCarbon ?? (farmContext.organic_carbon ? Number(farmContext.organic_carbon) : undefined);
        input.soilMoisture = input.soilMoisture ?? (farmContext.soil_moisture ? Number(farmContext.soil_moisture) : undefined);
        input.irrigationAvailable = input.irrigationAvailable !== undefined ? input.irrigationAvailable : farmContext.irrigation_available;
        input.irrigationMethod = input.irrigationMethod || farmContext.irrigation_method;
        input.waterSource = input.waterSource || farmContext.water_source;
        input.farmingMethod = input.farmingMethod || farmContext.farming_method;
        input.season = input.season || farmContext.season;
        input.farmArea = input.farmArea ?? (farmContext.area ? Number(farmContext.area) : undefined);
        input.areaUnit = input.areaUnit || farmContext.area_unit;
      }
    }

    // Call server-side Gemini Service
    const aiResult = await generateAdvisoryWithGemini(input.advisoryType, input, req.user);
    const { ai_response, model_name, model_version } = aiResult;

    // Derive overall risk & suitability score where applicable
    let overallRisk = 'low';
    let suitabilityScore = null;

    if (ai_response.crop_assessment?.suitability_score !== undefined) {
      suitabilityScore = ai_response.crop_assessment.suitability_score;
    } else if (ai_response.recommendations && ai_response.recommendations.length > 0) {
      suitabilityScore = ai_response.recommendations[0].suitability_score;
    }

    if (ai_response.risk_assessment && ai_response.risk_assessment.length > 0) {
      const hasHigh = ai_response.risk_assessment.some(r => r.level?.toLowerCase() === 'high');
      const hasMed = ai_response.risk_assessment.some(r => r.level?.toLowerCase() === 'medium');
      overallRisk = hasHigh ? 'high' : (hasMed ? 'medium' : 'low');
    }

    const advisoryId = uuidv4();

    // Persist to Database with parameterized SQL
    const insertRes = await query(
      `INSERT INTO advisories (
        id, user_id, farm_id, advisory_type, crop, location,
        input_data, ai_response, overall_risk, suitability_score,
        model_name, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        advisoryId,
        req.user.id,
        input.farmId || null,
        input.advisoryType,
        input.crop || 'General Advisory',
        input.location || null,
        JSON.stringify(input),
        JSON.stringify(ai_response),
        overallRisk,
        suitabilityScore,
        model_name,
        model_version
      ]
    );

    const savedAdvisory = insertRes.rows[0];

    // Auto-create initial priority actions if present in AI response
    if (ai_response.priority_actions && Array.isArray(ai_response.priority_actions)) {
      for (const item of ai_response.priority_actions) {
        const actionId = uuidv4();
        await query(
          `INSERT INTO advisory_actions (
            id, advisory_id, title, description, priority, status
          ) VALUES ($1, $2, $3, $4, $5, 'pending')`,
          [
            actionId,
            advisoryId,
            item.action,
            item.reason || '',
            item.priority || 'medium'
          ]
        );
      }
    } else if (ai_response.immediate_actions && Array.isArray(ai_response.immediate_actions)) {
      for (const act of ai_response.immediate_actions) {
        const actionId = uuidv4();
        await query(
          `INSERT INTO advisory_actions (
            id, advisory_id, title, description, priority, status
          ) VALUES ($1, $2, $3, $4, 'high', 'pending')`,
          [actionId, advisoryId, act, 'Immediate diagnosis recommended action']
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'AI Crop Advisory generated and saved successfully',
      data: {
        advisory: savedAdvisory
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisories(req, res, next) {
  try {
    const { crop, type, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

    let queryText = 'SELECT * FROM advisories WHERE user_id = $1';
    const params = [req.user.id];

    if (crop) {
      params.push(`%${crop.toLowerCase()}%`);
      queryText += ` AND LOWER(crop) LIKE $${params.length}`;
    }

    if (type) {
      params.push(type);
      queryText += ` AND advisory_type = $${params.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    const total = result.rows.length;
    const paginatedRows = result.rows.slice(offset, offset + Number(limit));

    res.json({
      success: true,
      data: {
        advisories: paginatedRows,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM advisories WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found or access denied'
      });
    }

    // Also fetch associated actions
    const actionsRes = await query(
      `SELECT * FROM advisory_actions WHERE advisory_id = $1 ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        advisory: result.rows[0],
        actions: actionsRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdvisory(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM advisories WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Advisory deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryActions(req, res, next) {
  try {
    const { id } = req.params;
    // Verify advisory belongs to user first
    const check = await query('SELECT id FROM advisories WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found or access denied'
      });
    }

    const actions = await query('SELECT * FROM advisory_actions WHERE advisory_id = $1 ORDER BY created_at ASC', [id]);
    res.json({
      success: true,
      data: {
        actions: actions.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateActionStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      `UPDATE advisory_actions SET status = $1, updated_at = NOW()
       WHERE id = $2 AND advisory_id IN (SELECT id FROM advisories WHERE user_id = $3)
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Action not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Action updated successfully',
      data: {
        action: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}
