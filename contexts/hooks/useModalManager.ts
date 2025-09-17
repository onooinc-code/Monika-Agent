
import { useState } from 'react';
import { PipelineStep, Message, ContextMenuItem } from '../../types/index.ts';

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
    
    const openContextMenu = (x: number, y: number, menuItems: ContextMenuItem[]) => {
        setContextMenuState({ isOpen: true, x, y, menuItems });
    };

    const closeContextMenu = () => {
        setContextMenuState(prev => ({ ...prev, isOpen: false }));
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
        contextMenuState, openContextMenu, closeContextMenu,
    };
};
