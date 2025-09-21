import React from 'react';
import { useAppContext } from '../contexts/StateProvider';
import { GlassIconButton } from './GlassIconButton';
import NotificationInbox from './NotificationInbox';
import { UserMenu } from './auth/UserMenu';

import apiUsageIcon from '../assets/images/api-usage.png';
import settingIcon from '../assets/images/setting.png';
import generateTeamIcon from '../assets/images/generate-team.png';

export const HeaderActions = () => {
    const { 
        setIsSettingsOpen, 
        setIsTeamGeneratorOpen, 
        setIsApiUsageOpen, 
        setIsAuthModalOpen // Get the setter for the auth modal
    } = useAppContext();

    return (
        <div className="header-actions header-action-card">
            <div className="z-10 p-2 flex items-center justify-center space-x-4">
                {/* User Menu / Login Button */}
                <UserMenu onLoginClick={() => setIsAuthModalOpen(true)} />

                {/* Other Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <GlassIconButton
                        onClick={() => setIsApiUsageOpen(true)}
                        title="API Usage"
                        ariaLabel="Open API Usage"
                        iconUrl={apiUsageIcon}
                        gradient="cyan"
                        className="w-8 h-8"
                    />
                    <GlassIconButton
                        onClick={() => setIsSettingsOpen(true)}
                        title="Settings"
                        ariaLabel="Open Settings"
                        iconUrl={settingIcon}
                        gradient="indigo"
                        className="w-8 h-8"
                    />
                    <NotificationInbox />
                    <div className="col-span-3 flex justify-center">
                        <GlassIconButton
                            onClick={() => setIsTeamGeneratorOpen(true)}
                            title="Generate Team"
                            ariaLabel="Open Team Generator"
                            iconUrl={generateTeamIcon}
                            gradient="purple"
                            className="w-8 h-8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
