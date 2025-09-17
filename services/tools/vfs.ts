// Virtual File System (VFS)
// A simple JavaScript object to simulate a directory structure.

export const virtualFileSystem = {
    'documents': {
        'project_brief.txt': 'Project Monica: Develop an advanced, multi-agent AI assistant with dynamic conversation flow and robust tooling.',
        'meeting_notes.md': '# Meeting Notes\n\n- Discussed VFS implementation.\n- Decided on a simple, object-based approach.\n- Key commands to support: ls, cat, pwd, echo, js.'
    },
    'images': {
        'logo.svg': '<svg>...</svg>',
    },
    'src': {
        'index.ts': 'console.log("Hello, World!");',
        'utils.js': 'export const a = 1;',
    },
    'readme.txt': 'This is a virtual file system for the Monica AI assistant. The AI can explore this system using shell commands.',
};

export const getPath = (path: string, currentDirectory: string): string => {
    if (path.startsWith('/')) {
        return path;
    }
    const parts = [...currentDirectory.split('/').filter(Boolean), ...path.split('/').filter(Boolean)];
    const newParts = [];
    for (const part of parts) {
        if (part === '..') {
            newParts.pop();
        } else if (part !== '.') {
            newParts.push(part);
        }
    }
    return '/' + newParts.join('/');
};

export const navigatePath = (fs: any, path: string): any => {
    const parts = path.split('/').filter(Boolean);
    let currentNode = fs;
    for (const part of parts) {
        if (typeof currentNode === 'object' && currentNode !== null && part in currentNode) {
            currentNode = currentNode[part];
        } else {
            throw new Error(`Path not found: ${path}`);
        }
    }
    return currentNode;
};