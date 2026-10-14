"use strict";

// Vul deze waarden in vanuit Supabase > Project Settings > API.
const SUPABASE_URL = "https://jfdsjyqznbvilvltzpgd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Kyj9jH-lKc_8QMpPcKgjEw_pgXTU-YT";
const API_URL = "http://localhost:3000/api";

const hasSupabaseConfig =
  SUPABASE_URL.includes(".supabase.co") &&
  !SUPABASE_URL.includes("JOUW-PROJECT") &&
  !SUPABASE_ANON_KEY.includes("JOUW_");

const supabaseClient = hasSupabaseConfig
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const $ = id => document.getElementById(id);
const AVATAR_ICONS = ["car-front", "trophy", "zap", "shield", "rocket", "star"];
const AVATAR_COLORS = ["#d8838a", "#62e6a7", "#ffc857", "#58a6c7", "#b18cff", "#ff426d"];

const CARS = [
  { id:"blue", name:"Basic car", model:"sedan", image:"images/car1.png", price:0, speed:120, handling:82, bonus:1, desc:"Jouw betrouwbare eerste auto: een flinke blauwe sedan.", color:"#2f6fd0", special:{ name:"Stadswiel", description:"Een nauwkeurige botsingszone.", collisionMargin:2 } },
  { id:"marmalade", name:"Retro Van", model:"delivery-van", image:"images/car6.png", price:1800, speed:172, handling:66, bonus:1.55, desc:"Gezellige oranje bus. Langzaam maar elke munt telt dubbel.", color:"#ff8c2e", special:{ name:"Ladenruit", description:"Verzamel 40% meer munten.", coinMultiplier:1.4 } },
  { id:"bloom", name:"Kever", model:"microcar", image:"images/car3.png", price:2600, speed:212, handling:99, bonus:1.15, desc:"Klein roze stadswagentje dat door elk gaatje glipt.", color:"#ff5fa2", special:{ name:"Tassenworp", description:"Een nauwkeurige botsingszone.", collisionMargin:3 } },
  { id:"violet", name:"Violet Sprint", model:"sports-car", image:"images/car2.png", price:4800, speed:292, handling:80, bonus:1.25, desc:"Paarse sportwagen met een grote achter-spoiler.", color:"#a24bd6", special:{ name:"Grote vleugel", description:"14% hogere topsnelheid.", speedMultiplier:1.14 } },
  { id:"bluebolt", name:"Blauwe Bliksem", model:"rally", image:"images/car4.png", price:7000, speed:306, handling:88, bonus:1.3, desc:"Racewagen met witte rallystrepen en nummer 1.", color:"#2f4fd0", special:{ name:"Kopman", description:"Verdien 18% meer score.", scoreMultiplier:1.18 } },
  { id:"ivory", name:"Ivoor GT", model:"sports-car", image:"images/car5.png", price:9800, speed:326, handling:90, bonus:1.5, desc:"Crèmekleurige luxe-GT met een imposante hoge spoiler.", color:"#e8dcc0", special:{ name:"Goudkoets", description:"Verzamel 30% meer munten.", coinMultiplier:1.3 } },
  { id:"sheriff", name:"Sheriff", model:"sedan", image:"images/car7.png", price:12500, speed:302, handling:93, bonus:1.4, desc:"Politieauto met lichtbak. Snel en altijd met back-up.", color:"#3a4a6b", special:{ name:"Back-up", description:"Verdien 10% meer score.", scoreMultiplier:1.1 } },
  { id:"car8", name:"City Taxi", model:"sedan", image:"images/car8.png", price:14500, speed:220, handling:86, bonus:1.35, desc:"Gele taxi die klaarstaat voor een snelle rit.", color:"#e6c52f", special:{ name:"Taximeter", description:"Verdien 10% meer score.", scoreMultiplier:1.1 } },
  { id:"car9", name:"Lime Runner", model:"hatchback", image:"images/car9.png", price:16000, speed:245, handling:91, bonus:1.3, desc:"Lichtgroene stadsauto met scherpe besturing.", color:"#89b62b", special:{ name:"Wendbaar", description:"Meer controle in druk verkeer.", handlingBonus:4 } },
  { id:"car10", name:"Orange Racer", model:"sports-car", image:"images/car10.png", price:18000, speed:275, handling:82, bonus:1.35, desc:"Oranje sportwagen voor lange rechte wegen.", color:"#ed762d", special:{ name:"Sprint", description:"14% hogere topsnelheid.", speedMultiplier:1.14 } },
  { id:"car11", name:"Redline", model:"rally", image:"images/car11.png", price:20000, speed:288, handling:86, bonus:1.4, desc:"Rode racer met grip voor snelle bochten.", color:"#db3e42", special:{ name:"Rallybonus", description:"Verdien 12% meer score.", scoreMultiplier:1.12 } },
  { id:"car12", name:"Pink Panther", model:"coupe", image:"images/car12.png", price:22000, speed:260, handling:96, bonus:1.45, desc:"Felle roze coupé die soepel door het verkeer stuurt.", color:"#bd3ec1", special:{ name:"Bochtenwerk", description:"Extra goede handling.", handlingBonus:5 } },
  { id:"car13", name:"Forest 4x4", model:"buggy", image:"images/car13.png", price:24000, speed:250, handling:92, bonus:1.4, desc:"Groene terreinwagen met stevige grip.", color:"#5f872b", special:{ name:"Terreinbanden", description:"Extra goede handling.", handlingBonus:4 } },
  { id:"car14", name:"Violet Van", model:"minivan", image:"images/car14.png", price:26000, speed:238, handling:83, bonus:1.65, desc:"Paarse bus met ruimte voor een flinke muntopbrengst.", color:"#824bb6", special:{ name:"Ruime laadbak", description:"Verzamel 20% meer munten.", coinMultiplier:1.2 } },
  { id:"car15", name:"Lagoon Roadster", model:"roadster", image:"images/car15.png", price:28000, speed:300, handling:94, bonus:1.45, desc:"Turquoise roadster die licht en snel door de bochten gaat.", color:"#47bfb8", special:{ name:"Open weg", description:"14% hogere topsnelheid.", speedMultiplier:1.14 } },
  { id:"car16", name:"Mini Tractor", model:"tractor", image:"images/car16.png", price:30000, speed:165, handling:74, bonus:1.8, desc:"Kleine tractor: niet de snelste, wel een echte muntmagneet.", color:"#3c9b45", special:{ name:"Oogstbonus", description:"Verzamel 30% meer munten.", coinMultiplier:1.3 } },
  { id:"car17", name:"Arctic Van", model:"delivery-van", image:"images/car17.png", price:32000, speed:225, handling:81, bonus:1.7, desc:"Witte bestelbus met een stevige muntbonus.", color:"#d9e0d9", special:{ name:"Grote laadruimte", description:"Verzamel 20% meer munten.", coinMultiplier:1.2 } },
  { id:"car18", name:"Stadsfiets", model:"bicycle", image:"images/car18.png", rubyPrice:18, speed:290, handling:100, bonus:1.45, desc:"Licht, stil en verrassend snel door de stad.", color:"#38a86b", special:{ name:"Fietspad", description:"Zeer kleine botsingszone.", collisionMargin:1 } },
  { id:"car19", name:"Mini Tank", model:"tank", image:"images/car19.png", rubyPrice:28, speed:185, handling:72, bonus:1.9, desc:"Een kleine tank die langzaam maar zeker vooruitgaat.", color:"#6b7c35", special:{ name:"Pantserbonus", description:"Verdien 15% meer score.", scoreMultiplier:1.15 } },
  { id:"car20", name:"Blue Utility", model:"pickup", image:"images/car20.png", price:35000, speed:255, handling:84, bonus:1.7, desc:"Blauwe werkauto met veel pit en een ruime laadbak.", color:"#328fbd", special:{ name:"Werkpaard", description:"Verzamel 15% meer munten.", coinMultiplier:1.15 } }
];

const CAR_TYPE_LABELS = {
  sedan:"Sedan",
  hatchback:"Hatchback",
  coupe:"Coupé",
  convertible:"Cabriolet",
  minivan:"Minivan",
  "sports-car":"Sportwagen",
  pickup:"Pickup",
  "station-wagon":"Stationwagen",
  tractor:"Tractor",
  buggy:"Buggy",
  "delivery-van":"Bestelbus",
  classic:"Klassieker",
  rally:"Rallywagen",
  microcar:"Microcar",
  roadster:"Roadster",
  bicycle:"Fiets",
  tank:"Tank"
};

const PARTS = [
  { id:"engine", name:"Motor", description:"Meer snelheid en een hogere scorelimiet.", base:100 },
  { id:"handling", name:"Handling", description:"Sneller sturen en nauwkeuriger ontwijken.", base:100 },
  { id:"magnet", name:"Muntbonus", description:"Meer munten verdienen tijdens je rit.", base:150 }
];

const PAINTS = [
  { id:"honey", name:"Honey", color:"#ffc857", price:150 },
  { id:"terracotta", name:"Terracotta", color:"#ff426d", price:250 },
  { id:"moss", name:"Moss", color:"#62e6a7", price:300 },
  { id:"heather", name:"Heather", color:"#b18cff", price:400 },
  { id:"pearl", name:"Pearl", color:"#f3f6ff", price:500 },
  { id:"copper", name:"Copper", color:"#ff9850", price:600 },
  { id:"rose", name:"Rosewood", color:"#d8838a", price:750 },
  { id:"sky", name:"Bluebird", color:"#58a6c7", price:850 },
  { id:"plum", name:"Plum", color:"#855b76", price:950 },
  { id:"slate", name:"Slate", color:"#667882", price:1100 },
  { id:"cream", name:"Oat cream", color:"#ead9b8", price:1250 },
  { id:"forest", name:"Deep forest", color:"#456b4f", price:1450 },
  { id:"ruby-glow", name:"Robijngloed", color:"#ff2d6f", rubyPrice:5 },
  { id:"obsidian", name:"Obsidiaan", color:"#1b1b22", rubyPrice:8 }
];

const CUSTOM_PAINT_PRICE = 250;
const COSMETICS = [
  { id:"wrap-stripes", type:"wrap", name:"Race strepen", value:"racing-stripes", color:"#e4c486", price:350 },
  { id:"wrap-flames", type:"wrap", name:"Pixelvlammen", value:"flames", color:"#e65b36", price:500 },
  { id:"wrap-checker", type:"wrap", name:"Geblokt dak", value:"checker", color:"#f3eee0", price:450 },
  { id:"wrap-side", type:"wrap", name:"Zijstreep", value:"side-stripe", color:"#d8838a", price:300 },
  { id:"wrap-camo", type:"wrap", name:"Bos-camo", value:"camo", color:"#78916a", price:650 },
  { id:"wrap-woodgrain", type:"wrap", name:"Houtnerf", value:"woodgrain", color:"#a86445", price:700 },
  { id:"wrap-pinstripe", type:"wrap", name:"Pinstripe", value:"pinstripe", color:"#ead9b8", price:400 },
  { id:"wrap-stars", type:"wrap", name:"Sterrenrit", value:"stars", color:"#ffc857", price:550 },
  { id:"rim-cream", type:"rimColor", name:"Room", value:"#ead9b8", color:"#ead9b8", price:200 },
  { id:"rim-copper", type:"rimColor", name:"Koper", value:"#c38a47", color:"#c38a47", price:250 },
  { id:"rim-brick", type:"rimColor", name:"Baksteen", value:"#b14c40", color:"#b14c40", price:300 },
  { id:"rim-sage", type:"rimColor", name:"Salie", value:"#78916a", color:"#78916a", price:300 },
  { id:"rim-slate", type:"rimColor", name:"Leisteen", value:"#718da5", color:"#718da5", price:350 },
  { id:"rim-gold", type:"rimColor", name:"Goud", value:"#ffc857", color:"#ffc857", price:400 },
  { id:"rim-pearl", type:"rimColor", name:"Parel", value:"#f3f6ff", color:"#f3f6ff", price:450 },
  { id:"spoiler-ducktail", type:"spoiler", name:"Ducktail", value:"ducktail", color:"#ba7551", price:450 },
  { id:"spoiler-wing", type:"spoiler", name:"Racevleugel", value:"wing", color:"#d59643", price:600 },
  { id:"spoiler-tall", type:"spoiler", name:"Hoge vleugel", value:"tall-wing", color:"#78916a", price:900 },
  { id:"spoiler-vintage", type:"spoiler", name:"Vintage lip", value:"vintage-lip", color:"#ead9b8", price:350 },
  { id:"wrap-prism", type:"wrap", name:"Prisma-effect", value:"prism", color:"#ff2d6f", rubyPrice:6 },
  { id:"rim-ruby", type:"rimColor", name:"Robijn", value:"#ff2d6f", color:"#ff2d6f", rubyPrice:5 },
  { id:"spoiler-blade", type:"spoiler", name:"Robijnvleugel", value:"blade", color:"#ff2d6f", rubyPrice:7 }
];
const COSMETIC_GROUPS = {
  wrap:{ field:"wrap", defaultValue:"none", defaultName:"Geen wrap", defaultColor:"#583d2e" },
  rimColor:{ field:"rimColor", defaultValue:"#332d2a", defaultName:"Steenkool", defaultColor:"#332d2a" },
  spoiler:{ field:"spoiler", defaultValue:"none", defaultName:"Geen spoiler", defaultColor:"#583d2e" }
};

