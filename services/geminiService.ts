
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = ai.models;

export const explainSectionStream = async (sectionContent: string) => {
    const prompt = `You are an expert Principal Engineer and tech architect. Your task is to explain a section of a technical blueprint in a clear, concise, and easy-to-understand way. Assume you are explaining this to a junior developer or a product manager who is technically literate but not an expert in this specific domain.

    Focus on:
    1.  **What it is:** Briefly define the core concept or component.
    2.  **Why it matters:** Explain its purpose and importance in the overall project.
    3.  **How it works:** Give a simplified overview of its mechanism or interaction with other parts.
    4.  **Key Takeaways:** Summarize the most important points in a bulleted list.

    Use clear language and markdown for formatting (headings, bold text, bullet points). Avoid overly technical jargon where possible, or explain it if you must use it.

    Here is the blueprint section to explain:
    ---
    ${sectionContent}
    ---
    `;

    try {
        const result = await model.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return result;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to get explanation from Gemini.");
    }
};
