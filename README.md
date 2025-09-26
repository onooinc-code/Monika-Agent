# Monica V3 - Advanced AI Assistant: Developer Guide

<p align="center">
  <img src="https://storage.googleapis.com/aistudio-public/gallery/78587395-8164-4a27-a988-51e9b2515b13/monica-banner.png" alt="Monica Banner" width="800"/>
</p>

**Monica** is an advanced, client-side AI assistant designed for complex, multi-agent conversations. It provides a flexible platform where users can configure and interact with a team of specialized AI agents within a single, coherent chat interface. The primary goal is to create a transparent, powerful, and user-friendly environment for exploring sophisticated AI interactions that go beyond simple question-and-answer formats.

The application's "Future World" aesthetic is built on glassmorphism, dark mode, and vibrant neon highlights, creating a modern and immersive user experience.

---

## ✨ Key Features (Client-Side v3.5.0 - Feature Complete)

Monica is packed with features that make it a powerful and flexible platform for AI interaction.

| Category                      | Feature                                                                                                      | Status        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| **Multi-Agent Conversation**  | **Dynamic, Continuous, & Manual Modes** for flexible conversation flow.                                        | ✅ Implemented |
|                               | **AI-Powered Agent Manager** to orchestrate complex tasks and discussions.                                     | ✅ Implemented |
|                               | **Moderated Chat** for structured, rule-based agent interactions.                                              | ✅ Implemented |
| **Advanced Message Handling** | Rich **Markdown & Code Block** rendering with syntax highlighting.                                             | ✅ Implemented |
|                               | AI-powered actions: **Summarize, Rewrite, Regenerate**.                                                        | ✅ Implemented |
|                               | **Alternative Responses** to explore different AI outputs for a single prompt.                                 | ✅ Implemented |
|                               | **Bookmarking** and automatic **long-message summarization**.                                                  | ✅ Implemented |
|                               | Interactive **Message Toolbar** for quick actions and settings.                                                | ✅ Implemented |
| **System Intelligence**       | **Long-Term Memory** for context persistence across conversations.                                             | ✅ Implemented |
|                               | AI-Powered **Team Generation Wizard** to create new agent teams from a high-level goal.                          | ✅ Implemented |
| **Transparency & Debugging**  | **Cognitive Workflow Inspector** to visualize the AI's step-by-step reasoning.                                 | ✅ Implemented |
|                               | **Prompt & Response Inspector** for deep debugging of API calls.                                               | ✅ Implemented |
| **Robust UI/UX**              | Comprehensive **global and per-conversation settings**.                                                        | ✅ Implemented |
|                               | Real-time **status indicators** and client-side **usage metrics**.                                             | ✅ Implemented |
|                               | **Conversation Search** and **Import/Export** for data management.                                             | ✅ Implemented |
|                               | **Developer Tools** providing a browsable gallery of the application's UI components.                          | ✅ Implemented |

---

## 🚀 Getting Started

Monica is a pure client-side application that runs directly in the browser from static files. There is no build step or server-side dependency.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge).
*   A Gemini API key.
*   An environment capable of serving static files (e.g., the VS Code "Live Server" extension or any simple web server).

### Running the Application

1.  **API Key Configuration:** The application requires a Google Gemini API key to function. The key **must** be available in the execution environment as `process.env.API_KEY`.
    > **Important:** This is a hard requirement. The application is designed for development environments where this variable can be injected, and it will not prompt the user for a key. In the main settings, users can provide a key at runtime, which is then stored in `localStorage`.

2.  **Serve the Files:** Serve the project's root directory using a static file server.

3.  **Open in Browser:** Open the `index.html` file in your browser via the server's address (e.g., `http://127.0.0.1:5500/index.html`).

---

## 🏛️ Architecture Deep Dive

Monica follows a clean, feature-oriented, three-layer architecture to ensure logic is decoupled and maintainable.

### Project File Structure

```
/
├── components/         # Reusable UI components
├── contexts/           # React context for state management
│   ├── hooks/          # Custom hooks for logic domains
│   └── StateProvider.tsx # Main context provider
├── services/           # External API interactions (Gemini API)
├── types/              # TypeScript type definitions
└── ...                 # Other root files
```

### Data Flow & Logic Separation

1.  **UI Layer (`/components`):** The presentation layer. It is responsible for what the user sees and captures their input. Components are stateless where possible, receiving data and callbacks from the State Layer.

2.  **State & Orchestration Layer (`/contexts`):** The control layer and the "brain" of the application. It manages all application data and business logic via React Context and a series of specialized custom hooks.

3.  **Service Layer (`/services`):** The data layer. It handles all communication with the Google Gemini API. It is composed of stateless, asynchronous functions that construct prompts, call the API, and handle errors.

### Example Flow: Sending a Message in "Dynamic" Mode

