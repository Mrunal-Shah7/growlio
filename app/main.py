#Author:Mrunal Shah
# app/main.py

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from app.FinalVerdictAgent import run_all, run_all_stream
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
import numpy as np

load_dotenv()

app = FastAPI(
    title="Growlio Stock Prediction API",
    description="Multi-agent stock forecasting system (ARIMA + Llama + Prophet + Technicals + Fundamentals + News)",
    version="1.0.0",
    author="Mrunal Shah"
)

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # keep this for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Models ------------------
class PredictionRequest(BaseModel):
    company_name: str


# ------------------ Normal JSON endpoint ------------------
@app.post("/predict")
async def predict_stock(req: PredictionRequest):
    return run_all(req.company_name)


# ------------------ SSE STREAMING ENDPOINT ------------------

# sanitize function (VERY IMPORTANT)
def sanitize(obj):
    """Convert numpy and non-JSON-safe objects into Python-native types."""
    if isinstance(obj, (np.generic,)):
        return obj.item()

    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [sanitize(x) for x in obj]

    return obj


@app.get("/predict-stream")
async def predict_stream(company: str):

    async def event_generator():
        # (1) Stream logs from the agent
        async for msg in run_all_stream(company):

            # Check if this is the FINAL JSON from your agent
            if msg.startswith("FINAL_JSON:"):
                raw_json = msg.replace("FINAL_JSON:", "")

                # Convert Python dict string → dict
                try:
                    python_obj = eval(raw_json)
                except:
                    # If already a dict, no change
                    python_obj = raw_json

                # Sanitize numpy types
                clean_dict = sanitize(python_obj)

                # Convert to valid JSON
                json_text = json.dumps(clean_dict)

                # Send to frontend
                yield f"data: FINAL_JSON:{json_text}\n\n"
                await asyncio.sleep(0.01)
                continue

            # (2) Normal log line → send directly
            yield f"data: {msg}\n\n"
            await asyncio.sleep(0.01)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# ------------------ Run server ------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# ---::ms::--- end block
