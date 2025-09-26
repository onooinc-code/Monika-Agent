

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { CloseIcon } from '@/components/Icons';
// FIX: Corrected import path for types to point to the barrel file.
import { HtmlComponent } from '@/types/index';

interface EditHtmlComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    componentToEdit: HtmlComponent;
    onUpdateComponent: (component: HtmlComponent) => void;
}

export const EditHtmlComponentModal: React.FC<EditHtmlComponentModalProps> = ({ isOpen, onClose, componentToEdit, onUpdateComponent }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [html, setHtml] = useState('');
    const [css, setCss] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { playSound } = useAppContext();

    useEffect(() => {
        if (isOpen && componentToEdit) {
            setName(componentToEdit.name);
            setCategory(componentToEdit.category);
            setHtml(componentToEdit.html);
            setCss(componentToEdit.css);
            setError(null);
        }
    }, [isOpen, componentToEdit]);

    const handleSubmit = () => {
        setError(null);
        if (!name.trim() || !category.trim() || !html.trim()) {
            setError('Name, Category, and HTML fields are required.');
            return;
        }
        
        onUpdateComponent({ 
            ...componentToEdit, 
            name: name.trim(), 
            category: category.trim(), 
            html, 
            css 
        });
        playSound('success');
        onClose();
    };
    
    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={onClose}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Edit HTML/CSS Component</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><CloseIcon /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Component Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" placeholder="e.g., ProfileCard" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" placeholder="e.g., Cards" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">HTML Code</label>
                        <textarea 
                            value={html} 
                            onChange={e => setHtml(e.target.value)} 
                            rows={8}
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">CSS Code (Optional)</label>
                        <textarea 
                            value={css} 
                            onChange={e => setCss(e.target.value)} 
                            rows={8}
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>

                <footer className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-black/20 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 transition-all transform hover:scale-105 neon-glow-cyan">Save Changes</button>
                </footer>
            </div>
        </div>
    );
};