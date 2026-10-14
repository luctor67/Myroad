
"use strict";

require("dotenv").config();
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

const { initializeApp, cert } = require("firebase-admin/app");

initializeApp({
  credential: cert(serviceAccount)
});
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// In productie alleen de ingestelde website-origin toestaan.
const allowedOrigin = process.env.CLIENT_ORIGIN;
const isLocalOrigin = origin => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
const localDevelopmentOrigin = isLocalOrigin(allowedOrigin);
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // curl/server-naar-server
    if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
    if (localDevelopmentOrigin && isLocalOrigin(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials:false
}));
app.use(express.json({ limit: "20kb" }));

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Vul SUPABASE_URL, SUPABASE_ANON_KEY en SUPABASE_SERVICE_ROLE_KEY in .env in.");
}

// Deze client heeft verhoogde rechten. Gebruik hem uitsluitend op de server.
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Deze client verifieert tokens via Supabase Auth.
const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const CARS = {
  blue: { price:0 },
  marmalade: { price:1800 },
  bloom: { price:2600 },
  violet: { price:4800 },
  bluebolt: { price:7000 },
  ivory: { price:9800 },
  sheriff: { price:12500 },
  car8: { price:14500 },
  car9: { price:16000 },
  car10: { price:18000 },
  car11: { price:20000 },
  car12: { price:22000 },
  car13: { price:24000 },
  car14: { price:26000 },
  car15: { price:28000 },
  car16: { price:30000 },
  car17: { price:32000 },
  car20: { price:35000 }
};

const PAINTS = {
  honey: { price:150 },
  terracotta: { price:250 },
  moss: { price:300 },
  heather: { price:400 },
  pearl: { price:500 },
  copper: { price:600 },
  rose: { price:750 },
  sky: { price:850 },
  plum: { price:950 },
  slate: { price:1100 },
  cream: { price:1250 },
  forest: { price:1450 }
};

const PARTS = {
  engine: { base:100 },
  handling: { base:100 },
  magnet: { base:150 }
};

const COSMETICS = {
  "wrap-stripes":350, "wrap-flames":500, "wrap-checker":450,
  "wrap-side":300, "wrap-camo":650, "wrap-woodgrain":700,
  "wrap-pinstripe":400, "wrap-stars":550,
  "rim-cream":200, "rim-copper":250, "rim-brick":300,
  "rim-sage":300, "rim-slate":350, "rim-gold":400, "rim-pearl":450,
  "spoiler-ducktail":450, "spoiler-wing":600,
  "spoiler-tall":900, "spoiler-vintage":350
};

// Exclusieve items die enkel met robijn te koop zijn.
const RUBY_CARS = {
  phantom: { price:15 },
  aurora: { price:40 },
  car18: { price:18 },
  car19: { price:28 }
};

const PROFILE_AVATARS = new Set(["car-front", "trophy", "zap", "shield", "rocket", "star"]);
const PROFILE_AVATAR_COLORS = new Set(["#d8838a", "#62e6a7", "#ffc857", "#58a6c7", "#b18cff", "#ff426d"]);

const RUBY_PAINTS = {
  "ruby-glow":5,
  "obsidian":8
};

const RUBY_COSMETICS = {
  "wrap-prism":6,
  "rim-ruby":5,
  "spoiler-blade":7
};

function fail(res, status, error) {
  return res.status(status).json({ error });
}

async function requireUser(req, res, next) {
  try {
    const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || "");
    if (!match) return fail(res, 401, "Log in om deze functie te gebruiken.");

    const { data, error } = await authClient.auth.getUser(match[1]);
    if (error || !data.user) return fail(res, 401, "Ongeldige of verlopen sessie.");

    req.user = data.user;
    next();
  } catch {
    return fail(res, 401, "Authenticatie mislukt.");
  }
}

app.get("/api/health", (_req, res) => res.json({ ok:true }));

app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  return requireUser(req, res, next);
});

