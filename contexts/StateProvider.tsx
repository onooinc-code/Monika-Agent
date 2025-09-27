
'use client';

import React, { createContext, useContext, useRef, useCallback, useMemo, useState, useEffect } from 'react';
// FIX: Corrected import path for types to point to the barrel file.
import { Agent, AgentManager, ConversationMode, Attachment, ManualSuggestion, HistoryView, Conversation, PipelineStep, UsageMetrics, Message, LongTermMemoryData, BubbleSettings, ContextMenuItem, SoundEvent, CustomComponent, HtmlComponent, ConversionType, LiveHandlerState } from '@/types/index';
import { useConversationManager } from '@/contexts/hooks/useConversationManager';
import { useChatHandler, LoadingStage } from '@/contexts/hooks/useChatHandler';
import { useHistoryHandler } from '@/contexts/hooks/useHistoryHandler';
import { useModalManager } from '@/contexts/hooks/useModalManager';
import { useUsageTracker } from '@/contexts/hooks/useUsageTracker';
import { useMemoryManager } from '@/contexts/hooks/useMemoryManager';
import { useUIPrefsManager } from '@/contexts/hooks/useUIPrefsManager';
import { useSoundManager } from '@/contexts/hooks/useSoundManager';
import { useLiveHandler } from '@/contexts/hooks/useLiveHandler';
import * as MemoryService from '@/services/analysis/memoryService';
import { ActionModalState, ContextMenuState } from '@/contexts/hooks/useModalManager';
import * as AgentConstants from '@/constants/agentConstants';
import { useLocalStorage } from './hooks/useLocalStorage';

interface AppState extends LiveHandlerState {
    agents: Agent[];
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
    handleReplaceAgents: (newAgents: Agent[]) => void;
    agentManager: AgentManager;
    setAgentManager: React.Dispatch<React.SetStateAction<AgentManager>>;
    
    conversations: Conversation[];
    activeConversationId: string | null;
    activeConversation: Conversation | null;

    conversationMode: ConversationMode;
    setConversationMode: React.Dispatch<React.SetStateAction<ConversationMode>>;
    isLoading: boolean;
    loadingStage: LoadingStage;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
    manualSuggestions: ManualSuggestion[];
    historyView: HistoryView | null;
    
    // Preferences
    sendOnEnter: boolean;
    setSendOnEnter: React.Dispatch<React.SetStateAction<boolean>>;
    isSoundEnabled: boolean;
    setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    playSound: (event: SoundEvent) => void;
    conversionType: ConversionType;
    setConversionType: React.Dispatch<React.SetStateAction<ConversionType>>;

    messagesEndRef: React.RefObject<HTMLDivElement>;
    
    handleSendMessage: (text: string, attachment?: Attachment) => Promise<void>;
    handleManualSelection: (agentId: string) => Promise<void>;
    handleShowHistory: () => Promise<void>;
    getAgent: (id: string) => Agent | undefined;

    // Conversation management functions
    handleNewConversation: () => void;
    handleDeleteConversation: (conversationId: string) => void;
    handleSelectConversation: (conversationId: string) => void;
    handleUpdateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
    handleUpdateConversationTitle: (conversationId: string, title: string) => void;
    handleGenerateTitle: (conversationId: string) => Promise<void>;
    handleExportConversations: () => void;
    handleImportConversations: (file: File) => void;
    
    // Per-conversation settings modal
    isConversationSettingsOpen: boolean;
    setIsConversationSettingsOpen: (isOpen: boolean) => void;
    
    // HTML Preview Modal
    isHtmlPreviewOpen: boolean;
    htmlPreviewContent: string;
    handleShowHtmlPreview: (html: string) => void;
    handleCloseHtmlPreview: () => void;

