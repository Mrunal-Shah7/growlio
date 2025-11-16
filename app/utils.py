#Author:Mrunal Shah
import yfinance as yf

def resolve_ticker(company_name: str) -> str:
    """
    Try to map a company name to a ticker using yfinance search.
    If it fails, return the input (assume it's already a ticker).
    """
    try:
        search = yf.Search(company_name, max_results=5, enable_fuzzy_query=True)
        quotes = getattr(search, "quotes", None)
        if quotes and len(quotes) > 0:
            ticker = quotes[0].get("symbol") or quotes[0].get("ticker") or quotes[0]
            print(f"Resolved '{company_name}' -> '{ticker}'")
            return ticker
    except Exception as e:
        pass
    print(f" Could not resolve '{company_name}', using input as ticker.")
    return company_name.strip().upper()
# ---::ms::--- end block