import { FunctionDeclaration, Type } from "@google/genai";

export const getCurrentWeatherSchema: FunctionDeclaration = {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            location: {
                type: Type.STRING,
                description: "The city and state, e.g. San Francisco, CA"
            },
        },
        required: ["location"]
    }
};

export const getCurrentWeather = async ({ location }: { location: string }): Promise<{ weather: object }> => {
    // This is a mock function. In a real application, you would call a weather API.
    const mockWeatherData: Record<string, { temperature: string; condition: string; }> = {
        "San Francisco, CA": { temperature: "15°C", condition: "Cloudy" },
        "Tokyo": { temperature: "28°C", condition: "Sunny" },
        "London": { temperature: "12°C", condition: "Rainy" },
        "Cairo": { temperature: "35°C", condition: "Sunny" }
    };

    const key = Object.keys(mockWeatherData).find(k => location.toLowerCase().includes(k.split(',')[0].toLowerCase())) || "San Francisco, CA";

    return Promise.resolve({ weather: mockWeatherData[key] });
};