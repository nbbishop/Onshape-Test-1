// launcher.js — take what the user types, open McMaster's search in a new tab.
// No Onshape API calls; this app's only job is to launch the search. The
// browser extension's chip handles grabbing the chosen part into the document.

// ---------------------------------------------------------------------------
// CONFIRM THIS ONE LINE against a real McMaster search.
// Go to mcmaster.com, search "M6 screw", copy the URL it lands on, and make
// buildSearchUrl() produce that same shape. The placeholder below is the most
// common pattern but McMaster's real format must be verified — replace if needed.
// ---------------------------------------------------------------------------
function buildSearchUrl(term) {
  // McMaster uses ?s=<terms> with + between words. encodeURIComponent gives
  // %20 for spaces, so convert those to + which matches McMaster's own URLs.
  const s = encodeURIComponent(term.trim()).replace(/%20/g, "+");
  // Try the /products/ search path — McMaster's own search routes through here
  // and may auto-pick the category. (Bare homepage ?s= landed on the homepage;
  // this is the next thing to try.)
  return `https://www.mcmaster.com/products/?s=${s}`;
}

const input = document.getElementById("q");
const button = document.getElementById("go");
const status = document.getElementById("status");

function launch() {
  const term = input.value.trim();
  if (!term) {
    status.textContent = "Type something to search for first.";
    return;
  }
  const url = buildSearchUrl(term);

  // Onshape embeds this page in a sandboxed iframe. window.open from inside an
  // iframe can be blocked, so we try it, and if it fails we fall back to a
  // real anchor click, which is more reliably allowed for user gestures.
  const win = window.open(url, "_blank", "noopener");
  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  status.textContent = `Opened McMaster search for "${term}".`;
}

button.addEventListener("click", launch);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") launch();
});
input.focus();

// ---- Theme: match Onshape ---------------------------------------------------
// Onshape embeds this app with a `?theme=dark|light` URL parameter telling us
// the user's current Onshape theme. We read that and match it automatically.
// Falls back to the browser preference when opened outside Onshape. The toggle
// still lets you override manually.
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme");

  let current = "light";
  function apply(theme) {
    current = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", current);
    try { localStorage.setItem("mc-theme", current); } catch {}
  }

  // Priority: Onshape's theme param > saved manual choice > browser preference.
  const params = new URLSearchParams(location.search);
  const onshapeTheme = params.get("theme"); // "dark" or "light" when embedded
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
