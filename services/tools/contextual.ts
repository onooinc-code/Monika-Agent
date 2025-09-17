
import { FunctionDeclaration, Type } from "@google/genai";

export const getFullMessageTextSchema: FunctionDeclaration = {
    name: "get_full_message_text",
    description: "Retrieves the full, original, unabbreviated text of a specific message from the conversation history using its ID.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            message_id: {
                type: Type.STRING,
                description: "The ID of the message to retrieve, found in the format (msg_id: ...)."
            }
        },
        required: ["message_id"]
    }
};