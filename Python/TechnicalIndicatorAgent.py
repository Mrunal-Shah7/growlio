# TechnicalIndicatorsAgent.py
import yfinance as yf
import pandas as pd
import numpy as np
from utils import resolve_ticker

def compute_indicators(df: pd.DataFrame):
    close = df['Close']

    # moving averages (extract last value as scalar)
    ma_5 = close.rolling(5).mean().iloc[-1] if len(close) >= 5 else close.mean()
    ma_20 = close.rolling(20).mean().iloc[-1] if len(close) >= 20 else close.mean()

    # convert to float
    ma_5 = float(ma_5)
    ma_20 = float(ma_20)

    # RSI scalar
    rsi_val = compute_rsi(close)
    rsi_val = float(rsi_val)

    # volatility scalar
    std20 = close.pct_change().rolling(20).std().iloc[-1] if len(close) >= 20 else close.pct_change().std()
    std20 = float(std20 if std20 is not None else 0.0)

    return {
        "ma_5": ma_5,
        "ma_20": ma_20,
        "rsi": rsi_val,
        "std20": std20
    }


def compute_rsi(series: pd.Series, period=14):
    delta = series.diff().dropna()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ma_up = up.rolling(period).mean()
    ma_down = down.rolling(period).mean()
    rs = ma_up / (ma_down + 1e-8)
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1] if len(rsi.dropna())>0 else 50.0

def predict_next_week(company_name: str):
    ticker = resolve_ticker(company_name)
    try:
        data = yf.download(ticker, period="60d", interval="1d", progress=False)
        if data.empty:
            return {"predictions": [], "summary": "No price data", "confidence": 0}
    except Exception as e:
        return {"predictions": [], "summary": f"Error fetching data: {e}", "confidence": 0}

    indicators = compute_indicators(data)
    # simple heuristic projection: compute average daily pct change last 7 days and apply
    pct_changes = data['Close'].pct_change().dropna().tail(7)
    avg_daily_return = float(pct_changes.mean())

    last_price = float(data['Close'].dropna().iloc[-1])
    preds = []
    price = last_price
    for i in range(7):
        price = price * (1 + avg_daily_return)
        preds.append(float(price))

    # simple signal scoring for confidence
    score = 50
    # if short MA above long MA -> bullish
    if indicators['ma_5'] > indicators['ma_20']:
        score += 15
        summary_trend = "Bullish (short MA > long MA)."
    else:
        score -= 5
        summary_trend = "Bearish/Neutral (short MA <= long MA)."

    # RSI extremes adjust
    if indicators['rsi'] < 30:
        score += 10
        summary_rsi = "RSI indicates oversold."
    elif indicators['rsi'] > 70:
        score -= 10
        summary_rsi = "RSI indicates overbought."
    else:
        summary_rsi = "RSI neutral."

    # volatility lowers confidence
    vol = float(indicators.get('std20', 0.0))
    if vol is None or np.isnan(vol):
        vol = 0.0
    if vol > 0.03:
        score -= 10

    score = int(max(0, min(100, score)))

    summary = f"{summary_trend} {summary_rsi} Avg daily return={avg_daily_return:.4f}, volatility={vol:.4f}"
    return {"predictions": preds, "summary": summary, "confidence": score}
