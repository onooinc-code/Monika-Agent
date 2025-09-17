'use strict';

function handleUpdateContext(updateData) {
    if (!updateData) {
        logMessage("Received empty update data.", "warn");
        return;
    }
    logMessage(`Merging context update: ${JSON.stringify(updateData.context_update)}`);
    conversationState = deepMerge(conversationState, updateData.context_update || {});
    if (updateData.summary) {
        if (!conversationState.messages) {
            conversationState.messages = [];
        }
        conversationState.messages.push({ sender: 'ai', full_text: '...', summary: updateData.summary, timestamp: new Date().toISOString() });
    }
    saveContext();
}

async function parseAndExecuteCommands(node) {
    logMessage("New AI response detected. Parsing for commands...");
    const changelogRegex = /<!--\s*MONICA_CHANGELOG_START\s*-->([\s\S]*?)<!--\s*MONICA_CHANGELOG_END\s*-->/g;
    const actionRegex = /<!--\s*MONICA_ACTION:\s*({[\s\S]*?})\s*-->/g;
    const updateRegex = /<!--\s*MONICA_UPDATE:\s*({[\s\S]*?})\s*-->/g;

    const html = node.innerHTML;
    let changelogMatch, actionMatch, updateMatch;
    let commandFound = false;
    
    while ((changelogMatch = changelogRegex.exec(html)) !== null) {
        const newChangelog = changelogMatch[1].trim();
        cumulativeChangelog += newChangelog + '\n\n';
        logMessage(`Changelog found and appended: ${newChangelog.substring(0, 50)}...`);
        saveContext();
    }

    while ((actionMatch = actionRegex.exec(html)) !== null) {
        commandFound = true;
        try {
            const command = JSON.parse(actionMatch[1]);
            logMessage(`MONICA_ACTION found: ${command.action}`);
            if (isAutomationEnabled) {
                setStatusLight('yellow');
                switch(command.action) {
                    case 'GET_PREVIEW_STATE': await handleGetPreviewState(); break;
                    case 'GET_DOM_STRUCTURE': await handleGetDomStructure(); break;
                    case 'INTERACT_ELEMENT': await handleInteractElement(command.params); break;
                }
            } else {
                logMessage(`Automation is OFF. Skipping execution of ${command.action}.`, "warn");
            }
        } catch (e) { 
            logMessage(`Failed to parse MONICA_ACTION: ${e.message}`, "error");
            setStatusLight('red');
        }
    }

    while ((updateMatch = updateRegex.exec(html)) !== null) {
        commandFound = true;
        try {
            const updateData = JSON.parse(updateMatch[1]);
            logMessage("MONICA_UPDATE found. Updating context.");
            handleUpdateContext(updateData);
        } catch (e) { 
            logMessage(`Failed to parse MONICA_UPDATE: ${e.message}`, "error");
            setStatusLight('red');
        }
    }

    if(commandFound) {
        setStatusLight('green');
    } else {
        logMessage("No commands found in the latest AI response.");
    }
}
