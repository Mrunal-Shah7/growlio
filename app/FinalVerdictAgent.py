# FinalVerdictAgent.py
from app.NewsAgent import NewsAgentService  # your existing file; ensure it returns dict as described or adapt
from app.Arima import predict_next_week as arima_predict  # ensure returns list when called differently
from app.Llama import predict_next_week as llama_predict
from app.ProphetModel import predict_next_week as prophet_predict

from app.TechnicalIndicatorAgent import predict_next_week as tech_predict
from app.FundamentalsAgent import predict_next_week as fund_predict

from google import genai
import numpy as np
import statistics

# Replace with your keys
GEMINI_API_KEY = "AIzaSyCffDW0Tu7zWXdHe5fKdyvOt5VXZTmpC2U"
NEWS_API_KEY = "e4fbd41e788b40f1b3ee166e2e53d7a7"

# configure gemini if you intend to use it for final explanation
genai_client = genai.Client(api_key=GEMINI_API_KEY)
GEMINI_MODEL = "gemini-2.5-pro"

def safe_list(pred):
    return pred if (isinstance(pred, list) and len(pred) >= 1) else []

def weighted_ensemble(numeric_preds_list, confidences, base_weights=None):
    """
    numeric_preds_list: list of lists (each len 7)
    confidences: list of confidences (0-100) for each respective list
    base_weights: optional base weights list same length
    """
    n = len(numeric_preds_list)
    if n == 0:
        return []

    # default equal base weights if not provided
    if base_weights is None:
        base_weights = [1.0] * n

    # convert confidences to 0..1
    confs = [max(0.01, c / 100.0) for c in confidences]  # avoid zero
    weights = [bw * cf for (bw, cf) in zip(base_weights, confs)]
    # normalize
    s = sum(weights)
    if s == 0:
        weights = [1.0/n]*n
    else:
        weights = [w / s for w in weights]

    # ensure lists are of length 7
    L = 7
    ensemble = []
    for i in range(L):
        s = 0.0
        for idx, preds in enumerate(numeric_preds_list):
            if len(preds) == L:
                s += preds[i] * weights[idx]
            else:
                # if this agent failed for this scenario, reduce its weight contribution
                s += 0.0
        ensemble.append(float(s))
    return ensemble, weights

def compute_agreement_score(preds_list):
    """
    returns a score from 0..1 where 1 = perfect agreement (low std), 0 = high disagreement
    uses normalized std across forecasts
    """
    # build array shape (agents, 7)
    arr = []
    for p in preds_list:
        if len(p)==7:
            arr.append(p)
    if len(arr) == 0:
        return 0.0
    arr = np.array(arr)
    stds = np.std(arr, axis=0)  # per day std
    mean_std = float(stds.mean())
    # normalize by mean price scale
    mean_price = float(np.mean(arr))
    if mean_price <= 0:
        return 0.0
    rel_std = mean_std / mean_price
    # map rel_std to agreement 0..1 (heuristic)
    score = max(0.0, min(1.0, 1.0 - rel_std*10))
    return score

def calibrate_final_confidence(agents_confidences, agreement_score, volatility, fundamentals_score, news_confidence):
    """
    agents_confidences: list of ints 0-100
    agreement_score: 0..1 (higher better)
    volatility: recent daily std (e.g., 0.02 for 2%)
    fundamentals_score: 0..100
    news_confidence: 0..100 (from news agent)
    returns int 0..100
    """
    # base is average of agents confidences
    base = np.mean(agents_confidences) if len(agents_confidences)>0 else 40
    # weights
    w_agreement = 20
    w_volatility = -25  # more vol -> reduce confidence
    w_fund = 15
    w_news = 15

    conf = base
    conf += w_agreement * (agreement_score)  # agreement increases confidence
    conf += w_fund * (fundamentals_score/100.0)
    conf += w_news * (news_confidence/100.0)
    # volatility penalty: map vol to penalty
    vol_penalty = 0
    try:
        vol_penalty = w_volatility * (volatility / 0.05)  # 5% vol -> full penalty
    except Exception:
        vol_penalty = 0
    conf += vol_penalty

    # clamp
    conf = int(max(0, min(100, conf)))
    return conf

