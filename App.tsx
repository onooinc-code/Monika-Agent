
'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MessageList } from '@/components/MessageList';
import { ManualSuggestions } from '@/components/ManualSuggestions';
import { MessageInput } from '@/components/MessageInput';
import { SettingsModal } from '@/components/SettingsModal';
import { HistoryModal } from '@/components/HistoryModal';
import { ConversationList } from '@/components/ConversationList';
import { ConversationSettingsModal } from '@/components/ConversationSettingsModal';
import { HtmlPreviewModal } from '@/components/HtmlPreviewModal';
import { ActionResponseModal } from '@/components/ActionResponseModal';
import { CognitiveInspectorModal } from '@/components/CognitiveInspectorModal';
import { PromptInspectorModal } from '@/components/PromptInspectorModal';
import { StatusBar } from '@/components/StatusBar';
import { LiveStatusIndicator } from '@/components/LiveStatusIndicator';
import { useAppContext } from '@/contexts/StateProvider';
import { AgentStatsModal } from '@/components/AgentStatsModal';
import { TeamGeneratorModal } from '@/components/TeamGeneratorModal';
import { ApiUsageModal } from '@/components/ApiUsageModal';
import { BookmarkedMessagesPanel } from '@/components/BookmarkedMessagesPanel';
import { ContextMenu } from '@/components/ContextMenu';
import { ConversationSubHeader } from '@/components/ConversationSubHeader';
import { ContextMenuItem } from '@/types/index';
import { PlusIcon, SettingsIcon, AlignLeftIcon } from '@/components/Icons';
import { AgentSettingsModal } from '@/components/AgentSettingsModal';
import { DeveloperInfoModal } from '@/components/DeveloperInfoModal';
import { ComponentsGalleryModal } from '@/components/ComponentsGalleryModal';
import { AddComponentModal } from '@/components/AddComponentModal';
import { AddHtmlComponentModal } from '@/components/AddHtmlComponentModal';
import { EditHtmlComponentModal } from '@/components/EditHtmlComponentModal';
import { EditComponentModal } from '@/components/EditComponentModal';
import { ComponentPreviewModal } from '@/components/ComponentPreviewModal';
import { ConversionTypeModal } from '@/components/ConversionTypeModal';
import { MessageArchiveModal } from '@/components/MessageArchiveModal';
import { LiveConversationBar } from '@/components/LiveConversationBar';


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
    isAddComponentModalOpen,
    setIsAddComponentModalOpen,
    isAddHtmlComponentModalOpen,
    setIsAddHtmlComponentModalOpen,
    setCustomComponents,
    setCustomHtmlComponents,
    isEditHtmlComponentModalOpen,
    closeEditHtmlComponentModal,
    editingHtmlComponent,
    handleUpdateHtmlComponent,
    isEditComponentModalOpen,
    closeEditComponentModal,
    editingComponent,
    handleUpdateCustomComponent,
    isComponentPreviewOpen,
    closeComponentPreviewModal,
    componentToPreview,
    previewBackground,
    isConnected,
    isConnecting,
  } = useAppContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarAnimationState, setSidebarAnimationState] = useState<'idle' | 'slow' | 'fast'>('idle');

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, messagesEndRef]);

  // Effect for sidebar animation and auto-close
  useEffect(() => {
    let slowTimer: number;
    let closeTimer: number;

    if (isSidebarOpen) {
      setSidebarAnimationState('slow');
      slowTimer = window.setTimeout(() => setSidebarAnimationState('fast'), 10000);
      closeTimer = window.setTimeout(() => setIsSidebarOpen(false), 20000);
    } else {
      setSidebarAnimationState('idle');
    }

    return () => {
      clearTimeout(slowTimer);
      clearTimeout(closeTimer);
    };
  }, [isSidebarOpen]);


  // Global keyboard shortcuts & click listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isHistoryOpen) setIsHistoryOpen(false);
        if (isConversationSettingsOpen) setIsConversationSettingsOpen(false);
        if (isAddComponentModalOpen) setIsAddComponentModalOpen(false);
        if (isAddHtmlComponentModalOpen) setIsAddHtmlComponentModalOpen(false);
        if (isEditHtmlComponentModalOpen) closeEditHtmlComponentModal();
        if (isEditComponentModalOpen) closeEditComponentModal();
        if (isComponentPreviewOpen) closeComponentPreviewModal();
        closeContextMenu();
      }

      if (e.altKey) {
        e.preventDefault();
        switch (e.key) {
          case '1': setConversationMode('Dynamic'); break;
          case '2': setConversationMode('Continuous'); break;
          case '3': setConversationMode('Manual'); break;
          case 's': setIsSettingsOpen(true); break;
          case 'o': if (activeConversation) setIsConversationSettingsOpen(true); break;
          case 'c': if(activeConversation) handleShowHistory(); break;
          case 'f': document.documentElement.requestFullscreen().catch(console.error); break;
          case 'm': if (document.fullscreenElement) document.exitFullscreen().catch(console.error); break;
          case 'n': handleNewConversation(); break;
        }
      }
    };
    
    const handleClick = () => closeContextMenu();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [
      isSettingsOpen, isHistoryOpen, isConversationSettingsOpen, 
      isAddComponentModalOpen, isAddHtmlComponentModalOpen, 
      isEditHtmlComponentModalOpen, isEditComponentModalOpen, 
      isComponentPreviewOpen, setIsSettingsOpen, setIsHistoryOpen, 
      setIsConversationSettingsOpen, setIsAddComponentModalOpen, 
      setIsAddHtmlComponentModalOpen, closeEditHtmlComponentModal, 
      closeEditComponentModal, closeComponentPreviewModal, setConversationMode, 
      handleShowHistory, activeConversation, closeContextMenu, handleNewConversation
  ]);

  const globalActions = useMemo<ContextMenuItem[]>(() => [
     { label: 'New Chat', icon: <PlusIcon/>, action: handleNewConversation },
     { isSeparator: true },
     { label: `Mode: Dynamic`, action: () => setConversationMode('Dynamic') },
     { label: `Mode: Continuous`, action: () => setConversationMode('Continuous') },
     { label: `Mode: Manual`, action: () => setConversationMode('Manual') },
     { isSeparator: true },
     { label: 'Open Settings', icon: <SettingsIcon/>, action: () => setIsSettingsOpen(true) },
     { label: 'Open Archive', icon: <AlignLeftIcon/>, action: () => setIsArchiveOpen(true) },
  ], [handleNewConversation, setConversationMode, setIsSettingsOpen, setIsArchiveOpen]);

  const handleGlobalContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, globalActions);
  }, [openContextMenu, globalActions]);

  const isLiveModeActive = isConnected || isConnecting;

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-200" style={{fontFamily: "'Inter', sans-serif"}}>
        <ConversationList isOpen={isSidebarOpen} />
        <div className="flex flex-1 flex-col min-w-0">
            <Header 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                sidebarAnimationState={sidebarAnimationState}
            />
            <div className="flex flex-1 min-h-0">
                <main
                    className="flex flex-col flex-1 bg-[#0a0a0f] min-h-0"
                    onContextMenu={handleGlobalContextMenu}
                >
                    <div className="flex-shrink-0">
                      <ConversationSubHeader conversation={activeConversation} />
                    </div>
                    
                    {activeConversation ? (
                        <div className="flex-1 overflow-y-auto pt-2">
                            <MessageList />
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-400">Welcome to Monica</h2>
                                <p className="text-gray-500 mt-2">Create a new chat or select one from the sidebar to get started.</p>
                            </div>
                        </div>
                    )}

                    {activeConversation && !isLiveModeActive && (
                        <div className="flex-shrink-0">
                          {conversationMode === 'Manual' && <ManualSuggestions />}
                          <LiveStatusIndicator />
                          <MessageInput />
                        </div>
                    )}
                </main>
                <BookmarkedMessagesPanel isOpen={isBookmarksPanelOpen} />
            </div>
            <div className="flex-shrink-0">
                <StatusBar />
            </div>
        </div>
        {isLiveModeActive && <LiveConversationBar />}
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
        <DeveloperInfoModal />
        <ComponentsGalleryModal />
        <AddComponentModal
            isOpen={isAddComponentModalOpen}
            onClose={() => setIsAddComponentModalOpen(false)}
            onAddComponent={(newComp) => setCustomComponents(prev => [...prev, newComp])}
        />
        <AddHtmlComponentModal
            isOpen={isAddHtmlComponentModalOpen}
            onClose={() => setIsAddHtmlComponentModalOpen(false)}
            onAddComponent={(newComp) => setCustomHtmlComponents(prev => [...prev, newComp])}
        />
        {editingHtmlComponent && (
          <EditHtmlComponentModal
              isOpen={isEditHtmlComponentModalOpen}
              onClose={closeEditHtmlComponentModal}
              componentToEdit={editingHtmlComponent}
              onUpdateComponent={handleUpdateHtmlComponent}
          />
        )}
         {editingComponent && (
          <EditComponentModal
              isOpen={isEditComponentModalOpen}
              onClose={closeEditComponentModal}
              componentToEdit={editingComponent}
              onUpdateComponent={handleUpdateCustomComponent}
          />
        )}
        {componentToPreview && (
            <ComponentPreviewModal
                isOpen={isComponentPreviewOpen}
                onClose={closeComponentPreviewModal}
                componentToPreview={componentToPreview}
                backgroundStyle={previewBackground}
            />
        )}
        <ConversionTypeModal />
    </div>
  );
}