    // Message actions
    handleToggleMessageBookmark: (messageId: string) => void;
    handleDeleteMessage: (messageId: string) => void;
    handleToggleMessageEdit: (messageId: string) => void;
    handleUpdateMessageText: (messageId: string, newText: string) => void;
    handleAppendToMessageText: (conversationId: string, messageId: string, textChunk: string) => void;
    handleFinalizeMessage: (conversationId: string, messageId: string, finalMessageData: Partial<Message>) => void;
    
    // AI Message Actions
    actionModalState: ActionModalState;
    closeActionModal: () => void;
    handleSummarizeMessage: (messageId: string) => Promise<void>;
    handleRewritePrompt: (messageId: string) => Promise<void>;
    handleRegenerateResponse: (aiMessageId: string) => Promise<void>;
    handleChangeAlternativeResponse: (messageId: string, direction: 'next' | 'prev') => void;

    // Inspector Modal
    isInspectorOpen: boolean;
    inspectorData: PipelineStep[] | null;
    openInspectorModal: (pipeline: PipelineStep[]) => void;
    closeInspectorModal: () => void;

    // Prompt Inspector Modal
    isPromptInspectorOpen: boolean;
    promptInspectorData: Message | null;
    openPromptInspectorModal: (message: Message) => void;
    closePromptInspectorModal: () => void;

    // Usage Metrics
    usageMetrics: UsageMetrics;
    logUsage: (tokens: number, agentId?: string, requestCount?: number) => void;
    getAgentTodayStats: (agentId: string) => { tokens: number; messages: number };

    // Agent Stats Modal
    isAgentStatsOpen: boolean;
    setIsAgentStatsOpen: (isOpen: boolean) => void;

    // Team Generator Modal
    isTeamGeneratorOpen: boolean;
    setIsTeamGeneratorOpen: (isOpen: boolean) => void;

    // API Usage Modal
    isApiUsageOpen: boolean;
    setIsApiUsageOpen: (isOpen: boolean) => void;
    
    // Message Archive Modal
    isArchiveOpen: boolean;
    setIsArchiveOpen: (isOpen: boolean) => void;

    // Long-Term Memory
    longTermMemory: LongTermMemoryData;
    setLongTermMemory: React.Dispatch<React.SetStateAction<LongTermMemoryData>>;
    clearMemory: () => void;
    handleExtractAndUpdateMemory: () => Promise<void>;

    // Global API Key
    globalApiKey: string;
    setGlobalApiKey: React.Dispatch<React.SetStateAction<string>>;

    // Bubble Settings
    agentBubbleSettings: BubbleSettings;
    setAgentBubbleSettings: React.Dispatch<React.SetStateAction<BubbleSettings>>;
    userBubbleSettings: BubbleSettings;
    setUserBubbleSettings: React.Dispatch<React.SetStateAction<BubbleSettings>>;

    // Bookmarks Panel
    isBookmarksPanelOpen: boolean;
    setIsBookmarksPanelOpen: (isOpen: boolean) => void;

    // Agent Management
    handleToggleAgentEnabled: (agentId: string) => void;
    lastTurnAgentIds: Set<string>;
    handleUpdateSingleAgent: (agentId: string, updates: Partial<Agent>) => void;
    handleUpdateAgentManager: (updates: Partial<AgentManager>) => void;
    
    // Context Menu
    contextMenuState: ContextMenuState;
    openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
    closeContextMenu: () => void;

    // Agent Settings Modal
    isAgentSettingsModalOpen: boolean;
    selectedAgentForModal: Agent | AgentManager | null;
    openAgentSettingsModal: (agent: Agent | AgentManager) => void;
    closeAgentSettingsModal: () => void;

    // Developer Info Modal
    isDeveloperInfoOpen: boolean;
    setIsDeveloperInfoOpen: (isOpen: boolean) => void;
    
