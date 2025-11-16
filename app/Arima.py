#Author:Mrunal Shah

import yfinance as yf
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings("ignore")


def resolve_ticker(company_name: str) -> str:
    """
    Resolve a company name to a valid ticker symbol using yfinance search.
    If lookup fails, return the original input.
    Signature: MS-2025
    """
    try:
        search = yf.Search(company_name, max_results=5, enable_fuzzy_query=True)
        quotes = search.quotes
        if quotes and len(quotes) > 0:
            ticker = quotes[0]["symbol"]
            print(f"Resolved '{company_name}' → ticker '{ticker}' \n #MS")
            return ticker
    except Exception:
        pass
    
    print(f"Error ! Could not resolve company name '{company_name}', treating it as ticker.")
    return company_name


def predict_next_week(company_name: str, return_values: bool = False):
    """
    Predict the next 7-day closing prices using ARIMA.
    Resolves company name → ticker automatically.
    Signature: MS-2025
    """

    ticker = resolve_ticker(company_name)

    try:
        data = yf.download(ticker, period="14d", interval="1d", progress=False)
    except Exception as e:
        print(f"Error downloading data for {ticker}: {e}")
        if return_values:
            return []
        return

    if data.empty:
        print(f" No price data found for '{ticker}'.")
        if return_values:
            return []
        return

    close_prices = data["Close"].dropna()
    if len(close_prices) < 3:
        print(" Not enough recent price data for ARIMA.")
        if return_values:
            return []
        return

    try:
        model = ARIMA(close_prices, order=(2, 1, 2))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=7)
    except Exception as e:
        print("ARIMA model failed:", e)
        if return_values:
            return []
        return

    forecast_values = [float(x) for x in forecast.tolist()]

    if return_values:
        return forecast_values

    print("\n ARIMA Prediction (Next 7 Days):\n")
    for i, p in enumerate(forecast_values, start=1):
        print(f"Day {i}: ${p:.2f}")
    print("\n #MS")


if __name__ == "__main__":
    company_name = input("Enter company name: ").strip()
    predict_next_week(company_name)
# ---::ms::--- end block