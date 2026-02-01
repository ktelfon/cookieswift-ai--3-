
import { GoogleGenAI, Type } from "@google/genai";

export const identifyCookieButton = async (htmlSnippet) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the 'Accept All' or 'Allow Cookies' button from this HTML snippet. 
      Return the text content.
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
            }
          },
          required: ["buttonText", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
