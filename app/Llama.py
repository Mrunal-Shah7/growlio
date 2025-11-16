#Author:Mrunal Shah
import os
import pandas as pd
import yfinance as yf
from huggingface_hub import InferenceClient
import datetime
import json
import re

from dotenv import load_dotenv
load_dotenv()


MS_HF_TOKEN = os.getenv("MS_HF_TOKEN")

client = InferenceClient(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    token=MS_HF_TOKEN
)


def resolve_ticker(company_name: str) -> str:
    """
    Resolve company name → ticker symbol using yfinance.
    """
    try:
        search = yf.Search(company_name, max_results=5, enable_fuzzy_query=True)
        quotes = search.quotes
        if quotes:
            ticker = quotes[0]["symbol"]
            print(f"Resolved '{company_name}' → ticker '{ticker}'")
            return ticker
    except Exception:
        pass
    
    print(f"Could not resolve company '{company_name}', treating it as ticker.")
    return company_name


def get_last_7_days_data(ticker: str):
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=14)
    data = yf.download(ticker, start=start_date, end=end_date, progress=False)

    if data.empty:
        raise ValueError(f"No data for ticker: {ticker}")

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [col[0] for col in data.columns]

    prices = data["Close"].dropna().tail(7).values.tolist()
    if len(prices) < 3:
        raise ValueError("Too few recent prices for prediction.")
    return prices


def predict_next_week(company_name: str, return_values=False):
    ticker = resolve_ticker(company_name)

    try:
        past_prices = get_last_7_days_data(ticker)
    except Exception as e:
        print("Error fetching price data:", e)
        if return_values:
            return []
        return

    prompt = f"""
You are a financial forecasting assistant.
The following are the last 7 daily closing prices of {ticker}:
{past_prices}

Predict the next 7 daily closing prices based only on this data.
Return ONLY valid JSON. No markdown, no extra text.

Use this format:
{{"predictions": [p1, p2, p3, p4, p5, p6, p7]}}
"auth_signature": "MS-2025"
"""

    print("Sending request to Llama…")

    try:
        response = client.chat_completion(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
    except Exception as e:
        print(" HuggingFace API error:", e)
        if return_values:
            return []
        return

    message = response.choices[0].message["content"]

    json_part = re.search(r"\{.*\}", message, re.DOTALL)
    if not json_part:
        print(" Model did not return valid JSON.")
        if return_values:
            return []
        return

    try:
        parsed = json.loads(json_part.group())
        preds = [float(x) for x in parsed["predictions"]]
    except Exception:
        print(" JSON parsing error.")
        if return_values:
            return []
        return

    if return_values:
        return preds

    print("\n #MS Llama Prediction (Next 7 Days):")
    for i, p in enumerate(preds, start=1):
        print(f"Day {i}: ${p:.2f}")


if __name__ == "__main__":
    company_name = input("Enter company name: ").strip()
    predict_next_week(company_name)
# ---::ms::--- end block