1.  **Action (UI Layer):** The user types in `MessageInput.tsx` and clicks "Send." The component calls `handleSendMessage()` from the `useAppContext` hook.
2.  **Dispatch (UI -> State):** The call is received by `useChatHandler.ts`. It immediately updates the UI with the user's message via functions from `useConversationManager.ts`.
3.  **Orchestration (State -> Service):** `useChatHandler` calls the `managerService.generateDynamicPlan()` function from the Service Layer, passing the necessary context.
4.  **Execution (Service Layer):** `managerService.ts` constructs a detailed prompt, gets a Gemini client instance via `getGenAIClient()`, and calls the API, requesting a structured JSON plan.
5.  **Response (Service -> State):** The service validates and returns the structured plan to `useChatHandler`.
6.  **Iteration (State -> Service -> State):** `useChatHandler` iterates through the plan, calling `agentService.generateResponse()` for each step. The `agentService` streams the response back, and the `useChatHandler` updates the state incrementally using `onAppendToMessageText` and `onFinalizeMessage`.
7.  **Re-render (State -> UI):** With each state update, React re-renders the affected components, such as `MessageBubble.tsx`, to display the new AI-generated content in real-time.

---

## 🧠 State Management (`AppContext`)

All global state is managed within `StateProvider.tsx`, which acts as a central orchestrator. It composes a series of domain-specific custom hooks to manage different facets of the application's logic.

-   **`useConversationManager`**: Handles all CRUD operations for conversations and messages (creating, deleting, updating, bookmarking, etc.).
-   **`useChatHandler`**: Contains the core logic for sending messages, orchestrating the AI response flow based on the current mode, and managing loading states.
-   **`useModalManager`**: Centralizes the open/closed state for all modals, panels, and context menus.
-   **`useMemoryManager`**: Manages the state of the AI's long-term memory object.
-   **`useUsageTracker`**: Handles client-side estimation and persistence of API usage metrics.
-   **`useHistoryHandler`**: Manages the logic for generating the structured conversation history view.
-   **`useSoundManager`**: Provides a centralized way to play UI sound effects.
-   **`useUIPrefsManager`**: Manages persistent user UI preferences, such as secure input visibility.

---

## 📝 Development Rules & Standards

### Development Process
The project follows a structured, six-phase lifecycle outlined in the [Development Cycle documentation](./Monica-Documentation/development_cycle.html).
1.  **Phase 1: Idea & Feature Definition:** A new feature is formally defined.
2.  **Phase 2: Planning:** A detailed implementation plan is created before coding.
3.  **Phase 3: Implementation:** The developer writes the code according to the plan.
4.  **Phase 4: Testing:** A comprehensive QA test plan is generated and the feature is rigorously tested.
5.  **Phase 5: Completion & Documentation:** The feature's definition file is marked complete and documentation is updated.
6.  **Phase 6: Production:** The feature is merged into the main branch.

### Coding Standards
-   **Single Responsibility Principle (SRP):** Every file, component, and function must have a single, well-defined purpose.
-   **Type Safety:** The project is 100% TypeScript. Avoid using `any`. All function parameters and return types must be explicitly typed.
-   **Functional Components:** All components must be functional components using React Hooks.
-   **Stateless Services:** All functions in the `/services` directory must be stateless. They receive all required data as parameters.
-   **Centralized API Client:** Always use the `getGenAIClient(apiKey)` factory from `services/gemini/client.ts` to get a Gemini instance.
-   **Robust Error Handling:** All API calls must be wrapped in a `try...catch` block and use the `handleAndThrowError` utility for consistent error management.
-   **Styling:** Use Tailwind CSS utility classes first. Adhere to the existing design language and use CSS variables defined in `index.html`.

### Testing
Currently, the project relies on a rigorous manual testing process. For each major feature, a comprehensive QA report is created in the `Monica-Documentation/testing/` directory. These reports include:
*   Static code analysis and risk assessment.
*   Unit and integration test scenarios written in Gherkin syntax.
*   A detailed, step-by-step manual End-to-End (E2E) test plan.

---

## 🔭 Future Vision

The project documentation outlines an ambitious vision for evolving Monica from an advanced AI assistant into a professional-grade, collaborative AI Development & Operations Platform by leveraging a sophisticated backend architecture.

Key areas for future growth include:
-   **Core Platform & Collaboration:** User Accounts, Multi-Device Sync, Team Workspaces, and Real-time Collaboration.
-   **Advanced Agent Intelligence:** Shared Team Memory, dynamic knowledge base integration (Notion, Google Drive), and agent self-improvement loops.
-   **Workflow Automation:** A visual, drag-and-drop workflow builder to automate complex, multi-step tasks.
-   **Analytics & Monetization:** Dashboards for cost analysis, a marketplace for community-built agents, and subscription tiers.

---

## 🤝 Contributing

Contributions are welcome! Please familiarize yourself with the project's architecture and follow the established [Development Cycle](./Monica-Documentation/development_cycle.html).