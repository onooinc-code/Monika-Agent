import React, { useState } from 'react';
import { PipelineStep, Message, ContextMenuItem, Agent, AgentManager, HtmlComponent, CustomComponent } from '@/types';

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

    const handleShowHtmlPreview = (html: string) => {
        setHtmlPreviewContent(html);
        setIsHtmlPreviewOpen(true);
    };

    const handleCloseHtmlPreview = () => {
        setIsHtmlPreviewOpen(false);
        setHtmlPreviewContent('');
    };

    const openActionModal = (config: { title: string; content: string; actions?: ActionModalButton[] }) => {
        setActionModalState({
            isOpen: true,
            title: config.title,
            content: config.content,
            actions: config.actions || null,
        });
    };

    const closeActionModal = () => {
        setActionModalState({ isOpen: false, title: '', content: '', actions: null });
    };

    const openInspectorModal = (pipeline: PipelineStep[]) => {
        setInspectorData(pipeline);
        setIsInspectorOpen(true);
    };

    const closeInspectorModal = () => {
        setIsInspectorOpen(false);
        setInspectorData(null);
    };

    const openPromptInspectorModal = (message: Message) => {
        setPromptInspectorData(message);
        setIsPromptInspectorOpen(true);
    };

    const closePromptInspectorModal = () => {
        setIsPromptInspectorOpen(false);
        setPromptInspectorData(null);
    };

    const openAgentSettingsModal = (agent: Agent | AgentManager) => {
        setSelectedAgentForModal(agent);
        setIsAgentSettingsModalOpen(true);
    };

    const closeAgentSettingsModal = () => {
        setIsAgentSettingsModalOpen(false);
        setSelectedAgentForModal(null);
    };
    
    const openContextMenu = (x: number, y: number, menuItems: ContextMenuItem[]) => {
        setContextMenuState({ isOpen: true, x, y, menuItems });
    };

    const closeContextMenu = () => {
        setContextMenuState(prev => ({ ...prev, isOpen: false }));
    };

    const openEditHtmlComponentModal = (component: HtmlComponent) => {
        setEditingHtmlComponent(component);
        setIsEditHtmlComponentModalOpen(true);
    };

    const closeEditHtmlComponentModal = () => {
        setIsEditHtmlComponentModalOpen(false);
        setEditingHtmlComponent(null);
    };

    const openEditComponentModal = (component: CustomComponent) => {
        setEditingComponent(component);
        setIsEditComponentModalOpen(true);
    };

    const closeEditComponentModal = () => {
        setIsEditComponentModalOpen(false);
        setEditingComponent(null);
    };

    const openComponentPreviewModal = (component: any, background: React.CSSProperties) => {
        setComponentToPreview(component);
        setPreviewBackground(background);
        setIsComponentPreviewOpen(true);
    };

    const closeComponentPreviewModal = () => {
        setIsComponentPreviewOpen(false);
        setComponentToPreview(null);
    };

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