const WORLDS = {
 country: {
    ground: "#68744a", road: "#584337", lane: "#e4c486",
    edge: "#a96542", scenery: "leaf", spawn: 1,
    minimumSpawn: .42, ramp: 650, traffic: 1,
    requiredLevel: 1, description: "Rustig door het bos"
  },

  snow: {
    ground: "#d6e2d5", road: "#59656b", lane: "#f3e8c4",
    edge: "#9eb4bd", scenery: "snow", spawn: .92,
    minimumSpawn: .4, ramp: 720, traffic: .96,
    requiredLevel: 5, description: "Gladde winterwegen"
  },

  highway: {
    ground: "#69705b", road: "#42464a", lane: "#f1d988",
    edge: "#b5a778", scenery: "highway", spawn: .62,
    minimumSpawn: .3, ramp: 950, traffic: 1.08,
    requiredLevel: 10, description: "Meer verkeer, hogere snelheid"
  },

  mountain: {
    ground: "#748068", road: "#625247", lane: "#ead49c",
    edge: "#b98558", scenery: "pine", spawn: .78,
    minimumSpawn: .36, ramp: 800, traffic: 1.03,
    curve: 13, requiredLevel: 15,
    description: "Rotsen en dennenbos"
  },

  // 5. Woestijn
  desert: {
    ground: "#d8ad68", road: "#665044", lane: "#f5d99b",
    edge: "#bc7947", scenery: "cactus", spawn: .82,
    minimumSpawn: .35, ramp: 780, traffic: 1.02,
    requiredLevel: 20, description: "Race door hete zandduinen"
  },

  // 6. Nachtelijke stad
  city: {
    ground: "#343746", road: "#292b35", lane: "#f5d35e",
    edge: "#656b89", scenery: "city", spawn: .8,
    minimumSpawn: .34, ramp: 700, traffic: 1.12,
    requiredLevel: 25, description: "Neonlichten en druk stadsverkeer"
  },

  // 7. Tropisch eiland
  tropical: {
    ground: "#42a66b", road: "#56534a", lane: "#fff0b3",
    edge: "#e6a56c", scenery: "palm", spawn: .9,
    minimumSpawn: .4, ramp: 740, traffic: .98,
    requiredLevel: 30, description: "Palmbomen en tropische stranden"
  },

  // 8. Vulkanisch landschap
  volcano: {
    ground: "#493d3b", road: "#343033", lane: "#ffb45c",
    edge: "#d94e36", scenery: "volcano", spawn: .72,
    minimumSpawn: .3, ramp: 850, traffic: 1.15,
    requiredLevel: 35, description: "Race langs lava en vulkanen"
  },

  // 9. Regenachtige stad
  rain: {
    ground: "#626e73", road: "#343e45", lane: "#e7e6c7",
    edge: "#829ca5", scenery: "rain", spawn: .88,
    minimumSpawn: .38, ramp: 720, traffic: 1.08,
    requiredLevel: 40, description: "Natte wegen en slecht zicht"
  },

  // 10. Herfstbos
  autumn: {
    ground: "#9a7049", road: "#514139", lane: "#efc777",
    edge: "#d27c43", scenery: "autumn", spawn: .95,
    minimumSpawn: .4, ramp: 680, traffic: 1.0,
    requiredLevel: 45, description: "Kronkelende wegen vol herfstbladeren"
  },

  // 11. Kustroute
  coast: {
    ground: "#d9c49b", road: "#555b60", lane: "#f5e7b9",
    edge: "#76b8c4", scenery: "coast", spawn: .78,
    minimumSpawn: .34, ramp: 800, traffic: 1.04,
    requiredLevel: 50, description: "Bochtige wegen langs de oceaan"
  },

  // 12. Neon futuristische wereld
  cyberpunk: {
    ground: "#28253e", road: "#201e2e", lane: "#54f4e8",
    edge: "#ec55e8", scenery: "cyberpunk", spawn: .7,
    minimumSpawn: .28, ramp: 1000, traffic: 1.2,
    requiredLevel: 60, description: "Futuristische snelwegen en neon"
  },

  // 13. Platteland bij zonsondergang
  sunset: {
    ground: "#8b7954", road: "#51423b", lane: "#ffe2a1",
    edge: "#dc855e", scenery: "sunset", spawn: .9,
    minimumSpawn: .38, ramp: 700, traffic: .98,
    requiredLevel: 65, description: "Gouden licht en landelijke wegen"
  },

  // 14. Ruimtewereld
  space: {
    ground: "#17182d", road: "#34364c", lane: "#b5c7ff",
    edge: "#8b6be8", scenery: "space", spawn: .68,
    minimumSpawn: .25, ramp: 1100, traffic: 1.18,
    requiredLevel: 75, description: "Race over wegen tussen de sterren"
  },

  // 15. Spookachtige wereld
  haunted: {
    ground: "#343c35", road: "#42403d", lane: "#c8d5a1",
    edge: "#7c6596", scenery: "haunted", spawn: .8,
    minimumSpawn: .32, ramp: 820, traffic: 1.1,
    requiredLevel: 85, description: "Mistige wegen door een spookbos"
  },

  // 16. Racecircuit
  racetrack: {
    ground: "#428354", road: "#35383c", lane: "#ffffff",
    edge: "#e74b4b", scenery: "racetrack", spawn: .65,
    minimumSpawn: .25, ramp: 1050, traffic: 1.25,
    requiredLevel: 100, description: "Een snel circuit voor ervaren racers"
  }
};

const DEFAULT_SAVE = {
  coins:0, rubies:0, best:0, owned:["blue"], selected:"blue",
  upgrades:{}, tuning:{}, ownedPaints:[], ownedCosmetics:[], xp:0, level:1,
  coinMultiplier:1, world:"country", sound:true, avatar:"car-front", avatarColor:"#d8838a"
};

let save = loadLocal();
let session = null;
let profile = null;
let authMode = "login";
let authReturnScreen = "home";
let runToken = null;
let runStart = 0;
let onlineRun = false;
let submitPending = false;

let running = false, paused = false, raf = 0, lastTime = 0;
let player, enemies = [], coins = [], score = 0, runCoins = 0;
let speed = 210, spawnTimer = 0, coinTimer = 0, roadOffset = 0;
let engineAudio = null;
const canvas = $("game-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const ROAD_LEFT = 35, ROAD_RIGHT = W - 35;
const keys = new Set();

function loadLocal() {
  try {
    const data = JSON.parse(localStorage.getItem("carDodgeDeluxe"));
    return { ...structuredClone(DEFAULT_SAVE), ...(data || {}) };
  } catch {
    return structuredClone(DEFAULT_SAVE);
  }
}

function persistLocal() {
  localStorage.setItem("carDodgeDeluxe", JSON.stringify(save));
}

function currentCar() {
  return CARS.find(c => c.id === save.selected) || CARS[0];
}

function currentWorld() {
  const world = WORLDS[save.world] || WORLDS.country;
  return save.level >= world.requiredLevel ? world : WORLDS.country;
}

function renderWorldOptions() {
  const savedWorld = WORLDS[save.world];
  if (!savedWorld || save.level < savedWorld.requiredLevel) {
    save.world = "country";
    persistLocal();
  }
  document.querySelectorAll("[data-world]").forEach(button => {
    const world = WORLDS[button.dataset.world];
    const locked = save.level < world.requiredLevel;
    const selected = button.dataset.world === save.world && !locked;
    button.disabled = locked;
    button.title = locked ? `Vrij op level ${world.requiredLevel}` : world.description;
    button.classList.toggle("selected", selected);
    button.classList.toggle("locked", locked);
    button.setAttribute("aria-pressed", String(selected));
    const description = button.querySelector("span");
    if (description) description.textContent = locked ? `Level ${world.requiredLevel} nodig` : world.description;
  });
}

function upgradeLevel(part) {
  return Number(save.upgrades?.[save.selected]?.[part] || 0);
}

function refreshIcons() {
  window.lucide?.createIcons();
}

function refreshSoundButton() {
  const button = $("sound-button");
  if (!button) return;
  const icon = save.sound ? "volume-2" : "volume-x";
  const label = save.sound ? "Motorgeluid uitzetten" : "Motorgeluid aanzetten";
  button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  button.setAttribute("aria-label", label);
  button.title = label;
  refreshIcons();
}

async function startEngineAudio() {
  if (!save.sound || !running || paused || engineAudio) return;
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) return;

  const context = new AudioContextType();
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  oscillator.type = "sawtooth";
  oscillator.frequency.value = 70;
  filter.type = "lowpass";
  filter.frequency.value = 360;
  gain.gain.value = 0.035;
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  engineAudio = { context, oscillator, gain };
  try {
    await context.resume();
  } catch {
    stopEngineAudio();
  }
}

function updateEngineAudio() {
  if (!engineAudio || engineAudio.context.state !== "running") return;
  const targetFrequency = 42 + speed * 0.24;
  engineAudio.oscillator.frequency.setTargetAtTime(
    targetFrequency,
    engineAudio.context.currentTime,
    0.1
  );
}

function stopEngineAudio() {
  if (!engineAudio) return;
  const audio = engineAudio;
  engineAudio = null;
  const now = audio.context.currentTime;
  audio.gain.gain.setTargetAtTime(0, now, 0.04);
  audio.oscillator.stop(now + 0.15);
  window.setTimeout(() => audio.context.close().catch(() => {}), 250);
}

function toggleSound() {
  save.sound = !save.sound;
  persistLocal();
  refreshSoundButton();
  if (save.sound && running && !paused) startEngineAudio();
  else stopEngineAudio();
}

function statsFor(car) {
  const upgrades = save.upgrades?.[car.id] || {};
  const tuning = save.tuning?.[car.id] || {};
  const special = car.special || {};
  const engine = Number(upgrades.engine || 0);
  const handling = Number(upgrades.handling || 0);
  const magnet = Number(upgrades.magnet || 0);
  const style = tuning.style || "balanced";

  let speedStat = (car.speed + engine * 12) * Number(special.speedMultiplier || 1);
  let handlingStat = Math.min(100, car.handling + handling * 5 + Number(special.handlingBonus || 0));
  if (style === "speed") {
    speedStat += 15;
    handlingStat = Math.max(20, handlingStat - 10);
  } else if (style === "control") {
    speedStat -= 10;
    handlingStat = Math.min(100, handlingStat + 10);
  }

  return {
    speed:Math.max(80, speedStat),
    handling:handlingStat,
    bonus:(car.bonus + magnet * 0.15) * Number(save.coinMultiplier || 1),
    special
  };
}

function awardLocalXP(amount) {
  save.xp += Math.max(0, Math.floor(amount));
  const rewards = [];
  while (save.xp >= save.level * 100) {
    save.xp -= save.level * 100;
    save.level++;
    if (save.level % 5 !== 0) continue;

    if (save.level === 5 || (save.level - 5) % 20 === 0) {
      save.coinMultiplier *= 2;
      rewards.push(`Level ${save.level}: dubbele muntbonus`);
    } else if (save.level === 10 || save.level === 20) {
      const carId = save.level === 10 ? "cedar" : "comet";
      const car = CARS.find(option => option.id === carId);
      if (!save.owned.includes(carId)) {
        save.owned.push(carId);
        rewards.push(`Level ${save.level}: ${car.name} vrijgespeeld`);
      } else {
        save.coins += Math.floor(car.price / 2);
        rewards.push(`Level ${save.level}: ${Math.floor(car.price / 2)} bonusmunten`);
      }
    } else if (save.level === 15) {
      save.coins += 1500;
      rewards.push("Level 15: 1.500 bonusmunten");
    } else {
      const rewardCoins = save.level * 100;
      save.coins += rewardCoins;
      rewards.push(`Level ${save.level}: ${rewardCoins} bonusmunten`);
    }

    // Robijn is zeldzaam: één per level-drempel van 10.
    if (save.level % 10 === 0) {
      save.rubies += 1;
      rewards.push(`Level ${save.level}: 1 robijn`);
    }
  }
  persistLocal();
  refreshHUD();
  renderShop();
  renderGarage();
  return rewards;
}

function apiConfigured() {
  return Boolean(session?.access_token);
}

async function api(path, options = {}) {
  if (!apiConfigured()) throw new Error("Log eerst in om deze online functie te gebruiken.");
  const response = await fetch(API_URL + path, {
    ...options,
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer " + session.access_token,
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "De serveraanvraag is mislukt.");
  return body;
}

// Profielkolommen die zowel de backend als de frontend gebruiken.
const PROFILE_COLUMNS =
  "id,username,avatar,avatar_color,coins,rubies,best_score,owned,selected,upgrades,tuning,owned_paints,owned_cosmetics,xp,player_level,coin_multiplier";

// Lees het profiel rechtstreeks uit Supabase. De RLS-policy staat "select" toe voor
// ingelogde gebruikers, dus dit werkt ook zonder draaiende Express-backend.
async function readProfileDirect() {
  if (!supabaseClient || !session?.user?.id) {
    throw new Error("Geen actieve sessie om het profiel te laden.");
  }
  const { data, error } = await supabaseClient
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", session.user.id)
    .single();
  if (error) throw error;
  return { profile:data };
}

// Lees de wereldranglijst rechtstreeks uit Supabase zodat de ranking altijd werkt.
async function readLeaderboardDirect() {
  if (!supabaseClient) throw new Error("Supabase is niet geconfigureerd.");
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("username,best_score")
    .gt("best_score", 0)
    .order("best_score", { ascending:false })
    .limit(100);
  if (error) throw error;
  return { entries:data || [] };
}

function showNotice(message) {
  $("connection-status").textContent = message;
}

function drawPixelAvatar(canvas, avatar, color) {
  const context = canvas.getContext("2d");
  const pixel = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(x, y, width, height);
  };
  const skin = avatar === "shield" ? "#ecc29a" : avatar === "zap" ? "#d89470"
    : avatar === "star" ? "#b8d47c" : avatar === "trophy" ? "#efb28d"
      : avatar === "rocket" ? "#e5ae88" : "#efbb91";
  const hair = avatar === "rocket" ? "#c96b3c" : avatar === "trophy" ? "#322535"
    : avatar === "star" ? "#773f78" : avatar === "shield" ? "#694333"
      : avatar === "zap" ? "#4b2930" : "#332838";
  const outfit = shadeColor(color, 0.68);

  context.clearRect(0, 0, canvas.width, canvas.height);
  pixel(0, 0, 32, 32, color);
  pixel(0, 27, 32, 5, shadeColor(color, 0.78));
  pixel(6, 25, 20, 7, outfit);
  pixel(12, 24, 8, 4, skin);
  pixel(7, 12, 3, 6, skin);
  pixel(22, 12, 3, 6, skin);
  pixel(8, 7, 16, 15, skin);
  pixel(7, 10, 2, 9, hair);
  pixel(23, 10, 2, 9, hair);
  pixel(10, 14, 3, 3, "#fff1d0");
  pixel(19, 14, 3, 3, "#fff1d0");
  pixel(11, 15, 2, 2, "#30242a");
  pixel(20, 15, 2, 2, "#30242a");
  pixel(13, 19, 6, 1, "#a94e50");
  pixel(14, 20, 4, 1, "#f5d2a7");

  if (avatar === "car-front") {
    pixel(6, 5, 20, 5, hair);
    pixel(5, 9, 22, 2, color);
    pixel(14, 5, 4, 2, "#fff0c7");
  } else if (avatar === "trophy") {
    pixel(7, 6, 18, 4, hair);
    pixel(8, 3, 4, 4, "#ffc857");
    pixel(14, 1, 4, 6, "#ffc857");
    pixel(20, 3, 4, 4, "#ffc857");
    pixel(13, 5, 6, 2, "#fff0a6");
  } else if (avatar === "zap") {
    pixel(6, 5, 20, 5, hair);
    pixel(7, 9, 4, 9, hair);
    pixel(21, 9, 5, 9, hair);
    pixel(12, 13, 9, 1, "#1e2433");
    pixel(13, 14, 7, 3, "#9fd9e8");
  } else if (avatar === "shield") {
    pixel(7, 5, 18, 5, hair);
    pixel(6, 8, 20, 3, "#d5dce1");
    pixel(14, 7, 4, 3, color);
    pixel(13, 27, 6, 5, "#e2c781");
  } else if (avatar === "rocket") {
    pixel(6, 6, 20, 5, hair);
    pixel(6, 4, 5, 5, hair);
    pixel(21, 4, 5, 5, hair);
    pixel(13, 17, 6, 2, "#fff0c7");
    pixel(14, 18, 4, 1, "#d95b5b");
  } else {
    pixel(7, 5, 18, 5, hair);
    pixel(5, 8, 4, 5, hair);
    pixel(23, 8, 4, 5, hair);
    pixel(8, 2, 2, 6, "#e2d57d");
    pixel(22, 2, 2, 6, "#e2d57d");
    pixel(8, 1, 3, 3, "#ff9f7b");
    pixel(21, 1, 3, 3, "#ff9f7b");
  }

  pixel(8, 27, 16, 2, color);
  pixel(11, 29, 10, 2, shadeColor(color, 1.2));
}

