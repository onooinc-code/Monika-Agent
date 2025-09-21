# System Architecture

## Overview
Monica is a sophisticated React-based web application that enables multi-agent AI conversations. The architecture follows a modular, component-driven approach with clear separation of concerns between UI, state management, services, and external integrations.

## Source Code Organization

### Core Application Structure
```
monica-v2/
├── index.tsx                    # Application entry point
├── App.tsx                      # Main application component
├── contexts/
│   └── StateProvider.tsx        # Global state management
├── components/                  # Reusable UI components
│   ├── Header.tsx
│   ├── MessageList.tsx
│   ├── MessageInput.tsx
│   ├── SettingsModal.tsx
│   ├── HistoryModal.tsx
│   └── [30+ other components]
├── services/                    # Business logic and API integrations
│   ├── gemini/
│   │   └── client.ts           # Google Gemini AI client
│   ├── chatService.ts
│   ├── agentService.ts
│   └── [10+ other services]
├── constants/                   # Application constants
│   └── agentConstants.ts       # Default agents and configurations
├── types/                       # TypeScript type definitions
│   ├── agent.ts
│   ├── conversation.ts
│   ├── message.ts
│   └── [10+ other type files]
├── hooks/                       # Custom React hooks
│   └── useLocalStorage.ts
└── styles/                      # CSS styling
    ├── main.css
    └── [component-specific styles]
```

### Key Architectural Components

#### 1. State Management Layer
- **StateProvider**: Central state management using React Context
- **Custom Hooks**: Specialized hooks for different concerns (conversation, chat, memory, etc.)
- **Local Storage Integration**: Persistent storage for user preferences and data
- **Real-time Updates**: Live status indicators and usage tracking

#### 2. Component Architecture
- **Modular Design**: Each component has a single responsibility
- **Composition Pattern**: Complex UI built from smaller, reusable components
- **Modal System**: Centralized modal management with context
- **Context Menus**: Dynamic context menus with keyboard shortcuts

#### 3. Hook-Centric Service Layer
- **Separation of Concerns**: Business logic is encapsulated within custom React hooks, separating it from UI components.
- **Primary Logic Hub**: The `contexts/hooks` directory serves as the main hub for business logic, managing state, API interactions, and core functionalities.
- **API Integration**: The `services/gemini/client.ts` provides a cached client for Google Gemini AI, but the core interaction logic resides in the `useChatHandler` hook.
- **Tool Integration**: Tools like calculator, weather, and shell execution are defined in the `services/tools` directory but are orchestrated and utilized within the hook-based architecture.
- **Memory Management**: Long-term memory is managed by the `useMemoryManager` hook, which handles extraction and updates.

### Service Layer Architecture

The service layer is organized into specialized domains, each handling distinct aspects of the application's functionality. Services are stateless, pure functions that handle external communication, data transformation, and business logic.

#### Core Gemini Client (`services/gemini/client.ts`)
- **Purpose**: Creates and caches Gemini API client instances based on API keys
- **Key Features**: Prevents redundant client initializations, improves performance
- **Implementation**: Factory pattern with client caching and reuse

#### Chat Services (`services/chat/`)
Handles the direct flow of conversation and agent interactions:

- **agentService.ts**: Core service for generating responses from individual AI agents
  - Handles streaming responses and real-time message delivery
  - Manages knowledge/memory injection into prompts
  - Constructs agent-specific prompts with context and instructions
  - Processes tool calls and function execution

- **managerService.ts**: Contains all logic for the AI Agent Manager
  - Decides which agent should respond next based on context
  - Generates structured plans for multi-agent discussions
  - Moderates conversation flow and maintains discussion quality
  - Handles agent coordination and turn-taking logic

- **messageActionsService.ts**: Processes AI-powered actions on existing messages
  - Summarizes long conversations or specific topics
  - Rewrites or improves message content
  - Extracts key information and insights
  - Provides contextual message analysis

#### Analysis Services (`services/analysis/`)
Analyzes conversation content to extract metadata and insights:

- **historyService.ts**: Generates content for the History Modal
  - Creates conversation summaries and topic extraction
  - Builds timeline visualizations of conversation flow
  - Provides export functionality for conversation data

- **memoryService.ts**: Extracts key facts for long-term memory
  - Identifies important information from conversations
  - Structures memory entries for future reference
  - Maintains conversation context across sessions

- **titleService.ts**: Generates concise, descriptive titles
  - Analyzes conversation content to create meaningful titles
  - Ensures titles are unique and descriptive
  - Updates titles as conversations evolve

#### Creation Services (`services/creation/`)
Uses AI to generate new configuration and content:

- **discussionService.ts**: Creates structured discussion rules
  - Generates guidelines for moderated discussions
  - Adapts rules based on agent profiles and goals
  - Ensures productive and focused conversations

- **teamGenerationService.ts**: Multi-step agent team creation
  - Guides users through creating specialized AI teams
  - Matches agents to specific goals and expertise areas
  - Configures agent personalities and capabilities

