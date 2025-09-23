import React, { useState } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon } from './Icons.tsx';
import { HtmlComponent } from '../types/index.ts';

const EXAMPLE_HTML = `<div class="card-container">
  <div class="card-content">
    <h3>Card Title</h3>
    <p>Use Tailwind CSS classes directly in your HTML. Custom CSS below will be scoped to this component.</p>
  </div>
</div>`;

const EXAMPLE_CSS = `/* CSS rules are automatically scoped */
.card-container {
  background: linear-gradient(145deg, #1f2937, #374151);
  border-radius: 0.75rem;
  padding: 1.5rem;
  color: white;
  width: 300px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}
.card-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #93c5fd; /* blue-300 */
}
.card-content p {
  font-size: 0.875rem;
  color: #d1d5db; /* gray-300 */
}`;

interface AddHtmlComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddComponent: (component: HtmlComponent) => void;
}

export const AddHtmlComponentModal: React.FC<AddHtmlComponentModalProps> = ({ isOpen, onClose, onAddComponent }) => {
    const [name, setName] = useState('My Card');
    const [category, setCategory] = useState('Cards');
    const [html, setHtml] = useState(EXAMPLE_HTML);
    const [css, setCss] = useState(EXAMPLE_CSS);
    const [error, setError] = useState<string | null>(null);
    const { playSound } = useAppContext();

    const handleSubmit = () => {
        setError(null);
        if (!name.trim() || !category.trim() || !html.trim()) {
            setError('Name, Category, and HTML fields are required.');
            return;
        }
        
        onAddComponent({ id: `html-${Date.now()}`, name: name.trim(), category: category.trim(), html, css });
        playSound('success');
        onClose();
    };
    
    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={onClose}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Add HTML/CSS Component</h2>
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
                        <p className="text-xs text-white mb-2">You can use Tailwind CSS classes here.</p>
                        <textarea 
                            value={html} 
                            onChange={e => setHtml(e.target.value)} 
                            rows={8}
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">CSS Code (Optional)</label>
                         <p className="text-xs text-white mb-2">These styles will be automatically scoped to this component only.</p>
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
                    <button onClick={handleSubmit} className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 transition-all transform hover:scale-105 neon-glow-cyan">Add Component</button>
                </footer>
            </div>
        </div>
    );
};
