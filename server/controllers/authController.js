import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function register(req, res, next) {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      state,
      district,
      village,
      preferred_language,
      farming_experience_years
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uuidv4();

    const insertResult = await query(
      `INSERT INTO users (
        id, email, password_hash, full_name, phone, state, district, village, preferred_language, farming_experience_years
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email, full_name, phone, state, district, village, preferred_language, farming_experience_years, created_at`,
      [
        userId,
        normalizedEmail,
        passwordHash,
        full_name.trim(),
        phone || null,
        state || null,
        district || null,
        village || null,
        preferred_language || 'English',
        farming_experience_years || 0
      ]
    );

    const user = insertResult.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      state: user.state,
      district: user.district,
      village: user.village,
      preferred_language: user.preferred_language,
      farming_experience_years: user.farming_experience_years,
      created_at: user.created_at
    };

    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  // Stateless JWT logout
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function getMe(req, res) {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}
