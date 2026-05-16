import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async getDesignRecommendations(query: string) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using mock results.");
      return null;
    }

    const prompt = `
      Act as a high-end nail salon stylist expert. 
      The customer wants: "${query}".
      
      Recommend 3 specific nail design styles that are currently viral on Pinterest and Instagram.
      For each, provide:
      1. A catchy name (e.g., 'Vanilla Chrome Glaze')
      2. A brief 1-sentence aesthetic description.
      3. A list of 3 key colors/materials used (e.g., 'Nude base', 'Pearl powder', 'High-gloss top coat').

      Return ONLY a JSON array of objects with keys: title, description, elements.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Gemini API error:", error);
      return null;
    }
  },

  async generateNailStudioResult(design: { shape: string, color: string, effect: string, art: string, accessory: string }) {
    const prompt = `
      Actúa como una estilista de uñas de lujo en "Lupe Nails Studio".
      La clienta ha diseñado:
      - Forma: ${design.shape}
      - Color: ${design.color}
      - Efecto: ${design.effect}
      - Arte Manual: ${design.art}
      - Accesorios/Pedrería: ${design.accessory}

      Genera un nombre artístico para este diseño y una descripción de 2 líneas que sea muy "Pinterest" y aspiracional.
      Incluye mención sutil al arte o accesorios si están presentes.
      Responde en JSON: { "name": "Nombre Viral", "description": "Descripción..." }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Gemini Studio error:", error);
      return { name: "Custom Lupe Style", description: "Un diseño único creado especialmente para potenciar tu estilo personal." };
    }
  }
};
