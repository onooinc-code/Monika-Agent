// Content script for Monica-Ext extension
class ContentScriptManager {
    constructor() {
        this.isInitialized = false;
        this.initialize();
    }

    initialize() {
        if (this.isInitialized) return;

        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });

        // Listen for messages from popup script
        window.addEventListener('message', (event) => {
            if (event.source !== window) return;
            if (event.data.type && event.data.type.startsWith('MONICA_EXT_')) {
                this.handleWindowMessage(event.data);
            }
        });

        this.isInitialized = true;
        console.log('Monica-Ext content script initialized');
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.type) {
            case 'EXECUTE_ACTION':
                this.executeAction(request.actionId)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'GET_PAGE_INFO':
                sendResponse(this.getPageInfo());
                break;

            case 'PING':
                sendResponse({ status: 'active' });
                break;

            default:
                sendResponse({ error: 'Unknown message type' });
        }
    }

    handleWindowMessage(data) {
        switch (data.type) {
            case 'MONICA_EXT_PAGE_ACTION':
                this.handlePageAction(data.action, data.params);
                break;
        }
    }

    async executeAction(actionId) {
        try {
            console.log(`Executing action: ${actionId}`);

            // Get current tab information
            const tabInfo = await this.getCurrentTabInfo();

            // Send action to background script for processing
            const response = await this.sendMessageToBackground({
                type: 'PROCESS_ACTION',
                actionId: actionId,
                tabInfo: tabInfo
            });

            if (response.success) {
                // Execute any page-specific actions if needed
                await this.executePageAction(actionId, response.data);
                return { success: true, value: response.value };
            } else {
                throw new Error(response.error || 'Action failed');
            }

        } catch (error) {
            console.error('Error executing action:', error);
            return { success: false, error: error.message };
        }
    }

    async executePageAction(actionId, data) {
        // Placeholder for page-specific action implementations
        switch (actionId) {
            case 'action1':
                return await this.executeAction1(data);
            case 'action2':
                return await this.executeAction2(data);
            case 'action3':
                return await this.executeAction3(data);
            case 'action4':
                return await this.executeAction4(data);
            case 'action5':
                return await this.executeAction5(data);
            case 'action6':
                return await this.executeAction6(data);
            case 'action7':
                return await this.executeAction7(data);
            default:
                throw new Error(`Unknown action: ${actionId}`);
        }
    }

    // Placeholder implementations for the 7 actions
    async executeAction1(data) {
        console.log('Executing Action 1 with data:', data);
        // Placeholder implementation
        return { success: true, value: 'Action 1 completed' };
    }

    async executeAction2(data) {
        console.log('Executing Action 2: Write "hello Agent" in text input');

        try {
            // Find and write to text input field with comprehensive error handling
            const result = await this.writeHelloAgentToInput();

            if (result.success) {
                return {
                    success: true,
                    value: result.message,
                    details: {
                        inputFound: result.inputFound,
                        inputType: result.inputType,
                        inputSelector: result.inputSelector,
                        timestamp: Date.now()
                    }
                };
            } else {
                throw new Error(result.error || 'Failed to write to input field');
            }

        } catch (error) {
            console.error('Action 2 error:', error);
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

    async executeAction3(data) {
        console.log('Executing Action 3: Click on the "Run" button');

        try {
            // Find and click "Run" button with comprehensive error handling
            const result = await this.clickRunButton();

            if (result.success) {
                return {
                    success: true,
                    value: result.message,
                    details: {
                        buttonFound: result.buttonFound,
                        buttonType: result.buttonType,
                        buttonSelector: result.buttonSelector,
                        buttonText: result.buttonText,
                        timestamp: Date.now()
                    }
                };
            } else {
                throw new Error(result.error || 'Failed to click "Run" button');
            }

        } catch (error) {
            console.error('Action 3 error:', error);
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

    async executeAction4(data) {
        console.log('Executing Action 4: Retrieve conversation title');

        try {
            // Retrieve conversation title with comprehensive error handling
            const result = await this.retrieveConversationTitle();

            if (result.success) {
                return {
                    success: true,
                    value: result.title,
                    details: {
                        titleFound: result.titleFound,
                        titleSource: result.titleSource,
                        titleSelector: result.titleSelector,
                        titleLength: result.titleLength,
                        timestamp: Date.now()
                    }
                };
            } else {
                throw new Error(result.error || 'Failed to retrieve conversation title');
            }

        } catch (error) {
            console.error('Action 4 error:', error);
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

    async executeAction5(data) {
        console.log('Executing Action 5 with data:', data);
        // Placeholder implementation
        return { success: true, value: 'Action 5 completed' };
    }

    async executeAction6(data) {
        console.log('Executing Action 6 with data:', data);
        // Placeholder implementation
        return { success: true, value: 'Action 6 completed' };
    }

    async executeAction7(data) {
        console.log('Executing Action 7 with data:', data);
        // Placeholder implementation
        return { success: true, value: 'Action 7 completed' };
    }

    async getCurrentTabInfo() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' }, (response) => {
                resolve(response || {});
            });
        });
    }

    getPageInfo() {
        return {
            url: window.location.href,
            title: document.title,
            hostname: window.location.hostname,
            timestamp: Date.now()
        };
    }

    sendMessageToBackground(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    // Utility method to send messages to popup
    sendMessageToPopup(message) {
        window.postMessage({
            type: 'MONICA_EXT_RESPONSE',
            ...message
        }, '*');
    }

    // Method to write "hello Agent" to text input field with comprehensive error handling
    async writeHelloAgentToInput() {
        const INPUT_TIMEOUT = 5000; // 5 seconds timeout
        const HELLO_TEXT = 'hello Agent';

        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkForInputs = () => {
                const elapsed = Date.now() - startTime;

                // Check timeout
                if (elapsed > INPUT_TIMEOUT) {
                    resolve({
                        success: false,
                        error: `Timeout: No suitable text input field found within ${INPUT_TIMEOUT}ms`,
                        inputFound: false,
                        timestamp: Date.now()
                    });
                    return;
                }

                try {
                    // Comprehensive input field detection with multiple selectors
                    const inputSelectors = [
                        // Standard input types
                        'input[type="text"]',
                        'input[type="search"]',
                        'input[type="email"]',
                        'input[type="password"]',
                        'input[type="url"]',
                        'input[type="tel"]',
                        // Textarea
                        'textarea',
                        // Content editable elements
                        '[contenteditable="true"]',
                        '[contenteditable=""]',
                        // Common input classes and IDs
                        'input.input-field',
                        'input.form-control',
                        'input[type="text"]:not([disabled]):not([readonly])',
                        'textarea:not([disabled]):not([readonly])',
                        // Chat input specific selectors
                        'input[placeholder*="message" i]',
                        'input[placeholder*="chat" i]',
                        'input[placeholder*="type" i]',
                        'textarea[placeholder*="message" i]',
                        'textarea[placeholder*="chat" i]',
                        // Common chat application selectors
                        '.chat-input input',
                        '.message-input input',
                        '[data-testid*="input"]',
                        '[data-testid*="message"]'
                    ];

                    let foundInput = null;
                    let usedSelector = '';

                    // Try each selector
                    for (const selector of inputSelectors) {
                        try {
                            const elements = document.querySelectorAll(selector);
                            for (const element of elements) {
                                if (this.isSuitableInput(element)) {
                                    foundInput = element;
                                    usedSelector = selector;
                                    break;
                                }
                            }
                            if (foundInput) break;
                        } catch (e) {
                            // Continue to next selector if query fails
                            continue;
                        }
                    }

                    if (!foundInput) {
                        // No input found, retry after a short delay
                        setTimeout(checkForInputs, 100);
                        return;
                    }

                    // Found a suitable input, attempt to write to it
                    const writeResult = this.writeToInput(foundInput, HELLO_TEXT);

                    if (writeResult.success) {
                        resolve({
                            success: true,
                            message: `Successfully wrote "${HELLO_TEXT}" to ${writeResult.inputType}`,
                            inputFound: true,
                            inputType: writeResult.inputType,
                            inputSelector: usedSelector,
                            timestamp: Date.now()
                        });
                    } else {
                        resolve({
                            success: false,
                            error: writeResult.error,
                            inputFound: true,
                            inputType: writeResult.inputType,
                            inputSelector: usedSelector,
                            timestamp: Date.now()
                        });
                    }

                } catch (error) {
                    resolve({
                        success: false,
                        error: `Error during input detection: ${error.message}`,
                        inputFound: false,
                        timestamp: Date.now()
                    });
                }
            };

            // Start checking for inputs
            checkForInputs();
        });
    }

    // Helper method to check if an element is a suitable input
    isSuitableInput(element) {
        try {
            // Check if element is visible
            const rect = element.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 &&
                            window.getComputedStyle(element).visibility !== 'hidden' &&
                            window.getComputedStyle(element).display !== 'none';

            if (!isVisible) return false;

            // Check if element is disabled or readonly
            if (element.disabled || element.readOnly) return false;

            // For contenteditable elements, check if they're actually editable
            if (element.contentEditable === 'true' || element.contentEditable === '') {
                return element.offsetParent !== null; // Must be in DOM and visible
            }

            // For input/textarea elements, check if they're actually writable
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return element.offsetParent !== null && !element.disabled && !element.readOnly;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Helper method to write text to an input element
    writeToInput(element, text) {
        try {
            // Store original value for potential restoration
            const originalValue = element.value || element.textContent || '';

            // Focus the element first
            element.focus();

            // Clear existing content
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = '';
            } else if (element.contentEditable === 'true' || element.contentEditable === '') {
                element.textContent = '';
            }

            // Write the new text
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = text;
            } else if (element.contentEditable === 'true' || element.contentEditable === '') {
                element.textContent = text;
            }

            // Trigger input event to simulate user typing
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);

            // Verify the text was written successfully
            let currentValue = '';
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                currentValue = element.value;
            } else if (element.contentEditable === 'true' || element.contentEditable === '') {
                currentValue = element.textContent;
            }

            if (currentValue === text) {
                return {
                    success: true,
                    inputType: element.tagName.toLowerCase() +
                              (element.type ? `[type="${element.type}"]` : '') +
                              (element.contentEditable ? '[contenteditable]' : ''),
                    originalValue: originalValue
                };
            } else {
                return {
                    success: false,
                    error: 'Text was not written successfully - verification failed',
                    inputType: element.tagName.toLowerCase() +
                              (element.type ? `[type="${element.type}"]` : '') +
                              (element.contentEditable ? '[contenteditable]' : '')
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `Failed to write to input: ${error.message}`,
                inputType: element.tagName.toLowerCase() +
                          (element.type ? `[type="${element.type}"]` : '') +
                          (element.contentEditable ? '[contenteditable]' : '')
            };
        }
    }

    // Method to inject custom functionality into the page
    injectCustomScript(scriptContent) {
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
        script.remove(); // Clean up after execution
    }

    // Helper method to check if an element is a suitable button
    isSuitableButton(element) {
        try {
            // Check if element is visible
            const rect = element.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 &&
                             window.getComputedStyle(element).visibility !== 'hidden' &&
                             window.getComputedStyle(element).display !== 'none';

            if (!isVisible) return false;

            // Check if element is disabled
            if (element.disabled) return false;

            // Check if element is clickable (has click handlers or is naturally clickable)
            const clickable = element.onclick ||
                             element.getAttribute('onclick') ||
                             element.href ||
                             element.tagName === 'BUTTON' ||
                             element.tagName === 'INPUT' ||
                             element.tagName === 'A' ||
                             window.getComputedStyle(element).cursor === 'pointer';

            if (!clickable) return false;

            // Additional checks for buttons
            if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
                return element.offsetParent !== null; // Must be in DOM and visible
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    // Helper method to click a button element
    clickButton(element) {
        try {
            // Store original state for potential restoration
            const originalDisabled = element.disabled;

            // Focus the element first
            element.focus();

            // Attempt to click the element
            element.click();

            return {
                success: true,
                buttonType: element.tagName.toLowerCase() +
                           (element.type ? `[type="${element.type}"]` : '') +
                           (element.className ? `[class="${element.className}"]` : ''),
                message: 'Button clicked successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: `Failed to click button: ${error.message}`,
                buttonType: element.tagName.toLowerCase() +
                           (element.type ? `[type="${element.type}"]` : '') +
                           (element.className ? `[class="${element.className}"]` : '')
            };
        }
    // Method to retrieve conversation title with multiple strategies and comprehensive error handling
    async retrieveConversationTitle() {
        const TITLE_TIMEOUT = 3000; // 3 seconds timeout as specified

        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkForTitles = () => {
                const elapsed = Date.now() - startTime;

                // Check timeout
                if (elapsed > TITLE_TIMEOUT) {
                    resolve({
                        success: false,
                        error: `Timeout: No conversation title found within ${TITLE_TIMEOUT}ms`,
                        titleFound: false,
                        timestamp: Date.now()
                    });
                    return;
                }

                try {
                    // Multiple strategies for finding conversation titles
                    const titleStrategies = [
                        // Strategy 1: Page title (most common)
                        {
                            name: 'page_title',
                            selector: null,
                            extract: () => {
                                const title = document.title;
                                return title && title.trim() && title !== 'New Chat' && title !== 'Chat' ? title.trim() : null;
                            }
                        },

                        // Strategy 2: Chat header titles
                        {
                            name: 'chat_header',
                            selector: 'h1, h2, h3, .chat-title, .conversation-title, [data-testid*="title"], [data-testid*="header"]',
                            extract: (element) => {
                                const text = element.textContent || element.innerText || '';
                                return text && text.trim() ? text.trim() : null;
                            }
                        },

                        // Strategy 3: Breadcrumb navigation
                        {
                            name: 'breadcrumb',
                            selector: '.breadcrumb, nav[aria-label*="breadcrumb"], [role="navigation"]',
                            extract: (element) => {
                                const text = element.textContent || element.innerText || '';
                                const matches = text.match(/([^>]+)$/); // Get last part of breadcrumb
                                return matches && matches[1] && matches[1].trim() ? matches[1].trim() : null;
                            }
                        },

                        // Strategy 4: URL-based title extraction
                        {
                            name: 'url_based',
                            selector: null,
                            extract: () => {
                                const url = window.location.href;
                                const urlMatch = url.match(/\/chat\/([^/?]+)/);
                                if (urlMatch && urlMatch[1]) {
                                    return decodeURIComponent(urlMatch[1]).replace(/[-_]/g, ' ').trim();
                                }
                                return null;
                            }
                        },

                        // Strategy 5: Meta tags
                        {
                            name: 'meta_tag',
                            selector: null,
                            extract: () => {
                                const metaTags = ['og:title', 'twitter:title', 'title'];
                                for (const tag of metaTags) {
                                    const meta = document.querySelector(`meta[property="${tag}"], meta[name="${tag}"]`);
                                    if (meta && meta.content && meta.content.trim()) {
                                        return meta.content.trim();
                                    }
                                }
                                return null;
                            }
                        },

                        // Strategy 6: Chat interface titles
                        {
                            name: 'chat_interface',
                            selector: '.chat-header h1, .chat-header h2, .conversation-header, .chat-title',
                            extract: (element) => {
                                const text = element.textContent || element.innerText || '';
                                return text && text.trim() ? text.trim() : null;
                            }
                        },

                        // Strategy 7: Sidebar conversation titles
                        {
                            name: 'sidebar_title',
                            selector: '[data-testid*="conversation"], [data-testid*="chat"], .sidebar-item.active, .conversation-item.active',
                            extract: (element) => {
                                const text = element.textContent || element.innerText || element.title || '';
                                return text && text.trim() ? text.trim() : null;
                            }
                        },

                        // Strategy 8: Document title alternatives
                        {
                            name: 'document_title_alt',
                            selector: null,
                            extract: () => {
                                const titleElement = document.querySelector('title');
                                if (titleElement && titleElement.text && titleElement.text.trim()) {
                                    return titleElement.text.trim();
                                }
                                return null;
                            }
                        }
                    ];

                    // Try each strategy
                    for (const strategy of titleStrategies) {
                        try {
                            let title = null;
                            let usedSelector = '';

                            if (strategy.selector) {
                                // Use DOM query
                                const elements = document.querySelectorAll(strategy.selector);
                                for (const element of elements) {
                                    if (this.isVisibleElement(element)) {
                                        title = strategy.extract(element);
                                        if (title) {
                                            usedSelector = strategy.selector;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                // Use direct extraction
                                title = strategy.extract();
                            }

                            if (title && this.isValidTitle(title)) {
                                resolve({
                                    success: true,
                                    title: title,
                                    titleFound: true,
                                    titleSource: strategy.name,
                                    titleSelector: usedSelector,
                                    titleLength: title.length,
                                    timestamp: Date.now()
                                });
                                return;
                            }
                        } catch (e) {
                            // Continue to next strategy if current one fails
                            continue;
                        }
                    }

                    // No title found, retry after a short delay
                    setTimeout(checkForTitles, 100);
                    return;

                } catch (error) {
                    resolve({
                        success: false,
                        error: `Error during title detection: ${error.message}`,
                        titleFound: false,
                        timestamp: Date.now()
                    });
                }
            };

            // Start checking for titles
            checkForTitles();
        });
    }

    // Helper method to check if an element is visible
    isVisibleElement(element) {
        try {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 &&
                            window.getComputedStyle(element).visibility !== 'hidden' &&
                            window.getComputedStyle(element).display !== 'none';

            return isVisible && element.offsetParent !== null;
        } catch (error) {
            return false;
        }
    }

    // Helper method to validate if a title is meaningful
    isValidTitle(title) {
        if (!title || typeof title !== 'string') return false;

        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 2 || trimmedTitle.length > 200) return false;

        // Reject generic titles
        const genericTitles = [
            'new chat', 'chat', 'conversation', 'untitled',
            'loading...', 'please wait', 'error', '404',
            'page not found', 'access denied', 'login'
        ];

        const lowerTitle = trimmedTitle.toLowerCase();
        if (genericTitles.some(generic => lowerTitle.includes(generic))) {
            return false;
        }

        // Reject titles that are just numbers or special characters
        if (/^[\d\s\W]+$/.test(trimmedTitle)) return false;

        return true;
    }
    }
}

// Initialize content script
const contentScriptManager = new ContentScriptManager();

// Export for potential use by other scripts
window.MonicaExtContentScript = contentScriptManager;
// Helper methods for button interaction
