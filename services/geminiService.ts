
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyCookieButton = async (htmlSnippet: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the 'Accept All' or 'Allow Cookies' button from this HTML snippet. 
      Return only the text content or CSS selector that uniquely identifies it.
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
