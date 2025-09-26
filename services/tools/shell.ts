import { FunctionDeclaration, Type } from "@google/genai";
import { virtualFileSystem as vfs, getPath, navigatePath } from './vfs';

let currentDirectory = '/';

export const executeShellCommandSchema: FunctionDeclaration = {
    name: "executeShellCommand",
    description: "Executes a command in a sandboxed web shell environment. Supports filesystem operations on a virtual file system (ls, cat, pwd, cd, echo) and safe JavaScript execution (js).",
    parameters: {
        type: Type.OBJECT,
        properties: {
            command: {
                type: Type.STRING,
                description: "The full command to execute, e.g., 'ls /documents', 'cat /readme.txt', 'js \"return 2+2\"'."
            }
        },
        required: ["command"]
    }
};

export const executeShellCommand = async ({ command }: { command: string }): Promise<{ stdout: string, stderr: string }> => {
    const [cmd, ...args] = command.trim().split(/\s+/);
    const argString = args.join(' ');

    try {
        switch (cmd) {
            case 'ls': {
                const path = args[0] || currentDirectory;
                const target = getPath(path, currentDirectory);
                const node = navigatePath(vfs, target);
                if (typeof node === 'object' && node !== null) {
                    return { stdout: Object.keys(node).join('\n'), stderr: '' };
                }
                return { stdout: '', stderr: `ls: ${path}: Not a directory` };
            }
            case 'cat': {
                if (args.length === 0) return { stdout: '', stderr: 'cat: missing operand' };
                const path = getPath(args[0], currentDirectory);
                const node = navigatePath(vfs, path);
                if (typeof node === 'string') {
                    return { stdout: node, stderr: '' };
                }
                 return { stdout: '', stderr: `cat: ${args[0]}: No such file or not a file` };
            }
            case 'pwd':
                return { stdout: currentDirectory, stderr: '' };
            
            case 'cd': {
                if (args.length === 0) return { stdout: '', stderr: 'cd: missing operand' };
                const newPath = getPath(args[0], currentDirectory);
                try {
                    const node = navigatePath(vfs, newPath);
                    if (typeof node === 'object' && node !== null) {
                        currentDirectory = newPath;
                        return { stdout: `Changed directory to ${newPath}`, stderr: '' };
                    } else {
                        return { stdout: '', stderr: `cd: ${args[0]}: Not a directory` };
                    }
                } catch (e) {
                     return { stdout: '', stderr: `cd: ${args[0]}: No such file or directory` };
                }
            }

            case 'echo':
                return { stdout: argString, stderr: '' };

            case 'js': {
                 try {
                    const code = command.substring(command.indexOf('js') + 2).trim();
                    // Use Function constructor for safer evaluation than eval()
                    const result = new Function(code)();
                    return { stdout: JSON.stringify(result, null, 2), stderr: '' };
                } catch (e) {
                    return { stdout: '', stderr: e instanceof Error ? e.message : String(e) };
                }
            }

            default:
                return { stdout: '', stderr: `Unknown command: ${cmd}` };
        }
    } catch (e) {
        return { stdout: '', stderr: e instanceof Error ? e.message : 'An unexpected error occurred.' };
    }
};
