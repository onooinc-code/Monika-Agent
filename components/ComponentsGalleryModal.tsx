import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon, SearchIcon, CodeIcon, SparklesIcon, CopyIcon, CheckIcon, UsersIcon, CpuIcon, PlanIcon, ComponentGalleryIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';
import { GlassIconButton } from './GlassIconButton.tsx';
import { FancySwitch } from './FancySwitch.tsx';
import { Spinner } from './Spinner.tsx';
import { ToggleSwitch } from './ToggleSwitch.tsx';

// A generic button to showcase the context-menu styles
const ContextMenuButton: React.FC<{className?: string, children: React.ReactNode, onClick?: () => void}> = ({ className, children, onClick }) => <button onClick={onClick} className={`context-menu-btn ${className}`}>{children}</button>;

const componentLibrary = [
  {
    name: 'Glass Icon Button',
    category: 'Buttons',
    component: GlassIconButton,
    props: [
      { name: 'gradient', type: 'select', options: ['indigo', 'cyan', 'purple', 'dev', 'menu'], defaultValue: 'indigo' },
      { name: 'title', type: 'string', defaultValue: 'Click Me' },
      { name: 'aria-label', type: 'string', defaultValue: 'Click Me Action' },
    ],
    code: {
      jsx: `<GlassIconButton\n  gradient="indigo"\n  title="Click Me"\n  aria-label="Click Me Action"\n  onClick={() => alert('Clicked!')}\n/>`,
      css: `.header-action-card`
    }
  },
  {
    name: 'Fancy Switch',
    category: 'Inputs',
    component: FancySwitch,
    props: [
      { name: 'checked', type: 'boolean', defaultValue: true },
    ],
    code: {
      jsx: `<FancySwitch\n  checked={true}\n  onChange={(isChecked) => console.log(isChecked)}\n/>`,
      css: `.fancy-switch`
    }
  },
  {
    name: 'Context Menu Button',
    category: 'Buttons',
    component: ContextMenuButton,
    props: [
      { name: 'children', type: 'string', defaultValue: 'Primary Action' },
      { name: 'className', type: 'select', options: ['context-menu-btn-primary', 'context-menu-btn-secondary', 'context-menu-btn-destructive'], defaultValue: 'context-menu-btn-primary'}
    ],
    code: {
      jsx: `<button className="context-menu-btn context-menu-btn-primary">\n  Primary Action\n</button>`,
      css: `.context-menu-btn`
    }
  },
  {
    name: 'Toggle Switch',
    category: 'Inputs',
    component: ToggleSwitch,
    props: [
      { name: 'label', type: 'string', defaultValue: 'Enable Feature' },
      { name: 'description', type: 'string', defaultValue: 'A short description of the feature.'},
      { name: 'enabled', type: 'boolean', defaultValue: false }
    ],
    code: {
      jsx: `<ToggleSwitch\n  label="Enable Feature"\n  description="A short description."\n  enabled={false}\n  onChange={(isEnabled) => console.log(isEnabled)}\n/>`,
      css: `N/A (Tailwind only)`
    }
  },
  {
    name: 'Spinner',
    category: 'Indicators',
    component: Spinner,
    props: [],
    code: {
      jsx: `<Spinner />`,
      css: `.animate-spin`
    }
  },
];

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode}> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`gallery-tab-btn px-4 py-2 rounded-lg font-semibold text-sm ${active ? 'active' : 'bg-black/20 hover:bg-white/10 text-gray-300'}`}>
        {children}
    </button>
);

