const API_BASE = "https://script.google.com/macros/s/AKfycbxyEuofFiv6LdG9FjbVWl8KYhfsblLoUzUdi_mFL4rYKCXATx09qkdThUV9fTQhYbgloQ/exec";

const meta = document.getElementById("meta");
const out = document.getElementById("out");
const search = document.getElementById("search");

let records = [];

loadData();
search.addEventListener("input", render);

async function loadData() {
  meta.textContent = "Cargando…";

  const url = `${API_BASE}?sheet=Datos&t=${Date.now()}`;

  try {
    // Intento 1: fetch normal
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    records = data.records || [];
    meta.textContent = `OK • ${data.count} registros • ${data.last_update}`;
    render();
  } catch (e) {
    // Intento 2: JSONP (por si CORS bloquea)
    const data = await fetchJsonp(`${API_BASE}?sheet=Datos&callback=__cb&t=${Date.now()}`);
    records = data.records || [];
    meta.textContent = `OK(JSONP) • ${data.count} registros • ${data.last_update}`;
    render();
  }
}

function render() {
  const q = (search.value || "").toLowerCase().trim();
  const filtered = q
    ? records.filter(r => JSON.stringify(r).toLowerCase().includes(q))
    : records;

  // Muestra 50 registros para no reventar el navegador
  out.textContent = JSON.stringify(filtered.slice(0, 50), null, 2);
}

// JSONP helper
function fetchJsonp(url) {
  return new Promise((resolve, reject) => {
    const cbName = "__cb_" + Math.random().toString(16).slice(2);
    window[cbName] = (data) => { cleanup(); resolve(data); };

    const s = document.createElement("script");
    s.src = url.replace("callback=__cb", `callback=${cbName}`);
    s.onerror = () => { cleanup(); reject(new Error("JSONP error")); };
    document.head.appendChild(s);

    const t = setTimeout(() => { cleanup(); reject(new Error("JSONP timeout")); }, 15000);

    function cleanup() {
      clearTimeout(t);
      if (s.parentNode) s.parentNode.removeChild(s);
      delete window[cbName];
    }
  });
}
