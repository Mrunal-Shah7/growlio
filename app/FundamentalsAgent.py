#Author:Mrunal Shah

import yfinance as yf
from app.utils import resolve_ticker
import numpy as np

def predict_next_week(company_name: str):
    ticker = resolve_ticker(company_name)
    try:
        t = yf.Ticker(ticker)
        info = t.info
    except Exception as e:
        return {"predictions": [], "summary": f"Error fetching fundamentals: {e}", "confidence": 0}

    pe = info.get("trailingPE") or info.get("forwardPE")
    eps = info.get("trailingEps")
    debt = info.get("totalDebt")
    market_cap = info.get("marketCap") or 0

    earnings_dates = []
    try:
        cal = t.calendar
        if hasattr(cal, 'index'):
            for val in cal.values.flatten():
                if isinstance(val, (str,)):
                    earnings_dates.append(val)
    except Exception:
        pass

    score = 50
    if market_cap and market_cap > 10_000_000_000:
        score += 5
    if pe and pe < 20:
        score += 5
    if eps and eps > 0:
        score += 5
    if debt and debt > 0:
        try:
            if debt / max(1, market_cap) > 0.5:
                score -= 10
        except Exception:
            pass

    adj = 0.0
    if score >= 60:
        adj = 0.002  
    elif score <= 40:
        adj = -0.002
    else:
        adj = 0.0

    try:
        hist = t.history(period="7d")
        if hist.empty:
            last = None
        else:
            last = float(hist['Close'].dropna().iloc[-1])
    except Exception:
        last = None

    preds = []
    if last is not None:
        p = last
        for _ in range(7):
            p = p * (1 + adj)
            preds.append(float(p))
    
    score = int(max(0, min(100, score)))

    summary = f"Fundamental score={score}. P/E={pe}, EPS={eps}, market_cap={market_cap}"
    return {"predictions": preds, "summary": summary, "confidence": score,"auth_signature": "MS-2025"}
# ---::ms::--- end block