    // Components Gallery Modal
    isComponentsGalleryOpen: boolean;
    setIsComponentsGalleryOpen: (isOpen: boolean) => void;
    isAddComponentModalOpen: boolean;
    setIsAddComponentModalOpen: (isOpen: boolean) => void;
    isAddHtmlComponentModalOpen: boolean;
    setIsAddHtmlComponentModalOpen: (isOpen: boolean) => void;
    customComponents: CustomComponent[];
    setCustomComponents: React.Dispatch<React.SetStateAction<CustomComponent[]>>;
    customHtmlComponents: HtmlComponent[];
    setCustomHtmlComponents: React.Dispatch<React.SetStateAction<HtmlComponent[]>>;
    handleUpdateHtmlComponent: (component: HtmlComponent) => void;
    handleUpdateCustomComponent: (component: CustomComponent) => void;
    handleConvertToReactComponent: (componentId: string) => void;
    
    // Edit HTML Component Modal
    isEditHtmlComponentModalOpen: boolean;
    editingHtmlComponent: HtmlComponent | null;
    openEditHtmlComponentModal: (component: HtmlComponent) => void;
    closeEditHtmlComponentModal: () => void;
    
    // Edit React Component Modal
    isEditComponentModalOpen: boolean;
    editingComponent: CustomComponent | null;
    openEditComponentModal: (component: CustomComponent) => void;
    closeEditComponentModal: () => void;

    // Component Preview Modal
    isComponentPreviewOpen: boolean;
    componentToPreview: any | null;
    openComponentPreviewModal: (component: any, background: React.CSSProperties) => void;
    closeComponentPreviewModal: () => void;
    previewBackground: React.CSSProperties;

    // Conversion Type Modal
    isConversionTypeModalOpen: boolean;
    setIsConversionTypeModalOpen: (isOpen: boolean) => void;

    // UI Preferences
    isPermanentlyVisible: (id: string) => boolean;
    togglePermanentVisibility: (id: string) => void;

    // Header visibility
    isHeaderExpanded: boolean;
    setIsHeaderExpanded: React.Dispatch<React.SetStateAction<boolean>>;

    // UI Enhancements
    activeGlowColor: string | null;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Core state and settings managed in memory with useLocalStorage for persistence
    const [agents, setAgents] = useLocalStorage<Agent[]>('agents', AgentConstants.DEFAULT_AGENTS);
    const [agentManager, setAgentManager] = useLocalStorage<AgentManager>('agentManager', AgentConstants.DEFAULT_AGENT_MANAGER);
    const [conversationMode, setConversationMode] = useLocalStorage<ConversationMode>('conversationMode', 'Dynamic');
    const [sendOnEnter, setSendOnEnter] = useLocalStorage<boolean>('sendOnEnter', true);
    const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('isSoundEnabled', true);
    const [globalApiKey, setGlobalApiKey] = useLocalStorage<string>('globalApiKey', process.env.NEXT_PUBLIC_API_KEY || '');
    const [agentBubbleSettings, setAgentBubbleSettings] = useLocalStorage<BubbleSettings>('agentBubbleSettings', { alignment: 'left', scale: 1, textDirection: 'ltr', fontSize: 1 });
    const [userBubbleSettings, setUserBubbleSettings] = useLocalStorage<BubbleSettings>('userBubbleSettings', { alignment: 'right', scale: 1, textDirection: 'ltr', fontSize: 1 });
    const [customComponents, setCustomComponents] = useLocalStorage<CustomComponent[]>('customComponents', []);
    const [customHtmlComponents, setCustomHtmlComponents] = useLocalStorage<HtmlComponent[]>('customHtmlComponents', []);
    const [conversionType, setConversionType] = useLocalStorage<ConversionType>('conversionType', 'Multi');
    const [isHeaderExpanded, setIsHeaderExpanded] = useLocalStorage('isHeaderExpanded', true);
    
