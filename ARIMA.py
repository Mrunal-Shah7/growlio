import yfinance as yf
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings("ignore")


def resolve_ticker(user_input: str) -> str:
    try:
        search = yf.Search(user_input, max_results=5, enable_fuzzy_query=True)
        quotes = search.quotes
        if quotes and len(quotes) > 0:
            ticker = quotes[0]['symbol']
            print(f"Resolved '{user_input}' to ticker '{ticker}'")
            return ticker
    except Exception as e:
        print(f"Search lookup failed for '{user_input}': {e}")
    return user_input


def predict_next_week(stock_input: str):
    ticker = resolve_ticker(stock_input)
    
    data = yf.download(ticker, period="5d", interval="1d")
    if data.empty:
        print("No data found for ticker:", ticker)
        return
    print(data)

    close_prices = data['Close'].dropna()
    model = ARIMA(close_prices, order=(2,1,2))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=7)
    forecast_dates = pd.date_range(start=close_prices.index[-1] + pd.Timedelta(days=1), periods=7)

    forecast_df = pd.DataFrame({'Predicted_Close': forecast}, index=forecast_dates)

    print(f"\n📈 {ticker} Stock Price Prediction for the Next 7 Days:\n")
    print("-" * 55)
    print(f"{'Date':<25}{'Predicted Closing Price':>30}")
    print("-" * 55)
    for date, price in forecast_df['Predicted_Close'].items():
        print(f"{date.strftime('%A, %d %b %Y'):<25}${price:>10.2f}")
    print("-" * 55)
    print("\nPrediction complete.\n")


if __name__ == "__main__":
    user_input = input("Enter stock ticker or company name: ").strip()
    predict_next_week(user_input)
