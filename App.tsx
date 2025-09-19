import React, { useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { MessageList } from './components/MessageList.tsx';
import { ManualSuggestions } from './components/ManualSuggestions.tsx';
import { MessageInput } from './components/MessageInput.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { ConversationList } from './components/ConversationList.tsx';
import { ConversationSettingsModal } from './components/ConversationSettingsModal.tsx';
import { HtmlPreviewModal } from './components/HtmlPreviewModal.tsx';
import { ActionResponseModal } from './components/ActionResponseModal.tsx';
import { CognitiveInspectorModal } from './components/CognitiveInspectorModal.tsx';
import { PromptInspectorModal } from './components/PromptInspectorModal.tsx';
import { StatusBar } from './components/StatusBar.tsx';
import { LiveStatusIndicator } from './components/LiveStatusIndicator.tsx';
import { useAppContext } from './contexts/StateProvider.tsx';
import { AgentStatsModal } from './components/AgentStatsModal.tsx';
import { TeamGeneratorModal } from './components/TeamGeneratorModal.tsx';
import { ApiUsageModal } from './components/ApiUsageModal.tsx';
import { BookmarkedMessagesPanel } from './components/BookmarkedMessagesPanel.tsx';
import { MessageArchiveModal } from './components/MessageArchiveModal.tsx';
import { ContextMenu } from './components/ContextMenu.tsx';
import { ConversationSubHeader } from './components/ConversationSubHeader.tsx';
import { ContextMenuItem } from './types/index.ts';
import { PlusIcon, SettingsIcon, AlignLeftIcon } from './components/Icons.tsx';
import { AgentSettingsModal } from './components/AgentSettingsModal.tsx';
import { SidebarToggler } from './components/SidebarToggler.tsx';

export default function App() {
  const { 
    activeConversation,
    messagesEndRef, 
    conversationMode,
    isSettingsOpen,
    setIsSettingsOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    isConversationSettingsOpen,
    setIsConversationSettingsOpen,
    setConversationMode,
    handleShowHistory,
    isBookmarksPanelOpen,
    openContextMenu,
    closeContextMenu,
    handleNewConversation,
    setIsArchiveOpen,
    isSidebarOpen,
  } = useAppContext();

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, messagesEndRef]);

  // Global keyboard shortcuts & click listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modals with Escape key
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isHistoryOpen) setIsHistoryOpen(false);
        if (isConversationSettingsOpen) setIsConversationSettingsOpen(false);
        closeContextMenu();
      }

      // Alt-based shortcuts
      if (e.altKey) {
        e.preventDefault();
        switch (e.key) {
          case '1':
            setConversationMode('Dynamic');
            break;
          case '2':
            setConversationMode('Continuous');
            break;
          case '3':
            setConversationMode('Manual');
            break;
          case 's':
            setIsSettingsOpen(true);
            break;
          case 'o':
            if (activeConversation) setIsConversationSettingsOpen(true);
            break;
          case 'c':
            if(activeConversation) handleShowHistory();
            break;
          case 'f':
            document.documentElement.requestFullscreen().catch(console.error);
            break;
          case 'm':
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(console.error);
            }
            break;
          case 'n':
            handleNewConversation();
            break;
        }
      }
    };
    
    const handleClick = () => {
        closeContextMenu();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [isSettingsOpen, isHistoryOpen, isConversationSettingsOpen, setIsSettingsOpen, setIsHistoryOpen, setIsConversationSettingsOpen, setConversationMode, handleShowHistory, activeConversation, closeContextMenu, handleNewConversation]);

  const handleGlobalContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const globalActions: ContextMenuItem[] = [
       { label: 'New Chat', icon: <PlusIcon/>, action: handleNewConversation },
       { isSeparator: true },
       { label: `Mode: Dynamic`, action: () => setConversationMode('Dynamic') },
       { label: `Mode: Continuous`, action: () => setConversationMode('Continuous') },
       { label: `Mode: Manual`, action: () => setConversationMode('Manual') },
       { isSeparator: true },
       { label: 'Open Settings', icon: <SettingsIcon/>, action: () => setIsSettingsOpen(true) },
       { label: 'Open Archive', icon: <AlignLeftIcon/>, action: () => setIsArchiveOpen(true) },
    ];
    openContextMenu(e.clientX, e.clientY, globalActions);
  };


  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-200" style={{fontFamily: "'Inter', sans-serif"}}>
        <SidebarToggler />
        <ConversationList />
        <div className={`flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
             <Header />
            <div className="flex flex-1 min-h-0">
                <main
                    className="flex flex-col flex-1 bg-[#0a0a0f] min-h-0"
                    onContextMenu={handleGlobalContextMenu}
                >
                    {activeConversation ? (
                        <>
                            <ConversationSubHeader conversation={activeConversation} />
                            <div className="flex-1 overflow-y-auto">
                                <MessageList />
                                <div ref={messagesEndRef} />
                            </div>
                            {conversationMode === 'Manual' && <ManualSuggestions />}
                            <LiveStatusIndicator />
                            <MessageInput />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-400">Welcome to Monica</h2>
                                <p className="text-gray-500 mt-2">Create a new chat or select one from the sidebar to get started.</p>
                            </div>
                        </div>
                    )}
                    <StatusBar />
                </main>
                <BookmarkedMessagesPanel isOpen={isBookmarksPanelOpen} />
            </div>
        </div>
        <SettingsModal />
        <HistoryModal />
        <ConversationSettingsModal />
        <HtmlPreviewModal />
        <ActionResponseModal />
        <CognitiveInspectorModal />
        <PromptInspectorModal />
        <AgentStatsModal />
        <TeamGeneratorModal />
        <ApiUsageModal />
        <MessageArchiveModal />
        <ContextMenu />
        <AgentSettingsModal />
    </div>
  );
}