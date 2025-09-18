import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { GlassIconButton } from './GlassIconButton.tsx';

export const HeaderActions = () => {
    const { setIsSettingsOpen, setIsTeamGeneratorOpen, setIsApiUsageOpen } = useAppContext();
    return (
        <div className="header-action-card">
            <div className="z-10 p-2 flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-2">
                    <GlassIconButton
                        onClick={() => setIsApiUsageOpen(true)}
                        title="API Usage"
                        aria-label="Open API Usage"
                        iconUrl="./assets/api-usage.png"
                        gradient="cyan"
                    />
                    <GlassIconButton
                        onClick={() => setIsSettingsOpen(true)}
                        title="Settings"
                        aria-label="Open Settings"
                        iconUrl="./assets/setting.png"
                        gradient="indigo"
                    />
                     <div className="col-span-2 flex justify-center">
                         <GlassIconButton
                            onClick={() => setIsTeamGeneratorOpen(true)}
                            title="Generate Team"
                            aria-label="Open Team Generator"
                            iconUrl="./assets/generate-team.png"
                            gradient="purple"
                        />
                     </div>
                 </div>
            </div>
        </div>
    );
}