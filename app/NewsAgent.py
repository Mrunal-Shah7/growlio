import requests
from google import genai


class NewsAgentService:
    def __init__(self, news_api_key: str, gemini_api_key: str):
    
        self.news_api_key = news_api_key

        self.client = genai.Client(api_key=gemini_api_key)
        self.model = "gemini-2.5-pro"   

        self.base_url = "https://newsapi.org/v2"

    def analyze_company(self, company_name: str) -> str:

        params = {
            "q": company_name,
            "language": "en",
            "pageSize": 7,
            "sortBy": "publishedAt",
            "apiKey": self.news_api_key
        }

        response = requests.get(f"{self.base_url}/everything", params=params)

        if response.status_code != 200:
            return f"❌ Error fetching news: {response.text}"

        news_data = response.text  

        
        prompt = f"""
You are a seasoned financial analyst with expertise in stock markets, company fundamentals, and sectoral trends.

Below is recent data/news about **{company_name}**:

{news_data}

Analyze this information and provide:

1. A concise summary of major company or sector developments in one or maximum two lines.
2. Your assessment of the company’s future growth potential (next 6–12 months) in one line.
3. The predicted values of the price of the stock for the next seven days. 
4. In the end, add a confidence score (0–100) for your prediction.

Format the output clearly and professionally for an investor audience.
"""

        try:
            result = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )

            return result.text

        except Exception as e:
            return f"❌ Error calling Gemini 2.5 Flash: {str(e)}"


if __name__ == "__main__":
    NEWS_API_KEY = "e4fbd41e788b40f1b3ee166e2e53d7a7"
    GEMINI_API_KEY = "AIzaSyCffDW0Tu7zWXdHe5fKdyvOt5VXZTmpC2U"

    service = NewsAgentService(NEWS_API_KEY, GEMINI_API_KEY)

    company = input("Enter a company name: ")
    print("\n🔎 Fetching and analyzing news...\n")

    analysis = service.analyze_company(company)
    print(analysis)