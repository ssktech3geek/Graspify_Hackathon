package com.graspify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final WebClient.Builder webClientBuilder;

    public String askGroq(String question, String context) {
        String prompt = context != null && !context.isEmpty()
            ? "You are a helpful study assistant. Here is the context from the user's study canvas:\n\n"
              + context + "\n\nNow answer this question:\n" + question
            : "You are a helpful study assistant. Answer this question:\n" + question;

        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.1-8b-instant",
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            )
        );

        try {
            Map response = webClientBuilder.build()
                .post()
                .uri("https://api.groq.com/openai/v1/chat/completions")
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            List choices = (List) response.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            return "Sorry, I couldn't get a response: " + e.getMessage();
        }
    }
}