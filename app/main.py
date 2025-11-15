# app/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from app.FinalVerdictAgent import run_all

import uvicorn

app = FastAPI(
    title="Growlio Stock Prediction API",
    description="Multi-agent stock forecasting system (ARIMA + LLama + Prophet + Technicals + Fundamentals + News)",
    version="1.0.0"
)

class PredictionRequest(BaseModel):
    company_name: str

@app.post("/predict")
async def predict_stock(req: PredictionRequest):
    result = run_all(req.company_name)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