    // 2. Refs & Local State
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isExtractingMemory, setIsExtractingMemory] = useState(false);
    const [lastTurnAgentIds, setLastTurnAgentIds] = useState<Set<string>>(new Set());
    const [activeGlowColor, setActiveGlowColor] = useState<string | null>(null);

    // 3. Custom Hooks for logic domains
    const { playSound } = useSoundManager({ isSoundEnabled });
    const modalManager = useModalManager();
    const conversationManager = useConversationManager();
    const historyHandler = useHistoryHandler();
    const usageTracker = useUsageTracker();
    const memoryManager = useMemoryManager();
    const uiPrefsManager = useUIPrefsManager();
    const liveHandler = useLiveHandler(agentManager, globalApiKey, playSound);
    
    const enabledAgents = useMemo(() => agents.filter(a => a.isEnabled ?? true), [agents]);

    const getAgent = useCallback((id: string) => {
        return agents.find(a => a.id === id);
    }, [agents]);

    const chatHandler = useChatHandler({
        agents: enabledAgents,
        agentManager,
        globalApiKey,
        activeConversation: conversationManager.activeConversation,
        conversationMode,
        longTermMemory: memoryManager.longTermMemory,
        onUpdateConversation: conversationManager.handleUpdateConversation,
        onAppendToMessageText: conversationManager.handleAppendToMessageText,
        onFinalizeMessage: conversationManager.handleFinalizeMessage,
        openActionModal: modalManager.openActionModal,
        closeActionModal: modalManager.closeActionModal,
        logUsage: usageTracker.logUsage,
        setLastTurnAgentIds: setLastTurnAgentIds,
        playSound,
    });
    
    // 4. Combined loading state for UI components
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const isLoading = chatHandler.isChatLoading || historyHandler.isGeneratingHistory || isExtractingMemory || isGeneratingTitle;

    // 5. Callback functions that bridge hooks or components
    const getAgentTodayStats = useCallback((agentId: string) => {
        const getTodayDateString = (): string => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const todayStr = getTodayDateString();
        const stats = usageTracker.usageMetrics.agentUsage[agentId] || { dailyUsage: [] };
        return stats.dailyUsage.find(d => d.date === todayStr) || { tokens: 0, messages: 0 };
    }, [usageTracker.usageMetrics.agentUsage]);

    // Effect for handling the contextual background glow
    useEffect(() => {
        const colorMap: Record<string, string> = {
            'manager': '#eab308', // yellow-500
        };
        agents.forEach(agent => {
            // A simple map from Tailwind class to hex. Could be expanded.
            const colorHex = {
                'bg-blue-500': '#3b82f6',
                'bg-green-500': '#22c55e',
                'bg-purple-500': '#a855f7',
            }[agent.color];
            if (colorHex) {
                colorMap[agent.id] = colorHex;
            }
        });

        const stage = chatHandler.loadingStage;
        switch (stage.stage) {
            case 'generating':
            case 'executing_plan':
                setActiveGlowColor(stage.agentId ? colorMap[stage.agentId] : null);
                break;
            case 'deciding':
            case 'planning':
            case 'moderating':
            case 'suggesting':
                setActiveGlowColor(colorMap['manager']);
                break;
            case 'idle':
                setActiveGlowColor(null);
                break;
        }
    }, [chatHandler.loadingStage, agents]);


    const handleGenerateTitle = useCallback(async (conversationId: string) => {
        setIsGeneratingTitle(true);
        await conversationManager.handleGenerateTitle(conversationId, agentManager, globalApiKey, (id, updates) => {
            conversationManager.handleUpdateConversation(id, updates);
            setIsGeneratingTitle(false);
        });
    }, [conversationManager, agentManager, globalApiKey]);

    const handleReplaceAgents = useCallback((newAgents: Agent[]) => {
        setAgents(newAgents);
        modalManager.setIsTeamGeneratorOpen(false);
    }, [setAgents, modalManager]);

    const handleExtractAndUpdateMemory = useCallback(async () => {
        if (!conversationManager.activeConversation || isLoading) return;

        setIsExtractingMemory(true);
        try {
            const newFacts = await MemoryService.extractKeyInformation(
                conversationManager.activeConversation.messages,
                agentManager,
                memoryManager.longTermMemory,
                globalApiKey
            );
            memoryManager.setLongTermMemory(newFacts);
            playSound('success');
            alert('Memory updated successfully!');
        } catch (error) {
            playSound('error');
            const message = error instanceof Error ? error.message : 'Failed to update memory from conversation.';
            console.error('Failed to update memory', error);
            alert(message);
        } finally {
            setIsExtractingMemory(false);
        }
    }, [conversationManager.activeConversation, isLoading, agentManager, memoryManager, globalApiKey, playSound]);

    const handleToggleAgentEnabled = useCallback((agentId: string) => {
        setAgents(prev => prev.map(agent => 
            agent.id === agentId
                ? { ...agent, isEnabled: !(agent.isEnabled ?? true) }
                : agent
        ));
    }, [setAgents]);
    
    const handleUpdateSingleAgent = useCallback((agentId: string, updates: Partial<Agent>) => {
        setAgents(prev => prev.map(agent => agent.id === agentId ? { ...agent, ...updates } : agent));
    }, [setAgents]);

    const handleUpdateAgentManager = useCallback((updates: Partial<AgentManager>) => {
        setAgentManager(prev => ({ ...prev, ...updates }));
    }, [setAgentManager]);

    const handleUpdateHtmlComponent = useCallback((updatedComponent: HtmlComponent) => {
        setCustomHtmlComponents(prev => 
            prev.map(c => c.id === updatedComponent.id ? updatedComponent : c)
        );
    }, [setCustomHtmlComponents]);
    
    const handleUpdateCustomComponent = useCallback((updatedComponent: CustomComponent) => {
        setCustomComponents(prev => 
            prev.map(c => c.name === updatedComponent.name ? updatedComponent : c)
        );
    }, [setCustomComponents]);

    const handleConvertToReactComponent = useCallback((componentId: string) => {
        const componentToConvert = customHtmlComponents.find(c => c.id === componentId);
        if (!componentToConvert) {
            alert('Error: Component not found.');
            return;
        }

        const newReactComponentName = componentToConvert.name.replace(/[^a-zA-Z0-9]/g, '');
        
        if(customComponents.some(c => c.name === newReactComponentName)) {
            alert(`Error: A React component named "${newReactComponentName}" already exists. Please rename the HTML component first.`);
            return;
        }
        
        const componentCode = `
const ${newReactComponentName} = () => {
  return (
    <div>
      <style>{\`
        ${componentToConvert.css.replace(/`/g, '\\`')}
      \`}</style>
      <div dangerouslySetInnerHTML={{ __html: \`
        ${componentToConvert.html.replace(/`/g, '\\`')}
      \` }} />
    </div>
  );
}

export default ${newReactComponentName};
`;

        const newReactComponent: CustomComponent = {
            name: newReactComponentName,
            category: componentToConvert.category,
            code: componentCode,
        };

        setCustomComponents(prev => [...prev, newReactComponent]);
        setCustomHtmlComponents(prev => prev.filter(c => c.id !== componentId));
        playSound('success');
    }, [customHtmlComponents, customComponents, setCustomComponents, setCustomHtmlComponents, playSound]);

    const createSoundifiedSetter = useCallback((setter: (isOpen: boolean) => void) => (isOpen: boolean) => {
        playSound(isOpen ? 'open' : 'close');
        setter(isOpen);
    }, [playSound]);
    
    const setIsSettingsOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsSettingsOpen), [createSoundifiedSetter, modalManager.setIsSettingsOpen]);
    const setIsHistoryOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsHistoryOpen), [createSoundifiedSetter, modalManager.setIsHistoryOpen]);
    const setIsConversationSettingsOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsConversationSettingsOpen), [createSoundifiedSetter, modalManager.setIsConversationSettingsOpen]);
    const setIsAgentStatsOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsAgentStatsOpen), [createSoundifiedSetter, modalManager.setIsAgentStatsOpen]);
    const setIsTeamGeneratorOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsTeamGeneratorOpen), [createSoundifiedSetter, modalManager.setIsTeamGeneratorOpen]);
    const setIsApiUsageOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsApiUsageOpen), [createSoundifiedSetter, modalManager.setIsApiUsageOpen]);
    const setIsArchiveOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsArchiveOpen), [createSoundifiedSetter, modalManager.setIsArchiveOpen]);
    const setIsBookmarksPanelOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsBookmarksPanelOpen), [createSoundifiedSetter, modalManager.setIsBookmarksPanelOpen]);
    const setIsDeveloperInfoOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsDeveloperInfoOpen), [createSoundifiedSetter, modalManager.setIsDeveloperInfoOpen]);
    const setIsComponentsGalleryOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsComponentsGalleryOpen), [createSoundifiedSetter, modalManager.setIsComponentsGalleryOpen]);
    const setIsAddComponentModalOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsAddComponentModalOpen), [createSoundifiedSetter, modalManager.setIsAddComponentModalOpen]);
    const setIsAddHtmlComponentModalOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsAddHtmlComponentModalOpen), [createSoundifiedSetter, modalManager.setIsAddHtmlComponentModalOpen]);
    const setIsConversionTypeModalOpen = useMemo(() => createSoundifiedSetter(modalManager.setIsConversionTypeModalOpen), [createSoundifiedSetter, modalManager.setIsConversionTypeModalOpen]);
    
    const openEditHtmlComponentModal = useCallback((component: HtmlComponent) => {
        playSound('open');
        modalManager.openEditHtmlComponentModal(component);
    }, [playSound, modalManager.openEditHtmlComponentModal]);
    const closeEditHtmlComponentModal = useCallback(() => {
        playSound('close');
        modalManager.closeEditHtmlComponentModal();
    }, [playSound, modalManager.closeEditHtmlComponentModal]);

    const openEditComponentModal = useCallback((component: CustomComponent) => {
        playSound('open');
        modalManager.openEditComponentModal(component);
    }, [playSound, modalManager.openEditComponentModal]);
    const closeEditComponentModal = useCallback(() => {
        playSound('close');
        modalManager.closeEditComponentModal();
    }, [playSound, modalManager.closeEditComponentModal]);
    
    const openComponentPreviewModal = useCallback((component: any, background: React.CSSProperties) => {
        playSound('open');
        modalManager.openComponentPreviewModal(component, background);
    }, [playSound, modalManager.openComponentPreviewModal]);
    const closeComponentPreviewModal = useCallback(() => {
        playSound('close');
        modalManager.closeComponentPreviewModal();
    }, [playSound, modalManager.closeComponentPreviewModal]);

    const openAgentSettingsModal = useCallback((agent: Agent | AgentManager) => {
        playSound('open');
        modalManager.openAgentSettingsModal(agent);
    }, [playSound, modalManager.openAgentSettingsModal]);
    const closeAgentSettingsModal = useCallback(() => {
        playSound('close');
        modalManager.closeAgentSettingsModal();
    }, [playSound, modalManager.closeAgentSettingsModal]);

    const handleShowHistory = useCallback(async () => {
        if (conversationManager.activeConversation) {
            setIsHistoryOpen(true);
            await historyHandler.handleShowHistory(conversationManager.activeConversation, agentManager, globalApiKey);
        }
    }, [conversationManager.activeConversation, agentManager, globalApiKey, historyHandler, setIsHistoryOpen]);

    // Wrapped functions for header control
    const handleSendMessage = useCallback(async (text: string, attachment?: Attachment) => {
        if (isHeaderExpanded) {
            setIsHeaderExpanded(false);
        }
        await chatHandler.handleSendMessage(text, attachment);
    }, [chatHandler, isHeaderExpanded, setIsHeaderExpanded]);

    const handleSelectConversation = useCallback((conversationId: string) => {
        conversationManager.handleSelectConversation(conversationId);
        setIsHeaderExpanded(true);
    }, [conversationManager.handleSelectConversation, setIsHeaderExpanded]);

    const handleNewConversation = useCallback(() => {
        conversationManager.handleNewConversation();
        setIsHeaderExpanded(true);
    }, [conversationManager.handleNewConversation, setIsHeaderExpanded]);
    
    const value: AppState = {
        // Core state
        agents,
        setAgents,
        handleReplaceAgents,
        agentManager,
        setAgentManager,
        conversationMode,
        setConversationMode,
        messagesEndRef,
        getAgent,
        globalApiKey,
        setGlobalApiKey,
        
        // Preferences
        sendOnEnter,
        setSendOnEnter,
        isSoundEnabled,
        setIsSoundEnabled,
        playSound,
        conversionType,
        setConversionType,
        
        // From useConversationManager, with some overridden by wrappers
        conversations: conversationManager.conversations.map(c => ({...c, isGeneratingTitle: c.id === conversationManager.activeConversationId && isGeneratingTitle})),
        activeConversationId: conversationManager.activeConversationId,
        activeConversation: conversationManager.activeConversation ? { ...conversationManager.activeConversation, isGeneratingTitle } : null,
        handleNewConversation,
        handleDeleteConversation: conversationManager.handleDeleteConversation,
        handleSelectConversation,
        handleUpdateConversation: conversationManager.handleUpdateConversation,
        handleUpdateConversationTitle: conversationManager.handleUpdateConversationTitle,
        handleGenerateTitle,
        handleExportConversations: conversationManager.handleExportConversations,
        handleImportConversations: conversationManager.handleImportConversations,
        handleToggleMessageBookmark: conversationManager.handleToggleMessageBookmark,
        handleDeleteMessage: conversationManager.handleDeleteMessage,
        handleToggleMessageEdit: conversationManager.handleToggleMessageEdit,
        handleUpdateMessageText: conversationManager.handleUpdateMessageText,
        handleChangeAlternativeResponse: conversationManager.handleChangeAlternativeResponse,
        handleAppendToMessageText: conversationManager.handleAppendToMessageText,
        handleFinalizeMessage: conversationManager.handleFinalizeMessage,

        // From useChatHandler, with some overridden by wrappers
        isLoading,
        loadingStage: chatHandler.loadingStage,
        manualSuggestions: chatHandler.manualSuggestions,
        handleSendMessage,
        handleManualSelection: chatHandler.handleManualSelection,
        handleSummarizeMessage: chatHandler.handleSummarizeMessage,
        handleRewritePrompt: chatHandler.handleRewritePrompt,
        handleRegenerateResponse: chatHandler.handleRegenerateResponse,
        
        // From useHistoryHandler
        historyView: historyHandler.historyView,
        handleShowHistory,
        
        // From useModalManager & wrappers
        isSettingsOpen: modalManager.isSettingsOpen,
        setIsSettingsOpen,
        isHistoryOpen: modalManager.isHistoryOpen,
        setIsHistoryOpen,
        isConversationSettingsOpen: modalManager.isConversationSettingsOpen,
        setIsConversationSettingsOpen,
        isHtmlPreviewOpen: modalManager.isHtmlPreviewOpen,
        htmlPreviewContent: modalManager.htmlPreviewContent,
        handleShowHtmlPreview: modalManager.handleShowHtmlPreview,
        handleCloseHtmlPreview: modalManager.handleCloseHtmlPreview,
        actionModalState: modalManager.actionModalState,
        closeActionModal: modalManager.closeActionModal,
        isInspectorOpen: modalManager.isInspectorOpen,
        inspectorData: modalManager.inspectorData,
        openInspectorModal: modalManager.openInspectorModal,
        closeInspectorModal: modalManager.closeInspectorModal,
        isPromptInspectorOpen: modalManager.isPromptInspectorOpen,
        promptInspectorData: modalManager.promptInspectorData,
        openPromptInspectorModal: modalManager.openPromptInspectorModal,
        closePromptInspectorModal: modalManager.closePromptInspectorModal,
        contextMenuState: modalManager.contextMenuState,
        openContextMenu: modalManager.openContextMenu,
        closeContextMenu: modalManager.closeContextMenu,
        isAgentSettingsModalOpen: modalManager.isAgentSettingsModalOpen,
        selectedAgentForModal: modalManager.selectedAgentForModal,
        openAgentSettingsModal,
        closeAgentSettingsModal,
        isDeveloperInfoOpen: modalManager.isDeveloperInfoOpen,
        setIsDeveloperInfoOpen,
        isComponentsGalleryOpen: modalManager.isComponentsGalleryOpen,
        setIsComponentsGalleryOpen,
        isAddComponentModalOpen: modalManager.isAddComponentModalOpen,
        setIsAddComponentModalOpen,
        isAddHtmlComponentModalOpen: modalManager.isAddHtmlComponentModalOpen,
        setIsAddHtmlComponentModalOpen,
        isEditHtmlComponentModalOpen: modalManager.isEditHtmlComponentModalOpen,
        editingHtmlComponent: modalManager.editingHtmlComponent,
        openEditHtmlComponentModal,
        closeEditHtmlComponentModal,
        isEditComponentModalOpen: modalManager.isEditComponentModalOpen,
        editingComponent: modalManager.editingComponent,
        openEditComponentModal,
        closeEditComponentModal,
        isComponentPreviewOpen: modalManager.isComponentPreviewOpen,
        componentToPreview: modalManager.componentToPreview,
        previewBackground: modalManager.previewBackground,
        openComponentPreviewModal,
        closeComponentPreviewModal,
        isConversionTypeModalOpen: modalManager.isConversionTypeModalOpen,
        setIsConversionTypeModalOpen,

        // From useUsageTracker
        usageMetrics: usageTracker.usageMetrics,
        logUsage: usageTracker.logUsage,
        getAgentTodayStats,
        isAgentStatsOpen: modalManager.isAgentStatsOpen,
        setIsAgentStatsOpen,
        isTeamGeneratorOpen: modalManager.isTeamGeneratorOpen,
        setIsTeamGeneratorOpen,
        isApiUsageOpen: modalManager.isApiUsageOpen,
        setIsApiUsageOpen,
        isArchiveOpen: modalManager.isArchiveOpen,
        setIsArchiveOpen,
        isBookmarksPanelOpen: modalManager.isBookmarksPanelOpen,
        setIsBookmarksPanelOpen,

        // From useMemoryManager
        longTermMemory: memoryManager.longTermMemory,
        setLongTermMemory: memoryManager.setLongTermMemory,
        clearMemory: memoryManager.clearMemory,
        handleExtractAndUpdateMemory,
        
        // From useLiveHandler
        ...liveHandler,

        // UI Prefs & Bubble settings
        agentBubbleSettings,
        setAgentBubbleSettings,
        userBubbleSettings,
        setUserBubbleSettings,
        isPermanentlyVisible: uiPrefsManager.isPermanentlyVisible,
        togglePermanentVisibility: uiPrefsManager.togglePermanentVisibility,
        
        // Agent Management
        handleToggleAgentEnabled,
        lastTurnAgentIds,
        handleUpdateSingleAgent,
        handleUpdateAgentManager,

        // Custom Components
        customComponents,
        setCustomComponents,
        customHtmlComponents,
        setCustomHtmlComponents,
        handleUpdateHtmlComponent,
        handleUpdateCustomComponent,
        handleConvertToReactComponent,

        // Header visibility
        isHeaderExpanded,
        setIsHeaderExpanded,

        // UI Enhancements
        activeGlowColor,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
