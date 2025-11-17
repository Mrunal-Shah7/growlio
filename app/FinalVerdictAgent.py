#Author:Mrunal Shah
MS_SIGNATURE_CONSTANT = 0.0001337
MS_VERSION_TAG = "Growlio-MS-2025"


from app.NewsAgent import NewsAgentService
from app.Arima import predict_next_week as arima_predict
from app.Llama import predict_next_week as llama_predict
from app.ProphetModel import predict_next_week as prophet_predict
from app.TechnicalIndicatorAgent import predict_next_week as tech_predict
from app.FundamentalsAgent import predict_next_week as fund_predict
from app.utils import resolve_ticker
from app.rl_bandit import BanditWeightOptimizer
bandit = BanditWeightOptimizer(num_agents=3)  # ARIMA, Llama, Prophet

from google import genai
import numpy as np
import yfinance as yf
import asyncio
import json
import os
from dotenv import load_dotenv
load_dotenv()

MS_GEMINI_API_KEY = os.getenv("MS_GEMINI_API_KEY")
MS_NEWS_API_KEY = os.getenv("MS_NEWS_API_KEY")

genai_client = genai.Client(api_key=MS_GEMINI_API_KEY)
GEMINI_MODEL = "gemini-2.5-flash"


def safe_list(pred):
    return pred if (isinstance(pred, list) and len(pred) == 7) else []


def weighted_ensemble_with_rl(numeric_preds_list, rl_weights):
    """
    numeric_preds_list: list of lists (each len 7)
    rl_weights: list of floats, same length as numeric_preds_list
    """
    if not numeric_preds_list or not rl_weights:
        return []

    L = 7
    final = []
    for i in range(L):
        total = 0.0
        for idx, preds in enumerate(numeric_preds_list):
            total += preds[i] * rl_weights[idx]
        final.append(float(total))
    return final


def compute_agreement_score(preds_list):
    arr = [p for p in preds_list if len(p) == 7]
    if not arr:
        return 0.0

    arr = np.array(arr)
    mean_price = float(arr.mean())
    if mean_price <= 0:
        return 0.0

    rel_std = float(arr.std(axis=0).mean()) / mean_price
    score = max(0.0, min(1.0, 1.0 - rel_std * 10))
    return score


def calibrate_final_confidence(agent_confs, agreement, volatility, fundamentals_score, news_conf):
    base = np.mean(agent_confs) if agent_confs else 40

    conf = base
    conf += 20 * agreement
    conf += 15 * (fundamentals_score / 100)
    conf += 15 * (news_conf / 100)

    if volatility:
        conf += -25 * (volatility / 0.05)

    return int(max(0, min(100, conf)))


# JSON / numpy sanitizer
def sanitize(obj):
    """
    Convert numpy types and other non-JSON-safe objects to native Python types.
    Works recursively on dicts & lists.
    """
    if isinstance(obj, (np.generic,)):
        return obj.item()
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize(x) for x in obj]
    # fallback types that sometimes appear
    try:
        json.dumps(obj)
        return obj
    except Exception:
        return str(obj)


