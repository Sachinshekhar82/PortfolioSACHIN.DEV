import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    about: string;
    email: string;
    github: string;
    linkedin: string;
    location: string;
  };
  education: {
    degree: string;
    institution: string;
    year: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    image: string;
    githubUrl: string;
    tags: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
  skills: string[];
}

export const parseResume = async (resumeText: string): Promise<PortfolioData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the following information from this resume text and return it as JSON: ${resumeText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              about: { type: Type.STRING },
              email: { type: Type.STRING },
              github: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              location: { type: Type.STRING },
            },
            required: ["name", "title", "about"],
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                year: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                image: { type: Type.STRING, description: "Suggest a high-quality Unsplash keyword for this project" },
                githubUrl: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
          certifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                issuer: { type: Type.STRING },
                year: { type: Type.STRING },
              },
            },
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