async function getProfile(userId) {
  const { data, error } = await admin
    .from("profiles")
    .select("id,username,avatar,avatar_color,coins,rubies,best_score,collision_count,owned,selected,upgrades,tuning,owned_paints,owned_cosmetics,xp,player_level,coin_multiplier")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

app.get("/api/profile", async (req, res) => {
  try {
    res.json({ profile: await getProfile(req.user.id) });
  } catch (e) {
    console.error(e);
    fail(res, 500, "Profiel kon niet worden geladen.");
  }
});

app.patch("/api/profile", async (req, res) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const { avatar, avatarColor } = req.body || {};
  if (!username || [...username].length > 20 ||
      !PROFILE_AVATARS.has(avatar) || !PROFILE_AVATAR_COLORS.has(avatarColor)) {
    return fail(res, 400, "Controleer je racenaam en avatarinstellingen.");
  }

  try {
    const { error } = await admin
      .from("profiles")
      .update({ username, avatar, avatar_color:avatarColor })
      .eq("id", req.user.id);
    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch (e) {
    console.error(e);
    fail(res, 400, "De racenaam kon niet worden opgeslagen.");
  }
});

app.post("/api/garage/buy", async (req, res) => {
  const { carId } = req.body || {};
  if (!CARS[carId] || carId === "blue") {
    return fail(res, 400, "Ongeldige auto.");
  }

  try {
    const { data, error } = await admin.rpc("buy_car", {
      p_user_id: req.user.id,
      p_car_id: carId,
      p_price: CARS[carId].price
    });

    if (error) throw error;
    const profile = await getProfile(req.user.id);
    res.json({ profile });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Aankoop geweigerd. Controleer je munten en garage.");
  }
});

app.post("/api/garage/select", async (req, res) => {
  const { carId } = req.body || {};
  if (!CARS[carId] && !RUBY_CARS[carId]) return fail(res, 400, "Ongeldige auto.");

  try {
    const { error } = await admin.rpc("select_car", {
      p_user_id: req.user.id,
      p_car_id: carId
    });
    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch {
    fail(res, 400, "Auto niet beschikbaar in je garage.");
  }
});

app.post("/api/garage/ruby/buy", async (req, res) => {
  const { carId } = req.body || {};
  if (!RUBY_CARS[carId]) {
    return fail(res, 400, "Ongeldige robijn-auto.");
  }

  try {
    const { error } = await admin.rpc("buy_ruby_car", {
      p_user_id: req.user.id,
      p_car_id: carId,
      p_price: RUBY_CARS[carId].price
    });

    if (error) throw error;
    const profile = await getProfile(req.user.id);
    res.json({ profile });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Aankoop geweigerd. Controleer je robijnen en garage.");
  }
});

app.post("/api/garage/paint/ruby/buy", async (req, res) => {
  const { paintId } = req.body || {};
  if (!Object.hasOwn(RUBY_PAINTS, paintId)) {
    return fail(res, 400, "Ongeldige robijn-lakkleur.");
  }

  try {
    const { error } = await admin.rpc("buy_ruby_paint", {
      p_user_id: req.user.id,
      p_paint_id: paintId,
      p_price: RUBY_PAINTS[paintId]
    });

    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Lak kopen geweigerd. Controleer je robijnen en verfvoorraad.");
  }
});

app.post("/api/garage/cosmetic/ruby/buy", async (req, res) => {
  const { cosmeticId } = req.body || {};
  if (!Object.hasOwn(RUBY_COSMETICS, cosmeticId)) {
    return fail(res, 400, "Ongeldige robijn-cosmetica.");
  }

  try {
    const { error } = await admin.rpc("buy_ruby_cosmetic", {
      p_user_id: req.user.id,
      p_cosmetic_id: cosmeticId,
      p_price: RUBY_COSMETICS[cosmeticId]
    });

    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Cosmetica kopen geweigerd. Controleer je robijnen en collectie.");
  }
});

app.post("/api/garage/paint/buy", async (req, res) => {
  const { paintId } = req.body || {};
  const customColor = /^#[0-9a-f]{6}$/i.test(paintId || "");
  if (!PAINTS[paintId] && !customColor) return fail(res, 400, "Ongeldige lakkleur.");

  try {
    const { error } = await admin.rpc("buy_paint", {
      p_user_id: req.user.id,
      p_paint_id: paintId,
      p_price: PAINTS[paintId]?.price ?? 250
    });
    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Lak kopen geweigerd. Controleer je munten en verfvoorraad.");
  }
});

app.post("/api/garage/cosmetic/buy", async (req, res) => {
  const { cosmeticId } = req.body || {};
  if (!Object.hasOwn(COSMETICS, cosmeticId)) return fail(res, 400, "Ongeldige cosmetica.");

  try {
    const { error } = await admin.rpc("buy_cosmetic", {
      p_user_id:req.user.id,
      p_cosmetic_id:cosmeticId,
      p_price:COSMETICS[cosmeticId]
    });
    if (error) throw error;
    res.json({ profile:await getProfile(req.user.id) });
  } catch (e) {
    console.error(e.message);
    fail(res, 400, "Cosmetica kopen geweigerd. Controleer je munten en collectie.");
  }
});

app.post("/api/garage/upgrade", async (req, res) => {
  const { carId, partId } = req.body || {};
  if ((!CARS[carId] && !RUBY_CARS[carId]) || !PARTS[partId]) {
    return fail(res, 400, "Ongeldige auto of upgrade.");
  }

  try {
    const { error } = await admin.rpc("upgrade_car", {
      p_user_id: req.user.id,
      p_car_id: carId,
      p_part_id: partId,
      p_base_price: PARTS[partId].base
    });
    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch {
    fail(res, 400, "Upgrade geweigerd. Controleer je munten en upgradeniveau.");
  }
});

app.post("/api/garage/tune", async (req, res) => {
  const { carId, tuning } = req.body || {};
  const validPaint = ["#32b8ff","#ff426d","#ffc857","#b18cff","#62e6a7","#f3f6ff","#ff9850","#54f5e2","#ff5de4","#a86445","#91a46a","#d59643","#d3774e","#d7bc82","#ba7551","#78916a","#d6bd8a","#dcae52","#d8838a","#58a6c7","#855b76","#667882","#ead9b8","#456b4f","#ff2d6f","#1b1b22"];
  const validNeon = ["#35d5f4","#ff426d","#a78bfa","#62e6a7","#ffc857"];
  const validStyles = ["balanced","speed","control"];
  const validWraps = ["none","racing-stripes","flames","checker","side-stripe","camo","woodgrain","pinstripe","stars","prism"];
  const validRims = ["#332d2a","#ead9b8","#c38a47","#b14c40","#78916a","#718da5","#ffc857","#f3f6ff","#ff2d6f"];
  const validSpoilers = ["none","ducktail","wing","tall-wing","vintage-lip","blade"];

  if ((!CARS[carId] && !RUBY_CARS[carId]) || !tuning ||
      (!validPaint.includes(tuning.paint) && !/^#[0-9a-f]{6}$/i.test(tuning.paint || "")) ||
      !validNeon.includes(tuning.neon) ||
      !validStyles.includes(tuning.style) ||
      !validWraps.includes(tuning.wrap || "none") ||
      !validRims.includes(tuning.rimColor || "#332d2a") ||
      !validSpoilers.includes(tuning.spoiler || "none")) {
    return fail(res, 400, "Ongeldige tuning.");
  }

  try {
    const { error } = await admin.rpc("save_tuning", {
      p_user_id: req.user.id,
      p_car_id: carId,
      p_tuning: tuning
    });
    if (error) throw error;
    res.json({ profile: await getProfile(req.user.id) });
  } catch {
    fail(res, 400, "Tuning niet opgeslagen. Controleer of je de auto bezit.");
  }
});

app.post("/api/run/start", async (req, res) => {
  try {
    const { data, error } = await admin
      .from("game_runs")
      .insert({ user_id:req.user.id })
      .select("id,started_at")
      .single();

    if (error) throw error;
    res.json({ runId:data.id, startedAt:data.started_at });
  } catch (e) {
    console.error(e);
    fail(res, 500, "De race kon niet worden gestart.");
  }
});

app.post("/api/run/finish", async (req, res) => {
  const { runId, score, coins } = req.body || {};

  if (typeof runId !== "string" ||
      !Number.isSafeInteger(score) || score < 0 ||
      !Number.isSafeInteger(coins) || coins < 0) {
    return fail(res, 400, "Ongeldige racegegevens.");
  }

  try {
    const { data, error } = await admin.rpc("finish_run", {
      p_user_id: req.user.id,
      p_run_id: runId,
      p_score: score,
      p_coins: coins
    });

    if (error) throw error;
    res.json({ accepted:true, profile:await getProfile(req.user.id), result:data });
  } catch (e) {
    console.error("Race afgewezen:", e.message);
    fail(res, 400, "Score geweigerd. De race kan ongeldig of al verwerkt zijn.");
  }
});

app.get("/api/leaderboard", async (req, res) => {
  const columns = { score:"best_score", coins:"coins", collisions:"collision_count" };
  const column = columns[req.query.category] || columns.score;
  try {
    const { data, error } = await admin
      .from("profiles")
      .select(`username,${column}`)
      .gt(column, 0)
      .order(column, { ascending:false })
      .limit(100);

    if (error) throw error;
    res.json({ entries:data || [] });
  } catch (e) {
    console.error(e);
    fail(res, 500, "Leaderboard tijdelijk niet beschikbaar.");
  }
});

// Serve de websitebestanden vanuit de projectmap.
const path = require("path");

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/style.css", (_req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/script.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});

app.get("/firebase-config.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "firebase-config.js"));
});

app.get("/firebase.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "firebase.js"));
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Car Dodge Deluxe draait op http://localhost:${port}`);
});