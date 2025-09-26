
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { CloseIcon, SearchIcon, ComponentGalleryIcon, PlusIcon, EditIcon, MaximizeIcon, ConvertToReactIcon } from '@/components/Icons';
import { safeRender } from '@/services/utils/safeRender';
// FIX: Corrected import path for types to point to the barrel file.
import { Conversation, CustomComponent, HtmlComponent } from '@/types/index';
import { DEFAULT_AGENTS } from '@/constants/agentConstants';
import { HtmlComponentPreview } from './HtmlComponentPreview';

// Import Components for Gallery
import { Avatar } from './Avatar';
import { ConversationItem } from './ConversationItem';
import { FancySwitch } from './FancySwitch';
import { GlassIconButton } from './GlassIconButton';
import { PlanDisplay } from './PlanDisplay';
import { SecureInput } from './SecureInput';
import { Spinner } from './Spinner';
import { TitleBar } from './TitleBar';
import { ToggleSwitch } from './ToggleSwitch';
import { TopicDivider } from './TopicDivider';

declare const Babel: any;


// --- Gallery Item Components ---
// We define components that use hooks at the top level to avoid breaking the rules of hooks.

const FancySwitchGalleryItem: React.FC = () => {
    const [checked, setChecked] = useState(false);
    return <FancySwitch checked={checked} onChange={setChecked} />;
};

const ToggleSwitchGalleryItem: React.FC = () => {
    const [enabled, setEnabled] = useState(true);
    return <div className="w-full max-w-sm"><ToggleSwitch label="Enable Feature" enabled={enabled} onChange={setEnabled} /></div>;
};

const SecureInputGalleryItem: React.FC = () => {
    const [val, setVal] = useState('s3cr3t-key-for-gallery');
    return <div className="w-full max-w-sm"><SecureInput id="gallery-secure-input" value={val} onChange={(e) => setVal(e.target.value)} /></div>;
};


const ContextMenuButton: React.FC<{className?: string, children: React.ReactNode}> = ({ className, children }) => <button className={`context-menu-btn ${className}`}>{children}</button>;

const componentLibrary = [
  {
    name: 'Glass Icon Button',
    category: 'Buttons',
    Component: () => <div className="w-24 h-24"><GlassIconButton onClick={() => {}} title="Sample" aria-label="Sample" gradient="indigo" /></div>
  },
  {
    name: 'Context Menu Buttons',
    category: 'Buttons',
    Component: () => (
      <div className="flex flex-col gap-2 w-48">
        <ContextMenuButton className="context-menu-btn-primary">Primary Action</ContextMenuButton>
        <ContextMenuButton className="context-menu-btn-secondary">Secondary Action</ContextMenuButton>
        <ContextMenuButton className="context-menu-btn-destructive">Destructive Action</ContextMenuButton>
      </div>
    )
  },
  {
    name: 'Manual Suggestion Buttons',
    category: 'Buttons',
    Component: () => {
      const agents = DEFAULT_AGENTS.slice(0, 3);
      return (
          <div className="flex justify-center flex-wrap gap-2">
              {agents.map(agent => (
                  <button key={agent.id} className={`px-4 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105 ${agent.color} ${agent.textColor}`}>
                      {safeRender(agent.name)}
                  </button>
              ))}
          </div>
      )
    }
  },
  {
    name: 'Fancy Switch',
    category: 'Inputs',
    Component: FancySwitchGalleryItem
  },
  {
    name: 'Toggle Switch',
    category: 'Inputs',
    Component: ToggleSwitchGalleryItem
  },
  {
    name: 'Secure Input',
    category: 'Inputs',
    Component: SecureInputGalleryItem
  },
  {
    name: 'Spinner',
    category: 'Indicators',
    Component: () => <Spinner />
  },
  {
    name: 'Live Status Indicator',
    category: 'Indicators',
    Component: () => (
      <div className="flex flex-col gap-2 text-sm text-gray-400 w-full max-w-sm items-start">
          <div className="flex items-center gap-2"><Spinner /><span>Manager is deciding...</span></div>
          <div className="flex items-center gap-2"><Spinner /><span>Creative Writer is generating...</span></div>
           <div className="flex items-center gap-2"><Spinner /><span>Manager is formulating a plan...</span></div>
      </div>
    )
  },
  {
    name: 'Avatar',
    category: 'Display',
    Component: () => (
      <div className="flex gap-2">
        <Avatar name="You" color="bg-indigo-500" />
        <Avatar name="Creative Writer" color="bg-blue-500" />
        <Avatar name="System" color="bg-yellow-500" />
      </div>
    )
  },
  {
    name: 'Plan Display',
    category: 'Display',
    Component: () => (
      <div className="w-full max-w-sm"><PlanDisplay plan={[{ agentId: 'agent-1', task: 'Write an introduction.' }, { agentId: 'agent-2', task: 'Provide technical details.' }]} /></div>
    )
  },
  {
    name: 'Topic Divider',
    category: 'Display',
    Component: () => (
      <div className="w-full max-w-sm"><TopicDivider text="New Topic" timestamp={new Date().toISOString()} /></div>
    )
  },
  {
    name: 'Conversation Item',
    category: 'Display',
    Component: () => {
      const mockConversation: Conversation = { id: 'conv-1', title: 'A Sample Chat', messages: [] };
      return (
        <div className="w-64 space-y-1">
          <ConversationItem conversation={mockConversation} isActive={true} onSelect={() => {}} onDelete={() => {}} />
          <ConversationItem conversation={{...mockConversation, title: "Another chat item"}} isActive={false} onSelect={() => {}} onDelete={() => {}} />
        </div>
      );
    }
  },
  {
    name: 'Title Bar',
    category: 'Display',
    Component: () => <div className="w-full max-w-md h-16"><TitleBar /></div>
  },
   {
    name: 'Agent & Manager Cards',
    category: 'Cards',
    Component: () => {
      const mockAgent = DEFAULT_AGENTS[0];
      return (
          <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
              <div className="flex-1 min-w-0 glass-pane rounded-lg flex flex-col">
                  <div className="flex items-center justify-between p-2 border-b-2 border-yellow-500">
                      <h3 className="font-bold text-sm text-white truncate">Agent Manager</h3>
                  </div>
                  <div className="flex-1 p-2 flex items-center justify-around text-center">
                      <div className="flex-1 flex flex-col items-center justify-center" title="Total decisions made">
                          <p className="font-mono font-bold text-sm text-white">1.2k</p>
                          <p className="text-xs text-white">Decisions</p>
                      </div>
                  </div>
              </div>
              <div className="flex-1 min-w-0 glass-pane rounded-lg flex flex-col">
                  <div className={`flex items-center justify-between p-2 border-b-2 border-blue-500`}>
                      <h3 className="font-bold text-sm text-white truncate">{safeRender(mockAgent.name)}</h3>
                  </div>
                   <div className="flex-1 p-2 flex items-center justify-around text-center">
                      <div className="flex-1 flex flex-col items-center justify-center" title="Tokens used today (estimate)">
                          <p className="font-mono font-bold text-sm text-white">5.6k</p>
                          <p className="text-xs text-white">Tokens</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center" title="Requests today (estimate)">
                          <p className="font-mono font-bold text-sm text-white">32</p>
                          <p className="text-xs text-white">Reqs</p>
                      </div>
                  </div>
              </div>
          </div>
      )
    }
  },
];

