import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

// Your Apps Script Web App URL
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxCQ7WwjmIH4YUnr0quWf97PlWC972eCHauPJPCEkoii320WZuiG4SyqKXIwTJtRRe2JQ/exec";

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.get("/templates", async (req, res) => {
  try {
    const sheet = req.query.sheet || "Datos";

    const target = new URL(APPS_SCRIPT_URL);
    target.searchParams.set("sheet", sheet);

    const r = await fetch(target.toString(), {
      headers: { accept: "application/json" },
    });

    if (!r.ok) {
      return res.status(502).json({ error: "Apps Script error", status: r.status });
    }

    const data = await r.json();

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify(data));
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error", detail: String(err) });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