function renderAvatarPicker() {
  const avatar = AVATAR_ICONS.includes(save.avatar) ? save.avatar : "car-front";
  const color = AVATAR_COLORS.includes(save.avatarColor) ? save.avatarColor : AVATAR_COLORS[0];
  save.avatar = avatar;
  save.avatarColor = color;

  const headerAvatar = $("header-avatar");
  headerAvatar.style.setProperty("--avatar-color", color);
  headerAvatar.innerHTML = '<canvas width="32" height="32" aria-hidden="true"></canvas>';
  drawPixelAvatar(headerAvatar.querySelector("canvas"), avatar, color);
  const preview = $("profile-avatar-preview");
  preview.style.setProperty("--avatar-color", color);
  preview.innerHTML = '<canvas width="32" height="32" aria-hidden="true"></canvas>';
  drawPixelAvatar(preview.querySelector("canvas"), avatar, color);
  $("profile-avatar-options").innerHTML = AVATAR_ICONS.map(icon => `
    <button class="avatar-option ${avatar === icon ? "selected" : ""}" type="button"
      data-avatar="${icon}" aria-label="Avatar ${icon}" aria-pressed="${avatar === icon}">
      <canvas width="32" height="32" aria-hidden="true"></canvas>
    </button>
  `).join("");
  $("profile-avatar-options").querySelectorAll("[data-avatar]").forEach(button => {
    drawPixelAvatar(button.querySelector("canvas"), button.dataset.avatar, color);
  });
  $("profile-avatar-colors").innerHTML = AVATAR_COLORS.map(option => `
    <button class="avatar-color-option ${color === option ? "selected" : ""}" type="button"
      data-avatar-color="${option}" style="--avatar-color:${option}"
      aria-label="Avatarkleur ${option}" aria-pressed="${color === option}"></button>
  `).join("");
  $("profile-avatar-options").querySelectorAll("[data-avatar]").forEach(button => {
    button.addEventListener("click", () => {
      save.avatar = button.dataset.avatar;
      renderAvatarPicker();
    });
  });
  $("profile-avatar-colors").querySelectorAll("[data-avatar-color]").forEach(button => {
    button.addEventListener("click", () => {
      save.avatarColor = button.dataset.avatarColor;
      renderAvatarPicker();
    });
  });
  refreshIcons();
}

function renderProfile() {
  renderAvatarPicker();
  const signedIn = Boolean(session?.user);
  $("profile-guest").classList.toggle("hidden", signedIn);
  $("profile-dashboard").classList.toggle("hidden", !signedIn);
  if (!signedIn) return;

  const username = profile?.username || session.user.email?.split("@")[0] || "Racer";
  const upgrades = Object.values(save.upgrades || {}).reduce((total, parts) =>
    total + Object.values(parts || {}).reduce((sum, level) => sum + Number(level || 0), 0), 0);
  $("profile-name").textContent = username;
  $("profile-email").textContent = session.user.email || "";
  $("profile-username").value = username;
  $("profile-best").textContent = Number(save.best || 0).toLocaleString("nl-BE");
  $("profile-level").textContent = save.level;
  $("profile-xp").textContent = `${save.xp} / ${save.level * 100} XP`;
  $("profile-coins").textContent = Number(save.coins || 0).toLocaleString("nl-BE");
  $("profile-rubies").textContent = Number(save.rubies || 0).toLocaleString("nl-BE");
  $("profile-rank").textContent = save.best >= 5000 ? "ELITE" : save.best >= 1500 ? "PRO" : save.best >= 500 ? "RACER" : "ROOKIE";
  $("profile-cars").textContent = save.owned.length;
  $("profile-car").textContent = currentCar().name;
  $("profile-world").textContent = WORLDS[save.world]?.description || "Landweg";
  $("profile-multiplier").textContent = `${Number(save.coinMultiplier || 1).toFixed(2)}x`;
  $("profile-upgrades").textContent = upgrades;
  $("profile-items").textContent = `${save.ownedPaints.length} / ${save.ownedCosmetics.length}`;
}

function showScreen(name) {
  const names = ["home","shop","garage","leaderboard","profile","auth","game","over"];
  names.forEach(n => $(`${n}-screen`).classList.toggle("hidden", n !== name));
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.screen === name);
  });
  window.scrollTo({ top:0, behavior:"smooth" });
}

function refreshHUD() {
  $("coin-total").textContent = save.coins;
  $("shop-coins").textContent = save.coins;
  $("ruby-total").textContent = save.rubies;
  $("shop-rubies").textContent = save.rubies;
  $("best-score").textContent = save.best;
  $("owned-count").textContent = save.owned.length;
  $("player-name").textContent = profile?.username?.toUpperCase() || "GASTSPELER";
  $("player-rank").textContent =
    save.best >= 5000 ? "ELITE" : save.best >= 1500 ? "PRO" : save.best >= 500 ? "RACER" : "ROOKIE";
  $("player-level").textContent = save.level;
  const nextLevelXP = save.level * 100;
  $("level-progress-fill").style.width = `${Math.min(100, save.xp / nextLevelXP * 100)}%`;
  $("level-xp").textContent = `${save.xp} / ${nextLevelXP} XP`;
  renderWorldOptions();

  const car = currentCar();
  renderCarArt($("hero-car"), car);
  $("hero-speed").textContent = Math.round(statsFor(car).speed);
  renderProfile();
}

// Cache voor auto-sprites zodat elke PNG maar één keer wordt geladen.
const CAR_IMAGE_CACHE = {};
function getCarImage(src) {
  if (CAR_IMAGE_CACHE[src]) return CAR_IMAGE_CACHE[src];
  const img = new Image();
  img.src = src;
  CAR_IMAGE_CACHE[src] = img;
  return img;
}

function colorToHsl(color) {
  const hex = color.replace("#", "");
  const channels = hex.length === 3
    ? hex.split("").map(channel => parseInt(channel + channel, 16) / 255)
    : [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  let hue = 0;
  let saturation = 0;

  if (delta) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue /= 6;
    if (hue < 0) hue += 1;
  }
  return { hue, saturation, lightness };
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue * 6;
  const secondary = chroma * (1 - Math.abs(section % 2 - 1));
  const offset = lightness - chroma / 2;
  const channels = section < 1 ? [chroma, secondary, 0]
    : section < 2 ? [secondary, chroma, 0]
      : section < 3 ? [0, chroma, secondary]
        : section < 4 ? [0, secondary, chroma]
          : section < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  return channels.map(channel => Math.round((channel + offset) * 255));
}

function createTunedCarSprite(image, car, tuning) {
  const sprite = document.createElement("canvas");
  sprite.width = image.naturalWidth;
  sprite.height = image.naturalHeight;
  const spriteContext = sprite.getContext("2d", { willReadFrequently:true });
  spriteContext.imageSmoothingEnabled = false;
  spriteContext.drawImage(image, 0, 0);

  if (tuning.paint && tuning.paint !== car.color) {
    const pixels = spriteContext.getImageData(0, 0, sprite.width, sprite.height);
    const original = colorToHsl(car.color);
    const target = colorToHsl(tuning.paint);
    const neutralSprite = original.saturation < 0.25;
    for (let index = 0; index < pixels.data.length; index += 4) {
      if (pixels.data[index + 3] === 0) continue;
      const color = colorToHsl(`#${[0, 1, 2].map(channel =>
        pixels.data[index + channel].toString(16).padStart(2, "0")).join("")}`);
      const hueDifference = Math.min(
        Math.abs(color.hue - original.hue),
        1 - Math.abs(color.hue - original.hue)
      );
      const neutralBodyPixel = neutralSprite && color.saturation < 0.18 &&
        color.lightness > 0.52 && color.lightness < 0.96;
      if (!neutralBodyPixel &&
          (color.saturation < 0.28 || color.lightness < 0.16 || hueDifference > 0.1)) continue;
      const [red, green, blue] = hslToRgb(
        target.hue,
        neutralBodyPixel
          ? target.saturation
          : target.saturation * Math.min(1, color.saturation / Math.max(original.saturation, 0.1)),
        color.lightness
      );
      pixels.data[index] = red;
      pixels.data[index + 1] = green;
      pixels.data[index + 2] = blue;
    }
    spriteContext.putImageData(pixels, 0, 0);
  }

  spriteContext.save();
  spriteContext.globalCompositeOperation = "source-atop";
  if (tuning.wrap === "racing-stripes") {
    spriteContext.fillStyle = "#f3eee0";
    spriteContext.fillRect(22, 14, 2, 9);
    spriteContext.fillRect(28, 14, 2, 9);
  } else if (tuning.wrap === "flames") {
    spriteContext.fillStyle = "#e65b36";
    [[18,18,9],[22,16,11],[27,18,9],[35,17,10],[41,19,8]].forEach(([x,y,width]) => spriteContext.fillRect(x,y,width,2));
  } else if (tuning.wrap === "checker") {
    spriteContext.fillStyle = "#f3eee0";
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 8; column++) {
        if ((row + column) % 2 === 0) spriteContext.fillRect(24 + column * 2, 15 + row * 2, 2, 2);
      }
    }
  } else if (tuning.wrap === "side-stripe") {
    spriteContext.fillStyle = "#d8838a";
    spriteContext.fillRect(14, 20, 39, 2);
  } else if (tuning.wrap === "camo") {
    [[18,15,8,3,"#456b4f"],[30,17,9,3,"#30251f"],[40,14,7,3,"#78916a"],
      [23,21,8,2,"#30251f"],[35,21,7,2,"#456b4f"]].forEach(([x,y,width,height,color]) => {
      spriteContext.fillStyle = color;
      spriteContext.fillRect(x, y, width, height);
    });
  } else if (tuning.wrap === "woodgrain") {
    [[17,16,34,1,"#ead9b8"],[20,19,30,1,"#704735"],[24,22,24,1,"#ead9b8"]].forEach(([x,y,width,height,color]) => {
      spriteContext.fillStyle = color;
      spriteContext.fillRect(x, y, width, height);
    });
  } else if (tuning.wrap === "pinstripe") {
    spriteContext.fillStyle = tuning.neon || "#ffc857";
    spriteContext.fillRect(17, 16, 36, 1);
    spriteContext.fillRect(20, 20, 31, 1);
  } else if (tuning.wrap === "stars") {
    spriteContext.fillStyle = tuning.neon || "#ffc857";
    [[22,16],[31,20],[40,15],[47,21]].forEach(([x,y]) => {
      spriteContext.fillRect(x, y, 2, 2);
      spriteContext.fillRect(x + 1, y - 1, 1, 4);
    });
  } else if (tuning.wrap === "prism") {
    ["#ff2d6f", "#ffc857", "#62e6a7", "#58a6c7"].forEach((color, index) => {
      spriteContext.fillStyle = color;
      spriteContext.fillRect(20 + index * 7, 15 + index % 2 * 3, 5, 2);
    });
  }

  if (tuning.rimColor && tuning.rimColor !== "#332d2a") {
    spriteContext.fillStyle = tuning.rimColor;
    spriteContext.fillRect(10, 21, 4, 4);
    spriteContext.fillRect(45, 21, 4, 4);
  }
  if (tuning.neon && tuning.neon !== "#35d5f4") {
    spriteContext.fillStyle = tuning.neon;
    spriteContext.fillRect(18, 27, 30, 1);
  }
  if (tuning.spoiler && tuning.spoiler !== "none") {
    spriteContext.fillStyle = tuning.spoiler === "blade" ? "#ff2d6f" : tuning.paint || car.color;
    spriteContext.fillRect(3, 11, tuning.spoiler === "tall-wing" ? 12 : 9, 3);
    if (["wing", "tall-wing", "blade"].includes(tuning.spoiler)) {
      spriteContext.fillRect(5, 9, 2, 7);
    }
  }
  spriteContext.restore();
  return sprite;
}

function renderCarArt(element, car) {
  if (!element) return;
  const art = element.getContext("2d");
  const tuning = save.tuning?.[car.id] || {};
  const hasVisualTuning =
    (tuning.paint && tuning.paint !== car.color) ||
    (tuning.neon && tuning.neon !== "#35d5f4") ||
    (tuning.wrap && tuning.wrap !== "none") ||
    (tuning.rimColor && tuning.rimColor !== "#332d2a") ||
    (tuning.spoiler && tuning.spoiler !== "none");

  // PNG-sprites blijven de basis; tuning wordt direct op de sprite toegepast.
  if (car.image) {
    const img = getCarImage(car.image);
    art.imageSmoothingEnabled = false;
    art.clearRect(0, 0, element.width, element.height);
    if (img.complete && img.naturalWidth) {
      const sprite = hasVisualTuning ? createTunedCarSprite(img, car, tuning) : img;
      const scale = Math.max(1, Math.floor(Math.min(element.width / img.naturalWidth, element.height / img.naturalHeight)));
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = Math.floor((element.width - w) / 2);
      const y = Math.floor((element.height - h) / 2);
      art.drawImage(sprite, x, y, w, h);
    } else {
      // Nog niet geladen: teken tijdelijk de procedurale top-down en herteken zodra de PNG klaar is.
      drawPixelCarProfile(art, element, car.model, tuning.paint || car.color, tuning);
      img.addEventListener("load", () => renderCarArt(element, car), { once:true });
    }
    return;
  }

  drawPixelCarProfile(art, element, car.model, tuning.paint || car.color, tuning);
}