export const ComponentsGalleryModal: React.FC = () => {
    const { isComponentsGalleryOpen, setIsComponentsGalleryOpen } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComponent, setSelectedComponent] = useState(componentLibrary[0]);
    
    const [componentProps, setComponentProps] = useState<Record<string, any>>(() => 
        componentLibrary[0].props.reduce((acc, prop) => {
            acc[prop.name] = prop.defaultValue;
            return acc;
        }, {})
    );
    
    const [activeTab, setActiveTab] = useState('props');
    const [previewSize, setPreviewSize] = useState({ width: '100%', height: '100%' });
    const [isXrayMode, setIsXrayMode] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    // FIX: Define filteredLibrary using useMemo to filter components based on the search query.
    const filteredLibrary = useMemo(() => {
        if (!searchQuery.trim()) {
            return componentLibrary;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return componentLibrary.filter(comp => 
            comp.name.toLowerCase().includes(lowercasedQuery) ||
            comp.category.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);

    useEffect(() => {
        if (selectedComponent) {
            const defaultProps = selectedComponent.props.reduce((acc, prop) => {
                acc[prop.name] = prop.defaultValue;
                return acc;
            }, {});
            setComponentProps(defaultProps);
        }
    }, [selectedComponent]);

    const handlePropChange = (propName: string, value: any) => {
        setComponentProps(prev => ({ ...prev, [propName]: value }));
    };

    const handleCopyCode = () => {
      navigator.clipboard.writeText(selectedComponent.code.jsx);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    };

    if (!isComponentsGalleryOpen) return null;

    const RenderComponent = selectedComponent.component as React.ElementType;

    // A more robust way to handle dynamic props and event handlers
    const { children, ...restFromState } = componentProps;
    const finalProps: Record<string, any> = { ...restFromState };

    // Explicitly add event handlers based on the component's needs
    if (selectedComponent.name === 'FancySwitch') {
        finalProps.onChange = (value: boolean) => handlePropChange('checked', value);
    } else if (selectedComponent.name === 'ToggleSwitch') {
        finalProps.onChange = (value: boolean) => handlePropChange('enabled', value);
    }
    
    if (selectedComponent.category === 'Buttons') {
        finalProps.onClick = () => alert(`Clicked ${selectedComponent.name}!`);
    }

    return (
      <div className="fixed inset-0 z-50 p-4 gallery-modal" onClick={() => setIsComponentsGalleryOpen(false)}>
        <div className="w-full h-full glass-pane rounded-xl flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
            <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <ComponentGalleryIcon className="w-8 h-8"/>
                    <h2 className="text-2xl font-bold text-white">Components Gallery</h2>
                </div>
                <button onClick={() => setIsComponentsGalleryOpen(false)} className="p-1 rounded-full hover:bg-white/10"><CloseIcon /></button>
            </header>
            
            <div className="gallery-grid flex-1 p-4 min-h-0">
                {/* Left Sidebar: Component List */}
                <div className="glass-pane rounded-lg p-4 flex flex-col">
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                        <input type="search" placeholder="Search components..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                        {filteredLibrary.map(comp => (
                            <button key={comp.name} onClick={() => setSelectedComponent(comp)} className={`w-full text-left p-2 rounded-md font-semibold text-sm transition-colors ${selectedComponent.name === comp.name ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                {safeRender(comp.name)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center: Preview Pane */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between glass-pane p-2 rounded-lg">
                        <span className="font-semibold text-white ml-2">{safeRender(selectedComponent.name)}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPreviewSize({ width: '100%', height: '100%'})} className="px-2 py-1 text-xs rounded-md hover:bg-white/10">Fit</button>
                            <button onClick={() => setPreviewSize({ width: '768px', height: '100%'})} className="px-2 py-1 text-xs rounded-md hover:bg-white/10">Tablet</button>
                            <button onClick={() => setPreviewSize({ width: '375px', height: '100%'})} className="px-2 py-1 text-xs rounded-md hover:bg-white/10">Mobile</button>
                        </div>
                    </div>
                    <div className="gallery-preview-pane flex-1 glass-pane rounded-lg p-4">
                       <div style={{ width: previewSize.width, height: previewSize.height }} className={`mx-auto my-auto flex items-center justify-center transition-all duration-300 ${isXrayMode ? 'gallery-x-ray' : ''}`}>
                          <RenderComponent {...finalProps}>{children}</RenderComponent>
                       </div>
                    </div>
                </div>
                
                {/* Right Sidebar: Dev Tools */}
                <div className="glass-pane rounded-lg p-4 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                         <h3 className="text-xl font-bold text-white">Dev Tools</h3>
                         <button onClick={() => setIsXrayMode(!isXrayMode)} className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${isXrayMode ? 'bg-purple-500 border-purple-400 text-white' : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                            X-Ray Mode
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <TabButton active={activeTab === 'props'} onClick={() => setActiveTab('props')}>Props</TabButton>
                        <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')}>Code</TabButton>
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                        {activeTab === 'props' && (
                            <div className="space-y-4 animate-fade-in-up">
                                {selectedComponent.props.length > 0 ? selectedComponent.props.map(prop => (
                                    <div key={prop.name}>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">{prop.name}</label>
                                        {prop.type === 'string' && <input type="text" value={componentProps[prop.name] || ''} onChange={e => handlePropChange(prop.name, e.target.value)} className="gallery-prop-input" />}
                                        {prop.type === 'boolean' && <ToggleSwitch enabled={componentProps[prop.name] || false} onChange={val => handlePropChange(prop.name, val)} label="" />}
                                        {prop.type === 'select' && (
                                            <select value={componentProps[prop.name]} onChange={e => handlePropChange(prop.name, e.target.value)} className="gallery-prop-input">
                                                {prop.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        )}
                                    </div>
                                )) : <p className="text-gray-500 text-sm">No configurable props for this component.</p>}
                            </div>
                        )}
                         {activeTab === 'code' && (
                            <div className="animate-fade-in-up">
                                <h4 className="font-semibold text-indigo-400 mb-2">JSX Usage</h4>
                                <div className="relative">
                                    <pre className="bg-black/30 text-sm text-cyan-300 p-3 rounded-md max-h-80 overflow-y-auto font-mono">
                                        <code>{selectedComponent.code.jsx}</code>
                                    </pre>
                                    <button onClick={handleCopyCode} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20">
                                      {hasCopied ? <CheckIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                                    </button>
                                </div>
                                 <h4 className="font-semibold text-indigo-400 mt-4 mb-2">Key CSS Classes</h4>
                                 <p className="font-mono text-sm bg-black/30 text-yellow-300 p-2 rounded-md">{selectedComponent.code.css}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};
