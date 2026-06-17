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

// ---- Theme: match Onshape (light #FFFFFF / dark #333333) -------------------
// On load, follow the system/browser preference. The toggle flips it manually
// and remembers the choice for this browser.
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  // Saved choice wins; otherwise follow the OS/browser dark-mode setting.
  let saved = null;
  try { saved = localStorage.getItem("mc-theme"); } catch {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(saved || (prefersDark ? "dark" : "light"));

  // If the user hasn't set a manual choice, keep following the system setting
  // when it changes.
  if (!saved && window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      apply(e.matches ? "dark" : "light");
    });
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem("mc-theme", next); } catch {}
    });
  }
})();
