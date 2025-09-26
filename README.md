# Monica V3.5.0 - Advanced AI Assistant: Developer Guide

<p align="center">
  <img src="https://storage.googleapis.com/aistudio-public/gallery/78587395-8164-4a27-a988-51e9b2515b13/monica-banner.png" alt="Monica Banner" width="800"/>
</p>

**Monica** is an advanced, client-side AI assistant designed for complex, multi-agent conversations. It provides a flexible platform where users can configure and interact with a team of specialized AI agents within a single, coherent chat interface. The primary goal is to create a transparent, powerful, and user-friendly environment for exploring sophisticated AI interactions that go beyond simple question-and-answer formats.

The application's "Future World" aesthetic is built on glassmorphism, dark mode, and vibrant neon highlights, creating a modern and immersive user experience.

---

## ✨ Key Features (v3.5.0 - Feature Complete & Stable)

This version represents a stable, feature-complete client-side application. All planned features for this iteration have been implemented and tested.

| ID | Feature                                       | Status        |
|----|-----------------------------------------------|---------------|
| 01 | Conversation Lifecycle Management             | ✅ Implemented |
| 02 | AI-Powered Conversation Titling               | ✅ Implemented |
| 03 | Per-Conversation Settings                     | ✅ Implemented |
| 04 | Rich Message Content (Markdown, Code)         | ✅ Implemented |
| 05 | Message Metadata Display                      | ✅ Implemented |
| 06 | Long Message Handling (Auto-Summarization)    | ✅ Implemented |
| 07 | Message Interaction Toolbar                   | ✅ Implemented |
| 08 | Message AI Actions (Summarize, Rewrite, etc.) | ✅ Implemented |
| 09 | Backend Process Transparency                  | ✅ Implemented |
| 10 | Status Bar & Usage Metrics                    | ✅ Implemented |
| 11 | Moderated Chat Mode                           | ✅ Implemented |
| 12 | AI-Generated Discussion Rules                 | ✅ Implemented |
| 13 | Advanced Agent Configuration (Tools, Keys)    | ✅ Implemented |
| 14 | Automatic Team Generation Wizard              | ✅ Implemented |
| 15 | Streaming AI Responses                        | ✅ Implemented |
| 16 | Conversation Search                           | ✅ Implemented |
| 17 | Conversation Import/Export                    | ✅ Implemented |
| 18 | Long-Term Memory                              | ✅ Implemented |
| 19 | Dynamic Conversation Flow (Planning)          | ✅ Implemented |
| 20 | Interactive Workflow Visualizer               | ✅ Implemented |
| 21 | Manager Insights Overlay                      | ✅ Implemented |
| 22 | Developer Tools (Component Gallery)           | ✅ Implemented |
| 23 | Live Conversation Mode (Voice Chat)           | ✅ Implemented |


---

## 🚀 Getting Started

Monica is a pure client-side application that runs directly in the browser from static files. There is no build step or server-side dependency.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge).
*   A Gemini API key.
*   An environment capable of serving static files (e.g., the VS Code "Live Server" extension or any simple web server).

### Running the Application

1.  **API Key Configuration:** The application requires a Google Gemini API key to function. The key **must** be available in the execution environment as `process.env.API_KEY`.
    > **Important:** This is a hard requirement. The application is designed for development environments where this variable can be injected. Users can also provide a key at runtime in the main settings, which is then stored in `localStorage`.

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

1.  **UI Layer (`/components`):** The presentation layer. Responsible for what the user sees and captures their input. Components are stateless where possible, receiving data and callbacks from the State Layer.

2.  **State & Orchestration Layer (`/contexts`):** The control layer and "brain" of the application. It manages all application data and business logic via React Context and a series of specialized custom hooks.

3.  **Service Layer (`/services`):** The data layer. It handles all communication with the Google Gemini API. It is composed of stateless, asynchronous functions that construct prompts, call the API, and handle errors.

---

## 🧠 State Management (`AppContext`)

All global state is managed within `StateProvider.tsx`, which acts as a central orchestrator. It composes a series of domain-specific custom hooks to manage different facets of the application's logic.

-   **`useConversationManager`**: Handles all CRUD operations for conversations and messages.
-   **`useChatHandler`**: Contains the core logic for sending messages and orchestrating the AI response flow.
-   **`useModalManager`**: Centralizes the open/closed state for all modals, panels, and context menus.
-   **`useMemoryManager`**: Manages the state of the AI's long-term memory object.
-   **`useUsageTracker`**: Handles client-side estimation and persistence of API usage metrics.
-   **`useHistoryHandler`**: Manages the logic for generating the structured conversation history view.
-   **`useSoundManager`**: Provides a centralized way to play UI sound effects.
-   **`useUIPrefsManager`**: Manages persistent user UI preferences.

---

## 📝 Development Rules & Standards

### Development Process
The project follows a structured, six-phase lifecycle which is now considered complete for this client-side version. All features have been implemented, tested, and documented.

### Coding Standards
-   **Single Responsibility Principle (SRP):** Every file, component, and function must have a single, well-defined purpose.
-   **Type Safety:** The project is 100% TypeScript. Avoid using `any`.
-   **Functional Components & Hooks:** All components are functional.
-   **Stateless Services:** All functions in the `/services` directory are stateless.
-   **Robust Error Handling:** All API calls are wrapped in a `try...catch` block and use custom error classes for consistent error management.

---

## 🔭 Future Vision

The project documentation outlines an ambitious vision for evolving Monica from an advanced AI assistant into a professional-grade, collaborative AI Development & Operations Platform by leveraging a sophisticated backend architecture.

Key areas for future growth include:
-   **Core Platform & Collaboration:** User Accounts, Multi-Device Sync, Team Workspaces, and Real-time Collaboration.
-   **Advanced Agent Intelligence:** Shared Team Memory, dynamic knowledge base integration (Notion, Google Drive), and agent self-improvement loops.
-   **Workflow Automation:** A visual, drag-and-drop workflow builder to automate complex, multi-step tasks.
-   **Analytics & Monetization:** Dashboards for cost analysis, a marketplace for community-built agents, and subscription tiers.