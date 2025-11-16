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
bandit = BanditWeightOptimizer(num_agents=3)  

from google import genai
import numpy as np
import yfinance as yf

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
    final = []
    for i in range(7):
        total = 0
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


def run_all(company_name: str):             #Idhar se main code chalu hota hai 
    tkr = resolve_ticker(company_name)

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

    numeric_preds = []
    if len(arima_preds) == 7:
        numeric_preds.append(arima_preds)
    if len(llama_preds) == 7:
        numeric_preds.append(llama_preds)
    if len(prophet_preds) == 7:
        numeric_preds.append(prophet_preds)

    if len(numeric_preds) == 0:
        if len(tech_preds) == 7:
            numeric_preds.append(tech_preds)
        if len(fund_preds) == 7:
            numeric_preds.append(fund_preds)

    errors = []
    try:
        hist = yf.download(tkr, period="7d", interval="1d", progress=False)
        last_price = float(hist["Close"].dropna().iloc[-1])
    except:
        last_price = None

    if last_price:
        for preds in numeric_preds:
            avg_pred = np.mean(preds)
            errors.append(abs(avg_pred - last_price))
    else:
        errors = [5, 5, 5]  

    bandit.update(errors)

    rl_weights = bandit.get_weights()

    rl_weights = rl_weights[:len(numeric_preds)]

    combined_preds = weighted_ensemble_with_rl(numeric_preds, rl_weights)

    try:
        df = yf.download(tkr, period="30d", interval="1d", progress=False)
        vol = float(df["Close"].pct_change().std()) if not df.empty else 0.0
    except:
        vol = 0.0

    agreement = compute_agreement_score(numeric_preds)

    agent_conf_list = [arima_conf, llama_conf, prophet_conf, tech_conf, fund_conf, news_conf]
    final_conf = calibrate_final_confidence(agent_conf_list, agreement, vol, fund_conf, news_conf)

    direction = "Neutral"
    try:
        if last_price and combined_preds:
            avg_pred = np.mean(combined_preds)
            pct = (avg_pred - last_price) / (last_price + 1e-8)
            if pct > 0.01:
                direction = "Rise"
            elif pct < -0.01:
                direction = "Fall"
    except:
        pass

    output = {
        "company": company_name,
        "ticker": tkr,
        "author": "MS",
        

        "agents": {
            "arima": {"predictions": arima_preds, "confidence": arima_conf,"auth_signature": "MS-2025"},
            "llama": {"predictions": llama_preds, "confidence": llama_conf,"auth_signature": "MS-2025"},
            "prophet": {"predictions": prophet_preds, "confidence": prophet_conf,"auth_signature": "MS-2025"},
            "technical": {"predictions": tech_preds, "confidence": tech_conf, "summary": tech.get("summary"),"auth_signature": "MS-2025"},
            "fundamentals": {"predictions": fund_preds, "confidence": fund_conf, "summary": fund.get("summary"),"auth_signature": "MS-2025"},
            "news": {"summary": news_summary, "confidence": news_conf,"auth_signature": "MS-2025"},
        },

        "rl_value_estimates": {
            "arima": bandit.values[0],
            "llama": bandit.values[1],
            "prophet": bandit.values[2]
        },

        "rl_weights_used": {
            "arima": rl_weights[0] if len(rl_weights) > 0 else None,
            "llama": rl_weights[1] if len(rl_weights) > 1 else None,
            "prophet": rl_weights[2] if len(rl_weights) > 2 else None
        },

        "combined_prediction": combined_preds,
        "final_confidence": final_conf,
        "agreement_score": agreement,
        "volatility": vol,
        "direction": direction,
        "auth_signature": "MS-2025",
        
    }

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

    return output
# ---::ms::--- end block