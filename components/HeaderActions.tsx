import React from 'react';
import { useAppContext } from '../contexts/StateProvider';
import { GlassIconButton } from './GlassIconButton';

import apiUsageIcon from '../assets/images/api-usage.png';
import settingIcon from '../assets/images/setting.png';
import generateTeamIcon from '../assets/images/generate-team.png';

export const HeaderActions = () => {
    const { setIsSettingsOpen, setIsTeamGeneratorOpen, setIsApiUsageOpen } = useAppContext();
    return (
        <div className="header-actions header-action-card">
            <div className="z-10 p-2 flex items-center justify-center">
                 <div className="grid grid-cols-2">
                    <GlassIconButton
                        onClick={() => setIsApiUsageOpen(true)}
                        title="API Usage"
                        ariaLabel=""
                        iconUrl={apiUsageIcon}
                        gradient="cyan"
                        className="w-8 h-8" // Reduced size for settings buttons
                    />
                    <GlassIconButton
                        onClick={() => setIsSettingsOpen(true)}
                        title="Settings"
                        ariaLabel="Open Settings"
                        iconUrl={settingIcon}
                        gradient="indigo"
                        className="w-8 h-8" // Reduced size for settings buttons
                    />
                     <div className="col-span-2 flex justify-center">
                         <GlassIconButton
                            onClick={() => setIsTeamGeneratorOpen(true)}
                            title="Generate Team"
                            ariaLabel="Open Team Generator"
                            iconUrl={generateTeamIcon}
                            gradient="purple"
                            className="w-8 h-8" // Keep original size for Generate Team if desired, or reduce to w-8 h-8
                        />
                     </div>
                 </div>
            </div>
        </div>
    );
}