import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from './connection.js';
import { runMigrations } from './migrations.js';

export async function seedDatabase() {
  console.log('🌱 Seeding Agriculture Advisory demo dataset...');
  await runMigrations();

  const demoEmail = 'farmer@agriadvisor.org';
  const existing = await query('SELECT * FROM users WHERE email = $1', [demoEmail]);

  let userId;
  if (existing.rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Farmer@123', salt);
    userId = uuidv4();

    await query(
      `INSERT INTO users (
        id, email, password_hash, full_name, phone, state, district, village, preferred_language, farming_experience_years
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        demoEmail,
        passwordHash,
        'Ramesh Kumar Patel',
        '+91 98765 43210',
        'Madhya Pradesh',
        'Hoshangabad',
        'Babai Village',
        'Hindi / English',
        14
      ]
    );
    console.log('✅ Demo user seeded: farmer@agriadvisor.org / Farmer@123');
  } else {
    userId = existing.rows[0].id;
    console.log('ℹ️ Demo user already exists.');
  }

  // Check demo farm
  const farmCheck = await query('SELECT * FROM farms WHERE user_id = $1', [userId]);
  let farmId;
  if (farmCheck.rows.length === 0) {
    farmId = uuidv4();
    await query(
      `INSERT INTO farms (
        id, user_id, name, location, state, district, village, area, area_unit,
        soil_type, soil_ph, nitrogen, phosphorus, potassium, organic_carbon, soil_moisture,
        irrigation_available, irrigation_method, water_source, previous_crop, current_crop,
        farming_method, season
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23
      )`,
      [
        farmId,
        userId,
        'Narmada Valley Green Acres',
        'Babai, Hoshangabad',
        'Madhya Pradesh',
        'Hoshangabad',
        'Babai',
        5.5,
        'acre',
        'Black (Regur)',
        6.8,
        280,
        24,
        210,
        0.58,
        42,
        true,
        'Drip & Canal',
        'Canal / Borewell',
        'Soybean',
        'Wheat (Sharbati)',
        'Integrated farming',
        'Rabi'
      ]
    );
    console.log('✅ Demo farm seeded: Narmada Valley Green Acres');
  } else {
    farmId = farmCheck.rows[0].id;
  }

  // Check demo advisory
  const advisoryCheck = await query('SELECT * FROM advisories WHERE user_id = $1', [userId]);
  if (advisoryCheck.rows.length === 0) {
    const advisoryId = uuidv4();
    const demoAiResponse = {
      summary: "Comprehensive Rabi season crop advisory for Sharbati Wheat on fertile Black soil with drip/canal irrigation.",
      crop_assessment: {
        crop: "Wheat (Sharbati)",
        suitability_score: 92,
        suitability_level: "high",
        reason: "Black soil retains optimal moisture during winter chill hours; neutral pH (6.8) is optimal for high-protein grain filling."
      },
      soil_assessment: {
        status: "suitable",
        observations: [
          "Soil pH 6.8 is within prime nutrient absorption window.",
          "Available Nitrogen (280 kg/ha) is moderate; Phosphorus (24 kg/ha) is slightly below ideal threshold."
        ],
        recommendations: [
          "Apply 25 kg/acre DAP basal dose during seedbed preparation.",
          "Incorporate 2-3 tons of farmyard manure to preserve soil aggregate porosity."
        ]
      },
      irrigation: {
        requirement: "Approx 350-400 mm distributed across 4 critical physiological stages.",
        frequency: "Every 18-21 days depending on soil moisture sensor feedback.",
        method: "Drip / Controlled Border Furrow",
        warnings: [
          "Crown Root Initiation (CRI) at 20-25 DAS is non-negotiable; water stress here drops yield by 30%.",
          "Avoid flooding during high wind forecasts to prevent lodging."
        ]
      },
      nutrition: {
        recommendations: [
          "Split Nitrogen into 3 parts: 50% basal, 25% at first irrigation, 25% at jointing stage.",
          "Foliar spray of 0.5% Zinc Sulphate + 2% Urea at 45 DAS to eliminate micro-chlorosis."
        ],
        timing: ["Basal", "Crown Root Initiation", "Flag Leaf Emergence"],
        notes: ["Avoid over-application of Nitrogen to prevent vegetative softness and aphid attraction."]
      },
      pest_and_disease: [
        {
          name: "Wheat Aphids (Mahua)",
          type: "pest",
          risk: "medium",
          signs: ["Curling of young tender leaves", "Honey-dew droplets with sooty mold"],
          prevention: [
            "Install yellow sticky traps @ 6 per acre.",
            "Conserve natural predators such as ladybird beetles.",
            "Spray 5% Neem Seed Kernel Extract (NSKE) at first sighting."
          ]
        },
        {
          name: "Yellow Rust (Puccinia striiformis)",
          type: "fungal",
          risk: "low",
          signs: ["Yellow pustules arranged in linear stripes on upper leaf surfaces"],
          prevention: [
            "Plant certified rust-resistant Sharbati cultivars.",
            "Scout canopy twice weekly during cloudy cool spells."
          ]
        }
      ],
      crop_management: [
        {
          stage: "Crown Root Initiation (Day 20-25)",
          actions: ["First critical irrigation", "First weeding / hand hoeing", "Top dress 30 kg Urea/acre"]
        },
        {
          stage: "Tillering to Jointing (Day 40-50)",
          actions: ["Second irrigation", "Foliar zinc spray", "Inspect for aphid colonies"]
        },
        {
          stage: "Grain Milk & Dough (Day 80-95)",
          actions: ["Maintain terminal moisture to prevent premature grain shriveling", "Cease irrigation 12 days before cut"]
        }
      ],
      risk_assessment: [
        {
          risk: "Terminal Heat Stress in Late February",
          level: "medium",
          reason: "Sudden temperature spikes over 32°C can shorten the grain filling period.",
          mitigation: "Light irrigation at dough stage and timely sowing before mid-November."
        }
      ],
      harvest: {
        general_guidance: "Harvest when grain feels flinty and moisture reaches 12-14%.",
        indicators: ["Golden yellow dry straw", "Grains snap cleanly between teeth"]
      },
      priority_actions: [
        {
          priority: "high",
          action: "Schedule Crown Root Initiation Irrigation",
          reason: "Determines primary productive tillers per plant."
        },
        {
          priority: "high",
          action: "Basal Phosphorus and Organic Enrichment",
          reason: "Enhances deep root anchoring in black soil."
        },
        {
          priority: "medium",
          action: "Install Yellow Sticky Traps for Aphids",
          reason: "Prevents sap feeding without toxic pesticide residues."
        }
      ],
      assumptions: [
        "Certified high-germination seed stock is utilized.",
        "Canal water salinity is within permissible limits (< 1.5 dS/m)."
      ],
      uncertainties: [
        "Late winter rainfall and localized hail cannot be guaranteed."
      ],
      professional_help_required: false,
      professional_help_reason: null
    };

    await query(
      `INSERT INTO advisories (
        id, user_id, farm_id, advisory_type, crop, location,
        input_data, ai_response, overall_risk, suitability_score,
        model_name, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        advisoryId,
        userId,
        farmId,
        'complete',
        'Wheat (Sharbati)',
        'Babai, Hoshangabad, MP',
        JSON.stringify({ crop: 'Wheat (Sharbati)', season: 'Rabi', soilType: 'Black (Regur)', irrigationAvailable: true }),
        JSON.stringify(demoAiResponse),
        'low',
        92,
        'gemini-2.5-flash',
        'production'
      ]
    );

    // Seed actions
    for (const item of demoAiResponse.priority_actions) {
      await query(
        `INSERT INTO advisory_actions (
          id, advisory_id, title, description, priority, status
        ) VALUES ($1, $2, $3, $4, $5, 'pending')`,
        [uuidv4(), advisoryId, item.action, item.reason, item.priority]
      );
    }
    console.log('✅ Demo advisory & actionable tasks seeded.');
  }

  console.log('🌾 Database seed complete.');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