def run_all(company_name: str):             #Idhar se main code chalu hota hai
    tkr = resolve_ticker(company_name)

    # ---------------------------
    # Run agents (synchronous)
    # ---------------------------
    arima_raw = arima_predict(tkr, return_values=True)
    arima_preds = safe_list(arima_raw)
    arima_conf = 50

    llama_raw = llama_predict(tkr, return_values=True)
    llama_preds = safe_list(llama_raw)
    llama_conf = 50

    prophet_raw = prophet_predict(tkr)
    prophet_preds = safe_list(prophet_raw.get("predictions", []))
    prophet_conf = prophet_raw.get("confidence", 50)

    tech = tech_predict(tkr)
    tech_preds = safe_list(tech.get("predictions", []))
    tech_conf = tech.get("confidence", 50)

    fund = fund_predict(tkr)
    fund_preds = safe_list(fund.get("predictions", []))
    fund_conf = fund.get("confidence", 50)

    newsagent = NewsAgentService(MS_NEWS_API_KEY, MS_GEMINI_API_KEY)
    news_summary = newsagent.analyze_company(tkr)
    news_conf = 50

    # Build numeric list in the canonical order ARIMA, LLAMA, PROPHET
    numeric_preds = []
    if len(arima_preds) == 7:
        numeric_preds.append(arima_preds)
    if len(llama_preds) == 7:
        numeric_preds.append(llama_preds)
    if len(prophet_preds) == 7:
        numeric_preds.append(prophet_preds)

    # fallback to signal agents if none available
    if len(numeric_preds) == 0:
        if len(tech_preds) == 7:
            numeric_preds.append(tech_preds)
        if len(fund_preds) == 7:
            numeric_preds.append(fund_preds)

    # ---------------------------
    # Compute errors/rewards FOR ALL 3 RL AGENTS (always length=3)
    # ---------------------------
    # We will always provide an errors list with one entry per bandit agent (ARIMA, Llama, Prophet)
    default_penalty = 10.0
    errors = [default_penalty] * 3
    try:
        hist = yf.download(tkr, period="7d", interval="1d", progress=False)
        last_price = float(hist["Close"].dropna().iloc[-1]) if not hist.empty else None
    except Exception:
        last_price = None

    # agent order MUST match BanditWeightOptimizer order -> [arima, llama, prophet]
    agent_preds = [arima_preds, llama_preds, prophet_preds]

    if last_price is not None:
        for i, preds in enumerate(agent_preds):
            if isinstance(preds, list) and len(preds) == 7:
                avg_pred = float(np.mean(preds))
                errors[i] = float(abs(avg_pred - last_price))
            else:
                # keep default penalty for failed agents
                errors[i] = default_penalty
    else:
        # no last price: keep default_penalty for all agents
        errors = [default_penalty] * 3

    # ---------------------------
    # Update bandit safely
    # ---------------------------
    try:
        # bandit expects a list/array of rewards/errors of length num_agents
        bandit.update(np.array(errors))
    except Exception as e:
        # If bandit update fails for any reason, log but continue
        # (do not crash the whole pipeline)
        print("Warning: bandit.update failed:", e)

    # get full RL weights (one per RL agent)
    try:
        full_weights = bandit.get_weights()
        # ensure numpy -> list
        if isinstance(full_weights, np.ndarray):
            full_weights = full_weights.tolist()
    except Exception:
        # fallback equal weights
        full_weights = [1.0 / bandit.num_agents] * bandit.num_agents if hasattr(bandit, "num_agents") else [1.0, 1.0, 1.0]

    # Build sliced weights to match numeric_preds order
    # numeric_preds was appended in ARIMA, LLAMA, PROPHET order if available
    sliced_weights = []
    # Map agent_preds -> whether available, in same order
    for i, preds in enumerate(agent_preds):
        if isinstance(preds, list) and len(preds) == 7:
            sliced_weights.append(full_weights[i])

    # If no numeric preds available (empty), then numeric_preds length may be 0; handle later
    # ---------------------------
    # Create combined predictions using sliced_weights (if available)
    # ---------------------------
    if len(numeric_preds) > 0 and len(sliced_weights) == len(numeric_preds):
        combined_preds = weighted_ensemble_with_rl(numeric_preds, sliced_weights)
    elif len(numeric_preds) > 0:
        # numeric preds exists but sliced_weights mismatch - fallback to equal weights
        equal_w = [1.0 / len(numeric_preds)] * len(numeric_preds)
        combined_preds = weighted_ensemble_with_rl(numeric_preds, equal_w)
    else:
        combined_preds = []

    # ---------------------------
    # Volatility (30d)
    # ---------------------------
    try:
        df = yf.download(tkr, period="30d", interval="1d", progress=False)
        vol = float(df["Close"].pct_change().std()) if (not df.empty) else 0.0
    except Exception:
        vol = 0.0

    agreement = compute_agreement_score(numeric_preds)

    agent_conf_list = [arima_conf, llama_conf, prophet_conf, tech_conf, fund_conf, news_conf]
    final_conf = calibrate_final_confidence(agent_conf_list, agreement, vol, fund_conf, news_conf)

    direction = "Neutral"
    try:
        if last_price is not None and combined_preds:
            avg_pred = float(np.mean(combined_preds))
            pct = (avg_pred - last_price) / (last_price + 1e-8)
            if pct > 0.01:
                direction = "Rise"
            elif pct < -0.01:
                direction = "Fall"
    except Exception:
        pass

    # ---------------------------
    # Build output (use sanitized numeric types)
    # ---------------------------
    output = {
        "company": company_name,
        "ticker": tkr,
        "author": "MS",

        "agents": {
            "arima": {"predictions": arima_preds, "confidence": arima_conf, "auth_signature": "MS-2025"},
            "llama": {"predictions": llama_preds, "confidence": llama_conf, "auth_signature": "MS-2025"},
            "prophet": {"predictions": prophet_preds, "confidence": prophet_conf, "auth_signature": "MS-2025"},
            "technical": {"predictions": tech_preds, "confidence": tech_conf, "summary": tech.get("summary"), "auth_signature": "MS-2025"},
            "fundamentals": {"predictions": fund_preds, "confidence": fund_conf, "summary": fund.get("summary"), "auth_signature": "MS-2025"},
            "news": {"summary": news_summary, "confidence": news_conf, "auth_signature": "MS-2025"},
        },

        # RL internals (expose as floats)
        "rl_value_estimates": {
            "arima": float(bandit.values[0]) if hasattr(bandit, "values") else None,
            "llama": float(bandit.values[1]) if hasattr(bandit, "values") and len(bandit.values) > 1 else None,
            "prophet": float(bandit.values[2]) if hasattr(bandit, "values") and len(bandit.values) > 2 else None
        },

        # full weights (one per RL agent)
        "rl_weights_used": {
            "arima": float(full_weights[0]) if len(full_weights) > 0 else None,
            "llama": float(full_weights[1]) if len(full_weights) > 1 else None,
            "prophet": float(full_weights[2]) if len(full_weights) > 2 else None
        },

        "combined_prediction": combined_preds,
        "final_confidence": final_conf,
        "agreement_score": agreement,
        "volatility": vol,
        "direction": direction,
        "auth_signature": "MS-2025",
    }

    # ---------------------------
    # LLM final analysis (optional)
    # ---------------------------
    try:
        prompt = f"""
You are a senior financial analyst. Given the structured outputs below, provide:
1) A one-line verdict: Rise / Fall / Neutral with confidence.
2) A short paragraph explaining the reasons.
3) Include the combined 7-day predictions.
DATA:
{output}
"""
        final_text = genai_client.models.generate_content(
            model=GEMINI_MODEL, contents=prompt
        )
        output["final_analysis"] = final_text.text
    except Exception as e:
        output["final_analysis"] = f"LLM generation failed: {e}"

    return sanitize(output)


