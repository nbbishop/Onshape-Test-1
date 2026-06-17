// launcher.js — category grid with smart filter + theme matching.

// ---- Keyword map: product term -> the category label it lives under ---------
// Typing a product (e.g. "screws") surfaces its parent category button
// (Fastening & Joining). Labels here must match the button text exactly.
// Extend this list freely — add "term": "Category Label" pairs.
const KEYWORD_MAP = {
  // Fastening & Joining
  "screw": "Fastening & Joining", "screws": "Fastening & Joining",
  "bolt": "Fastening & Joining", "bolts": "Fastening & Joining",
  "nut": "Fastening & Joining", "nuts": "Fastening & Joining",
  "washer": "Fastening & Joining", "washers": "Fastening & Joining",
  "shcs": "Fastening & Joining", "socket head": "Fastening & Joining",
  "standoff": "Fastening & Joining", "standoffs": "Fastening & Joining",
  "rivet": "Fastening & Joining", "rivets": "Fastening & Joining",
  "anchor": "Fastening & Joining", "threaded rod": "Fastening & Joining",
  "threaded insert": "Fastening & Joining", "insert": "Fastening & Joining",
  "retaining ring": "Fastening & Joining", "spacer": "Fastening & Joining",
  "spacers": "Fastening & Joining", "pin": "Fastening & Joining",
  "dowel": "Fastening & Joining", "eyebolt": "Fastening & Joining",
  "u-bolt": "Fastening & Joining", "magnet": "Fastening & Joining",
  "adhesive": "Fastening & Joining", "tape": "Fastening & Joining",
  "weld": "Fastening & Joining", "key stock": "Fastening & Joining",

  // Power Transmission
  "bearing": "Power Transmission", "bearings": "Power Transmission",
  "shaft collar": "Power Transmission", "shaft collars": "Power Transmission",
  "collar": "Power Transmission", "shaft": "Power Transmission",
  "sprocket": "Power Transmission", "sprockets": "Power Transmission",
  "gear": "Power Transmission", "gears": "Power Transmission",
  "pulley": "Power Transmission", "pulleys": "Power Transmission",
  "belt": "Power Transmission", "chain": "Power Transmission",
  "coupling": "Power Transmission", "bushing": "Power Transmission",
  "bushings": "Power Transmission", "u-joint": "Power Transmission",
  "lead screw": "Power Transmission", "ball screw": "Power Transmission",
  "linear bearing": "Power Transmission", "motor": "Power Transmission",

  // Sealing
  "o-ring": "Sealing", "o-rings": "Sealing", "oring": "Sealing",
  "gasket": "Sealing", "seal": "Sealing", "seals": "Sealing",
  "grommet": "Sealing",

  // Raw Materials
  "aluminum": "Raw Materials", "steel": "Raw Materials", "brass": "Raw Materials",
  "plastic": "Raw Materials", "sheet": "Raw Materials", "bar": "Raw Materials",
  "rod": "Raw Materials", "tube stock": "Raw Materials", "metal": "Raw Materials",
  "acrylic": "Raw Materials", "delrin": "Raw Materials", "abs": "Raw Materials",
  "rubber": "Raw Materials", "foam": "Raw Materials",

  // Pipe, Tubing, Hose & Fittings
  "pipe": "Pipe, Tubing, Hose & Fittings", "tubing": "Pipe, Tubing, Hose & Fittings",
  "tube": "Pipe, Tubing, Hose & Fittings", "hose": "Pipe, Tubing, Hose & Fittings",
  "fitting": "Pipe, Tubing, Hose & Fittings", "fittings": "Pipe, Tubing, Hose & Fittings",
  "elbow": "Pipe, Tubing, Hose & Fittings",

  // Electrical & Lighting
  "wire": "Electrical & Lighting", "cable": "Electrical & Lighting",
  "connector": "Electrical & Lighting", "switch": "Electrical & Lighting",
  "led": "Electrical & Lighting", "light": "Electrical & Lighting",
  "conduit": "Electrical & Lighting",

  // Flow & Level Control
  "valve": "Flow & Level Control", "valves": "Flow & Level Control",

  // Hand Tools
  "wrench": "Hand Tools", "screwdriver": "Hand Tools", "pliers": "Hand Tools",
  "hammer": "Hand Tools", "allen": "Hand Tools", "hex key": "Hand Tools",

  // Sawing & Cutting
  "drill bit": "Sawing & Cutting", "saw": "Sawing & Cutting",
  "blade": "Sawing & Cutting", "tap": "Sawing & Cutting", "end mill": "Sawing & Cutting",

  // Material Handling
  "caster": "Material Handling", "casters": "Material Handling",
  "wheel": "Material Handling", "wheels": "Material Handling",

  // Suspending
  "bracket": "Suspending", "clamp": "Suspending", "hanger": "Suspending",

  // Measuring & Inspecting
  "caliper": "Measuring & Inspecting", "gauge": "Measuring & Inspecting",
  "ruler": "Measuring & Inspecting",

  // Safety Supplies
  "gloves": "Safety Supplies", "goggles": "Safety Supplies",
};

(function () {
  const filter = document.getElementById("filter");
  const grid = document.getElementById("grid");
  if (!filter || !grid) return;
  const cats = Array.from(grid.querySelectorAll(".cat:not(.misc)"));

  // Which categories does a typed term point to? Combine direct label matches
  // with keyword-map matches so "screws" surfaces "Fastening & Joining".
  function matchingLabels(q) {
    const labels = new Set();
    // keyword map: any mapped term that the query contains (or that contains the query)
    for (const term in KEYWORD_MAP) {
      if (term.includes(q) || q.includes(term)) labels.add(KEYWORD_MAP[term]);
    }
    return labels;
  }

  filter.addEventListener("input", function () {
    const q = filter.value.trim().toLowerCase();
    if (!q) { cats.forEach((c) => c.classList.remove("hidden")); return; }

    const mapped = matchingLabels(q);
    cats.forEach(function (c) {
      const label = c.textContent.toLowerCase();
      const directHit = label.includes(q);          // typed a category name
      const mappedHit = mapped.has(c.textContent);   // typed a product in this category
      c.classList.toggle("hidden", !(directHit || mappedHit));
    });
  });
})();

// ---- Theme: match Onshape (?theme=dark|light); toggle overrides ------------
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme");

  let current = "light";
  function apply(theme) {
    current = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", current);
    const logo = document.getElementById("logo");
    if (logo) logo.src = current === "dark" ? "logo-dark.png" : "logo-light.png";
    try { localStorage.setItem("mc-theme", current); } catch {}
  }

  const params = new URLSearchParams(location.search);
  const onshapeTheme = params.get("theme");
  let saved = null;
  try { saved = localStorage.getItem("mc-theme"); } catch {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  apply(onshapeTheme || saved || (prefersDark ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      apply(current === "dark" ? "light" : "dark");
    });
  }
})();
