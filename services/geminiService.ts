
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GeminiEditResponse } from './types';

// Function to get API key from localStorage or environment
const getApiKey = (): string => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        const userApiKey = localStorage.getItem('gemini-api-key');
        if (userApiKey) {
            return userApiKey;
        }
    }
    
    // Fallback to environment variable
    if (!process.env.API_KEY) {
        throw new Error("No API key found. Please set your Gemini API key using the BYOK button or set the API_KEY environment variable.");
    }
    
    return process.env.API_KEY;
};

// Function to create GoogleGenAI instance with current API key
const createAIInstance = () => {
    const apiKey = getApiKey();
    return new GoogleGenAI({ apiKey });
};

const base64ToGenerativePart = (base64Data: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64Data.split(',')[1],
            mimeType,
        },
    };
};

export const editImageWithGemini = async (base64Image: string, mimeType: string, prompt: string): Promise<GeminiEditResponse> => {
    try {
        const ai = createAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    base64ToGenerativePart(base64Image, mimeType),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let foundImage: { base64Image: string; mimeType: string; } | null = null;
        let textResponse: string | null = null;

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    foundImage = {
                        base64Image: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                    };
                } else if (part.text) {
                    textResponse = part.text;
                }
            }
        }
        
        if (!foundImage && !textResponse) {
             throw new Error("API response was empty. The model may have refused the request.");
        }
        
        return { image: foundImage, text: textResponse };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to edit image with Gemini: ${error.message}`);
        }
        throw new Error("An unknown error occurred while processing the image with Gemini.");
    }
};

export const generateContextualPrompts = async (base64Image: string, mimeType: string): Promise<string[]> => {
    try {
         const ai = createAIInstance();
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    base64ToGenerativePart(base64Image, mimeType),
                    { text: "Analyze this 360-degree photo of a room. Suggest 5 short, creative prompts for an AI to edit this image. The prompts should describe specific changes, like adding an object, changing wall colors, or altering the mood. Focus on actionable design ideas." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prompts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A creative editing prompt."
                            }
                        }
                    }
                }
            }
         });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (result.prompts && Array.isArray(result.prompts)) {
            // Filter to ensure all prompts are strings, preventing render errors.
            return result.prompts.filter(p => typeof p === 'string').slice(0, 5);
        }

        return [];

    } catch(error) {
        console.error("Error generating contextual prompts:", error);
        // In case of error, we don't want to break the app, just return an empty array.
        return [];
    }
};
