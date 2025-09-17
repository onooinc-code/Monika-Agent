import { FunctionDeclaration, Type } from "@google/genai";

export const calculatorSchema: FunctionDeclaration = {
    name: "calculator",
    description: "Performs basic arithmetic operations like addition, subtraction, multiplication, and division.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            expression: {
                type: Type.STRING,
                description: "The mathematical expression to evaluate (e.g., '5*7', '10+3')."
            }
        },
        required: ["expression"]
    }
};

export const calculator = async ({ expression }: { expression: string }): Promise<{ result: number | string }> => {
    try {
        // A safe way to evaluate mathematical expressions without using eval().
        // This regex is a simple approach; a more robust solution would use a proper math parser library.
        if (!/^[0-9+\-*/.()\s]+$/.test(expression)) {
             return { result: "Error: Invalid characters in expression." };
        }
        const result = new Function(`return ${expression}`)();
        return { result };
    } catch (error) {
        return { result: `Error: ${error instanceof Error ? error.message : "Could not evaluate expression."}` };
    }
};