// Hex-kleur lichter (amount > 0) of donkerder (amount < 0) maken — voor pixel-art shading.
function shiftHex(hex, amount) {
  let h = String(hex || "#888888").replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const num = parseInt(h, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  if (amount >= 0) {
    r += (255 - r) * amount; g += (255 - g) * amount; b += (255 - b) * amount;
  } else {
    r *= (1 + amount); g *= (1 + amount); b *= (1 + amount);
  }
  const to = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
const lighten = (hex, amount) => shiftHex(hex, amount);
const darken = (hex, amount) => shiftHex(hex, -amount);

function drawPixelCarProfile(art, canvasElement, model, paint, tuning = {}) {
  const scale = Math.max(1, Math.floor(Math.min(canvasElement.width / 64, canvasElement.height / 32)));
  const offsetX = Math.floor((canvasElement.width - 64 * scale) / 2);
  const offsetY = Math.floor((canvasElement.height - 32 * scale) / 2);
  const pixel = (x, y, width, height, color) => {
    art.fillStyle = color;
    art.fillRect(x, y, width, height);
  };
  const roofRows = {
    sedan:[[6,25,38],[7,21,43],[8,18,47],[9,17,48],[10,16,49]],
    hatchback:[[5,22,38],[6,19,43],[7,16,47],[8,15,49],[9,14,50]],
    coupe:[[7,29,38],[8,25,43],[9,21,47],[10,19,49],[11,18,50]],
    convertible:[[8,29,39],[9,26,44],[10,24,47],[11,23,49]],
    minivan:[[4,18,44],[5,16,48],[6,15,49],[7,15,50],[8,15,50]],
    "sports-car":[[8,29,37],[9,25,42],[10,22,46],[11,20,48]],
    pickup:[[6,24,37],[7,21,42],[8,18,46],[9,17,47]],
    "station-wagon":[[5,22,38],[6,19,43],[7,16,47],[8,15,49],[9,14,50]],
    tractor:[[7,31,39],[8,27,44],[9,25,46]],
    buggy:[[7,27,38],[8,23,43],[9,21,46],[10,20,47]],
    "delivery-van":[[4,18,43],[5,15,48],[6,14,50],[7,13,51],[8,13,51]],
    classic:[[6,25,39],[7,22,44],[8,20,47],[9,19,48]],
    rally:[[5,23,39],[6,19,44],[7,16,48],[8,15,50]],
    microcar:[[7,28,38],[8,24,43],[9,22,45],[10,21,46]],
    roadster:[[9,29,38],[10,27,42],[11,24,46]]
  }[model] || [[6,25,38],[7,21,43],[8,18,47],[9,17,48]];
  const bodyRows = [[12,43],[11,48],[9,53],[7,57],[6,59],[5,60],[5,60],[6,59],[8,57],[10,54],[13,51],[17,47]];

  art.save();
  art.imageSmoothingEnabled = false;
  art.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  art.clearRect(-offsetX / scale, -offsetY / scale, canvasElement.width / scale, canvasElement.height / scale);

  bodyRows.forEach(([left, right], row) => {
    const y = row + 12;
    // Donkere contour + gekleurde carrosserie; de onderste helft krijgt extra
    // schaduw en de bovenste een lichte reflectie voor een 3D-uitstraling.
    pixel(left, y, right - left + 1, 1, "#30251f");
    const shade = row < 6 ? lighten(paint, 0.14) : row > 9 ? darken(paint, 0.16) : paint;
    pixel(left + 1, y, right - left - 1, 1, shade);
  });
  pixel(8, 22, 50, 2, "#382820");
  // Reflectielijn over de bovenkant van de body.
  pixel(10, 24, 46, 1, lighten(paint, 0.32));

  const accent = tuning.neon || "#a8ba7d";
  if (tuning.wrap === "racing-stripes") {
    pixel(21, 14, 28, 2, accent);
    pixel(21, 17, 28, 1, "#f8dfaa");
  } else if (tuning.wrap === "flames") {
    [[34,16,15],[32,17,18],[35,18,13],[39,19,9]].forEach(([x,y,width]) => pixel(x,y,width,1,accent));
    pixel(36, 17, 10, 1, "#f4d889");
  } else if (tuning.wrap === "checker") {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 6; column++) {
        if ((row + column) % 2 === 0) pixel(31 + column * 2, 14 + row * 2, 2, 2, accent);
      }
    }
  } else if (tuning.wrap === "side-stripe") {
    pixel(20, 18, 34, 2, accent);
    pixel(20, 20, 27, 1, "#f8dfaa");
  } else if (tuning.wrap === "prism") {
    const prismColors = ["#ff2d6f","#ff9f43","#ffe66d","#4ecdc4"];
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 12; column++) {
        pixel(20 + column * 3, 14 + row * 2, 3, 1, prismColors[(row + column) % prismColors.length]);
      }
    }
    pixel(20, 19, 36, 1, "#fff0f5");
  }

  if (tuning.spoiler === "ducktail") {
    pixel(5, 12, 8, 2, "#30251f");
    pixel(6, 12, 6, 1, paint);
  } else if (tuning.spoiler === "wing") {
    pixel(7, 10, 3, 7, "#30251f");
    pixel(2, 9, 14, 2, paint);
    pixel(4, 11, 10, 1, "#30251f");
  } else if (tuning.spoiler === "blade") {
    pixel(6, 11, 3, 8, "#1b1b22");
    pixel(1, 9, 16, 2, "#ff2d6f");
    pixel(3, 8, 12, 1, "#ff8fb0");
    pixel(4, 12, 10, 1, "#1b1b22");
  }

  roofRows.forEach(([y, left, right], index) => {
    pixel(left - 1, y, right - left + 3, 1, "#30251f");
    // Het dak krijgt aan de bovenkant licht en naar beneden meer schaduw.
    const roofShade = index === 0 ? lighten(paint, 0.22)
      : index < 2 ? lighten(paint, 0.08)
      : index >= roofRows.length - 2 ? darken(paint, 0.14) : paint;
    pixel(left, y, right - left + 1, 1, roofShade);
  });

  const windows = {
    sedan:[[20,8,9,4],[32,8,10,4]],
    hatchback:[[18,7,10,5],[31,7,13,5]],
    coupe:[[25,9,18,3]],
    convertible:[[27,10,6,3],[36,10,6,3],[44,9,2,5]],
    minivan:[[18,6,11,5],[32,6,14,5]],
    "sports-car":[[27,10,15,3]],
    pickup:[[21,8,10,4],[34,9,8,3]],
    "station-wagon":[[18,7,10,5],[31,7,14,5]],
    tractor:[[28,9,13,3]],
    buggy:[[26,9,7,4],[36,9,7,4]],
    "delivery-van":[[17,6,12,5],[32,6,14,5]],
    classic:[[21,8,9,4],[33,8,11,4]],
    rally:[[19,7,11,5],[33,7,13,5]],
    microcar:[[26,9,14,4]],
    roadster:[[31,11,5,2],[39,11,5,2]]
  }[model] || [[20,8,9,4],[32,8,10,4]];
  windows.forEach(([x, y, width, height]) => {
    pixel(x - 1, y - 1, width + 2, height + 2, "#30251f");
    // Glas met een verticale gradiënt: donker onder, licht boven + glansstreep.
    const glassTop = "#9aa7a2";
    const glassBottom = "#5d6a70";
    const half = Math.max(1, Math.floor(height / 2));
    pixel(x, y, width, half, glassTop);
    pixel(x, y + half, width, height - half, glassBottom);
    pixel(x + 1, y + 1, Math.max(1, width - 3), 1, "#d7e0d3");
  });

  if (model === "pickup") {
    pixel(10, 15, 9, 5, "#7e523b");
    pixel(11, 16, 7, 3, "#a56d49");
  }

  [10, 45].forEach(x => {
    const wheelRows = [[2,5],[1,6],[0,7],[0,7],[0,7],[0,7],[1,6],[2,5]];
    wheelRows.forEach(([left, right], row) => {
      pixel(x + left, 18 + row, right - left + 1, 1, "#241f1d");
      if (row > 1 && row < 7) pixel(x + left + 1, 18 + row, right - left - 1, 1, tuning.rimColor || "#332d2a");
      pixel(20, 14, 9, 1, accent);
    });
    pixel(x + 3, 20, 2, 1, "#b7b4a4");
    pixel(x + 2, 22, 4, 1, "#8a887f");
  });
  pixel(56, 16, 4, 2, "#f4d889");
  pixel(6, 16, 3, 2, "#b84f45");
  pixel(31, 15, 1, 6, "#51372a");
  pixel(33, 16, 3, 1, "#f1d49a");
  pixel(22, 14, 25, 1, "#f8dfaa");
  if (model === "sports-car" || model === "rally" || model === "roadster") {
    pixel(56, 12, 4, 1, "#30251f");
    pixel(58, 10, 2, 3, "#30251f");
  }
  if (model === "tractor") {
    pixel(47, 15, 3, 5, "#6a4734");
    pixel(50, 17, 5, 2, "#d2ac5c");
  }
  art.restore();
}

function renderMetrics(car) {
  const stats = statsFor(car);
  const metrics = [
    ["Snelheid", Math.min(100, stats.speed / 3), Math.round(stats.speed), "gauge"],
    ["Handling", stats.handling, Math.round(stats.handling), "move"],
    ["Muntbonus", Math.min(100, stats.bonus / 2 * 100), `${stats.bonus.toFixed(2)}x`, "coins"]
  ];
  return metrics.map(([name, value, label, icon]) => `
    <div class="metric">
      <span class="metric-label"><i data-lucide="${icon}" aria-hidden="true"></i>${name}</span>
      <div class="meter"><span style="width:${Math.max(2, Math.min(100, value))}%"></span></div>
      <b>${label}</b>
    </div>
  `).join("");
}

function renderShop() {
  $("car-list").innerHTML = CARS.map(car => {
    const owned = save.owned.includes(car.id);
    const selected = save.selected === car.id;
    const stats = statsFor(car);
    const ruby = typeof car.rubyPrice === "number";
    const price = ruby ? car.rubyPrice : car.price;
    const balance = ruby ? save.rubies : save.coins;
    const disabled = !owned && balance < price;

    return `
      <article class="car-card ${selected ? "selected" : ""} ${ruby ? "ruby-item" : ""}">
        <div class="car-preview"><canvas class="car-preview-canvas" data-car-art="${car.id}" width="240" height="135" aria-hidden="true"></canvas></div>
        ${ruby ? '<span class="car-type ruby-badge"><i data-lucide="gem" aria-hidden="true"></i> Exclusief · Robijn</span>' : `<span class="car-type">${CAR_TYPE_LABELS[car.model]}</span>`}
        <h3>${car.name}</h3>
        <p>${car.desc}</p>
        <div class="car-special"><strong><i data-lucide="sparkles" aria-hidden="true"></i> ${car.special.name}</strong><span>${car.special.description}</span></div>
        <div class="car-metrics">${renderMetrics(car)}</div>
        <div class="car-price">${owned ? '<i data-lucide="check" aria-hidden="true"></i> In jouw garage' : `<i data-lucide="${ruby ? "gem" : "coins"}" aria-hidden="true"></i> ${price.toLocaleString("nl-BE")} ${ruby ? "robijn" : "munten"}`}</div>
        <button class="btn ${selected ? "primary" : "secondary"}"
          data-car="${car.id}" ${selected || disabled ? "disabled" : ""}>
          ${selected ? '<i data-lucide="check" aria-hidden="true"></i> Geselecteerd' : owned ? '<i data-lucide="car-front" aria-hidden="true"></i> Selecteer auto' : `<i data-lucide="shopping-cart" aria-hidden="true"></i> Koop met ${ruby ? "robijn" : "munten"}`}
        </button>
      </article>
    `;
  }).join("");

  $("car-list").querySelectorAll("[data-car]").forEach(button => {
    button.addEventListener("click", () => buyOrSelect(button.dataset.car));
  });
  $("car-list").querySelectorAll("[data-car-art]").forEach(canvas => {
    renderCarArt(canvas, CARS.find(car => car.id === canvas.dataset.carArt));
  });
  refreshIcons();
}

async function buyOrSelect(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;
  const ruby = typeof car.rubyPrice === "number";

  if (save.owned.includes(id)) {
    save.selected = id;
    persistLocal();
    if (session) {
      try { await api("/garage/select", { method:"POST", body:JSON.stringify({ carId:id }) }); }
      catch (e) { showNotice("Auto lokaal geselecteerd. Online synchronisatie: " + e.message); }
    }
  } else {
    const price = ruby ? car.rubyPrice : car.price;
    const balance = ruby ? save.rubies : save.coins;
    if (balance < price) {
      return alert(ruby ? "Je hebt niet genoeg robijn voor deze exclusieve auto." : "Je hebt niet genoeg munten.");
    }
    if (session) {
      try {
        const data = await api(ruby ? "/garage/ruby/buy" : "/garage/buy", {
          method:"POST", body:JSON.stringify({ carId:id })
        });
        applyProfile(data.profile);
      } catch (e) {
        return alert("Aankoop mislukt: " + e.message);
      }
    } else {
      if (ruby) save.rubies -= price; else save.coins -= price;
      save.owned.push(id);
      save.selected = id;
      persistLocal();
      showNotice("Aankoop lokaal bewaard. Log in om aankopen online te synchroniseren.");
    }
  }
  refreshHUD();
  renderShop();
  renderGarage();
}

function renderGarage() {
  const car = currentCar();
  const tuning = save.tuning?.[car.id] || {};
  renderCarArt($("garage-car"), car);
  $("garage-car-type").textContent = CAR_TYPE_LABELS[car.model];
  $("garage-car-name").textContent = car.name;
  $("garage-car-description").textContent = car.desc;
    $("garage-car-special").innerHTML = `<strong><i data-lucide="sparkles" aria-hidden="true"></i> ${car.special.name}</strong><span>${car.special.description}</span>`;
  $("car-stats").innerHTML = renderMetrics(car);

  $("garage-select").innerHTML = CARS
    .filter(c => save.owned.includes(c.id))
    .map(c => `<option value="${c.id}" ${c.id === car.id ? "selected" : ""}>${c.name}</option>`)
    .join("");

  $("paint-select").value = tuning.paint || car.color;
  $("paint-picker").value = tuning.paint || car.color;
  renderPaintOptions(car);
  renderCosmeticOptions(car, "wrap");
  renderCosmeticOptions(car, "rimColor");
  renderCosmeticOptions(car, "spoiler");
  refreshCustomPaintButton(car);

  $("upgrade-list").innerHTML = PARTS.map(part => {
    const level = upgradeLevel(part.id);
    const price = part.base * (level + 1);
    return `
      <div class="upgrade-row">
        <div>
          <h4>${part.name} <span class="muted">LVL ${level}/5</span></h4>
          <p>${part.description}</p>
          <div class="meter"><span style="width:${level * 20}%"></span></div>
        </div>
        <button class="btn secondary" data-upgrade="${part.id}"
          ${level >= 5 || save.coins < price ? "disabled" : ""}>
          ${level >= 5 ? "MAX" : `<i data-lucide="coins" aria-hidden="true"></i> ${price}`}
        </button>
      </div>`;
  }).join("");

  $("upgrade-list").querySelectorAll("[data-upgrade]").forEach(button => {
    button.addEventListener("click", () => buyUpgrade(button.dataset.upgrade));
  });
  refreshIcons();
}

