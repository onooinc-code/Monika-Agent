# Technologies and Development Setup

## Core Technologies

### Frontend Framework
- **React 18.3.1**: Modern React with concurrent features and improved performance
- **TypeScript 5.8.2**: Type safety and better developer experience
- **Vite 6.2.0**: Fast build tool with excellent development experience

### UI and Styling
- **Custom CSS**: Extensive custom styling system with organized structure
  - Component-specific stylesheets
  - Animation systems (keyframes, classes, sidebar animations)
  - Layout utilities (background, effects, scrollbar)
  - Utility classes for prose styling

### State Management
- **React Context API**: Centralized state management without external libraries
- **Custom Hooks**: Specialized hooks for different concerns
- **Local Storage Integration**: Persistent user preferences and data

### External Integrations

#### AI Services
- **Google Gemini AI 1.20.0**: Primary AI service using gemini-2.5-flash model
- **@genkit-ai/mcp 1.19.3**: Model Context Protocol for tool integrations

#### Database
- **Supabase 2.57.4**: Backend database for data persistence (planned integration)

#### Notifications
- **@novu/react 3.9.3**: Notification system integration

## Development Dependencies

### Build and Development Tools
- **@vitejs/plugin-react 5.0.0**: React plugin for Vite
- **cross-env 10.0.0**: Environment variable management
- **jsdom 27.0.0**: DOM implementation for testing

### Testing Framework
- **Vitest 3.2.4**: Fast unit testing framework
- **@testing-library/react 16.3.0**: React testing utilities
- **@testing-library/jest-dom 6.8.0**: Custom Jest matchers
- **@testing-library/user-event 14.6.1**: User interaction testing

### Type Definitions
- **@types/node 22.14.0**: Node.js type definitions

## Project Structure

### Source Organization
```
monica-v2/
├── src/                          # Main source directory
├── components/                   # Reusable UI components (40+ components)
├── contexts/                     # React context providers and hooks
├── services/                     # Business logic and API services
├── constants/                    # Application constants and configurations
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── styles/                       # CSS styling system
└── database/                     # Database migrations and utilities
```

### Key Directories
- **components/**: 40+ reusable UI components with specialized functionality
- **services/**: Business logic layer with API integrations and utilities
- **contexts/**: React Context providers for state management
- **types/**: Comprehensive TypeScript definitions for all data structures
- **styles/**: Organized CSS system with animations and utilities

## Development Setup

### Prerequisites
- Modern web browser
- Environment capable of serving static files
- API_KEY environment variable for Google Gemini AI

### Running the Application
1. Set the `API_KEY` environment variable
2. Serve the `index.html` file as the main entry point
3. JavaScript modules load automatically via Vite

### Available Scripts
- `npm run dev`: Start development server with Vite
- `npm run build`: Build production bundle
- `npm test`: Run tests with Vitest

## Technical Constraints

### Browser Compatibility
- Modern browsers with ES modules support
- Web APIs for local storage and real-time updates
- CSS Grid and Flexbox support

### Performance Requirements
- Efficient re-rendering with React optimization patterns
- Memory leak prevention in long-running sessions
- API request caching and deduplication

### Security Considerations
- API key management and validation
- Input sanitization and XSS prevention
- Secure handling of conversation data

## Dependencies Analysis

### Production Dependencies
- **React Ecosystem**: Core React functionality with modern features
- **AI Integration**: Google Gemini AI with MCP support
- **Database**: Supabase client for backend integration
- **Notifications**: Novu integration for user notifications

### Development Dependencies
- **Build Tools**: Vite for fast development and optimized builds
- **Testing**: Comprehensive testing setup with Vitest and Testing Library
- **Type Safety**: TypeScript with Node.js type definitions

## Tool Usage Patterns

### AI Integration
- Gemini client with API key caching
- Multiple model support (gemini-2.5-flash)
- Tool integration via MCP protocol

### State Management
- Context API for global state
- Custom hooks for specialized logic
- Local storage for persistence

### Component Architecture
- Modular, single-responsibility components
- Composition over inheritance pattern
- Centralized modal and context menu management

### Testing Strategy
- Unit tests with Vitest
- Component testing with Testing Library
- User interaction simulation

## Environment Configuration

### Required Environment Variables
- `API_KEY`: Google Gemini AI API key

### Optional Configuration
- Development server configuration via Vite
- Build optimization settings
- Testing environment variables

## Build and Deployment

### Build Process
- Vite handles bundling and optimization
- Static asset handling and code splitting
- Production-ready bundle generation

### Deployment Requirements
- Static file hosting capability
- Environment variable support
- Modern browser compatibility

## Performance Optimization

### Bundle Optimization
- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Asset optimization and compression

### Runtime Performance
- React.memo for component memoization
- Efficient state updates and re-renders
- Memory leak prevention strategies

### Network Optimization
- API request caching and deduplication
- Efficient token usage tracking
- Connection pooling for external services