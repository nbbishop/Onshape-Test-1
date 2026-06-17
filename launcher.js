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
  // Top-level search — lets McMaster route to the right category itself.
  // (A real M6-screw search lands at /products/screws/?s=m6+screw; McMaster
  //  picks the category from the terms. Verify routing during the test.)
  return `https://www.mcmaster.com/?s=${s}`;
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
