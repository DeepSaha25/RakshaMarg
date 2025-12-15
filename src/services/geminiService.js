import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

let model;

if (config.geminiApiKey) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

export const geminiService = {
    async analyzeSafety(routeData, crimeData) {
        if (!model) {
            console.warn('Gemini API Key missing, skipping analysis');
            return { safetyScore: 50, summary: "Analysis unavailable (API Key missing)" };
        }

        // Prompt engineering to analyze safety
        const prompt = `
      Analyze the safety of the following route based on the provided data:
      Route Summary: ${routeData.summary}
      Nearby Places: ${JSON.stringify(routeData.places || [])}
      Crime Reports: ${JSON.stringify(crimeData || [])}
      
      Provide a JSON response with:
      - safetyScore (0-100)
      - riskFactors (array of strings)
      - friendlyTips (array of strings)
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Parsing logic: ensure output is JSON or handle text gracefully
            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return { safetyReport: "Error generating report" };
        }
    }
};
