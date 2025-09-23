import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon } from './Icons.tsx';
import { CustomComponent } from '../types/index.ts';

declare const Babel: any;

interface EditComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    componentToEdit: CustomComponent;
    onUpdateComponent: (component: CustomComponent) => void;
}

export const EditComponentModal: React.FC<EditComponentModalProps> = ({ isOpen, onClose, componentToEdit, onUpdateComponent }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { playSound } = useAppContext();

    useEffect(() => {
        if (isOpen && componentToEdit) {
            setName(componentToEdit.name);
            setCategory(componentToEdit.category);
            setCode(componentToEdit.code);
            setError(null);
        }
    }, [isOpen, componentToEdit]);

    const handleSubmit = () => {
        setError(null);
        if (!name.trim() || !category.trim() || !code.trim()) {
            setError('All fields are required.');
            return;
        }

        if (name.trim() !== componentToEdit.name) {
            setError('Component name cannot be changed as it is used as a unique identifier.');
            return;
        }

        try {
            Babel.transform(code, { presets: ['react'] }).code;
            onUpdateComponent({ name: name.trim(), category: category.trim(), code });
            playSound('success');
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                setError(`JSX Syntax Error: ${e.message}`);
            } else {
                setError('An unknown error occurred during validation.');
            }
            playSound('error');
        }
    };
    
    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={onClose}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col modal-content shadow-purple-500/20" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Edit Custom Component</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><CloseIcon /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Component Name (Read-only)</label>
                            <input type="text" value={name} readOnly className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" placeholder="e.g., Cards" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">React JSX Code</label>
                        <textarea 
                            value={code} 
                            onChange={e => setCode(e.target.value)} 
                            rows={15}
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white font-mono text-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>}
                </div>

                <footer className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-black/20 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-all transform hover:scale-105 neon-glow-purple">Save Changes</button>
                </footer>
            </div>
        </div>
    );
};