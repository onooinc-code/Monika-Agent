
# GEMINI Development Guide for Monica

This document provides a comprehensive guide for developers (both human and AI) to contribute to the Monica project. It outlines the project's architecture, development process, testing strategy, and more.

## Project Overview

Monica is an advanced, client-side AI assistant that allows you to chat with multiple AI agents in the same conversation. It features a sophisticated architecture that allows for dynamic, AI-driven conversation flows, persistent memory, and deep introspection into the AI's cognitive processes.

## Getting Started

### Prerequisites

*   A modern web browser.
*   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
*   A Gemini API key.

### Environment Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/monika-agent.git
    cd monika-agent
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root of the project and add your Gemini API key to it:
    ```
    VITE_GEMINI_API_KEY=your-api-key
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start a development server and open the application in your default browser.

## Development Process

The project follows a structured, feature-driven development process. Each new feature or significant change goes through a structured, six-phase lifecycle:

1.  **Phase 1: Idea & Feature Definition:** A new feature is formally defined in a text file, outlining its objectives and core functionality.
2.  **Phase 2: Planning:** Before coding, a detailed implementation plan is created.
3.  **Phase 3: Implementation:** The developer writes the code according to the plan.
4.  **Phase 4: Testing:** A comprehensive QA test plan is generated and the feature is rigorously tested.
5.  **Phase 5: Completion & Documentation:** The feature's definition file is moved to the `Completed` directory and all relevant documentation is updated.
6.  **Phase 6: Production:** The feature is merged into the main branch and deployed.

## Testing

To ensure the quality of the application, we use a combination of manual and automated testing.

### Manual Testing

The manual testing process is outlined in the QA test plans located in the `Monica-Documentation/testing/` directory. Each test plan includes:

*   Static analysis
*   Risk assessment
*   Unit/integration test scenarios (in Gherkin syntax)
*   A manual end-to-end test plan

### Automated Testing

We use [Vitest](https://vitest.dev/) for running unit and integration tests and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing React components.

#### Writing Tests

When writing tests, please adhere to the following guidelines:

*   Place test files next to the component or service they are testing, with the `.test.tsx` or `.test.ts` extension.
*   Write clear and concise test descriptions.
*   Test for both expected and unexpected behavior.
*   Mock any external dependencies, such as API calls.

#### Running Tests

To run the automated tests, use the following command:

```bash
npm run test
```

This will run all the tests in the project and output the results to the console.

## Architecture

Monica follows a feature-oriented architecture designed for scalability, maintainability, and clean separation of concerns.

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

### Data Flow

The application's architecture ensures a unidirectional data flow and clear separation between different layers of logic:

1.  **UI Layer (`/components`):** "Dumb" components responsible for rendering the UI and capturing user input.
2.  **State & Orchestration Layer (`/contexts`):** The heart of the application, where state is managed and logic is orchestrated.
3.  **Service Layer (`/services`):** Responsible for all external communication with the Google Gemini API.

## Features

Monica is packed with features that make it a powerful and flexible AI assistant. Here are some of the key features:

*   **Multi-Agent Conversations:** Chat with multiple AI agents in the same conversation.
*   **AI Manager:** An AI manager that can be used to manage the dialogue flow.
*   **Manual Suggestions:** Manually suggest the next speaker in the conversation.
*   **Configurable Agents:** Configure the behavior of each AI agent.
*   **Structured Chat History:** View a structured chat history with summaries and topic lists.
*   **Persistent Memory:** The AI has a persistent memory that it can use to remember key facts from previous conversations.
*   **Cognitive Inspector:** A "Workflow Visualizer" that allows you to see the AI's step-by-step process.
*   **Team Generator:** A wizard for generating a new team of AI agents.
*   **And much more!**

## Future Vision

We have an ambitious vision for evolving Monica from an advanced AI assistant into a professional-grade, collaborative AI Development & Operations Platform. Some of the features we plan to add in the future include:

*   **User Accounts & SSO**
*   **Multi-Device Synchronization**
*   **Team Workspaces & RBAC**
*   **Real-time Collaboration & Presence**
*   **Shared Team Memory & Visual Memory Graph Explorer**
*   **Agent Tool Use & Function Calling**
*   **And much more!**

