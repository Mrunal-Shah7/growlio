package com.xenostar.growliooo;


import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class NewsAgentService{
    private final ChatClient chatClient;
    private final WebClient webClient;
    private final String newsApiKey;
    public NewsAgentService(ChatClient.Builder builder, @Value("e4fbd41e788b40f1b3ee166e2e53d7a7") String newsApiKey){
        this.chatClient = builder.build();
        this.webClient = WebClient.builder().baseUrl("https://newsapi.org/v2").build();
        this.newsApiKey = newsApiKey;
    }

    public String analyzeCompany(String companyName) {
        String response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/everything")
                        .queryParam("q", companyName)
                        .queryParam("language", "en")
                        .queryParam("pageSize", 7)
                        .queryParam("sortBy", "publishedAt")
                        .queryParam("apiKey", newsApiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        String prompt = """
                You are a seasoned financial analyst with expertise in stock markets, company fundamentals, and sectoral trends.
                Below is recent data/news about %s:

                %s

                Analyze this information and provide:
                1. A concise summary of any major company or sector developments.
                2. Your assessment of the company’s future growth potential (next 6-12 months).
                3. A reasoned qualitative stock price outlook — whether it’s likely to rise, fall, or remain stable.
                4. Mention key macroeconomic or sectoral drivers influencing the stock.
                5. (Optional) Add a confidence score (0-100) for your prediction.

                Make the output well-formatted, clear, and insightful for an investor audience.
                """.formatted(companyName, response);

        return chatClient.prompt(prompt).call().content();
    }
}