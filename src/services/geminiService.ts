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
        model: "gemini-2.0-flash",
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

  generateFallbackResult(design: { shape: string, color: string, effect: string, art: string, accessory: string }) {
    const styleNames = [
      'Chrome Pearl Glaze', 'Soft Vanilla Cloud', 'Rose Gold Aura', 'Milky Lavender Dream',
      'Golden Hour Shimmer', 'Crystal Nude Elegance', 'Pink Sand Dune', 'Midnight Chrome Luxe',
      'French Couture Gloss', 'Clean Girl Pearl', 'Holographic Halo', 'Satin Blush Finish',
      'Glazed Donut Chic', 'Mermaid Scale Chrome', 'Opal Dreamscape'
    ];
    const name = styleNames[Math.floor(Math.random() * styleNames.length)];
    const desc = `Diseño en forma ${design.shape} con ${design.effect === 'Brillante' ? 'brillo ultra premium' : design.effect === 'Mate' ? 'acabado mate sedoso' : design.effect === 'Chrome' ? 'efecto chrome espejado' : design.effect === 'Glazed' ? 'acabado glazed donut' : 'destellos glitter'}${design.art !== 'none' ? ` y arte ${ART_NAMES[design.art as keyof typeof ART_NAMES] || 'personalizado'}` : ''}${design.accessory !== 'none' ? ` con ${ACCESSORY_NAMES[design.accessory as keyof typeof ACCESSORY_NAMES] || 'accesorios'}` : ''}. Un estilo que grita elegancia y tendencia.`;
    return { name, description: desc };
  },

  async generateNailStudioResult(design: { shape: string, color: string, effect: string, art: string, accessory: string }) {
    if (!process.env.GEMINI_API_KEY) {
      return this.generateFallbackResult(design);
    }

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
      if (!text) return this.generateFallbackResult(design);
      const parsed = JSON.parse(text.replace(/```json|```/g, ""));
      return parsed;
    } catch (error) {
      console.error("Gemini Studio error:", error);
      return this.generateFallbackResult(design);
    }
  }
}

const ART_NAMES = {
  'none': 'sin arte',
  'minimal': 'diseño minimalista',
  'marble': 'efecto mármol',
  'floral': 'flores manuales',
  'french': 'francesa moderna'
};

const ACCESSORY_NAMES = {
  'none': 'sin accesorios',
  'pearls': 'micro perlas',
  'crystals': 'cristales Swarovski',
  'gold-flakes': 'hojas de oro'
};
