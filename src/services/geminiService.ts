import { GoogleGenAI, Type } from "@google/genai";
import { QuizResponse, QuizSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateQuestion(settings: QuizSettings): Promise<QuizResponse> {
  const prompt = `Class: ${settings.currentClass}, Subject: ${settings.subject}, Topic: ${settings.topic}, Level: ${settings.difficulty}, Seed: ${settings.seed}`;
  
  const systemInstruction = `
    You are the core engine of QuizMorph, a Professional Educational Quiz App. 
    Your goal is to generate one high-quality, randomized multiple-choice question based on the user's selection.
    
    SPECIAL RULE FOR MIXED SUBJECTS:
    If the subject is "Mixed Subjects", you MUST provide a question from any of the standard subjects (Physics, Chemistry, Biology, Maths, Geography, History, Civics, Economics, English) ensuring equal weightage over multiple calls. Use the Seed to determine which subject to pick.
    
    RULES:
    1. RANDOMIZATION: Use the provided Seed to ensure the question is unique.
    2. NO REPETITION: Avoid common textbook questions. Mix conceptual, application-based, and factual questions.
    3. IMAGE PROMPT: For subjects like Physics, Chemistry, and Geography, if a visual is necessary (e.g., a circuit diagram, map, or chemical structure), you MUST include a detailed "image_prompt". Set "has_image" to true.
    4. ACCURACY: Ensure the question and explanation are scientifically and factually correct.
    5. BOX FORMAT: Return the response in the exact JSON structure provided in the schema.
    6. OPTIONS: Provide exactly 4 options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            step_info: {
              type: Type.OBJECT,
              properties: {
                current_class: { type: Type.STRING },
                selected_subject: { type: Type.STRING },
                selected_topic: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["current_class", "selected_subject", "selected_topic", "difficulty"]
            },
            question_box: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                has_image: { type: Type.BOOLEAN },
                image_prompt: { type: Type.STRING, nullable: true },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "has_image", "options", "answer", "explanation"]
            },
            random_seed_used: { type: Type.STRING }
          },
          required: ["step_info", "question_box", "random_seed_used"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as QuizResponse;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional educational diagram for a quiz: ${prompt}` }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
