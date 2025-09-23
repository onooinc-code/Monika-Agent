import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon, SearchIcon, ComponentGalleryIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';
import { GlassIconButton } from './GlassIconButton.tsx';
import { FancySwitch } from './FancySwitch.tsx';
import { Spinner } from './Spinner.tsx';
import { ToggleSwitch } from './ToggleSwitch.tsx';
import { Avatar } from './Avatar.tsx';
import { PlanDisplay } from './PlanDisplay.tsx';
import { TopicDivider } from './TopicDivider.tsx';

const ContextMenuButton: React.FC<{className?: string, children: React.ReactNode}> = ({ className, children }) => <button className={`context-menu-btn ${className}`}>{children}</button>;

const componentLibrary = [
  {
    name: 'Glass Icon Button',
    category: 'Buttons',
    render: () => (
      <div className="w-24 h-24"><GlassIconButton onClick={() => {}} title="Sample" aria-label="Sample" gradient="indigo" /></div>
    )
  },
  {
    name: 'Fancy Switch',
    category: 'Inputs',
    render: () => <FancySwitch checked={true} onChange={() => {}} />
  },
  {
    name: 'Context Menu Buttons',
    category: 'Buttons',
    render: () => (
      <div className="flex flex-col gap-2 w-48">
        <ContextMenuButton className="context-menu-btn-primary">Primary</ContextMenuButton>
        <ContextMenuButton className="context-menu-btn-secondary">Secondary</ContextMenuButton>
        <ContextMenuButton className="context-menu-btn-destructive">Destructive</ContextMenuButton>
      </div>
    )
  },
  {
    name: 'Toggle Switch',
    category: 'Inputs',
    render: () => <div className="w-full max-w-sm"><ToggleSwitch label="Enable Setting" enabled={true} onChange={() => {}} /></div>
  },
  {
    name: 'Spinner',
    category: 'Indicators',
    render: () => <Spinner />
  },
  {
    name: 'Avatar',
    category: 'Display',
    render: () => (
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
    render: () => (
      <div className="w-full max-w-sm"><PlanDisplay plan={[{ agentId: 'agent-1', task: 'Write an introduction.' }, { agentId: 'agent-2', task: 'Provide technical details.' }]} /></div>
    )
  },
  {
    name: 'Topic Divider',
    category: 'Display',
    render: () => (
      <div className="w-full max-w-sm"><TopicDivider text="New Topic" timestamp={new Date().toISOString()} /></div>
    )
  }
];

const allCategories = ['All', ...new Set(componentLibrary.map(c => c.category))];

export const ComponentsGalleryModal: React.FC = () => {
    const { isComponentsGalleryOpen, setIsComponentsGalleryOpen } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredLibrary = useMemo(() => {
        return componentLibrary.filter(comp => {
            const categoryMatch = activeCategory === 'All' || comp.category === activeCategory;
            const searchMatch = !searchQuery.trim() || comp.name.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }, [searchQuery, activeCategory]);
    
    if (!isComponentsGalleryOpen) return null;

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
            
            <div className="gallery-modal-grid flex-1 p-4 min-h-0">
                {/* Left Sidebar: Filters */}
                <div className="glass-pane rounded-lg p-4 flex flex-col">
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                        <input type="search" placeholder="Search components..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                        <div className="space-y-1">
                            {allCategories.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left p-2 rounded-md font-semibold text-sm transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                    {safeRender(cat)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Component Grid */}
                <div className="overflow-y-auto gallery-component-grid p-1">
                  {filteredLibrary.length > 0 ? filteredLibrary.map(comp => (
                    <div key={comp.name} className="gallery-component-card">
                      <div className="gallery-component-preview">
                        {comp.render()}
                      </div>
                      <div className="p-3 bg-black/10">
                        <h4 className="font-semibold text-white">{safeRender(comp.name)}</h4>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full flex items-center justify-center h-full text-center text-gray-500">
                        <p>No components found matching your criteria.</p>
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>
    );
};