export const renderCustomReactComponent = (comp: CustomComponent) => {
    try {
        const transpiledCode = Babel.transform(comp.code, { presets: ['react'] }).code;
        const body = transpiledCode.replace(/export default\s+\w+;/, '');
        const DynamicComponent = new Function('React', `${body}; return ${comp.name};`)(React);
        return <DynamicComponent />;
    } catch (error) {
        console.error(`Error transpiling custom component "${comp.name}":`, error);
        return <div className="text-red-400 p-4 bg-red-900/50 rounded-md">Error: {error instanceof Error ? error.message : 'Failed to load component.'}</div>;
    }
};

const BackgroundControls: React.FC<{
    backgroundStyle: React.CSSProperties;
    setBackgroundStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
}> = ({ backgroundStyle, setBackgroundStyle }) => {
    const [showGrid, setShowGrid] = useState(true);

    const handleStyleChange = (prop: keyof React.CSSProperties, value: string) => {
        setBackgroundStyle(prev => ({ ...prev, [prop]: value }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Background</h3>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input 
                    type="color" 
                    value={backgroundStyle.backgroundColor || '#0a0a0f'}
                    onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-full h-10 p-1 bg-black/20 border border-white/10 rounded-md"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input 
                    type="text" 
                    placeholder="https://..."
                    value={backgroundStyle.backgroundImage?.replace(/url\(['"]?(.*?)['"]?\)/, '$1') || ''}
                    onChange={e => handleStyleChange('backgroundImage', e.target.value ? `url(${e.target.value})` : '')}
                    className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white text-sm"
                />
            </div>
             <ToggleSwitch
                label="Show Grid Pattern"
                enabled={showGrid}
                onChange={setShowGrid}
            />
            {backgroundStyle.backgroundImage && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Size</label>
                         <select value={backgroundStyle.backgroundSize || 'cover'} onChange={e => handleStyleChange('backgroundSize', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white text-sm">
                            <option>cover</option>
                            <option>contain</option>
                             <option>auto</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Repeat</label>
                         <select value={backgroundStyle.backgroundRepeat || 'no-repeat'} onChange={e => handleStyleChange('backgroundRepeat', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white text-sm">
                            <option>no-repeat</option>
                            <option>repeat</option>
                            <option>repeat-x</option>
                            <option>repeat-y</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ComponentsGalleryModal: React.FC = () => {
    const { 
      isComponentsGalleryOpen, 
      setIsComponentsGalleryOpen, 
      customComponents, 
      setIsAddComponentModalOpen,
      customHtmlComponents,
      setIsAddHtmlComponentModalOpen,
      openEditHtmlComponentModal,
      openEditComponentModal,
      openComponentPreviewModal,
      handleConvertToReactComponent,
    } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});

    const allBuiltInComponents = componentLibrary;
    const allCustomReactComponents = customComponents;
    const allCustomHtmlComponents = customHtmlComponents;

    const allCategories = useMemo(() => ['All', ...Array.from(new Set([
        ...allBuiltInComponents.map(c => c.category),
        ...allCustomReactComponents.map(c => c.category),
        ...allCustomHtmlComponents.map(c => c.category),
    ]))], [allBuiltInComponents, allCustomReactComponents, allCustomHtmlComponents]);

    const filteredComponents = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();

        const filter = (comps: any[], type: 'react' | 'html' | 'builtin') => comps.filter(comp => {
            const categoryMatch = activeCategory === 'All' || comp.category === activeCategory;
            const searchMatch = !searchQuery.trim() || comp.name.toLowerCase().includes(lowercasedQuery);
            return categoryMatch && searchMatch;
        }).map(comp => ({ ...comp, type }));

        return [
            ...filter(allBuiltInComponents, 'builtin'),
            ...filter(allCustomReactComponents, 'react'),
            ...filter(allCustomHtmlComponents, 'html'),
        ];
    }, [searchQuery, activeCategory, allBuiltInComponents, allCustomReactComponents, allCustomHtmlComponents]);
    
    if (!isComponentsGalleryOpen) return null;

    return (
      <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay ${isComponentsGalleryOpen ? 'open' : ''}`} onClick={() => setIsComponentsGalleryOpen(false)}>
        <div className="w-full h-full max-w-7xl glass-pane rounded-xl flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
            <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <ComponentGalleryIcon className="w-8 h-8"/>
                    <h2 className="text-2xl font-bold text-white">Components Gallery</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsAddComponentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all transform hover:scale-105 neon-glow-purple">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add React Component</span>
                    </button>
                     <button onClick={() => setIsAddHtmlComponentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all transform hover:scale-105 neon-glow-cyan">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add HTML Component</span>
                    </button>
                    <button onClick={() => setIsComponentsGalleryOpen(false)} className="p-1 rounded-full hover:bg-white/10"><CloseIcon /></button>
                </div>
            </header>
            
            <div className="gallery-modal-grid flex-1 p-4 min-h-0">
                {/* Left Sidebar: Filters */}
                <aside className="glass-pane rounded-lg p-4 flex flex-col">
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                        <input type="search" placeholder="Search components..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                        <BackgroundControls backgroundStyle={backgroundStyle} setBackgroundStyle={setBackgroundStyle} />
                        <hr className="my-4 border-white/10"/>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                        <nav className="space-y-1">
                            {allCategories.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left p-2 rounded-md font-semibold text-sm transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                    {safeRender(cat)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content: Component Grid */}
                <main className="overflow-y-auto p-1 flex-1">
                  <div className="gallery-component-grid">
                    {filteredComponents.length > 0 ? filteredComponents.map(comp => (
                        <div key={comp.id || comp.name} className="gallery-component-card animate-fade-in-up">
                            <div className={`gallery-component-preview`} style={backgroundStyle}>
                                {comp.type === 'builtin' && <comp.Component />}
                                {comp.type === 'react' && renderCustomReactComponent(comp)}
                                {comp.type === 'html' && <HtmlComponentPreview component={comp as HtmlComponent} />}
                            </div>
                            <div className="p-3 bg-black/10 mt-auto flex justify-between items-center">
                                <h4 className="font-semibold text-white">{safeRender(comp.name)}</h4>
                                <div className="flex items-center gap-1">
                                    {(comp.type === 'html') && (
                                        <>
                                            <button onClick={() => handleConvertToReactComponent(comp.id)} className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white" title="Convert to React Component">
                                                <ConvertToReactIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEditHtmlComponentModal(comp as HtmlComponent)} className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white" title="Edit Component">
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                     {(comp.type === 'react') && (
                                        <button onClick={() => openEditComponentModal(comp as CustomComponent)} className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white" title="Edit Component">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => openComponentPreviewModal(comp, backgroundStyle)} className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white" title="Fullscreen View">
                                        <MaximizeIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                      <div className="col-span-full flex items-center justify-center h-full text-center text-gray-500">
                          <p>No components found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </main>
            </div>
        </div>
      </div>
    );
};
