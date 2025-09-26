
import React, { useState, useCallback } from 'react';
// FIX: Corrected import path for types to point to the barrel file.
import { PipelineStep, Message, ContextMenuItem, Agent, AgentManager, HtmlComponent, CustomComponent } from '@/types/index';

export interface ActionModalButton {
    label: string;
    onClick: () => void;
    isSecondary?: boolean;
}

export interface ActionModalState {
    isOpen: boolean;
    title: string;
    content: string;
    actions: ActionModalButton[] | null;
}

export interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    menuItems: ContextMenuItem[];
}

export const useModalManager = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isConversationSettingsOpen, setIsConversationSettingsOpen] = useState(false);
    const [isHtmlPreviewOpen, setIsHtmlPreviewOpen] = useState(false);
    const [htmlPreviewContent, setHtmlPreviewContent] = useState('');
    const [actionModalState, setActionModalState] = useState<ActionModalState>({
        isOpen: false,
        title: '',
        content: '',
        actions: null
    });
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const [inspectorData, setInspectorData] = useState<PipelineStep[] | null>(null);
    const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState(false);
    const [promptInspectorData, setPromptInspectorData] = useState<Message | null>(null);
    const [isAgentStatsOpen, setIsAgentStatsOpen] = useState(false);
    const [isTeamGeneratorOpen, setIsTeamGeneratorOpen] = useState(false);
    const [isApiUsageOpen, setIsApiUsageOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);
    const [isAgentSettingsModalOpen, setIsAgentSettingsModalOpen] = useState(false);
    const [selectedAgentForModal, setSelectedAgentForModal] = useState<Agent | AgentManager | null>(null);
    const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);
    const [isComponentsGalleryOpen, setIsComponentsGalleryOpen] = useState(false);
    const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
    const [isAddHtmlComponentModalOpen, setIsAddHtmlComponentModalOpen] = useState(false);
    const [isEditHtmlComponentModalOpen, setIsEditHtmlComponentModalOpen] = useState(false);
    const [editingHtmlComponent, setEditingHtmlComponent] = useState<HtmlComponent | null>(null);
    const [isEditComponentModalOpen, setIsEditComponentModalOpen] = useState(false);
    const [editingComponent, setEditingComponent] = useState<CustomComponent | null>(null);
    const [isComponentPreviewOpen, setIsComponentPreviewOpen] = useState(false);
    const [componentToPreview, setComponentToPreview] = useState<any | null>(null);
    const [previewBackground, setPreviewBackground] = useState<React.CSSProperties>({});
    const [isConversionTypeModalOpen, setIsConversionTypeModalOpen] = useState(false);


    const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
        isOpen: false,
        x: 0,
        y: 0,
        menuItems: []
    });

    const handleShowHtmlPreview = useCallback((html: string) => {
        setHtmlPreviewContent(html);
        setIsHtmlPreviewOpen(true);
    }, []);

    const handleCloseHtmlPreview = useCallback(() => {
        setIsHtmlPreviewOpen(false);
        setHtmlPreviewContent('');
    }, []);

    const openActionModal = useCallback((config: { title: string; content: string; actions?: ActionModalButton[] }) => {
        setActionModalState({
            isOpen: true,
            title: config.title,
            content: config.content,
            actions: config.actions || null,
        });
    }, []);

    const closeActionModal = useCallback(() => {
        setActionModalState({ isOpen: false, title: '', content: '', actions: null });
    }, []);

    const openInspectorModal = useCallback((pipeline: PipelineStep[]) => {
        setInspectorData(pipeline);
        setIsInspectorOpen(true);
    }, []);

    const closeInspectorModal = useCallback(() => {
        setIsInspectorOpen(false);
        setInspectorData(null);
    }, []);

    const openPromptInspectorModal = useCallback((message: Message) => {
        setPromptInspectorData(message);
        setIsPromptInspectorOpen(true);
    }, []);

    const closePromptInspectorModal = useCallback(() => {
        setIsPromptInspectorOpen(false);
        setPromptInspectorData(null);
    }, []);

    const openAgentSettingsModal = useCallback((agent: Agent | AgentManager) => {
        setSelectedAgentForModal(agent);
        setIsAgentSettingsModalOpen(true);
    }, []);

    const closeAgentSettingsModal = useCallback(() => {
        setIsAgentSettingsModalOpen(false);
        setSelectedAgentForModal(null);
    }, []);
    
    const openContextMenu = useCallback((x: number, y: number, menuItems: ContextMenuItem[]) => {
        setContextMenuState({ isOpen: true, x, y, menuItems });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenuState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const openEditHtmlComponentModal = useCallback((component: HtmlComponent) => {
        setEditingHtmlComponent(component);
        setIsEditHtmlComponentModalOpen(true);
    }, []);

    const closeEditHtmlComponentModal = useCallback(() => {
        setIsEditHtmlComponentModalOpen(false);
        setEditingHtmlComponent(null);
    }, []);

    const openEditComponentModal = useCallback((component: CustomComponent) => {
        setEditingComponent(component);
        setIsEditComponentModalOpen(true);
    }, []);

    const closeEditComponentModal = useCallback(() => {
        setIsEditComponentModalOpen(false);
        setEditingComponent(null);
    }, []);

    const openComponentPreviewModal = useCallback((component: any, background: React.CSSProperties) => {
        setComponentToPreview(component);
        setPreviewBackground(background);
        setIsComponentPreviewOpen(true);
    }, []);

    const closeComponentPreviewModal = useCallback(() => {
        setIsComponentPreviewOpen(false);
        setComponentToPreview(null);
    }, []);

    return {
        isSettingsOpen, setIsSettingsOpen,
        isHistoryOpen, setIsHistoryOpen,
        isConversationSettingsOpen, setIsConversationSettingsOpen,
        isHtmlPreviewOpen, htmlPreviewContent,
        handleShowHtmlPreview, handleCloseHtmlPreview,
        actionModalState, openActionModal, closeActionModal,
        isInspectorOpen, inspectorData,
        openInspectorModal, closeInspectorModal,
        isPromptInspectorOpen, promptInspectorData,
        openPromptInspectorModal, closePromptInspectorModal,
        isAgentStatsOpen, setIsAgentStatsOpen,
        isTeamGeneratorOpen, setIsTeamGeneratorOpen,
        isApiUsageOpen, setIsApiUsageOpen,
        isArchiveOpen, setIsArchiveOpen,
        isBookmarksPanelOpen, setIsBookmarksPanelOpen,
        isAgentSettingsModalOpen,
        selectedAgentForModal,
        openAgentSettingsModal,
        closeAgentSettingsModal,
        isDeveloperInfoOpen, setIsDeveloperInfoOpen,
        isComponentsGalleryOpen, setIsComponentsGalleryOpen,
        isAddComponentModalOpen, setIsAddComponentModalOpen,
        isAddHtmlComponentModalOpen, setIsAddHtmlComponentModalOpen,
        isEditHtmlComponentModalOpen,
        editingHtmlComponent,
        openEditHtmlComponentModal,
        closeEditHtmlComponentModal,
        isEditComponentModalOpen,
        editingComponent,
        openEditComponentModal,
        closeEditComponentModal,
        isComponentPreviewOpen,
        componentToPreview,
        previewBackground,
        openComponentPreviewModal,
        closeComponentPreviewModal,
        isConversionTypeModalOpen, setIsConversionTypeModalOpen,
        contextMenuState, openContextMenu, closeContextMenu,
    };
};