function priceInfo(item) {
  const ruby = typeof item.rubyPrice === "number";
  const price = ruby ? item.rubyPrice : (item.price || 0);
  const balance = ruby ? save.rubies : save.coins;
  const suffix = ruby ? "robijn" : "munten";
  return { ruby, price, balance, suffix, label:`${price} ${suffix}` };
}

function renderPaintOptions(car) {
  const tuning = save.tuning?.[car.id] || {};
  const currentPaint = tuning.paint || car.color;
  const options = [{ id:"factory", name:"Fabriekslak", color:car.color, price:0 }, ...PAINTS];
  $("paint-options").innerHTML = options.map(paint => {
    const unlocked = paint.id === "factory" ||
      save.ownedPaints.includes(paint.id) || tuning.paint === paint.color;
    const info = priceInfo(paint);
    const selected = currentPaint === paint.color && unlocked;
    const label = unlocked ? selected ? "Gekozen" : "Gebruik" : info.label;
    return `<button class="paint-option ${selected ? "selected" : ""} ${info.ruby ? "ruby-item" : ""}" type="button"
      data-paint="${paint.id}" ${!unlocked && info.balance < info.price ? "disabled" : ""}
      aria-label="${paint.name}, ${label}" aria-pressed="${selected}">
      <span class="paint-swatch" style="--paint-color:${paint.color}"></span>
      <span class="paint-option-label"><strong>${paint.name}</strong><small>${info.ruby ? "◆ " : ""}${label}</small></span>
    </button>`;
  }).join("");
  $("paint-options").querySelectorAll("[data-paint]").forEach(button => {
    button.addEventListener("click", () => choosePaint(button.dataset.paint));
  });
  refreshIcons();
}

function refreshCustomPaintButton(car = currentCar()) {
  const button = $("buy-custom-paint");
  if (!button) return;
  const color = $("paint-picker").value.toLowerCase();
  const tuning = save.tuning?.[car.id] || {};
  const unlocked = save.ownedPaints.includes(color) || tuning.paint === color || color === car.color;
  button.textContent = unlocked ? "GEBRUIK KLEUR" : `KOOP KLEUR · ${CUSTOM_PAINT_PRICE}`;
  button.disabled = !unlocked && save.coins < CUSTOM_PAINT_PRICE;
}

function renderCosmeticOptions(car, type) {
  const group = COSMETIC_GROUPS[type];
  const target = $(`${type === "rimColor" ? "rim" : type}-options`);
  const tuning = save.tuning?.[car.id] || {};
  const selectedValue = tuning[group.field] || group.defaultValue;
  const options = [
    { id:`${type}-default`, name:group.defaultName, value:group.defaultValue, color:group.defaultColor, price:0, default:true },
    ...COSMETICS.filter(option => option.type === type)
  ];
  target.dataset.value = selectedValue;
  target.innerHTML = options.map(option => {
    const unlocked = option.default || save.ownedCosmetics.includes(option.id) || tuning[group.field] === option.value;
    const info = priceInfo(option);
    const selected = selectedValue === option.value && unlocked;
    const label = unlocked ? selected ? "Gekozen" : "Gebruik" : info.label;
    return `<button class="paint-option cosmetic-option ${selected ? "selected" : ""} ${info.ruby ? "ruby-item" : ""}" type="button"
      data-cosmetic="${option.id}" ${!unlocked && info.balance < info.price ? "disabled" : ""}
      aria-label="${option.name}, ${label}" aria-pressed="${selected}">
      <span class="paint-swatch" style="--paint-color:${option.color}"></span>
      <span class="paint-option-label"><strong>${option.name}</strong><small>${info.ruby ? "◆ " : ""}${label}</small></span>
    </button>`;
  }).join("");
  target.querySelectorAll("[data-cosmetic]").forEach(button => {
    button.addEventListener("click", () => chooseCosmetic(button.dataset.cosmetic));
  });
}

async function equipTuningValue(car, field, value) {
  save.tuning[car.id] = { ...(save.tuning?.[car.id] || {}), [field]:value };
  persistLocal();
  if (session) {
    try {
      const data = await api("/garage/tune", {
        method:"POST",
        body:JSON.stringify({ carId:car.id, tuning:save.tuning[car.id] })
      });
      applyProfile(data.profile);
    } catch (error) {
      showNotice("Cosmetica lokaal opgeslagen; online opslaan mislukte: " + error.message);
    }
  }
  refreshHUD();
  renderGarage();
  renderShop();
}

async function chooseCosmetic(id) {
  const cosmetic = COSMETICS.find(option => option.id === id);
  if (!cosmetic) return;
  const car = currentCar();
  const group = COSMETIC_GROUPS[cosmetic.type];
  const tuning = save.tuning?.[car.id] || {};
  const unlocked = save.ownedCosmetics.includes(id) || tuning[group.field] === cosmetic.value;
  const info = priceInfo(cosmetic);
  if (!unlocked && info.balance < info.price) {
    return alert(info.ruby ? "Je hebt niet genoeg robijn voor deze exclusieve cosmetica." : "Je hebt niet genoeg munten voor deze cosmetica.");
  }

  if (!unlocked && session) {
    try {
      const data = await api(info.ruby ? "/garage/cosmetic/ruby/buy" : "/garage/cosmetic/buy", {
        method:"POST",
        body:JSON.stringify({ cosmeticId:id })
      });
      applyProfile(data.profile);
    } catch (error) {
      return alert("Cosmetica kopen mislukt: " + error.message);
    }
  } else if (!unlocked) {
    if (info.ruby) save.rubies -= info.price; else save.coins -= info.price;
    save.ownedCosmetics.push(id);
  }
  await equipTuningValue(car, group.field, cosmetic.value);
}

async function buyCustomPaint() {
  const car = currentCar();
  const color = $("paint-picker").value.toLowerCase();
  const tuning = save.tuning?.[car.id] || {};
  const unlocked = save.ownedPaints.includes(color) || tuning.paint === color || color === car.color;
  if (!unlocked && save.coins < CUSTOM_PAINT_PRICE) return alert("Je hebt niet genoeg munten voor deze kleur.");

  if (!unlocked && session) {
    try {
      const data = await api("/garage/paint/buy", {
        method:"POST",
        body:JSON.stringify({ paintId:color })
      });
      applyProfile(data.profile);
    } catch (error) {
      return alert("Kleur kopen mislukt: " + error.message);
    }
  } else if (!unlocked) {
    save.coins -= CUSTOM_PAINT_PRICE;
    save.ownedPaints.push(color);
  }
  $("paint-select").value = color;
  await equipTuningValue(car, "paint", color);
}

async function choosePaint(paintId) {
  const car = currentCar();
  const tuning = save.tuning?.[car.id] || {};
  const paint = paintId === "factory"
    ? { id:"factory", name:"Fabriekslak", color:car.color, price:0 }
    : PAINTS.find(option => option.id === paintId);
  if (!paint) return;

  const unlocked = paint.id === "factory" ||
    save.ownedPaints.includes(paint.id) || tuning.paint === paint.color;
  const info = priceInfo(paint);
  if (!unlocked && info.balance < info.price) {
    return alert(info.ruby ? "Je hebt niet genoeg robijn voor deze exclusieve lak." : "Je hebt niet genoeg munten voor deze lak.");
  }

  if (!unlocked && session) {
    try {
      const data = await api(info.ruby ? "/garage/paint/ruby/buy" : "/garage/paint/buy", {
        method:"POST",
        body:JSON.stringify({ paintId:paint.id })
      });
      applyProfile(data.profile);
    } catch (error) {
      return alert("Lak kopen mislukt: " + error.message);
    }
  } else if (!unlocked) {
    if (info.ruby) save.rubies -= info.price; else save.coins -= info.price;
    save.ownedPaints.push(paint.id);
  }

  save.tuning[car.id] = { ...(save.tuning?.[car.id] || {}), paint:paint.color };
  persistLocal();
  if (session) {
    try {
      const data = await api("/garage/tune", {
        method:"POST",
        body:JSON.stringify({ carId:car.id, tuning:save.tuning[car.id] })
      });
      applyProfile(data.profile);
    } catch (error) {
      showNotice("Lak lokaal toegepast, maar online opslaan mislukte: " + error.message);
    }
  }
  refreshHUD();
  renderShop();
  renderGarage();
}

async function buyUpgrade(partId) {
  const part = PARTS.find(p => p.id === partId);
  if (!part) return;

  const level = upgradeLevel(partId);
  if (level >= 5) return;
  const price = part.base * (level + 1);
  if (save.coins < price) return alert("Niet genoeg munten.");

  if (session) {
    try {
      const data = await api("/garage/upgrade", {
        method:"POST",
        body:JSON.stringify({ carId:save.selected, partId })
      });
      applyProfile(data.profile);
    } catch (e) {
      return alert("Upgrade mislukt: " + e.message);
    }
  } else {
    save.coins -= price;
    save.upgrades[save.selected] ||= {};
    save.upgrades[save.selected][partId] = level + 1;
    persistLocal();
    const rewards = awardLocalXP(25 * (level + 1));
    showNotice(rewards.length
      ? rewards.join(" · ")
      : "Upgrade lokaal opgeslagen. Log in voor online voortgang.");
  }

  refreshHUD();
  renderGarage();
}

async function saveTuning() {
  const previousTuning = save.tuning[save.selected] || {};
  save.tuning[save.selected] = {
    paint:$("paint-select").value,
    neon:previousTuning.neon || "#35d5f4",
    style:previousTuning.style || "balanced",
    wrap:$("wrap-options").dataset.value || "none",
    rimColor:$("rim-options").dataset.value || "#332d2a",
    spoiler:$("spoiler-options").dataset.value || "none"
  };
  persistLocal();

  if (session) {
    try {
      await api("/garage/tune", {
        method:"POST",
        body:JSON.stringify({
          carId:save.selected,
          tuning:save.tuning[save.selected]
        })
      });
      showNotice("Tuning online opgeslagen.");
    } catch (e) {
      showNotice("Tuning lokaal bewaard, maar online opslaan mislukte: " + e.message);
    }
  } else {
    showNotice("Tuning lokaal bewaard. Log in om online op te slaan.");
  }

  renderGarage();
  refreshHUD();
}

function applyProfile(p) {
  if (!p) return;
  profile = p;
  save.coins = Number(p.coins || 0);
  save.rubies = Number(p.rubies || 0);
  save.best = Number(p.best_score || 0);
  save.owned = Array.isArray(p.owned) ? p.owned : ["blue"];
  if (!save.owned.includes("blue")) save.owned.unshift("blue");
  save.selected = save.owned.includes(p.selected) ? p.selected : "blue";
  save.upgrades = p.upgrades || {};
  save.tuning = p.tuning || {};
  save.ownedPaints = Array.isArray(p.owned_paints) ? p.owned_paints : (save.ownedPaints || []);
  save.xp = Number(p.xp || 0);
  save.level = Number(p.player_level || 1);
  save.coinMultiplier = Number(p.coin_multiplier || 1);
  save.ownedCosmetics = Array.isArray(p.owned_cosmetics) ? p.owned_cosmetics : (save.ownedCosmetics || []);
  save.avatar = AVATAR_ICONS.includes(p.avatar) ? p.avatar : "car-front";
  save.avatarColor = AVATAR_COLORS.includes(p.avatar_color) ? p.avatar_color : AVATAR_COLORS[0];
  persistLocal();
  refreshHUD();
}

async function loadProfile() {
  if (!session) return;
  let data;
  try {
    // Probeer eerst de vertrouwde backend (meest complete, gevalideerd).
    data = await api("/profile");
  } catch (backendError) {
    // Backend niet bereikbaar: lees het profiel direct uit Supabase.
    try {
      data = await readProfileDirect();
    } catch {
      throw backendError;
    }
  }
  applyProfile(data.profile);
  renderShop();
  renderGarage();
}

function setAuthMode(mode) {
  authMode = mode;
  $("auth-title").textContent = mode === "login" ? "Welkom terug, racer" : "Word een racer";
  $("auth-submit").textContent = mode === "login" ? "INLOGGEN" : "ACCOUNT AANMAKEN";
  $("auth-username").classList.toggle("hidden", mode === "login");
  $("auth-switch").textContent = mode === "login"
    ? "Nog geen account? Registreren"
    : "Heb je al een account? Inloggen";
  $("auth-password").autocomplete = mode === "login" ? "current-password" : "new-password";
}

async function handleAuth(event) {
  event.preventDefault();
  if (!supabaseClient) {
    $("auth-message").textContent = "Vul eerst je Supabase URL en publishable key in script.js.";
    return;
  }

  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;
  const username = $("auth-username").value.trim();

  $("auth-message").textContent = "Even geduld...";
  try {
    if (authMode === "register") {
      const { data, error } = await supabaseClient.auth.signUp({
        email, password,
        options:{ data:{ username:username || "Racer" } }
      });
      if (error) throw error;
      if (!data.session) {
        $("auth-message").textContent =
          "Account aangemaakt. Bevestig je e-mailadres en log daarna in.";
        return;
      }
      session = data.session;
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      session = data.session;
    }

    const { data:sessionData } = await supabaseClient.auth.getSession();
    session = sessionData.session;
    if (!session) throw new Error("Kon geen actieve sessie verkrijgen.");

    // De login is geslaagd zodra de Supabase-sessie staat. Profiel en ranglijst
    // mogen dat niet ongedaan maken als de backend even niet bereikbaar is.
    const returnScreen = authReturnScreen;
    authReturnScreen = "home";
    $("auth-message").textContent = "Ingelogd!";
    showNotice("Online verbonden. Je voortgang wordt aan je account gekoppeld.");
    refreshHUD();
    showScreen(returnScreen);

    try {
      await loadProfile();
    } catch (e) {
      showNotice("Ingelogd, maar profiel laden is mislukt: " + e.message);
    }
    try {
      await loadLeaderboard();
    } catch { /* ranglijst-fout mag de login niet blokkeren */ }
    updateSaveStatus();
  } catch (error) {
    $("auth-message").textContent = error.message;
  }
}

