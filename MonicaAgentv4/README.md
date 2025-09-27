# MonicaAgentv4 - Advanced AI Assistant

<p align="center">
  <img src="https://storage.googleapis.com/aistudio-public/gallery/78587395-8164-4a27-a988-51e9b2515b13/monica-banner.png" alt="Monica Banner" width="800"/>
</p>

**Monica v4.0.0** is an advanced, client-side AI assistant, rebuilt from the ground up on **Next.js 14**. It provides a flexible platform where users can configure and interact with a team of specialized AI agents within a single, coherent chat interface. The primary goal is to create a transparent, powerful, and user-friendly environment for exploring sophisticated AI interactions that go beyond simple question-and-answer formats.

The application's "Future World" aesthetic is built on glassmorphism, dark mode, and vibrant neon highlights, creating a modern and immersive user experience.

---

## ✨ Key Features

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
| **System Intelligence**       | **Long-Term Memory** for context persistence across conversations.                                             | ✅ Implemented |
|                               | AI-Powered **Team Generation Wizard** to create new agent teams from a high-level goal.                          | ✅ Implemented |
| **Transparency & Debugging**  | **Cognitive Workflow Inspector** to visualize the AI's step-by-step reasoning.                                 | ✅ Implemented |
|                               | **Prompt & Response Inspector** for deep debugging of API calls.                                               | ✅ Implemented |
| **Robust UI/UX**              | Comprehensive **global and per-conversation settings**.                                                        | ✅ Implemented |
|                               | Real-time **status indicators** and client-side **usage metrics**.                                             | ✅ Implemented |

---

## 🚀 Getting Started

Monica is a client-side application built with Next.js 14.

### Prerequisites

*   Node.js and npm (or yarn/pnpm).
*   A Google Gemini API key.

### Running the Application

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd MonicaAgentv4
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **API Key Configuration:** The application requires a Google Gemini API key. Create a `.env.local` file in the root of the `MonicaAgentv4` directory and add your key:
    ```
    NEXT_PUBLIC_API_KEY=your_gemini_api_key_here
    ```
    > **Note:** Users can also provide a key at runtime in the main settings, which is then stored in `localStorage` and will override the environment variable.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ Architecture Deep Dive

Monica follows a clean, feature-oriented, three-layer architecture to ensure logic is decoupled and maintainable.

### Project File Structure

```
/
├── app/                  # Next.js App Router (layout, page, globals)
├── components/           # Reusable UI components
├── contexts/             # React context for state management
│   ├── hooks/            # Custom hooks for logic domains
│   └── StateProvider.tsx   # Main context provider
├── services/             # External API interactions (Gemini API)
├── types/                # TypeScript type definitions
└── ...                   # Config files (next.config.js, etc.)
```

### Data Flow & Logic Separation

1.  **UI Layer (`/components`):** The presentation layer. Responsible for what the user sees and capturing their input. Components are stateless where possible, receiving data and callbacks from the State Layer.

2.  **State & Orchestration Layer (`/contexts`):** The control layer and "brain" of the application. It manages all application data and business logic via React Context and a series of specialized custom hooks.

3.  **Service Layer (`/services`):** The data layer. It handles all communication with the Google Gemini API. It is composed of stateless, asynchronous functions that construct prompts, call the API, and handle errors.

---

## 🔭 Future Vision

The project documentation outlines an ambitious vision for evolving Monica from an advanced AI assistant into a professional-grade, collaborative AI Development & Operations Platform by leveraging a sophisticated backend architecture.

Key areas for future growth include:
-   **Core Platform & Collaboration:** User Accounts, Multi-Device Sync, Team Workspaces, and Real-time Collaboration.
-   **Advanced Agent Intelligence:** Shared Team Memory, dynamic knowledge base integration (Notion, Google Drive), and agent self-improvement loops.
-   **Workflow Automation:** A visual, drag-and-drop workflow builder to automate complex, multi-step tasks.
-   **Analytics & Monetization:** Dashboards for cost analysis, a marketplace for community-built agents, and subscription tiers.
