import pandas as pd
import yfinance as yf
from prophet import Prophet       # ✅ correct import
from app.utils import resolve_ticker
import numpy as np


def predict_next_week(company_name: str):
    ticker = resolve_ticker(company_name)
    try:
        df = yf.download(ticker, period="120d", interval="1d", progress=False)
        if df.empty:
            return {"predictions": [], "summary": "No data for Prophet", "confidence": 0}
    except Exception as e:
        return {"predictions": [], "summary": f"Error fetching data: {e}", "confidence": 0}

    df = df.reset_index()[['Date', 'Close']].rename(columns={'Date':'ds', 'Close':'y'})
    # Prophet requires at least some points
    if len(df) < 30:
        return {"predictions": [], "summary": "Insufficient data for Prophet", "confidence": 0}

    m = Prophet(daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=False)
    try:
        m.fit(df)
        future = m.make_future_dataframe(periods=7)
        forecast = m.predict(future)
        preds_df = forecast[['ds', 'yhat']].tail(7)
        preds = [float(x) for x in preds_df['yhat'].tolist()]
        # estimate confidence: smaller historical residuals => higher confidence
        hist_pred = m.predict(df)
        residuals = df['y'] - hist_pred['yhat']
        rmse = np.sqrt((residuals ** 2).mean())
        last_price = df['y'].iloc[-1]
        rel_rmse = (rmse / (last_price + 1e-8))
        conf = int(max(0, min(100, 80 - rel_rmse * 200)))  # heuristics
        summary = f"Prophet RMSE={rmse:.4f}, rel_rmse={rel_rmse:.4f}"
        return {"predictions": preds, "summary": summary, "confidence": conf}
    except Exception as e:
        return {"predictions": [], "summary": f"Prophet failed: {e}", "confidence": 0}