async function logout() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  session = null;
  profile = null;
  save = loadLocal();
  refreshHUD();
  renderShop();
  renderGarage();
  showNotice("Je bent uitgelogd. Lokale demo-voortgang blijft op dit apparaat.");
  showScreen("home");
}

async function loadLeaderboard() {
  const target = $("leaderboard-list");
  target.innerHTML = '<p class="muted">Leaderboard laden...</p>';

  if (!session) {
    target.innerHTML = '<p class="muted">Log in om de echte wereldranglijst te bekijken.</p>';
    return;
  }

  let rows = [];
  try {
    // Lees direct uit Supabase zodat de ranking ook zonder backend werkt.
    const direct = await readLeaderboardDirect();
    rows = direct.entries || [];
  } catch (directError) {
    // Fallback naar de backend als de directe read wordt geblokkeerd.
    try {
      const data = await api("/leaderboard");
      rows = data.entries || [];
    } catch (e) {
      target.innerHTML = `<p class="muted">${escapeHTML(e.message)}</p>`;
      return;
    }
  }

  target.innerHTML = rows.length ? rows.map((entry, i) => `
    <div class="leader-row">
      <span class="rank-number">${i + 1}</span>
      <span>${escapeHTML(entry.username || "Racer")}</span>
      <strong>${Number(entry.best_score).toLocaleString("nl-BE")}</strong>
    </div>
  `).join("") : '<p class="muted">Nog geen scores. Start de eerste race!</p>';
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[c]);
}

// ----- GAMEPLAY -----

// Maakt een kleur lichter (>1) of donkerder (<1) voor diepte en shading.
function shadeColor(hex, amount) {
  const h = String(hex || "#888888").replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, Math.round(((num >> 16) & 255) * amount)));
  const g = Math.max(0, Math.min(255, Math.round(((num >> 8) & 255) * amount)));
  const b = Math.max(0, Math.min(255, Math.round((num & 255) * amount)));
  return `rgb(${r},${g},${b})`;
}

// Tekent een trompvormige autobody (neus smaller dan staart) als canvas-path.
function bodyPath(t, leftTop, rightTop, leftBottom, rightBottom, top, bottom) {
  t.beginPath();
  t.moveTo(leftTop, top);
  t.lineTo(rightTop, top);
  t.lineTo(rightBottom, bottom);
  t.lineTo(leftBottom, bottom);
  t.closePath();
}

function drawCar(x, y, w, h, color, neon = "#a8ba7d", model = "hatchback", target = ctx, customization = {}, vehicleId = "") {
  const rim = customization.rimColor || "#332d2a";
  const accent = customization.neon || neon;
  const light = shadeColor(color, 1.24);
  const dark = shadeColor(color, 0.6);
  const edge = shadeColor(color, 0.38);

  if (["bicycle", "tractor", "tank"].includes(model)) {
    target.save();
    target.shadowColor = "rgba(15,8,6,0.42)";
    target.shadowBlur = 5;
    target.shadowOffsetY = 3;

    if (model === "bicycle") {
      const center = x + w / 2;
      const wheelWidth = Math.max(4, w * 0.15);
      const wheelHeight = h * 0.2;
      target.fillStyle = "#171819";
      target.fillRect(center - wheelWidth / 2, y + h * 0.04, wheelWidth, wheelHeight);
      target.fillRect(center - wheelWidth / 2, y + h * 0.76, wheelWidth, wheelHeight);
      target.shadowBlur = 0;
      target.shadowOffsetY = 0;
      target.strokeStyle = edge;
      target.lineWidth = Math.max(2, w * 0.08);
      target.beginPath();
      target.moveTo(center, y + h * 0.2);
      target.lineTo(x + w * 0.73, y + h * 0.53);
      target.lineTo(center, y + h * 0.79);
      target.lineTo(x + w * 0.28, y + h * 0.5);
      target.closePath();
      target.stroke();
      target.strokeStyle = color;
      target.lineWidth = Math.max(2, w * 0.06);
      target.beginPath();
      target.moveTo(center, y + h * 0.2);
      target.lineTo(x + w * 0.73, y + h * 0.53);
      target.lineTo(center, y + h * 0.79);
      target.lineTo(x + w * 0.28, y + h * 0.5);
      target.closePath();
      target.stroke();
      target.strokeStyle = rim;
      target.lineWidth = Math.max(2, w * 0.08);
      target.beginPath();
      target.moveTo(center, y + h * 0.2);
      target.lineTo(x + w * 0.28, y + h * 0.2);
      target.moveTo(center, y + h * 0.2);
      target.lineTo(x + w * 0.72, y + h * 0.2);
      target.stroke();
      target.fillStyle = accent;
      target.fillRect(center - 2, y + h * 0.46, 4, 4);
      target.fillStyle = "#fff0c0";
      target.fillRect(center - 2, y + h * 0.03, 4, 3);
      target.fillStyle = "#ff5a4d";
      target.fillRect(center - 2, y + h * 0.94, 4, 3);
    } else if (model === "tractor") {
      const rearY = y + h * 0.64;
      const frontY = y + h * 0.19;
      target.fillStyle = "#20201d";
      target.fillRect(x + w * 0.02, rearY, w * 0.29, h * 0.29);
      target.fillRect(x + w * 0.69, rearY, w * 0.29, h * 0.29);
      target.fillRect(x + w * 0.12, frontY, w * 0.2, h * 0.17);
      target.fillRect(x + w * 0.68, frontY, w * 0.2, h * 0.17);
      target.shadowBlur = 0;
      target.shadowOffsetY = 0;
      target.fillStyle = rim;
      target.fillRect(x + w * 0.08, rearY + h * 0.06, w * 0.17, h * 0.17);
      target.fillRect(x + w * 0.75, rearY + h * 0.06, w * 0.17, h * 0.17);
      target.fillStyle = dark;
      target.fillRect(x + w * 0.2, y + h * 0.12, w * 0.6, h * 0.58);
      target.fillStyle = color;
      target.fillRect(x + w * 0.25, y + h * 0.09, w * 0.5, h * 0.52);
      target.fillStyle = "#46565d";
      target.fillRect(x + w * 0.28, y + h * 0.2, w * 0.44, h * 0.23);
      target.fillStyle = "#9fb0b5";
      target.fillRect(x + w * 0.31, y + h * 0.22, w * 0.38, h * 0.07);
      target.fillStyle = accent;
      target.fillRect(x + w * 0.32, y + h * 0.47, w * 0.36, 3);
      target.fillStyle = "#fff0c0";
      target.fillRect(x + w * 0.28, y + h * 0.05, w * 0.16, 3);
      target.fillRect(x + w * 0.56, y + h * 0.05, w * 0.16, 3);
    } else {
      const trackWidth = w * 0.23;
      target.fillStyle = "#1e211c";
      target.fillRect(x + 1, y + h * 0.06, trackWidth, h * 0.88);
      target.fillRect(x + w - trackWidth - 1, y + h * 0.06, trackWidth, h * 0.88);
      target.shadowBlur = 0;
      target.shadowOffsetY = 0;
      target.fillStyle = "#55594a";
      for (let mark = 0; mark < 8; mark++) {
        target.fillRect(x + 2, y + h * (0.1 + mark * 0.1), trackWidth - 2, 2);
        target.fillRect(x + w - trackWidth, y + h * (0.1 + mark * 0.1), trackWidth - 2, 2);
      }
      target.fillStyle = edge;
      target.fillRect(x + w * 0.21, y + h * 0.08, w * 0.58, h * 0.84);
      target.fillStyle = color;
      target.fillRect(x + w * 0.25, y + h * 0.11, w * 0.5, h * 0.78);
      target.fillStyle = shadeColor(color, 0.78);
      target.fillRect(x + w * 0.3, y + h * 0.14, w * 0.4, h * 0.18);
      target.fillStyle = "#46565d";
      target.fillRect(x + w * 0.34, y + h * 0.18, w * 0.32, h * 0.15);
      target.fillStyle = dark;
      target.fillRect(x + w * 0.32, y + h * 0.45, w * 0.36, h * 0.26);
      target.fillStyle = color;
      target.fillRect(x + w * 0.35, y + h * 0.48, w * 0.3, h * 0.2);
      target.fillStyle = accent;
      target.fillRect(x + w * 0.46, y + h * 0.52, w * 0.08, h * 0.12);
      if (customization.wrap === "camo") {
        target.fillStyle = "#4e5a34";
        target.fillRect(x + w * 0.28, y + h * 0.38, w * 0.15, h * 0.08);
        target.fillRect(x + w * 0.56, y + h * 0.72, w * 0.12, h * 0.08);
      }
      target.fillStyle = "#fff0c0";
      target.fillRect(x + w * 0.32, y + h * 0.04, w * 0.12, 3);
      target.fillRect(x + w * 0.56, y + h * 0.04, w * 0.12, 3);
    }

    target.restore();
    return;
  }

  // Model-variaties: slanke sportwagens zijn small bij de neus, bakwagens boxy.
  const slim = ["sports-car","coupe","roadster","rally","microcar","convertible","classic"].includes(model);
  const wide = ["pickup","minivan","delivery-van","tractor","station-wagon","buggy"].includes(model);
  const topInset = slim ? 0.14 : wide ? 0.04 : 0.08;
  const botInset = slim ? 0.2 : wide ? 0.05 : 0.1;

  const leftTop = x + w * topInset;
  const rightTop = x + w * (1 - topInset);
  const leftBottom = x + w * botInset;
  const rightBottom = x + w * (1 - botInset);
  const top = y;
  const bottom = y + h;
  const pad = 2;

  target.save();
  target.shadowColor = "rgba(15,8,6,0.45)";
  target.shadowBlur = 8;
  target.shadowOffsetY = 4;

  // 1. Contour (donkerste laag) met grondschaduw.
  target.fillStyle = edge;
  bodyPath(target, leftTop, rightTop, leftBottom, rightBottom, top, bottom);
  target.fill();
  target.shadowBlur = 0;
  target.shadowOffsetY = 0;

  // 2. Carrosserie-basis.
  target.fillStyle = color;
  bodyPath(target, leftTop + pad, rightTop - pad, leftBottom + pad, rightBottom - pad, top + pad, bottom - pad);
  target.fill();

  // 3. Highlight over de neus (licht valt van boven).
  target.fillStyle = light;
  bodyPath(target, leftTop + pad + 1, rightTop - pad - 1, leftBottom + w * 0.16, rightBottom - w * 0.16, top + pad, top + h * 0.56);
  target.fill();

  // 4. Schaduw aan staart en onderkant.
  target.fillStyle = dark;
  bodyPath(target, leftBottom + w * 0.14, rightBottom - w * 0.14, leftBottom + pad, rightBottom - pad, bottom - h * 0.28, bottom - pad);
  target.fill();

  // 5. Subtiele doorlopende daklijn.
  target.globalAlpha = 0.35;
  target.fillStyle = edge;
  target.fillRect(x + w * 0.3, top + h * 0.12, w * 0.4, 1);
  target.globalAlpha = 1;

  // --- Wielen met velg (steken net buiten de body uit) ---
  [h * 0.16, h * 0.74].forEach(wy => {
    [-1, 1].forEach(side => {
      const wx = side < 0 ? x + w * 0.05 : x + w * 0.83;
      const ww = w * 0.12;
      const wh = h * 0.16;
      const ty = top + wy;
      target.fillStyle = "#1c1715";
      target.fillRect(wx, ty, ww, wh);
      target.fillStyle = rim;
      target.fillRect(wx + 2, ty + 2, ww - 4, wh - 4);
      target.fillStyle = shadeColor(rim, 1.35);
      target.fillRect(wx + ww * 0.34, ty + wh * 0.36, ww * 0.32, wh * 0.3);
    });
  });

  // --- Ruiten: cabine + voorruit met glans ---
  const cabW = w * 0.58;
  const isVan = model === "delivery-van" || model === "minivan";
  const isSportsCar = ["sports-car", "coupe", "roadster", "rally"].includes(model);
  const cabWidth = isSportsCar ? w * 0.5 : isVan ? w * 0.64 : cabW;
  const cabTop = top + h * (isVan ? 0.24 : isSportsCar ? 0.28 : 0.3);
  const cabH = h * (isVan ? 0.34 : isSportsCar ? 0.2 : 0.24);
  target.fillStyle = "#46565d";
  target.fillRect(x + (w - cabWidth) / 2, cabTop, cabWidth, cabH);
  target.fillStyle = "#9fb0b5";
  target.fillRect(x + (w - cabWidth) / 2 + 2, cabTop + 1, cabWidth - 4, 2);
  target.fillStyle = "#46565d";
  target.fillRect(x + w * 0.3, top + h * 0.2, w * 0.4, h * 0.08);

  if (isVan) {
    target.fillStyle = edge;
    target.fillRect(x + w * 0.15, top + h * 0.63, w * 0.7, h * 0.25);
    target.fillStyle = shadeColor(color, 0.92);
    target.fillRect(x + w * 0.19, top + h * 0.66, w * 0.62, h * 0.19);
    target.fillStyle = edge;
    target.fillRect(x + w * 0.49, top + h * 0.67, 1, h * 0.17);
  } else if (model === "pickup") {
    target.fillStyle = edge;
    target.fillRect(x + w * 0.16, top + h * 0.62, w * 0.68, h * 0.26);
    target.fillStyle = shadeColor(color, 0.82);
    target.fillRect(x + w * 0.22, top + h * 0.65, w * 0.56, h * 0.19);
    target.fillStyle = light;
    target.fillRect(x + w * 0.27, top + h * 0.68, w * 0.46, 2);
  }

  if (vehicleId === "car8") {
    target.fillStyle = "#31251e";
    target.fillRect(x + w * 0.37, top + h * 0.39, w * 0.26, h * 0.09);
    target.fillStyle = "#fff1a8";
    target.fillRect(x + w * 0.4, top + h * 0.4, w * 0.2, h * 0.06);
  } else if (vehicleId === "sheriff") {
    target.fillStyle = "#e84f4f";
    target.fillRect(x + w * 0.34, top + h * 0.4, w * 0.16, 3);
    target.fillStyle = "#56a8e8";
    target.fillRect(x + w * 0.5, top + h * 0.4, w * 0.16, 3);
  } else if (vehicleId === "bluebolt" || vehicleId === "car11") {
    target.fillStyle = "#f4e8ca";
    target.fillRect(x + w * 0.38, top + 4, w * 0.07, h * 0.2);
    target.fillRect(x + w * 0.55, top + 4, w * 0.07, h * 0.2);
  }

  // --- Neon accentlijn over de flank ---
  target.globalAlpha = 0.85;
  target.fillStyle = accent;
  target.fillRect(x + w * 0.28, top + h * 0.6, w * 0.44, 2);
  target.globalAlpha = 1;

  // --- Koplampen (voorkant) + achterlichten ---
  target.fillStyle = "#fff4c0";
  target.fillRect(x + w * 0.2, top + 3, w * 0.16, 4);
  target.fillRect(x + w * 0.64, top + 3, w * 0.16, 4);
  target.fillStyle = "#ff5a4d";
  target.fillRect(x + w * 0.16, bottom - 6, w * 0.18, 4);
  target.fillRect(x + w * 0.66, bottom - 6, w * 0.18, 4);

  // --- Spoilers ---
  if (customization.spoiler === "ducktail") {
    target.fillStyle = color;
    target.fillRect(x + w * 0.1, bottom - 12, w * 0.8, 6);
    target.fillStyle = edge;
    target.fillRect(x + w * 0.1, bottom - 7, w * 0.8, 1);
  } else if (customization.spoiler === "wing") {
    target.fillStyle = "#1c1715";
    target.fillRect(x + w * 0.06, bottom - 14, w * 0.88, 3);
    target.fillRect(x + w * 0.12, bottom - 9, 3, 6);
    target.fillRect(x + w * 0.84, bottom - 9, 3, 6);
    target.fillStyle = color;
    target.fillRect(x + w * 0.03, bottom - 16, w * 0.94, 4);
  } else if (customization.spoiler === "tall-wing") {
    target.fillStyle = "#1c1715";
    target.fillRect(x + w * 0.08, bottom - 20, w * 0.84, 4);
    target.fillRect(x + w * 0.12, bottom - 16, 3, 8);
    target.fillRect(x + w * 0.84, bottom - 16, 3, 8);
    target.fillStyle = accent;
    target.fillRect(x + w * 0.05, bottom - 22, w * 0.9, 3);
  } else if (customization.spoiler === "vintage-lip") {
    target.fillStyle = shadeColor(color, 0.7);
    target.fillRect(x + w * 0.12, bottom - 10, w * 0.76, 4);
  } else if (customization.spoiler === "blade") {
    target.fillStyle = "#1b1b22";
    target.fillRect(x + w * 0.12, bottom - 12, w * 0.76, 5);
    target.fillStyle = "#ff2d6f";
    target.fillRect(x + w * 0.06, bottom - 14, w * 0.88, 3);
    target.fillStyle = "#ff8fb0";
    target.fillRect(x + w * 0.2, bottom - 15, w * 0.6, 1);
  }

  // --- Wraps ---
  const wrap = customization.wrap;
  if (wrap === "racing-stripes") {
    target.fillStyle = accent;
    target.fillRect(x + w * 0.38, top + 3, w * 0.07, h - 8);
    target.fillRect(x + w * 0.55, top + 3, w * 0.07, h - 8);
    target.fillStyle = "#f8dfaa";
    target.fillRect(x + w * 0.38, top + h * 0.42, w * 0.07, h * 0.3);
    target.fillRect(x + w * 0.55, top + h * 0.42, w * 0.07, h * 0.3);
  } else if (wrap === "flames") {
    target.fillStyle = "#e65b36";
    [[0.2,0.32],[0.34,0.4],[0.28,0.52],[0.44,0.56],[0.5,0.44]].forEach(([fx, fy]) => {
      target.fillRect(x + w * fx, top + h * fy, w * 0.14, h * 0.1);
    });
    target.fillStyle = "#f2bf54";
    target.fillRect(x + w * 0.3, top + h * 0.54, w * 0.36, 3);
  } else if (wrap === "checker") {
    target.fillStyle = accent;
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 3; column++) {
        if ((row + column) % 2 === 0) {
          target.fillRect(x + w * 0.28 + column * w * 0.16, top + h * 0.16 + row * h * 0.06, w * 0.16, h * 0.06);
        }
      }
    }
  } else if (wrap === "side-stripe") {
    target.fillStyle = accent;
    target.fillRect(x + w * 0.16, top + h * 0.6, w * 0.68, 3);
    target.fillStyle = "#f8dfaa";
    target.fillRect(x + w * 0.16, top + h * 0.63, w * 0.68, 1);
  } else if (wrap === "camo") {
    const camo = ["#5c6b3a","#6f7d45","#48552f","#7d8a52"];
    const patches = [[0.24,0.18],[0.44,0.14],[0.6,0.24],[0.28,0.36],[0.5,0.4],[0.66,0.44],[0.36,0.56],[0.58,0.6]];
    patches.forEach(([px, py], i) => {
      target.fillStyle = camo[i % camo.length];
      target.fillRect(x + w * px, top + h * py, w * 0.16, h * 0.11);
    });
  } else if (wrap === "woodgrain") {
    target.fillStyle = "#8a5a2b";
    target.fillRect(x + w * 0.22, top + h * 0.16, w * 0.56, h * 0.46);
    target.fillStyle = "#a8703a";
    target.fillRect(x + w * 0.22, top + h * 0.16, w * 0.56, 1);
    target.fillStyle = "#6b4420";
    for (let i = 0; i < 5; i++) {
      target.fillRect(x + w * 0.22, top + h * (0.24 + i * 0.08), w * 0.56, 1);
    }
  } else if (wrap === "pinstripe") {
    target.fillStyle = accent;
    target.fillRect(x + w * 0.34, top + 3, 2, h - 8);
    target.fillRect(x + w * 0.64, top + 3, 2, h - 8);
  } else if (wrap === "stars") {
    target.fillStyle = accent;
    [[0.3,0.2],[0.6,0.18],[0.45,0.34],[0.34,0.5],[0.62,0.48]].forEach(([sx, sy]) => {
      const sx0 = x + w * sx;
      const sy0 = top + h * sy;
      target.fillRect(sx0, sy0, 3, 3);
      target.fillRect(sx0 - 1, sy0 + 1, 5, 1);
      target.fillRect(sx0 + 1, sy0 - 1, 1, 5);
    });
  } else if (wrap === "prism") {
    const prism = ["#ff2d6f","#ff9f43","#ffe66d","#4ecdc4","#7b6cff"];
    for (let row = 0; row < 5; row++) {
      for (let column = 0; column < 8; column++) {
        target.fillStyle = prism[(row + column) % prism.length];
        target.fillRect(x + w * 0.24 + column * w * 0.07, top + h * 0.14 + row * h * 0.07, w * 0.07, h * 0.07);
      }
    }
    target.fillStyle = "#fff0f5";
    target.fillRect(x + w * 0.24, top + h * 0.42, w * 0.56, 1);
  }

  target.restore();
}