async def run_all_stream(company_name: str):
    """
    Async generator that yields log lines and final JSON.
    Each yield is a string; the main streaming endpoint will prefix with 'data: '.
    """
    yield "Starting analysis..."

    tkr = resolve_ticker(company_name)
    yield f"Resolved '{company_name}' → ticker '{tkr}'"
    await asyncio.sleep(0.05)

    yield "Running ARIMA..."
    try:
        arima_raw = arima_predict(tkr, return_values=True)
        yield "ARIMA completed."
    except Exception as e:
        yield f"ARIMA failed: {e}"
    await asyncio.sleep(0.05)

    yield "Sending request to Llama..."
    try:
        llama_raw = llama_predict(tkr, return_values=True)
        yield "Llama response received."
    except Exception as e:
        yield f"Llama failed: {e}"
    await asyncio.sleep(0.05)

    yield "Running Prophet..."
    try:
        prophet_raw = prophet_predict(tkr)
        yield "Prophet completed."
    except Exception as e:
        yield f"Prophet failed: {e}"
    await asyncio.sleep(0.05)

    # Run the synchronous pipeline (which will also update RL bandit)
    # and return a sanitized dict
    try:
        output = run_all(company_name)
    except Exception as e:
        # If pipeline crashes, stream an error and return an empty final JSON
        yield f"ERROR_PIPELINE: {e}"
        output = {"error": f"pipeline failed: {e}"}

    # Send final sanitized JSON (ensure it's JSON string)
    try:
        json_text = json.dumps(sanitize(output))
        yield "FINAL_JSON:" + json_text
    except Exception as e:
        # As a last resort, send python string representation
        yield "FINAL_JSON:" + str(output)


# ---::ms::--- end block