#### Tool Integration Services (`services/tools/`)
Provides external capabilities to AI agents:

- **calculator.ts**: Mathematical computation and analysis
- **weather.ts**: Real-time weather information and forecasting
- **shell.ts**: Command execution and system interaction
- **contextual.ts**: Context-aware tool selection and usage
- **vfs.ts**: Virtual file system operations
- **index.ts**: Centralized tool registration and management

## Key Technical Decisions

### 1. React 18 + TypeScript
**Decision**: Modern React with TypeScript for type safety and better developer experience
**Rationale**: Provides excellent tooling, type checking, and modern React features
**Impact**: Improved code quality, better IDE support, and reduced runtime errors

### 2. Vite as Build Tool
**Decision**: Vite instead of Create React App for faster development
**Rationale**: Significantly faster hot module replacement and build times
**Impact**: Improved developer productivity and faster iteration cycles

### 3. Context API for State Management
**Decision**: React Context over Redux for state management
**Rationale**: Simpler architecture for this application size, no need for complex state management
**Impact**: Cleaner code, easier to understand data flow, better performance

### 4. Custom Hooks Pattern
**Decision**: Extensive use of custom hooks for logic separation
**Rationale**: Better code reusability and separation of concerns
**Impact**: More maintainable and testable code structure

### 5. Component Composition
**Decision**: Composition over inheritance for UI components
**Rationale**: More flexible and reusable component architecture
**Impact**: Easier to maintain and extend UI components

## Design Patterns in Use

### 1. Provider Pattern
Used extensively for state management and context sharing across components, with `StateProvider.tsx` as the central provider.

### 2. Custom Hooks Pattern
This is the primary architectural pattern for business logic. Specialized hooks in the `contexts/hooks` directory manage distinct concerns such as conversation flow (`useChatHandler`), state management (`useConversationManager`), and UI preferences (`useUIPrefsManager`).

### 3. Factory Pattern
A factory pattern is used in `services/gemini/client.ts` to create and cache `GoogleGenAI` clients, ensuring that a new client is not created for every request.

### 4. Observer Pattern
The application uses an observer-like pattern for real-time updates, where state changes in the `StateProvider` trigger re-renders in consuming components.

### 5. Strategy Pattern
The `ConversationMode` (`Dynamic`, `Continuous`, `Manual`) is a clear implementation of the Strategy Pattern, allowing the application to switch between different conversation flow algorithms at runtime.

## Component Relationships

### Core Data Flow
```
User Input → MessageInput → ChatHandler → AgentService → Gemini API
                                                           ↓
Agent Response ← MessageList ← ConversationManager ← StateProvider
```

### State Management Flow
```
Local Storage ↔ Custom Hooks ↔ Context Provider ↔ Components
```

### Modal Management Flow
```
User Action → ModalManager Hook → Context Update → Modal Components
```

## Critical Implementation Paths

### 1. Multi-Agent Conversation Flow
**Path**: `MessageInput` → `useChatHandler` → `agentService` → `geminiClient` → `AgentManager` → Response Processing → `MessageList`
**Critical Components**: Agent selection logic, conversation context management, response formatting

### 2. State Persistence
**Path**: Component State → `useLocalStorage` → Browser Storage → Hydration on App Load
**Critical Components**: State serialization, migration handling, performance optimization

### 3. Real-time Updates
**Path**: API Response → State Update → Component Re-render → UI Updates
**Critical Components**: Efficient re-rendering, memory leak prevention, performance optimization

### 4. Error Handling
**Path**: API Error → Error Boundary → User Notification → State Recovery
**Critical Components**: Error boundaries, user feedback, graceful degradation

## Integration Points

### External APIs
- **Google Gemini AI**: Primary AI service for agent responses
- **Supabase**: Backend database for data persistence (planned)
- **MCP Servers**: Model Context Protocol for tool integrations

### Internal Services
- **Agent Management**: Creation, configuration, and switching of AI agents
- **Conversation Management**: CRUD operations for conversations
- **Memory Management**: Long-term memory extraction and storage
- **Tool Services**: Calculator, weather, shell execution

## Performance Considerations

### 1. Component Optimization
- Memoization of expensive computations
- Lazy loading of heavy components
- Efficient re-rendering strategies

### 2. Memory Management
- Cleanup of event listeners and subscriptions
- Efficient state updates to prevent unnecessary re-renders
- Memory leak prevention in long-running sessions

### 3. API Optimization
- Request caching and deduplication
- Efficient token usage tracking
- Connection pooling for external services

## Security Architecture

### 1. API Key Management
- Secure storage in local state
- Environment variable configuration
- API key validation and sanitization

### 2. Input Validation
- User input sanitization
- API response validation
- XSS prevention measures

### 3. Data Protection
- Secure handling of conversation data
- Privacy considerations for memory storage
- Safe defaults for sensitive configurations