function roadBendAt(y, world = currentWorld()) {
  return world.curve ? Math.sin((y + roadOffset * 1.5) / 88) * world.curve : 0;
}

function drawRoad(dt = 0) {
  const world = currentWorld();
  ctx.fillStyle = world.ground;
  ctx.fillRect(0, 0, W, H);

  roadOffset = (roadOffset + speed * dt) % 58;
  const treeOffset = (roadOffset * 2.1) % 126;
  if (world.scenery === "highway") {
    for (let y = -45 + roadOffset; y < H + 35; y += 72) {
      drawPixelGuardrail(21, y);
      drawPixelGuardrail(W - 31, y + 36);
    }
  } else {
    for (let y = -100 + treeOffset; y < H + 40; y += 126) {
      drawPixelTree(3, y, world.scenery);
      drawPixelTree(W - 29, y + 63, world.scenery);
      if (world.scenery === "pine") drawPixelRock(2, y + 85);
    }
  }

  ctx.fillStyle = world.road;
  if (world.curve) {
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(ROAD_LEFT + roadBendAt(y, world), y, ROAD_RIGHT - ROAD_LEFT, 4);
    }
  } else {
    ctx.fillRect(ROAD_LEFT, 0, ROAD_RIGHT - ROAD_LEFT, H);
  }

  const laneWidth = (ROAD_RIGHT - ROAD_LEFT) / 3;
  ctx.fillStyle = world.lane;
  for (let y = -58 + roadOffset; y < H; y += 58) {
    const bend = roadBendAt(y + 13, world);
    ctx.fillRect(ROAD_LEFT + bend + laneWidth - 2, y, 4, 27);
    ctx.fillRect(ROAD_LEFT + bend + laneWidth * 2 - 2, y, 4, 27);
  }

  ctx.fillStyle = world.edge;
  if (world.curve) {
    for (let y = 0; y < H; y += 4) {
      const bend = roadBendAt(y, world);
      ctx.fillRect(ROAD_LEFT + bend, y, 4, 4);
      ctx.fillRect(ROAD_RIGHT - 4 + bend, y, 4, 4);
    }
  } else {
    ctx.fillRect(ROAD_LEFT, 0, 4, H);
    ctx.fillRect(ROAD_RIGHT - 4, 0, 4, H);
  }

  if (world.scenery !== "highway") {
    ctx.fillStyle = world.scenery === "snow" ? "#f3eee0" : "#9aa66b";
    for (let y = -32 + roadOffset; y < H; y += 64) {
      ctx.fillRect(10, y, 7, 3);
      ctx.fillRect(W - 23, y + 24, 8, 3);
    }
  }
}

function drawPixelTree(x, y, style = "leaf") {
  ctx.fillStyle = "#493020";
  ctx.fillRect(x + 10, y + 17, 7, 14);
  const darkLeaves = style === "snow" ? "#455d59" : style === "pine" ? "#344a3b" : "#39482d";
  const leaves = style === "snow" ? "#6c8980" : style === "pine" ? "#526c4b" : "#667b43";
  ctx.fillStyle = darkLeaves;
  ctx.fillRect(x + 5, y + 8, 17, 15);
  ctx.fillRect(x + 9, y + 3, 10, 20);
  ctx.fillStyle = leaves;
  ctx.fillRect(x + 7, y + 8, 13, 3);
  ctx.fillRect(x + 4, y + 13, 4, 6);
  ctx.fillRect(x + 18, y + 11, 5, 7);
  ctx.fillStyle = style === "snow" ? "#f1eee0" : style === "pine" ? "#85906a" : "#8a9853";
  ctx.fillRect(x + 10, y + 5, 5, 3);
  ctx.fillRect(x + 6, y + 12, 3, 3);
  ctx.fillRect(x + 18, y + 15, 3, 3);
  if (style === "snow") {
    ctx.fillRect(x + 8, y + 9, 12, 2);
    ctx.fillRect(x + 5, y + 14, 4, 2);
    ctx.fillRect(x + 18, y + 12, 5, 2);
  }
}

function drawPixelGuardrail(x, y) {
  ctx.fillStyle = "#777b75";
  ctx.fillRect(x + 4, y + 3, 3, 22);
  ctx.fillRect(x + 13, y + 15, 3, 22);
  ctx.fillStyle = "#d2c9a9";
  ctx.fillRect(x, y + 7, 15, 4);
  ctx.fillRect(x + 10, y + 19, 15, 4);
}

function drawPixelRock(x, y) {
  ctx.fillStyle = "#54483e";
  ctx.fillRect(x, y + 5, 16, 10);
  ctx.fillRect(x + 4, y, 9, 5);
  ctx.fillStyle = "#8d8876";
  ctx.fillRect(x + 4, y + 6, 8, 2);
}

function drawCoin(coin) {
  const rows = [
    [6,13],[4,15],[3,16],[2,17],[1,18],[1,18],[0,19],[0,19],[0,19],[0,19],
    [0,19],[1,18],[1,18],[2,17],[3,16],[4,15],[6,13]
  ];
  rows.forEach(([left, right], row) => {
    ctx.fillStyle = "#743315";
    ctx.fillRect(coin.x - 10 + left, coin.y - 9 + row, right - left + 1, 1);
    if (right - left > 3) {
      ctx.fillStyle = row < 8 ? "#ffca34" : "#f2a91f";
      ctx.fillRect(coin.x - 9 + left, coin.y - 8 + row, right - left - 1, 1);
    }
  });
  ctx.fillStyle = "#fff4c0";
  ctx.fillRect(coin.x - 5, coin.y + 3, 3, 2);
  ctx.fillRect(coin.x - 2, coin.y, 3, 2);
  ctx.fillRect(coin.x + 1, coin.y - 3, 3, 2);
  ctx.fillRect(coin.x + 4, coin.y - 6, 3, 2);
}

function resetRun() {
  const car = currentCar();
  const stats = statsFor(car);
  const tuning = save.tuning?.[car.id] || {};
  player = {
    x:W / 2 - 19, y:H - 105, w:38, h:65,
    id:car.id,
    speed:250 + stats.handling * 1.1,
    color:tuning.paint || car.color,
    neon:tuning.neon || "#a8ba7d",
    handling:stats.handling,
    coinBonus:stats.bonus,
    maxSpeed:stats.speed,
    model:car.model,
    customization:tuning,
    special:stats.special,
    coinMultiplier:Number(stats.special.coinMultiplier || 1),
    magnetRadius:Number(stats.special.magnetRadius || 0),
    collisionMargin:Number(stats.special.collisionMargin || 2),
    scoreMultiplier:Number(stats.special.scoreMultiplier || 1),
    nearMissCoins:Number(stats.special.nearMissCoins || 0),
    nearMissScore:Number(stats.special.nearMissScore || 0),
    nearMissScoreEarned:0
  };
  enemies = [];
  coins = [];
  score = 0;
  runCoins = Number(player.special.startingCoins || 0);
  speed = 210;
  spawnTimer = .35;
  coinTimer = 1.1;
  roadOffset = 0;
  $("score").textContent = "0";
  $("run-coins").textContent = runCoins;
  $("special-status").textContent = `${player.special.name}: ${player.special.description}`;
}

function spawnEnemy() {
  const laneWidth = (ROAD_RIGHT - ROAD_LEFT) / 3;
  const trafficCars = CARS.filter(car => car.id !== save.selected);
  if (!trafficCars.length) return;

  // Kies alleen een rijstrook waar bovenaan genoeg afstand is tot de auto ervoor.
  // Zo verschijnen auto's niet in elkaar wanneer het verkeer drukker wordt.
  const safeLanes = [0, 1, 2].filter(lane =>
    !enemies.some(enemy => enemy.lane === lane && enemy.y < 105 && enemy.y > -145)
  );
  if (!safeLanes.length) return;

  const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
  const car = trafficCars[Math.floor(Math.random() * trafficCars.length)];
  const trafficStats = statsFor(car);
  const x = ROAD_LEFT + roadBendAt(-78, currentWorld()) + laneWidth * lane + laneWidth / 2 - 19;
  enemies.push({
    id:car.id,
    x,
    targetX:x,
    lane,
    laneChangeIn:2.5 + Math.random() * 4,
    y:-78, w:38, h:65,
    color:car.color,
    model:car.model,
    // Snellere modellen bewegen langzamer door beeld; elke auto varieert licht.
    speedFactor:(1.2 - ((trafficStats.speed - 120) / 206) * 0.4) * (0.9 + Math.random() * 0.2)
  });
}