def run_all(company_name: str):
    # 1. numeric predictors
    arima = arima_predict(company_name, return_values=True) if callable(arima_predict) else {"predictions": []}
    if isinstance(arima, dict):
        arima_preds = safe_list(arima.get("predictions", []))
        arima_conf = arima.get("confidence", 50)
    else:
        arima_preds = arima or []
        arima_conf = 50

    llama = llama_predict(company_name, return_values=True)
    llama_preds = safe_list(llama) if isinstance(llama, list) else safe_list(llama.get("predictions", [])) if isinstance(llama, dict) else []
    llama_conf = llama.get("confidence", 50) if isinstance(llama, dict) else 50

    prophet = prophet_predict(company_name)
    prophet_preds = safe_list(prophet.get("predictions", []))
    prophet_conf = prophet.get("confidence", 50)

   

    # 2. signal agents
    tech = tech_predict(company_name)
    tech_preds = safe_list(tech.get("predictions", []))
    tech_conf = tech.get("confidence", 50)

    fund = fund_predict(company_name)
    fund_preds = safe_list(fund.get("predictions", []))
    fund_conf = fund.get("confidence", 50)

    # news agent: call your existing NewsAgentService.analyze_company and get confidence if available.
    newsagent = NewsAgentService(NEWS_API_KEY, GEMINI_API_KEY)
    news_raw = newsagent.analyze_company(company_name)
    # If your news agent returns plain text, we should parse or assume a default confidence.
    # For simplicity assume news_raw is text; set news_conf fallback:
    news_conf = 50
    news_summary = news_raw
    # optionally, if the news agent returns structured json string, parse confidence

    # 3. collect numeric lists and confidences
    numeric_preds = []
    confidences = []
    base_weights = []
    # Order: ARIMA, LLAMA, PROPHET, LSTM
    if len(arima_preds)==7:
        numeric_preds.append(arima_preds); confidences.append(arima_conf); base_weights.append(1.0)
    if len(llama_preds)==7:
        numeric_preds.append(llama_preds); confidences.append(llama_conf); base_weights.append(1.0)
    if len(prophet_preds)==7:
        numeric_preds.append(prophet_preds); confidences.append(prophet_conf); base_weights.append(1.0)
   

    # If no numeric predictors available, try to synthesize using tech/fund/news last price drift
    if len(numeric_preds)==0:
        # try to fallback to tech_preds/fund_preds if they have numbers
        fallbacks = []
        for p in [tech_preds, fund_preds]:
            if len(p)==7:
                fallbacks.append(p)
        numeric_preds = fallbacks
        confidences = [tech_conf, fund_conf][:len(fallbacks)]
        base_weights = [0.7, 0.3][:len(fallbacks)]

    # 4. ensemble
    combined_preds, used_weights = weighted_ensemble(numeric_preds, confidences, base_weights=base_weights)

    # 5. compute volatility (use last 30-day pct std)
    import yfinance as yf
    tkr = company_name
    try:
        # attempt to resolve ticker via utils
        from utils import resolve_ticker
        tkr = resolve_ticker(company_name)
        df = yf.download(tkr, period="30d", interval="1d", progress=False)
        vol = float(df['Close'].pct_change().std()) if (not df.empty) else 0.0
    except Exception:
        vol = 0.0

    # 6. agreement
    agreement = compute_agreement_score(numeric_preds)

    # 7. fundamentals score (use fund_conf scaled)
    fund_score = fund_conf if fund_conf is not None else 50

    # 8. calibrate final confidence
    agents_conf_list = confidences + [tech_conf, fund_conf, news_conf]
    final_confidence = calibrate_final_confidence(agents_conf_list, agreement, vol, fund_score, news_conf)

    # 9. final verdict direction
    # compute average change over next 7 days relative to last known price
    last_price = None
    try:
    
        hist = yf.download(tkr, period="7d", interval="1d", progress=False)
        if not hist.empty:
            last_price = float(hist['Close'].dropna().iloc[-1])
    except Exception:
        last_price = None

    direction = "Neutral"
    if last_price is not None and len(combined_preds)==7:
        avg_pred = np.mean(combined_preds)
        pct_change = (avg_pred - last_price) / (last_price + 1e-8)
        if pct_change > 0.01:
            direction = "Rise"
        elif pct_change < -0.01:
            direction = "Fall"
        else:
            direction = "Neutral"

    # 10. prepare final structured output
    output = {
        "company": company_name,
        "ticker": tkr,
        "agents": {
            "arima": {"predictions": arima_preds, "confidence": arima_conf},
            "llama": {"predictions": llama_preds, "confidence": llama_conf},
            "prophet": {"predictions": prophet_preds, "confidence": prophet_conf},
            
            "technical": {"predictions": tech_preds, "confidence": tech_conf, "summary": tech.get("summary")},
            "fundamentals": {"predictions": fund_preds, "confidence": fund_conf, "summary": fund.get("summary")},
            "news": {"summary": news_summary, "confidence": news_conf}
        },
        "combined_prediction": combined_preds,
        "combined_weights_used": used_weights,
        "final_confidence": final_confidence,
        "agreement_score": agreement,
        "volatility": vol,
        "direction": direction
    }

    # Optionally: call Gemini to generate a natural-language final analysis using above structure
    try:
        prompt = f"""
You are a senior financial analyst. Given the structured outputs below, provide:
1) A one-line verdict: Rise/Fall/Neutral (next 7 days) with confidence.
2) A short paragraph explaining the main reasons.
3) Show the combined 7-day predictions (comma separated).
Data:
{output}
"""
        res = genai_client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        output['final_analysis'] = res.text
    except Exception as e:
        output['final_analysis'] = f"LLM generation failed: {e}"

    return output


