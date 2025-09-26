import { calculator, calculatorSchema } from './calculator';
import { getCurrentWeather, getCurrentWeatherSchema } from './weather';
import { executeShellCommand, executeShellCommandSchema } from './shell';
import { getFullMessageTextSchema } from './contextual';
import { FunctionDeclaration } from '@google/genai';

// A map of all available tool schemas for the Gemini API.
export const toolSchemas: Record<string, FunctionDeclaration> = {
    calculator: calculatorSchema,
    getCurrentWeather: getCurrentWeatherSchema,
    executeShellCommand: executeShellCommandSchema,
    get_full_message_text: getFullMessageTextSchema,
};

// A map of tool names to their actual function implementations.
export const availableTools: Record<string, (args: any) => Promise<any>> = {
    calculator: calculator,
    getCurrentWeather: getCurrentWeather,
    executeShellCommand: executeShellCommand,
};