function spawnCoin() {
  const laneWidth = (ROAD_RIGHT - ROAD_LEFT) / 3;
  const lane = Math.floor(Math.random() * 3);
  coins.push({
    x:ROAD_LEFT + laneWidth * lane + laneWidth / 2,
    y:-20
  });
}

function collides(a, b, m = 2) {
  return a.x + m < b.x + b.w - m &&
    a.x + a.w - m > b.x + m &&
    a.y + m < b.y + b.h - m &&
    a.y + a.h - m > b.y + m;
}

function update(dt) {
  const turnSpeed = (180 + player.handling * 1.5) * Number(player.special.steeringMultiplier || 1);
  if (keys.has("ArrowLeft") || keys.has("a")) player.x -= turnSpeed * dt;
  if (keys.has("ArrowRight") || keys.has("d")) player.x += turnSpeed * dt;
  const playerBend = roadBendAt(player.y);
  player.x = Math.max(ROAD_LEFT + playerBend + 7, Math.min(ROAD_RIGHT + playerBend - player.w - 7, player.x));

  spawnTimer += dt;
  coinTimer += dt;
  const world = currentWorld();
  if (spawnTimer > Math.max(world.minimumSpawn, world.spawn - score / world.ramp)) {
    spawnTimer = 0;
    spawnEnemy();
  }
  if (coinTimer > 1.45) {
    coinTimer = 0;
    if (Math.random() > .12) spawnCoin();
  }

  enemies.forEach(enemy => {
    enemy.laneChangeIn -= dt;
    if (enemy.laneChangeIn <= 0) {
      enemy.laneChangeIn = 2.5 + Math.random() * 4;
      const options = [enemy.lane - 1, enemy.lane + 1].filter(lane => lane >= 0 && lane < 3);

      // Verander alleen van rijstrook als die vrij is en er geen auto vlakbij rijdt.
      const safeOptions = options.filter(targetLane =>
        !enemies.some(other => other !== enemy &&
          (other.lane === targetLane || other.lane === enemy.lane) &&
          Math.abs(other.y - enemy.y) < 100)
      );
      if (safeOptions.length && Math.random() < 0.35) {
        enemy.lane = safeOptions[Math.floor(Math.random() * safeOptions.length)];
      }
    }
    const laneWidth = (ROAD_RIGHT - ROAD_LEFT) / 3;
    enemy.targetX = ROAD_LEFT + roadBendAt(enemy.y, world) + laneWidth * enemy.lane + laneWidth / 2 - enemy.w / 2;
    enemy.x += Math.sign(enemy.targetX - enemy.x) * Math.min(Math.abs(enemy.targetX - enemy.x), 58 * dt);
    const relativeTrafficSpeed = Math.max(speed * 0.65, Math.min(speed * 1.4, speed * enemy.speedFactor));
    enemy.y += relativeTrafficSpeed * world.traffic * dt;
    if (!enemy.passed && enemy.y > player.y + player.h) {
      enemy.passed = true;
      const close = Math.abs((enemy.x + enemy.w / 2) - (player.x + player.w / 2)) < player.w + 18;
      if (close && player.nearMissCoins) {
        runCoins += player.nearMissCoins;
        $("run-coins").textContent = runCoins;
      }
      if (close && player.nearMissScore && player.nearMissScoreEarned < 10) {
        const bonus = Math.min(player.nearMissScore, 10 - player.nearMissScoreEarned);
        score += bonus;
        player.nearMissScoreEarned += bonus;
      }
    }
  });
  coins.forEach(coin => {
    coin.y += speed * dt;
    if (player.magnetRadius && Math.abs(coin.y - player.y) < 120) {
      const dx = player.x + player.w / 2 - coin.x;
      if (Math.abs(dx) < player.magnetRadius) {
        coin.x += Math.sign(dx) * Math.min(Math.abs(dx), 150 * dt);
      }
    }
  });

  const hitIndex = enemies.findIndex(enemy => collides(player, enemy, player.collisionMargin));
  if (hitIndex >= 0) {
    endGame();
    return;
  }

  coins = coins.filter(coin => {
    const radius = 12;
    const got = player.x < coin.x + radius &&
      player.x + player.w > coin.x - radius &&
      player.y < coin.y + radius &&
      player.y + player.h > coin.y - radius;
    if (got) {
      runCoins += Math.max(1, Math.round(player.coinBonus * player.coinMultiplier));
      $("run-coins").textContent = runCoins;
      return false;
    }
    return coin.y < H + 20;
  });

  enemies = enemies.filter(enemy => enemy.y < H + 90);
  score += dt * 10 * player.scoreMultiplier;
  speed = Math.min(440, 210 + score * .65, player.maxSpeed * 1.5);
  $("score").textContent = Math.floor(score);
}

function drawFrame(dt) {
  drawRoad(dt);
  coins.forEach(drawCoin);
  enemies.forEach(enemy => drawCar(enemy.x, enemy.y, enemy.w, enemy.h, enemy.color, "#a8ba7d", enemy.model, ctx, {}, enemy.id));
  if (player) drawCar(player.x, player.y, player.w, player.h, player.color, player.neon, player.model, ctx, player.customization, player.id);
}

function loop(timestamp) {
  if (!running || paused) return;
  const dt = Math.min((timestamp - lastTime) / 1000, .035);
  lastTime = timestamp;
  update(dt);
  updateEngineAudio();
  if (running) {
    drawFrame(dt);
    raf = requestAnimationFrame(loop);
  }
}

async function startGame() {
  cancelAnimationFrame(raf);
  keys.clear();
  if (!WORLDS[save.world] || save.level < WORLDS[save.world].requiredLevel) {
    save.world = "country";
    persistLocal();
    renderWorldOptions();
  }
  resetRun();
  runToken = null;
  onlineRun = false;
  submitPending = false;

  if (session) {
    try {
      const result = await api("/run/start", { method:"POST", body:"{}" });
      runToken = result.runId;
      onlineRun = true;
    } catch (e) {
      showNotice("Online server niet bereikbaar. Deze race wordt lokaal gespeeld.");
    }
  }

  runStart = performance.now();
  running = true;
  paused = false;
  startEngineAudio();
  $("pause-overlay").classList.add("hidden");
  showScreen("game");
  lastTime = performance.now();
  drawFrame(0);
  raf = requestAnimationFrame(loop);
}

async function endGame() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(raf);
  stopEngineAudio();

  const finalScore = Math.floor(score);
  const earned = runCoins;
  const onlineSubmission = Boolean(session && onlineRun && runToken && !submitPending);
  let levelRewards = [];
  save.best = Math.max(save.best, finalScore);

  $("final-score").textContent = finalScore;
  $("final-coins").textContent = earned;
  $("submission-status").textContent = onlineSubmission
    ? "Score en beloning worden door de server gecontroleerd..."
    : session
      ? "Offline-race: score en munten zijn alleen lokaal opgeslagen."
      : "Demo-race: log in om scores online in te dienen.";

  if (!session || !onlineRun) {
    save.coins += earned;
    // Robijn is zeldzaam: één per 500 punten (offline-spiegel van de serverregel).
    const earnedRubies = Math.floor(finalScore / 500);
    if (earnedRubies > 0) {
      save.rubies += earnedRubies;
      $("submission-status").textContent =
        `Demo-race: ${earned} munten en ${earnedRubies} robijn verdiend.`;
    }
    levelRewards = awardLocalXP(Math.max(1, Math.floor(finalScore / 10)));
    persistLocal();
    refreshHUD();
  } else if (onlineSubmission) {
    submitPending = true;
    try {
      const result = await api("/run/finish", {
        method:"POST",
        body:JSON.stringify({
          runId:runToken,
          score:finalScore,
          coins:earned,
          durationMs:Math.floor(performance.now() - runStart)
        })
      });
      applyProfile(result.profile);
      const reward = result.result?.progress?.reward;
      $("submission-status").textContent = reward
        ? `✓ Level ${result.profile.player_level} bereikt. Beloning: ${reward}.`
        : "✓ Score verwerkt door de server.";
    } catch (e) {
      $("submission-status").textContent =
        "Score niet geaccepteerd: " + e.message;
    }
  }

  persistLocal();
  refreshHUD();
  showScreen("over");
  if (levelRewards.length) $("submission-status").textContent = levelRewards.join(" · ");
  if (onlineRun) await loadLeaderboard();
}

function pauseGame() {
  if (!running || paused) return;
  paused = true;
  cancelAnimationFrame(raf);
  stopEngineAudio();
  $("pause-overlay").classList.remove("hidden");
}
function resumeGame() {
  if (!running || !paused) return;
  paused = false;
  $("pause-overlay").classList.add("hidden");
  startEngineAudio();
  lastTime = performance.now();
  raf = requestAnimationFrame(loop);
}
function quitGame() {
  running = false;
  paused = false;
  cancelAnimationFrame(raf);
  stopEngineAudio();
  keys.clear();
  showScreen("home");
}

function holdButton(id, key) {
  const button = $(id);
  button.addEventListener("pointerdown", e => {
    e.preventDefault();
    keys.add(key);
    button.setPointerCapture?.(e.pointerId);
  });
  ["pointerup","pointercancel","lostpointercapture"].forEach(type => {
    button.addEventListener(type, () => keys.delete(key));
  });
}

// ----- NAVIGATIE & EVENTS -----

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", async () => {
    const screen = button.dataset.screen;
    if (screen === "shop") renderShop();
    if (screen === "garage") renderGarage();
    if (screen === "leaderboard") await loadLeaderboard();
    if (screen === "profile") renderProfile();
    showScreen(screen);
  });
});

document.querySelectorAll("[data-world]").forEach(button => {
  button.addEventListener("click", () => {
    const world = WORLDS[button.dataset.world];
    if (!world || save.level < world.requiredLevel) {
      return showNotice(`Deze wereld speel je vrij op level ${world?.requiredLevel || 1}.`);
    }
    save.world = button.dataset.world;
    persistLocal();
    renderWorldOptions();
  });
});

$("play-button").addEventListener("click", startGame);
$("retry-button").addEventListener("click", startGame);
$("pause-button").addEventListener("click", pauseGame);
$("sound-button").addEventListener("click", toggleSound);
$("resume-button").addEventListener("click", resumeGame);
$("quit-button").addEventListener("click", quitGame);
$("profile-login").addEventListener("click", () => {
  authReturnScreen = "profile";
  setAuthMode("login");
  showScreen("auth");
});
$("profile-logout").addEventListener("click", logout);
$("profile-form").addEventListener("submit", async event => {
  event.preventDefault();
  const username = $("profile-username").value.trim();
  $("profile-status").textContent = "Profiel opslaan...";
  try {
    const result = await api("/profile", {
      method:"PATCH",
      body:JSON.stringify({
        username,
        avatar:save.avatar,
        avatarColor:save.avatarColor
      })
    });
    applyProfile(result.profile);
    $("profile-status").textContent = "Profiel bijgewerkt.";
  } catch (error) {
    $("profile-status").textContent = error.message;
  }
});
$("auth-form").addEventListener("submit", handleAuth);
$("auth-switch").addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
});
$("refresh-leaderboard").addEventListener("click", loadLeaderboard);
$("save-tuning").addEventListener("click", saveTuning);
$("buy-custom-paint").addEventListener("click", buyCustomPaint);
$("paint-picker").addEventListener("input", () => refreshCustomPaintButton());

$("garage-select").addEventListener("change", async e => {
  const id = e.target.value;
  if (!save.owned.includes(id)) return;
  save.selected = id;
  persistLocal();
  if (session) {
    try {
      await api("/garage/select", { method:"POST", body:JSON.stringify({ carId:id }) });
    } catch (error) {
      showNotice("Selectie niet online opgeslagen: " + error.message);
    }
  }
  refreshHUD();
  renderGarage();
});


document.addEventListener("keydown", (e) => {
  if (typeof e.key !== "string") return;

  const key = e.key.length === 1
    ? e.key.toLowerCase()
    : e.key;

  if (["ArrowLeft", "ArrowRight", " "].includes(key)) {
    e.preventDefault();
  }

  if (typeof keys !== "undefined" && keys instanceof Set) {
    keys.add(key);
  }

  if (key === "Escape" && running) {
    if (paused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (typeof e.key !== "string") return;

  const key = e.key.length === 1
    ? e.key.toLowerCase()
    : e.key;

  if (typeof keys !== "undefined" && keys instanceof Set) {
    keys.delete(key);
  }
});

window.addEventListener("blur", () => keys.clear());
holdButton("left-button", "ArrowLeft");
holdButton("right-button", "ArrowRight");

async function init() {
  renderShop();
  renderGarage();
  refreshHUD();
  setAuthMode("login");
  refreshSoundButton();
  renderWorldOptions();

  if (!supabaseClient) {
    showNotice("Lokale demo actief. Configureer Supabase en de backend voor online accounts.");
    drawFrame(0);
    return;
  }

  try {
    const { data } = await supabaseClient.auth.getSession();
    session = data.session;
    if (session) {
      showNotice("Online verbonden. Je account is ingelogd.");
      refreshHUD();
      try { await loadProfile(); } catch (e) { showNotice("Profiel laden mislukt: " + e.message); }
      try { await loadLeaderboard(); } catch { /* negeer */ }
      updateSaveStatus();
    } else {
      showNotice("Log in om je voortgang online op te slaan en de ranglijst te bekijken.");
    }

    supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      session = newSession;
      if (!session) {
        profile = null;
        return;
      }
      // Voorkom zware databaseaanroepen binnen de auth callback.
      setTimeout(() => loadProfile().catch(console.error), 0);
      updateSaveStatus();
    });
  } catch (error) {
    showNotice("Verbinden mislukt: " + error.message);
  }

  drawFrame(0);
}

// Toont of "online opslaan" (aankopen/races via de backend) actief is.
async function updateSaveStatus() {
  if (!session) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(API_URL + "/health", { signal:controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      showNotice("Ingelogd · online opslaan actief (races en aankopen worden bewaard).");
    } else {
      showNotice("Ingelogd · ranglijst werkt, maar online opslaan staat uit (backend niet bereikbaar).");
    }
  } catch {
    showNotice("Ingelogd · ranglijst werkt, maar online opslaan staat uit (start de server: npm start).");
  }
}

init();