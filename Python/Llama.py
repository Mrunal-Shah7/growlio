import pandas as pd
import yfinance as yf
from huggingface_hub import InferenceClient
import datetime
import json
import re

HF_TOKEN = "token"  

client = InferenceClient(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    token=HF_TOKEN
)

def get_last_7_days_data(ticker: str):
    """Fetch the last 7 daily closing prices from Yahoo Finance"""
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=14)  
    data = yf.download(ticker, start=start_date, end=end_date, progress=False)

    if data.empty:
        raise ValueError(f"❌ No data found for symbol '{ticker}'. Please check the ticker symbol.")

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [col[0] for col in data.columns]

    close_prices = data["Close"].dropna().tail(7).values.tolist()
    return close_prices


def predict_next_week(ticker: str):
    past_prices = get_last_7_days_data(ticker)

    prompt = f"""
You are a financial forecasting assistant.
The following are the last 7 daily closing prices of {ticker}:
{past_prices}

Predict the next 7 daily closing prices based on this data.
Return ONLY valid JSON. No code, no text, no markdown.

Output format (strictly JSON):
{{"predictions": [day8, day9, day10, day11, day12, day13, day14]}}
"""

    print("🔹 Sending request to Llama model on Hugging Face servers...")

    response = client.chat_completion(
        model="meta-llama/Meta-Llama-3-8B-Instruct",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=250,
    )

    message = response.choices[0].message["content"]
    print("\n🧠 Raw Model Response:\n", message)

    json_match = re.search(r'\{.*\}', message, re.DOTALL)
    if json_match:
        try:
            json_data = json.loads(json_match.group())
            predictions = json_data.get("predictions", [])

            print("\n📅 Predicted Next 7 Days Closing Prices:\n")
            today = datetime.date.today()
            for i, price in enumerate(predictions, start=1):
                future_date = today + datetime.timedelta(days=i)
                day_name = future_date.strftime("%A")
                date_str = future_date.strftime("%d %b %Y")
                print(f"{day_name:<10}, {date_str}   $ {price:>8.2f}")
        except Exception as e:
            print("\n⚠️ Could not parse JSON data properly.")
            print("Error:", e)
    else:
        print("\n⚠️ Model response did not contain valid JSON. Check model output above.")


if __name__ == "__main__":
    ticker = input("Enter stock symbol (e.g. AAPL, TSLA, MSFT): ").strip().upper()
    try:
        predict_next_week(ticker)
    except Exception as e:
        print(f"\n❌ Error: {e}")
