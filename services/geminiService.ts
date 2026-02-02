
import { GoogleGenAI, Type } from "@google/genai";

export const identifyCookieButton = async (htmlSnippet: string, apiKey: string) => {
  if (!apiKey) {
    console.error("Gemini API Key is missing.");
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Upgraded model recommendation
      contents: `Identify the 'Accept All' or 'Allow Cookies' button from this HTML snippet. 
      Return only the EXACT text content as it appears in the HTML. Do not paraphrase or normalize.
      HTML: ${htmlSnippet}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            buttonText: {
              type: Type.STRING,
              description: "The visible text of the button (e.g., 'Accept All', 'Allow', 'I agree')"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of why this button was chosen"
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 1"
            }
          },
          required: ["buttonText", "reasoning", "confidence"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
