import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon } from './Icons.tsx';
import { renderCustomReactComponent } from './ComponentsGalleryModal.tsx';
import { HtmlComponentPreview } from './HtmlComponentPreview.tsx';
import { HtmlComponent, CustomComponent } from '../types/index.ts';

interface ComponentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    componentToPreview: any;
    backgroundStyle: React.CSSProperties;
}

export const ComponentPreviewModal: React.FC<ComponentPreviewModalProps> = ({ isOpen, onClose, componentToPreview, backgroundStyle }) => {
    
    if (!isOpen) return null;

    const renderPreview = () => {
        if (!componentToPreview) return null;

        switch (componentToPreview.type) {
            case 'builtin':
                return <componentToPreview.Component />;
            case 'react':
                return renderCustomReactComponent(componentToPreview as CustomComponent);
            case 'html':
                return <HtmlComponentPreview component={componentToPreview as HtmlComponent} />;
            default:
                return <div className="text-red-400">Unknown component type</div>;
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={onClose}>
            <div className="glass-pane rounded-xl shadow-2xl w-full h-full flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Preview: {componentToPreview.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <main 
                    className="flex-1 p-8 flex items-center justify-center overflow-auto"
                    style={backgroundStyle}
                >
                   {renderPreview()}
                </main>
            </div>
        </div>
    );
};