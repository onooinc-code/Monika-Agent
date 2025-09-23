import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { GlassIconButton } from './GlassIconButton.tsx';

export const HeaderLeftActions: React.FC = () => {
    const { setIsTeamGeneratorOpen, setIsApiUsageOpen, setIsDeveloperInfoOpen, setIsComponentsGalleryOpen } = useAppContext();

    return (
        <div className="HeaderLeftActions header-action-card">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 p-3 z-10 w-full h-full">
                <GlassIconButton
                    onClick={() => setIsApiUsageOpen(true)}
                    title="API Usage"
                    aria-label="Open API Usage"
                    gradient="cyan"
                    className="ApiUsageActionButton"
                />
                <GlassIconButton
                    onClick={() => setIsComponentsGalleryOpen(true)}
                    title="Components Gallery"
                    aria-label="Open Components Gallery"
                    gradient="indigo"
                    className="ComponentsGalleryActionButton"
                />
                <GlassIconButton
                    onClick={() => setIsTeamGeneratorOpen(true)}
                    title="Generate Team"
                    aria-label="Open Team Generator"
                    gradient="purple"
                    className="TeamGeneratorActionButton"
                />
                <GlassIconButton
                    onClick={() => setIsDeveloperInfoOpen(true)}
                    title="Developer Info"
                    aria-label="Open Developer Info Panel"
                    gradient="dev"
                    className="DeveloperInfoActionButton"
                />
            </div>
        </div>
    );
};