// Background script for Monica-Ext extension
class BackgroundScriptManager {
    constructor() {
        this.isInitialized = false;
        this.activeTabs = new Map();
        this.actionQueue = [];
        this.initialize();
    }

    initialize() {
        if (this.isInitialized) return;

        // Set up message listeners
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });

        // Handle tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        // Handle tab removal
        chrome.tabs.onRemoved.addListener((tabId) => {
            this.handleTabRemoval(tabId);
        });

        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleExtensionInstalled(details);
        });

        this.isInitialized = true;
        console.log('Monica-Ext background script initialized');
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.type) {
            case 'EXECUTE_ACTION':
                this.executeAction(request.actionId, sender)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'PROCESS_ACTION':
                this.processAction(request.actionId, request.tabInfo, sender)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'GET_CURRENT_TAB':
                this.getCurrentTab(sender.tab.id)
                    .then(tab => sendResponse(tab))
                    .catch(error => sendResponse({ error: error.message }));
                break;

            case 'GET_ACTIONS':
                sendResponse({ actions: this.getStoredActions() });
                break;

            case 'UPDATE_ACTION_STATUS':
                this.updateActionStatus(request.actionId, request.status, request.value);
                sendResponse({ success: true });
                break;

            case 'PING':
                sendResponse({ status: 'active', timestamp: Date.now() });
                break;

            default:
                sendResponse({ error: 'Unknown message type' });
        }
    }

    async executeAction(actionId, sender) {
        try {
            console.log(`Background: Executing action ${actionId}`);

            // Get current tab information
            const tab = await this.getCurrentTab(sender.tab.id);

            // Process the action
            const result = await this.processAction(actionId, tab, sender);

            // Notify popup of status update
            this.notifyPopup({
                type: 'ACTION_STATUS_UPDATE',
                actionId: actionId,
                status: result.success ? 'success' : 'error',
                value: result.value
            });

            return result;

        } catch (error) {
            console.error('Error executing action:', error);
            return { success: false, error: error.message };
        }
    }

    async processAction(actionId, tabInfo, sender) {
        try {
            // Route action to appropriate handler
            const result = await this.routeActionToHandler(actionId, tabInfo, sender);

            // Store action result
            this.storeActionResult(actionId, result);

            return result;

        } catch (error) {
            console.error('Error processing action:', error);
            return { success: false, error: error.message };
        }
    }

    async routeActionToHandler(actionId, tabInfo, sender) {
        // Route to content script for page-specific actions
        const contentScriptResult = await this.sendMessageToContentScript(
            sender.tab.id,
            {
                type: 'EXECUTE_ACTION',
                actionId: actionId,
                tabInfo: tabInfo
            }
        );

        if (contentScriptResult && contentScriptResult.success) {
            return contentScriptResult;
        }

        // Fallback to background processing if content script fails
        return await this.executeBackgroundAction(actionId, tabInfo);
    }

    async executeBackgroundAction(actionId, tabInfo) {
        // Placeholder implementations for background actions
        switch (actionId) {
            case 'action1':
                return await this.executeBackgroundAction1(tabInfo);
            case 'action2':
                return await this.executeBackgroundAction2(tabInfo);
            case 'action3':
                return await this.executeBackgroundAction3(tabInfo);
            case 'action4':
                return await this.executeBackgroundAction4(tabInfo);
            case 'action5':
                return await this.executeBackgroundAction5(tabInfo);
            case 'action6':
                return await this.executeBackgroundAction6(tabInfo);
            case 'action7':
                return await this.executeBackgroundAction7(tabInfo);
            default:
                throw new Error(`Unknown action: ${actionId}`);
        }
    }

    // Action 1: Navigate to "new chat" URL with error handling and timeout
    async executeBackgroundAction1(tabInfo) {
        console.log('Executing Action 1: Navigate to new chat URL');

        try {
            // Configuration for Action 1
            const NEW_CHAT_URL = 'https://chat.openai.com/?model=gpt-4'; // Example URL - can be configured
            const NAVIGATION_TIMEOUT = 10000; // 10 seconds timeout
            const SUCCESS_CHECK_DELAY = 2000; // Wait 2 seconds after navigation to check success

            // Create a new tab for navigation
            const newTab = await this.createNewTab(NEW_CHAT_URL);

            if (!newTab || !newTab.id) {
                throw new Error('Failed to create new tab for navigation');
            }

            // Wait for navigation to complete and verify success
            const navigationResult = await this.waitForNavigationAndVerify(
                newTab.id,
                NEW_CHAT_URL,
                NAVIGATION_TIMEOUT,
                SUCCESS_CHECK_DELAY
            );

            if (navigationResult.success) {
                return {
                    success: true,
                    value: `Successfully navigated to new chat: ${navigationResult.url}`,
                    details: {
                        tabId: newTab.id,
                        finalUrl: navigationResult.url,
                        navigationTime: navigationResult.navigationTime
                    }
                };
            } else {
                throw new Error(navigationResult.error || 'Navigation failed or timed out');
            }

        } catch (error) {
            console.error('Action 1 error:', error);
            return {
                success: false,
                error: error.message,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    async executeBackgroundAction2(tabInfo) {
        console.log('Executing Background Action 2: Write "hello Agent" in text input');

        try {
            // Action 2 is primarily handled by content script
            // Background script coordinates the action and handles fallbacks

            const result = await this.sendMessageToContentScript(
                tabInfo.id,
                {
                    type: 'EXECUTE_ACTION',
                    actionId: 'action2',
                    tabInfo: tabInfo
                }
            );

            if (result && result.success) {
                return {
                    success: true,
                    value: result.value,
                    details: {
                        inputFound: result.details?.inputFound || false,
                        inputType: result.details?.inputType || 'unknown',
                        inputSelector: result.details?.inputSelector || 'unknown',
                        timestamp: Date.now()
                    }
                };
            } else {
                // Fallback: Try to find input fields using background script methods
                const fallbackResult = await this.executeAction2Fallback(tabInfo);

                if (fallbackResult.success) {
                    return fallbackResult;
                } else {
                    return {
                        success: false,
                        error: result?.error || 'Failed to execute Action 2',
                        details: {
                            contentScriptError: result?.error || 'Content script failed',
                            fallbackError: fallbackResult.error,
                            timestamp: Date.now()
                        }
                    };
                }
            }

        } catch (error) {
            console.error('Background Action 2 error:', error);
            return {
                success: false,
                error: error.message,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    // Fallback implementation for Action 2 when content script is not available
    async executeAction2Fallback(tabInfo) {
        console.log('Executing Action 2 fallback');

        try {
            // Inject a script to find and write to input fields
            const injectionResult = await this.injectAction2Script(tabInfo.id);

            if (injectionResult.success) {
                return {
                    success: true,
                    value: 'Successfully wrote "hello Agent" via script injection',
                    details: {
                        method: 'script_injection',
                        timestamp: Date.now()
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Script injection failed',
                    details: {
                        injectionError: injectionResult.error,
                        timestamp: Date.now()
                    }
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `Fallback execution failed: ${error.message}`,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    // Inject Action 2 script into the page
    async injectAction2Script(tabId) {
        const action2Script = `
            (function() {
                const INPUT_TIMEOUT = 5000;
                const HELLO_TEXT = 'hello Agent';
                let timeoutId;

                function findAndWriteToInput() {
                    const inputSelectors = [
                        'input[type="text"]',
                        'input[type="search"]',
                        'textarea',
                        '[contenteditable="true"]'
                    ];

                    for (const selector of inputSelectors) {
                        const elements = document.querySelectorAll(selector);
                        for (const element of elements) {
                            if (isSuitableInput(element)) {
                                return writeToInput(element, HELLO_TEXT);
                            }
                        }
                    }
                    return { success: false, error: 'No suitable input field found' };
                }

                function isSuitableInput(element) {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0 &&
                                    window.getComputedStyle(element).visibility !== 'hidden' &&
                                    window.getComputedStyle(element).display !== 'none';
                    return isVisible && !element.disabled && !element.readOnly;
                }

                function writeToInput(element, text) {
                    try {
                        element.focus();
                        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                            element.value = text;
                        } else if (element.contentEditable === 'true') {
                            element.textContent = text;
                        }
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        return {
                            success: true,
                            message: 'Successfully wrote to input',
                            inputType: element.tagName.toLowerCase()
                        };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                }

                // Set timeout for the operation
                const timeoutPromise = new Promise((resolve) => {
                    timeoutId = setTimeout(() => {
                        resolve({ success: false, error: 'Operation timed out' });
                    }, INPUT_TIMEOUT);
                });

                // Execute the operation
                const operationPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        const result = findAndWriteToInput();
                        clearTimeout(timeoutId);
                        resolve(result);
                    }, 100);
                });

                return Promise.race([operationPromise, timeoutPromise]);
            })();
        `;

        return new Promise((resolve) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (script) => {
                    try {
                        return eval(script);
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                },
                args: [action2Script]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    resolve({
                        success: false,
                        error: chrome.runtime.lastError.message
                    });
                } else {
                    resolve(results[0].result || { success: false, error: 'No result' });
                }
            });
        });
    }

    // Fallback implementation for Action 3 when content script is not available
    async executeAction3Fallback(tabInfo) {
        console.log('Executing Action 3 fallback');

        try {
            // Inject a script to find and click "Run" button
            const injectionResult = await this.injectAction3Script(tabInfo.id);

            if (injectionResult.success) {
                return {
                    success: true,
                    value: 'Successfully clicked "Run" button via script injection',
                    details: {
                        method: 'script_injection',
                        buttonFound: injectionResult.buttonFound,
                        buttonType: injectionResult.buttonType,
                        buttonSelector: injectionResult.buttonSelector,
                        buttonText: injectionResult.buttonText,
                        timestamp: Date.now()
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Script injection failed',
                    details: {
                        injectionError: injectionResult.error,
                        timestamp: Date.now()
                    }
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `Fallback execution failed: ${error.message}`,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    // Inject Action 3 script into the page
    async injectAction3Script(tabId) {
        const action3Script = `
            (function() {
                const BUTTON_TIMEOUT = 5000; // 5 seconds timeout
                let timeoutId;

                function findAndClickButton() {
                    const buttonSelectors = [
                        // Standard button elements with "run" text
                        'button:contains("Run")',
                        'button:contains("run")',
                        'input[type="button"][value*="Run" i]',
                        'input[type="button"][value*="run" i]',
                        'input[type="submit"][value*="Run" i]',
                        'input[type="submit"][value*="run" i]',
                        // Common button classes and IDs
                        'button.btn-run',
                        'button.run-button',
                        'button[class*="run" i]',
                        'button[id*="run" i]',
                        'input.btn-run',
                        'input.run-button',
                        'input[class*="run" i]',
                        'input[id*="run" i]',
                        // Generic run buttons
                        'button[title*="run" i]',
                        'button[aria-label*="run" i]',
                        // Common execution buttons
                        'button:contains("Execute")',
                        'button:contains("Start")',
                        'button:contains("Go")',
                        'button:contains("Launch")',
                        // Play/Run icons (common in UI)
                        'button[class*="play" i]',
                        'button[class*="start" i]',
                        'button[class*="execute" i]',
                        // Specific selectors for common frameworks
                        '.run-btn',
                        '.execute-btn',
                        '[data-testid*="run"]',
                        '[data-testid*="execute"]',
                        '[data-cy*="run"]',
                        '[data-cy*="execute"]'
                    ];

                    let foundButton = null;
                    let usedSelector = '';
                    let buttonText = '';

                    // Try each selector
                    for (const selector of buttonSelectors) {
                        try {
                            let elements;

                            // Handle pseudo-selectors like :contains()
                            if (selector.includes(':contains(')) {
                                const textMatch = selector.match(/:contains\\("([^"]+)"\\)/);
                                if (textMatch) {
                                    const searchText = textMatch[1];
                                    elements = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'))
                                        .filter(el => {
                                            const text = el.textContent || el.value || el.innerText || '';
                                            return text.toLowerCase().includes(searchText.toLowerCase());
                                        });
                                } else {
                                    continue;
                                }
                            } else {
                                elements = document.querySelectorAll(selector);
                            }

                            for (const element of elements) {
                                if (isSuitableButton(element)) {
                                    foundButton = element;
                                    usedSelector = selector;
                                    buttonText = element.textContent || element.value || element.innerText || 'Button';
                                    break;
                                }
                            }
                            if (foundButton) break;
                        } catch (e) {
                            // Continue to next selector if query fails
                            continue;
                        }
                    }

                    if (!foundButton) {
                        return { success: false, error: 'No suitable "Run" button found' };
                    }

                    // Found a suitable button, attempt to click it
                    const clickResult = clickButton(foundButton);

                    if (clickResult.success) {
                        return {
                            success: true,
                            message: 'Successfully clicked button',
                            buttonFound: true,
                            buttonType: clickResult.buttonType,
                            buttonSelector: usedSelector,
                            buttonText: buttonText
                        };
                    } else {
                        return {
                            success: false,
                            error: clickResult.error,
                            buttonFound: true,
                            buttonType: clickResult.buttonType,
                            buttonSelector: usedSelector,
                            buttonText: buttonText
                        };
                    }
                }

                function isSuitableButton(element) {
                    try {
                        // Check if element is visible
                        const rect = element.getBoundingClientRect();
                        const isVisible = rect.width > 0 && rect.height > 0 &&
                                         window.getComputedStyle(element).visibility !== 'hidden' &&
                                         window.getComputedStyle(element).display !== 'none';

                        if (!isVisible) return false;

                        // Check if element is disabled
                        if (element.disabled) return false;

                        // Check if element is clickable
                        const clickable = element.onclick ||
                                         element.getAttribute('onclick') ||
                                         element.href ||
                                         element.tagName === 'BUTTON' ||
                                         element.tagName === 'INPUT' ||
                                         element.tagName === 'A' ||
                                         window.getComputedStyle(element).cursor === 'pointer';

                        if (!clickable) return false;

                        return true;
                    } catch (error) {
                        return false;
                    }
                }

                function clickButton(element) {
                    try {
                        // Focus the element first
                        element.focus();

                        // Attempt to click the element
                        element.click();

                        return {
                            success: true,
                            buttonType: element.tagName.toLowerCase() +
                                       (element.type ? '[type="' + element.type + '"]' : '') +
                                       (element.className ? '[class="' + element.className + '"]' : ''),
                            message: 'Button clicked successfully'
                        };

                    } catch (error) {
                        return {
                            success: false,
                            error: 'Failed to click button: ' + error.message,
                            buttonType: element.tagName.toLowerCase() +
                                       (element.type ? '[type="' + element.type + '"]' : '') +
                                       (element.className ? '[class="' + element.className + '"]' : '')
                        };
                    }
                }

                // Set timeout for the operation
                const timeoutPromise = new Promise((resolve) => {
                    timeoutId = setTimeout(() => {
                        resolve({ success: false, error: 'Operation timed out' });
                    }, BUTTON_TIMEOUT);
                });

                // Execute the operation
                const operationPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        const result = findAndClickButton();
                        clearTimeout(timeoutId);
                        resolve(result);
                    }, 100);
                });

                return Promise.race([operationPromise, timeoutPromise]);
            })();
        `;

        return new Promise((resolve) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (script) => {
                    try {
                        return eval(script);
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                },
                args: [action3Script]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    resolve({
                        success: false,
                        error: chrome.runtime.lastError.message
                    });
                } else {
                    resolve(results[0].result || { success: false, error: 'No result' });
                }
            });
        });
    }

    async executeBackgroundAction3(tabInfo) {
        console.log('Executing Background Action 3: Click on the "Run" button');

        try {
            // Action 3 is primarily handled by content script
            // Background script coordinates the action and handles fallbacks

            const result = await this.sendMessageToContentScript(
                tabInfo.id,
                {
                    type: 'EXECUTE_ACTION',
                    actionId: 'action3',
                    tabInfo: tabInfo
                }
            );

            if (result && result.success) {
                return {
                    success: true,
                    value: result.value,
                    details: {
                        buttonFound: result.details?.buttonFound || false,
                        buttonType: result.details?.buttonType || 'unknown',
                        buttonSelector: result.details?.buttonSelector || 'unknown',
                        buttonText: result.details?.buttonText || 'unknown',
                        timestamp: Date.now()
                    }
                };
            } else {
                // Fallback: Try to find and click button using script injection
                const fallbackResult = await this.executeAction3Fallback(tabInfo);

                if (fallbackResult.success) {
                    return fallbackResult;
                } else {
                    return {
                        success: false,
                        error: result?.error || 'Failed to execute Action 3',
                        details: {
                            contentScriptError: result?.error || 'Content script failed',
                            fallbackError: fallbackResult.error,
                            timestamp: Date.now()
                        }
                    };
                }
            }

        } catch (error) {
            console.error('Background Action 3 error:', error);
            return {
                success: false,
                error: error.message,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    async executeBackgroundAction4(tabInfo) {
        console.log('Executing Background Action 4: Retrieve conversation title');

        try {
            // Action 4 is primarily handled by content script
            // Background script coordinates the action and handles fallbacks

            const result = await this.sendMessageToContentScript(
                tabInfo.id,
                {
                    type: 'EXECUTE_ACTION',
                    actionId: 'action4',
                    tabInfo: tabInfo
                }
            );

            if (result && result.success) {
                return {
                    success: true,
                    value: result.value,
                    details: {
                        titleFound: result.details?.titleFound || false,
                        titleSource: result.details?.titleSource || 'content_script',
                        titleSelector: result.details?.titleSelector || 'unknown',
                        titleLength: result.details?.titleLength || 0,
                        timestamp: Date.now()
                    }
                };
            } else {
                // Fallback: Try to retrieve title using script injection
                const fallbackResult = await this.executeAction4Fallback(tabInfo);

                if (fallbackResult.success) {
                    return fallbackResult;
                } else {
                    return {
                        success: false,
                        error: result?.error || 'Failed to execute Action 4',
                        details: {
                            contentScriptError: result?.error || 'Content script failed',
                            fallbackError: fallbackResult.error,
                            timestamp: Date.now()
                        }
                    };
                }
            }

        } catch (error) {
            console.error('Background Action 4 error:', error);
            return {
                success: false,
                error: error.message,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }
    // Fallback implementation for Action 4 when content script is not available
    async executeAction4Fallback(tabInfo) {
        console.log('Executing Action 4 fallback');

        try {
            // Inject a script to retrieve conversation title
            const injectionResult = await this.injectAction4Script(tabInfo.id);

            if (injectionResult.success) {
                return {
                    success: true,
                    value: injectionResult.title,
                    details: {
                        method: 'script_injection',
                        titleFound: injectionResult.titleFound,
                        titleSource: injectionResult.titleSource,
                        titleSelector: injectionResult.titleSelector,
                        titleLength: injectionResult.titleLength,
                        timestamp: Date.now()
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Script injection failed',
                    details: {
                        injectionError: injectionResult.error,
                        timestamp: Date.now()
                    }
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `Fallback execution failed: ${error.message}`,
                details: {
                    errorType: error.name,
                    timestamp: Date.now()
                }
            };
        }
    }

    // Inject Action 4 script into the page
    async injectAction4Script(tabId) {
        const action4Script = `
            (function() {
                const TITLE_TIMEOUT = 3000; // 3 seconds timeout
                let timeoutId;

                function findConversationTitle() {
                    const titleStrategies = [
                        // Strategy 1: Page title
                        () => {
                            const title = document.title;
                            return title && title.trim() && title !== 'New Chat' && title !== 'Chat' ? title.trim() : null;
                        },

                        // Strategy 2: Chat header titles
                        () => {
                            const elements = document.querySelectorAll('h1, h2, h3, .chat-title, .conversation-title, [data-testid*="title"], [data-testid*="header"]');
                            for (const element of elements) {
                                const text = element.textContent || element.innerText || '';
                                if (text && text.trim()) {
                                    return text.trim();
                                }
                            }
                            return null;
                        },

                        // Strategy 3: Breadcrumb navigation
                        () => {
                            const elements = document.querySelectorAll('.breadcrumb, nav[aria-label*="breadcrumb"], [role="navigation"]');
                            for (const element of elements) {
                                const text = element.textContent || element.innerText || '';
                                const matches = text.match(/([^>]+)$/);
                                if (matches && matches[1] && matches[1].trim()) {
                                    return matches[1].trim();
                                }
                            }
                            return null;
                        },

                        // Strategy 4: URL-based title extraction
                        () => {
                            const url = window.location.href;
                            const urlMatch = url.match(/\\/chat\\/([^\\/?]+)/);
                            if (urlMatch && urlMatch[1]) {
                                return decodeURIComponent(urlMatch[1]).replace(/[-_]/g, ' ').trim();
                            }
                            return null;
                        },

                        // Strategy 5: Meta tags
                        () => {
                            const metaTags = ['og:title', 'twitter:title', 'title'];
                            for (const tag of metaTags) {
                                const meta = document.querySelector(\`meta[property="\${tag}"], meta[name="\${tag}"]\`);
                                if (meta && meta.content && meta.content.trim()) {
                                    return meta.content.trim();
                                }
                            }
                            return null;
                        }
                    ];

                    // Try each strategy
                    for (const strategy of titleStrategies) {
                        try {
                            const title = strategy();
                            if (title && isValidTitle(title)) {
                                return {
                                    success: true,
                                    title: title,
                                    titleFound: true,
                                    titleSource: 'fallback_strategy',
                                    titleSelector: 'unknown',
                                    titleLength: title.length
                                };
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    return { success: false, error: 'No conversation title found' };
                }

                function isValidTitle(title) {
                    if (!title || typeof title !== 'string') return false;
                    const trimmedTitle = title.trim();
                    if (trimmedTitle.length < 2 || trimmedTitle.length > 200) return false;

                    const genericTitles = ['new chat', 'chat', 'conversation', 'untitled', 'loading...', 'please wait', 'error', '404'];
                    const lowerTitle = trimmedTitle.toLowerCase();
                    if (genericTitles.some(generic => lowerTitle.includes(generic))) {
                        return false;
                    }

                    return true;
                }

                // Set timeout for the operation
                const timeoutPromise = new Promise((resolve) => {
                    timeoutId = setTimeout(() => {
                        resolve({ success: false, error: 'Operation timed out' });
                    }, TITLE_TIMEOUT);
                });

                // Execute the operation
                const operationPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        const result = findConversationTitle();
                        clearTimeout(timeoutId);
                        resolve(result);
                    }, 100);
                });

                return Promise.race([operationPromise, timeoutPromise]);
            })();
        `;

        return new Promise((resolve) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (script) => {
                    try {
                        return eval(script);
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                },
                args: [action4Script]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    resolve({
                        success: false,
                        error: chrome.runtime.lastError.message
                    });
                } else {
                    resolve(results[0].result || { success: false, error: 'No result' });
                }
            });
        });
    }

    async executeBackgroundAction5(tabInfo) {
        console.log('Executing Background Action 5');
        return { success: true, value: 'Background Action 5 completed' };
    }

    async executeBackgroundAction6(tabInfo) {
        console.log('Executing Background Action 6');
        return { success: true, value: 'Background Action 6 completed' };
    }

    async executeBackgroundAction7(tabInfo) {
        console.log('Executing Background Action 7');
        return { success: true, value: 'Background Action 7 completed' };
    }

    // Helper method to create a new tab and navigate to URL
    async createNewTab(url) {
        return new Promise((resolve, reject) => {
            chrome.tabs.create({ url: url, active: true }, (tab) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Failed to create tab: ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(tab);
                }
            });
        });
    }

    // Helper method to wait for navigation and verify success
    async waitForNavigationAndVerify(tabId, expectedUrl, timeout, successCheckDelay) {
        const startTime = Date.now();

        return new Promise((resolve) => {
            const checkNavigation = () => {
                chrome.tabs.get(tabId, (tab) => {
                    if (chrome.runtime.lastError) {
                        resolve({
                            success: false,
                            error: `Tab not found: ${chrome.runtime.lastError.message}`,
                            navigationTime: Date.now() - startTime
                        });
                        return;
                    }

                    const elapsed = Date.now() - startTime;

                    // Check if we've exceeded the timeout
                    if (elapsed > timeout) {
                        resolve({
                            success: false,
                            error: `Navigation timeout after ${timeout}ms`,
                            navigationTime: elapsed
                        });
                        return;
                    }

                    // Check if tab is still loading
                    if (tab.status === 'loading') {
                        setTimeout(checkNavigation, 500); // Check again in 500ms
                        return;
                    }

                    // Tab finished loading, wait a bit more to ensure page is fully loaded
                    if (tab.status === 'complete') {
                        setTimeout(() => {
                            // Verify the URL matches expected (allowing for redirects)
                            const currentUrl = tab.url || '';
                            const expectedBase = expectedUrl.split('?')[0]; // Remove query params for comparison
                            const currentBase = currentUrl.split('?')[0];

                            if (currentBase === expectedBase || currentUrl.includes(expectedBase)) {
                                resolve({
                                    success: true,
                                    url: currentUrl,
                                    navigationTime: elapsed
                                });
                            } else {
                                resolve({
                                    success: false,
                                    error: `Navigation completed but URL mismatch. Expected: ${expectedBase}, Got: ${currentBase}`,
                                    navigationTime: elapsed
                                });
                            }
                        }, successCheckDelay);
                        return;
                    }

                    // Unknown tab status, retry
                    setTimeout(checkNavigation, 500);
                });
            };

            // Start checking navigation
            checkNavigation();
        });
    }

    async getCurrentTab(tabId) {
        return new Promise((resolve) => {
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                } else {
                    resolve({
                        id: tab.id,
                        url: tab.url,
                        title: tab.title,
                        active: tab.active,
                        windowId: tab.windowId
                    });
                }
            });
        });
    }

    sendMessageToContentScript(tabId, message) {
        return new Promise((resolve) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    resolve({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    resolve(response);
                }
            });
        });
    }

    notifyPopup(message) {
        chrome.runtime.sendMessage(message);
    }

    updateActionStatus(actionId, status, value = null) {
        // Store action status in chrome storage
        chrome.storage.local.get(['actions'], (result) => {
            const actions = result.actions || [];
            const actionIndex = actions.findIndex(a => a.id === actionId);

            if (actionIndex !== -1) {
                actions[actionIndex].status = status;
                if (value !== null) {
                    actions[actionIndex].value = value;
                }

                chrome.storage.local.set({ actions: actions });
            }
        });
    }

    storeActionResult(actionId, result) {
        // Store action result with timestamp
        const actionResult = {
            actionId: actionId,
            timestamp: Date.now(),
            success: result.success,
            value: result.value,
            error: result.error
        };

        chrome.storage.local.get(['actionHistory'], (result) => {
            const history = result.actionHistory || [];
            history.push(actionResult);

            // Keep only last 100 entries
            if (history.length > 100) {
                history.splice(0, history.length - 100);
            }

            chrome.storage.local.set({ actionHistory: history });
        });
    }

    getStoredActions() {
        // This would typically retrieve from storage
        // For now, return default actions
        return [
            { id: 'action1', name: 'Action 1', status: 'pending', value: null },
            { id: 'action2', name: 'Action 2', status: 'pending', value: null },
            { id: 'action3', name: 'Action 3', status: 'pending', value: null },
            { id: 'action4', name: 'Action 4', status: 'pending', value: null },
            { id: 'action5', name: 'Action 5', status: 'pending', value: null },
            { id: 'action6', name: 'Action 6', status: 'pending', value: null },
            { id: 'action7', name: 'Action 7', status: 'pending', value: null }
        ];
    }

    handleTabUpdate(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url) {
            this.activeTabs.set(tabId, {
                id: tabId,
                url: tab.url,
                title: tab.title,
                timestamp: Date.now()
            });
        }
    }

    handleTabRemoval(tabId) {
        this.activeTabs.delete(tabId);
    }

    handleExtensionInstalled(details) {
        console.log('Monica-Ext extension installed/updated:', details.reason);

        if (details.reason === 'install') {
            // Initialize default settings
            chrome.storage.local.set({
                actions: this.getStoredActions(),
                actionHistory: [],
                settings: {
                    version: chrome.runtime.getManifest().version,
                    installDate: Date.now()
                }
            });
        }
    }
}

// Initialize background script
const backgroundScriptManager = new BackgroundScriptManager();