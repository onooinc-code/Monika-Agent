
import { calculator, calculatorSchema } from './calculator.ts';
import { getCurrentWeather, getCurrentWeatherSchema } from './weather.ts';
import { executeShellCommand, executeShellCommandSchema } from './shell.ts';
import { getFullMessageTextSchema } from './contextual.ts';
import { FunctionDeclaration } from '@google/genai';

// A map of all available tool schemas for the Gemini API.
export const toolSchemas: Record<string, FunctionDeclaration> = {
    calculator: calculatorSchema,
    getCurrentWeather: getCurrentWeatherSchema,
    executeShellCommand: executeShellCommandSchema,
    get_full_message_text: getFullMessageTextSchema,
};

// A map of tool names to their actual function implementations.
// Note: contextual tools like get_full_message_text are implemented dynamically.
export const availableTools: Record<string, (args: any) => Promise<any>> = {
    calculator: calculator,
    getCurrentWeather: getCurrentWeather,
    executeShellCommand: executeShellCommand,
};
