# Template API - Cloud Run Ready

This project acts as a proxy between Google AI Studio (Tool Function)
and your Google Apps Script JSON endpoint.

## Apps Script URL Configured

https://script.google.com/macros/s/AKfycbxCQ7WwjmIH4YUnr0quWf97PlWC972eCHauPJPCEkoii320WZuiG4SyqKXIwTJtRRe2JQ/exec

---

## Endpoints

GET /health  
GET /templates?sheet=Datos

---

## Deploy to Cloud Run

From this folder:

```bash
gcloud run deploy template-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

(Optional) If you want to set env var explicitly:

```bash
gcloud run deploy template-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxCQ7WwjmIH4YUnr0quWf97PlWC972eCHauPJPCEkoii320WZuiG4SyqKXIwTJtRRe2JQ/exec"
```

---

## Test After Deploy

https://YOUR_CLOUD_RUN_URL/templates?sheet=Datos

---

## AI Studio Tool Config

Function name: get_templates

Schema:

```json
{
  "type": "object",
  "properties": {
    "sheet": {
      "type": "string"
    }
  }
}
```

Map to:

GET https://YOUR_CLOUD_RUN_URL/templates?sheet={sheet}

Done.
