import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import {
  Agent,
  AgentManager,
  ConversationMode,
  Attachment,
  ManualSuggestion,
  HistoryView,
  Conversation,
  PipelineStep,
  UsageMetrics,
  Message,
  LongTermMemoryData,
  BubbleSettings,
  ContextMenuItem,
  SoundEvent,
} from "../types/index.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useConversationManager } from "./hooks/useConversationManager.ts";
import { useChatHandler, LoadingStage } from "./hooks/useChatHandler.ts";
import { useHistoryHandler } from "./hooks/useHistoryHandler.ts";
import { useModalManager } from "./hooks/useModalManager.ts";
import { useUsageTracker } from "./hooks/useUsageTracker.ts";
import { useMemoryManager } from "./hooks/useMemoryManager.ts";
import { useUIPrefsManager } from "./hooks/useUIPrefsManager.ts";
import { useSoundManager } from "./hooks/useSoundManager.ts";
import { AuthProvider } from "./hooks/auth/useAuth.tsx";
import * as MemoryService from "../services/analysis/memoryService.ts";
import { ActionModalState, ContextMenuState } from "./hooks/useModalManager.ts";
import * as AgentConstants from "../constants/agentConstants.ts";

interface AppState {
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
  sendOnEnter: boolean;
  setSendOnEnter: React.Dispatch<React.SetStateAction<boolean>>;
  isSoundEnabled: boolean;
  setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  playSound: (event: SoundEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: (text: string, attachment?: Attachment) => Promise<void>;
  handleManualSelection: (agentId: string) => Promise<void>;
  handleShowHistory: () => Promise<void>;
  getAgent: (id: string) => Agent | undefined;
  handleNewConversation: () => void;
  handleDeleteConversation: (conversationId: string) => void;
  handleSelectConversation: (conversationId: string) => void;
  handleUpdateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  handleUpdateConversationTitle: (
    conversationId: string,
    title: string
  ) => void;
  handleGenerateTitle: (conversationId: string) => Promise<void>;
  handleExportConversations: () => void;
  handleImportConversations: (file: File) => void;
  isConversationSettingsOpen: boolean;
  setIsConversationSettingsOpen: (isOpen: boolean) => void;
  isHtmlPreviewOpen: boolean;
  htmlPreviewContent: string;
  handleShowHtmlPreview: (html: string) => void;
  handleCloseHtmlPreview: () => void;
  handleToggleMessageBookmark: (messageId: string) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleToggleMessageEdit: (messageId: string) => void;
  handleUpdateMessageText: (messageId: string, newText: string) => void;
  handleAppendToMessageText: (
    conversationId: string,
    messageId: string,
    textChunk: string
  ) => void;
  handleFinalizeMessage: (
    conversationId: string,
    messageId: string,
    finalMessageData: Partial<Message>
  ) => void;
  actionModalState: ActionModalState;
  closeActionModal: () => void;
  handleSummarizeMessage: (messageId: string) => Promise<void>;
  handleRewritePrompt: (messageId: string) => Promise<void>;
  handleRegenerateResponse: (aiMessageId: string) => Promise<void>;
  handleChangeAlternativeResponse: (
    messageId: string,
    direction: "next" | "prev"
  ) => void;
  isInspectorOpen: boolean;
  inspectorData: PipelineStep[] | null;
  openInspectorModal: (pipeline: PipelineStep[]) => void;
  closeInspectorModal: () => void;
  isPromptInspectorOpen: boolean;
  promptInspectorData: Message | null;
  openPromptInspectorModal: (message: Message) => void;
  closePromptInspectorModal: () => void;
  usageMetrics: UsageMetrics;
  logUsage: (tokens: number, agentId?: string, requestCount?: number) => void;
  isAgentStatsOpen: boolean;
  setIsAgentStatsOpen: (isOpen: boolean) => void;
  isTeamGeneratorOpen: boolean;
  setIsTeamGeneratorOpen: (isOpen: boolean) => void;
  isApiUsageOpen: boolean;
  setIsApiUsageOpen: (isOpen: boolean) => void;
  isArchiveOpen: boolean;
  setIsArchiveOpen: (isOpen: boolean) => void;
  longTermMemory: LongTermMemoryData;
  setLongTermMemory: React.Dispatch<React.SetStateAction<LongTermMemoryData>>;
  clearMemory: () => void;
  handleExtractAndUpdateMemory: () => Promise<void>;
  globalApiKey: string;
  setGlobalApiKey: React.Dispatch<React.SetStateAction<string>>;
  agentBubbleSettings: BubbleSettings;
  setAgentBubbleSettings: React.Dispatch<React.SetStateAction<BubbleSettings>>;
  userBubbleSettings: BubbleSettings;
  setUserBubbleSettings: React.Dispatch<React.SetStateAction<BubbleSettings>>;
  isBookmarksPanelOpen: boolean;
  setIsBookmarksPanelOpen: (isOpen: boolean) => void;
  handleToggleAgentEnabled: (agentId: string) => void;
  lastTurnAgentIds: Set<string>;
  handleUpdateSingleAgent: (agentId: string, updates: Partial<Agent>) => void;
  handleUpdateAgentManager: (updates: Partial<AgentManager>) => void;
  contextMenuState: ContextMenuState;
  openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
  isAgentSettingsModalOpen: boolean;
  selectedAgentForModal: Agent | AgentManager | null;
  openAgentSettingsModal: (agent: Agent | AgentManager) => void;
  closeAgentSettingsModal: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isPermanentlyVisible: (id: string) => boolean;
  togglePermanentVisibility: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarPinned: boolean;
  setIsSidebarPinned: (isPinned: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [agents, setAgents] = useLocalStorage<Agent[]>(
    "agents",
    AgentConstants.DEFAULT_AGENTS
  );
  const [agentManager, setAgentManager] = useLocalStorage<AgentManager>(
    "agent-manager",
    AgentConstants.DEFAULT_AGENT_MANAGER
  );
  const [conversationMode, setConversationMode] =
    useLocalStorage<ConversationMode>("conversation-mode", "Dynamic");
  const [sendOnEnter, setSendOnEnter] = useLocalStorage<boolean>(
    "send-on-enter",
    true
  );
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>(
    "is-sound-enabled",
    true
  );
  const [globalApiKey, setGlobalApiKey] = useLocalStorage<string>(
    "global-api-key",
    ""
  );
  const [agentBubbleSettings, setAgentBubbleSettings] =
    useLocalStorage<BubbleSettings>("agent-bubble-settings", {
      alignment: "left",
      scale: 1,
      textDirection: "ltr",
      fontSize: 1,
    });
  const [userBubbleSettings, setUserBubbleSettings] =
    useLocalStorage<BubbleSettings>("user-bubble-settings", {
      alignment: "right",
      scale: 1,
      textDirection: "ltr",
      fontSize: 1,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExtractingMemory, setIsExtractingMemory] = useState(false);
  const [lastTurnAgentIds, setLastTurnAgentIds] = useState<Set<string>>(
    new Set()
  );

  const { playSound } = useSoundManager({ isSoundEnabled });
  const modalManager = useModalManager();
  const conversationManager = useConversationManager();
  const historyHandler = useHistoryHandler();
  const usageTracker = useUsageTracker();
  const memoryManager = useMemoryManager();
  const uiPrefsManager = useUIPrefsManager();

  const enabledAgents = agents.filter((a) => a.isEnabled ?? true);

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

  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const isLoading =
    chatHandler.isChatLoading ||
    historyHandler.isGeneratingHistory ||
    isExtractingMemory ||
    isGeneratingTitle;

  const getAgent = useCallback(
    (id: string) => {
      return agents.find((a) => a.id === id);
    },
    [agents]
  );

  const handleGenerateTitle = async (conversationId: string) => {
    setIsGeneratingTitle(true);
    await conversationManager.handleGenerateTitle(
      conversationId,
      agentManager,
      globalApiKey,
      (id, updates) => {
        conversationManager.handleUpdateConversation(id, updates);
        setIsGeneratingTitle(false);
      }
    );
  };

  const handleReplaceAgents = (newAgents: Agent[]) => {
    setAgents(newAgents);
    modalManager.setIsTeamGeneratorOpen(false);
  };

  const handleExtractAndUpdateMemory = async () => {
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
      playSound("success");
      alert("Memory updated successfully!");
    } catch (error) {
      playSound("error");
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update memory from conversation.";
      console.error("Failed to update memory", error);
      alert(message);
    } finally {
      setIsExtractingMemory(false);
    }
  };

  const handleToggleAgentEnabled = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, isEnabled: !(agent.isEnabled ?? true) }
          : agent
      )
    );
  };

  const handleUpdateSingleAgent = (
    agentId: string,
    updates: Partial<Agent>
  ) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      )
    );
  };

  const handleUpdateAgentManager = (updates: Partial<AgentManager>) => {
    setAgentManager((prev) => ({ ...prev, ...updates }));
  };

  const createSoundifiedSetter =
    (setter: (isOpen: boolean) => void) => (isOpen: boolean) => {
      playSound(isOpen ? "open" : "close");
      setter(isOpen);
    };

  const setIsSettingsOpen = createSoundifiedSetter(
    modalManager.setIsSettingsOpen
  );
  const setIsHistoryOpen = createSoundifiedSetter(
    modalManager.setIsHistoryOpen
  );
  const setIsConversationSettingsOpen = createSoundifiedSetter(
    modalManager.setIsConversationSettingsOpen
  );
  const setIsAgentStatsOpen = createSoundifiedSetter(
    modalManager.setIsAgentStatsOpen
  );
  const setIsTeamGeneratorOpen = createSoundifiedSetter(
    modalManager.setIsTeamGeneratorOpen
  );
  const setIsApiUsageOpen = createSoundifiedSetter(
    modalManager.setIsApiUsageOpen
  );
  const setIsArchiveOpen = createSoundifiedSetter(
    modalManager.setIsArchiveOpen
  );
  const setIsBookmarksPanelOpen = createSoundifiedSetter(
    modalManager.setIsBookmarksPanelOpen
  );
  const setIsSidebarOpen = createSoundifiedSetter(
    modalManager.setIsSidebarOpen
  );
  const setIsSidebarPinned = createSoundifiedSetter(
    modalManager.setIsSidebarPinned
  );
  const setIsAuthModalOpen = createSoundifiedSetter(
    modalManager.setIsAuthModalOpen
  );

  const openAgentSettingsModal = (agent: Agent | AgentManager) => {
    playSound("open");
    modalManager.openAgentSettingsModal(agent);
  };
  const closeAgentSettingsModal = () => {
    playSound("close");
    modalManager.closeAgentSettingsModal();
  };
  const handleShowHistory = async () => {
    if (conversationManager.activeConversation) {
      setIsHistoryOpen(true);
      await historyHandler.handleShowHistory(
        conversationManager.activeConversation,
        agentManager,
        globalApiKey
      );
    }
  };

  const value: AppState = {
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
    sendOnEnter,
    setSendOnEnter,
    isSoundEnabled,
    setIsSoundEnabled,
    playSound,
    conversations: conversationManager.conversations.map((c) => ({
      ...c,
      isGeneratingTitle:
        c.id === conversationManager.activeConversationId && isGeneratingTitle,
    })),
    activeConversationId: conversationManager.activeConversationId,
    activeConversation: conversationManager.activeConversation
      ? { ...conversationManager.activeConversation, isGeneratingTitle }
      : null,
    handleNewConversation: conversationManager.handleNewConversation,
    handleDeleteConversation: conversationManager.handleDeleteConversation,
    handleSelectConversation: conversationManager.handleSelectConversation,
    handleUpdateConversation: conversationManager.handleUpdateConversation,
    handleUpdateConversationTitle:
      conversationManager.handleUpdateConversationTitle,
    handleGenerateTitle,
    handleExportConversations: conversationManager.handleExportConversations,
    handleImportConversations: conversationManager.handleImportConversations,
    isLoading,
    loadingStage: chatHandler.loadingStage,
    manualSuggestions: chatHandler.manualSuggestions,
    handleSendMessage: chatHandler.handleSendMessage,
    handleManualSelection: chatHandler.handleManualSelection,
    historyView: historyHandler.historyView,
    handleShowHistory,
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
    isSidebarOpen: modalManager.isSidebarOpen,
    setIsSidebarOpen,
    isSidebarPinned: modalManager.isSidebarPinned,
    setIsSidebarPinned,
    isAuthModalOpen: modalManager.isAuthModalOpen,
    setIsAuthModalOpen,
    handleToggleMessageBookmark:
      conversationManager.handleToggleMessageBookmark,
    handleDeleteMessage: conversationManager.handleDeleteMessage,
    handleToggleMessageEdit: conversationManager.handleToggleMessageEdit,
    handleUpdateMessageText: conversationManager.handleUpdateMessageText,
    handleAppendToMessageText: conversationManager.handleAppendToMessageText,
    handleFinalizeMessage: conversationManager.handleFinalizeMessage,
    actionModalState: modalManager.actionModalState,
    closeActionModal: modalManager.closeActionModal,
    handleSummarizeMessage: chatHandler.handleSummarizeMessage,
    handleRewritePrompt: chatHandler.handleRewritePrompt,
    handleRegenerateResponse: chatHandler.handleRegenerateResponse,
    handleChangeAlternativeResponse:
      conversationManager.handleChangeAlternativeResponse,
    isInspectorOpen: modalManager.isInspectorOpen,
    inspectorData: modalManager.inspectorData,
    openInspectorModal: modalManager.openInspectorModal,
    closeInspectorModal: modalManager.closeInspectorModal,
    isPromptInspectorOpen: modalManager.isPromptInspectorOpen,
    promptInspectorData: modalManager.promptInspectorData,
    openPromptInspectorModal: modalManager.openPromptInspectorModal,
    closePromptInspectorModal: modalManager.closePromptInspectorModal,
    usageMetrics: usageTracker.usageMetrics,
    logUsage: usageTracker.logUsage,
    longTermMemory: memoryManager.longTermMemory,
    setLongTermMemory: memoryManager.setLongTermMemory,
    clearMemory: memoryManager.clearMemory,
    handleExtractAndUpdateMemory,
    agentBubbleSettings,
    setAgentBubbleSettings,
    userBubbleSettings,
    setUserBubbleSettings,
    handleToggleAgentEnabled,
    lastTurnAgentIds,
    handleUpdateSingleAgent,
    handleUpdateAgentManager,
    contextMenuState: modalManager.contextMenuState,
    openContextMenu: modalManager.openContextMenu,
    closeContextMenu: modalManager.closeContextMenu,
    isAgentSettingsModalOpen: modalManager.isAgentSettingsModalOpen,
    selectedAgentForModal: modalManager.selectedAgentForModal,
    openAgentSettingsModal,
    closeAgentSettingsModal,
    isPermanentlyVisible: uiPrefsManager.isPermanentlyVisible,
    togglePermanentVisibility: uiPrefsManager.togglePermanentVisibility,
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </AuthProvider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
