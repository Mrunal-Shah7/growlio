#Author:Mrunal Shah

import pandas as pd
import yfinance as yf
from prophet import Prophet
from app.utils import resolve_ticker
import numpy as np


def predict_next_week(company_name: str):
    ticker = resolve_ticker(company_name)

    try:
        df = yf.download(ticker, period="1y", interval="1d", progress=False)

        if df.empty:
            return {"predictions": [], "summary": "No data for Prophet", "confidence": 0}

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] for col in df.columns]

        df = df.reset_index()

        date_col = df.columns[0]

        df = df.rename(columns={date_col: "ds", "Close": "y"})
        df = df[["ds", "y"]].dropna()

        df["ds"] = pd.to_datetime(df["ds"])
        df["y"] = df["y"].astype(float)

    except Exception as e:
        return {"predictions": [], "summary": f"Error fetching or preparing data: {e}", "confidence": 0}

    if len(df) < 30:
        return {"predictions": [], "summary": "Insufficient data for Prophet", "confidence": 0}

    try:
        m = Prophet(weekly_seasonality=True)
        m.fit(df)

        future = m.make_future_dataframe(periods=7)
        forecast = m.predict(future)

        preds = forecast.tail(7)["yhat"].astype(float).tolist()

        hist_pred = m.predict(df)
        residuals = df["y"] - hist_pred["yhat"]
        rmse = np.sqrt((residuals**2).mean())
        last_price = df["y"].iloc[-1]
        rel_rmse = rmse / (last_price + 1e-8)

        confidence = int(max(0, min(100, 80 - rel_rmse * 200)))

        return {
            "predictions": preds,
            "summary": f"Prophet RMSE={rmse:.4f}, rel_rmse={rel_rmse:.4f}",
            "auth_signature": "MS-2025",
            "confidence": confidence
        }

    except Exception as e:
        return {"predictions": [], "summary": f"Prophet failed: {e}", "confidence": 0}
# ---::ms::--- end block