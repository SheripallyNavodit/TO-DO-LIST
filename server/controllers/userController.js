import { query } from '../db/connection.js';

export async function getProfile(req, res, next) {
  try {
    const result = await query(
      'SELECT id, email, full_name, phone, state, district, village, preferred_language, farming_experience_years, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        profile: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const {
      full_name,
      phone,
      state,
      district,
      village,
      preferred_language,
      farming_experience_years
    } = req.body;

    const result = await query(
      `UPDATE users SET
        full_name = $1,
        phone = $2,
        state = $3,
        district = $4,
        village = $5,
        preferred_language = $6,
        farming_experience_years = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING id, email, full_name, phone, state, district, village, preferred_language, farming_experience_years, updated_at`,
      [
        full_name.trim(),
        phone || null,
        state || null,
        district || null,
        village || null,
        preferred_language || 'English',
        farming_experience_years ?? 0,
        req.user.id
      ]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
}
