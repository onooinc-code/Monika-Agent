# Component Library

## Overview

Monica's UI is built from a comprehensive library of 40+ reusable React components, each designed with a single responsibility and following consistent patterns for props, styling, and accessibility. This document serves as a complete reference for developers working with the component system.

## Component Categories

### Core Layout Components

#### App.tsx
**Description**: Root component that assembles the main application layout and orchestrates all major UI sections.

**Key Features**:
- Global state provider setup
- Main layout structure
- Modal system integration
- Error boundary implementation

#### Header.tsx
**Description**: Main application header with conditional rendering for dashboard vs conversation-specific views.

**Props**:
```typescript
interface HeaderProps {
  // No props - uses context for all data
}
```

**Features**:
- Sticky positioning with glassmorphism styling
- Agent cards display with gradient backgrounds
- Manager card integration
- Responsive design (collapses on mobile)

#### ConversationList.tsx
**Description**: Collapsible left sidebar for conversation management and search.

**Features**:
- Conversation search and filtering
- Import/export functionality
- Bookmark management
- Responsive sidebar behavior

#### BookmarkedMessagesPanel.tsx
**Description**: Collapsible right sidebar for managing bookmarked messages.

**Features**:
- Message bookmark organization
- Search within bookmarks
- Quick navigation to bookmarked content

#### StatusBar.tsx
**Description**: Persistent footer displaying real-time usage metrics and system status.

**Features**:
- API usage tracking
- Real-time token consumption
- System performance indicators
- Persistent across all views

### Chat & Message Components

#### MessageList.tsx
**Description**: Renders the complete list of messages for the active conversation with virtualization support.

**Props**:
```typescript
interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onMessageAction?: (action: MessageAction, messageId: string) => void;
}
```

**Features**:
- Message virtualization for performance
- Auto-scroll to latest messages
- Loading state handling
- Message action integration

#### MessageBubble.tsx
**Description**: Advanced message display component with comprehensive functionality for rendering individual messages.

**Props**:
```typescript
interface MessageBubbleProps {
  message: Message;
  agent?: Agent;
  featureFlags?: Conversation['featureFlags'];
}
```

**Features**:
- Markdown rendering with syntax highlighting
- Context menu with message actions
- Code block handling with copy functionality
- Message editing and alternatives
- Bookmark integration
- Agent-specific styling
- Responsive design

#### MessageInput.tsx
**Description**: Primary input component for user messages with attachment support and keyboard shortcuts.

**Props**:
```typescript
interface MessageInputProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**Features**:
- Text input with auto-resize
- Image attachment support (up to 4MB)
- Keyboard shortcuts (Enter/Ctrl+Enter)
- File validation and error handling
- Integration with ActionToolbar
- Loading state management
- Custom SendIconV2 component

#### PlanDisplay.tsx
**Description**: Specialized component for displaying multi-step AI-generated plans with progress tracking.

**Props**:
```typescript
interface PlanDisplayProps {
  plan: Plan;
  onStepComplete?: (stepId: string) => void;
  showProgress?: boolean;
}
```

**Features**:
- Step-by-step plan visualization
- Progress tracking
- Interactive step completion
- Collapsible sections

### Modal Components

#### SettingsModal.tsx
**Description**: Comprehensive settings panel for application configuration and agent management.

**Features**:
- API key management with secure input
- Global preferences (sound, shortcuts, etc.)
- Data management (export/import)
- Long-term memory editing
- Agent manager configuration
- Individual agent settings
- Tabbed interface organization

#### ConversationSettingsModal.tsx
**Description**: Settings specific to the currently active conversation.

**Features**:
- Conversation-specific preferences
- Agent selection for conversation
- Feature flag toggles
- Conversation metadata editing

#### HistoryModal.tsx
**Description**: Displays AI-generated conversation summaries and topic analysis.

**Features**:
- Conversation summary display
- Topic extraction and display
- Timeline visualization
- Export functionality

#### CognitiveInspectorModal.tsx
**Description**: Advanced workflow visualizer showing the AI's step-by-step reasoning process.

**Features**:
- Step-by-step process visualization
- Decision tree display
- Performance metrics
- Debug information

#### TeamGeneratorModal.tsx
**Description**: Wizard interface for generating new teams of AI agents with specific expertise.

**Features**:
- Multi-step agent generation process
- Goal-based agent creation
- Expertise area selection
- Agent personality configuration

### Form & Input Components

#### ToggleSwitch.tsx
**Description**: Reusable toggle switch component with label and description support.

**Props**:
```typescript
interface ToggleSwitchProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}
```

**Features**:
- Accessible switch implementation
- Smooth animations and transitions
- Focus management and keyboard navigation
- Custom styling with glassmorphism
- ARIA compliance

#### SecureInput.tsx
**Description**: Specialized input component for sensitive data like API keys.

**Props**:
```typescript
interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showToggle?: boolean;
}
```

**Features**:
- Password-style input masking
- Show/hide toggle functionality
- Secure data handling
- Validation feedback

#### FancySwitch.tsx
**Description**: Enhanced switch component with advanced styling and animations.

**Features**:
- Custom animations
- Multiple visual states
- Advanced accessibility features

### Action & Utility Components

#### ActionToolbar.tsx
**Description**: Toolbar component providing quick actions for message composition.

**Props**:
```typescript
interface ActionToolbarProps {
  onAttachClick: () => void;
  onFormatClick?: () => void;
  disabled?: boolean;
}
```

**Features**:
- Attachment button integration
- Format options
- Keyboard shortcut hints
- Responsive design

#### GlassIconButton.tsx
**Description**: Icon button component with glassmorphism styling and hover effects.

**Props**:
```typescript
interface GlassIconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

**Features**:
- Glassmorphism visual design
- Hover and focus effects
- Multiple variants
- Accessibility support

#### Spinner.tsx
**Description**: Loading spinner component with customizable appearance.

**Props**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

**Features**:
- Multiple size options
- Customizable colors
- CSS-based animations
- Glassmorphism integration

### Icon Components (50+ Icons)

The project includes a comprehensive icon library in `components/icons/` with 50+ custom icon components:

#### Core Icons
- **AlignLeftIcon.tsx** - Text alignment icon
- **ApiUsageGlassIcon.tsx** - API usage indicator with glassmorphism
- **AttachmentIcon.tsx** - File attachment icon
- **BookmarkIcon.tsx** - Bookmark management icon

#### Action Icons
- **CopyIcon.tsx** - Copy to clipboard functionality
- **EditIcon.tsx** - Edit mode toggle
- **DeleteIcon.tsx** - Delete/remove actions
- **SendIcon.tsx** - Message sending actions

#### Status Icons
- **LoadingIcon.tsx** - Loading state indicators
- **SuccessIcon.tsx** - Success confirmation
- **ErrorIcon.tsx** - Error state display
- **WarningIcon.tsx** - Warning notifications

#### Navigation Icons
- **ArrowUpIcon.tsx** - Scroll to top functionality
- **ArrowDownIcon.tsx** - Scroll to bottom functionality
- **MenuIcon.tsx** - Navigation menu toggle
- **CloseIcon.tsx** - Modal and panel closing

### Specialized Components

#### AgentCardV2.tsx
**Description**: Enhanced agent display card with gradient backgrounds and status indicators.

**Features**:
- Agent avatar and name display
- Status indicators
- Gradient color schemes
- Interactive hover effects

#### AgentPowerButton.tsx
**Description**: Specialized button for agent activation/deactivation.

**Features**:
- Power state visualization
- Smooth state transitions
- Status feedback

#### SidebarBeacon.tsx
**Description**: Visual indicator for sidebar presence and activity.

**Features**:
- Pulsing animation
- Status-based colors
- Responsive positioning

#### SidebarToggler.tsx
**Description**: Toggle button for sidebar visibility control.

**Features**:
- Smooth slide animations
- Keyboard accessibility
- Mobile-responsive design

#### TopicDivider.tsx
**Description**: Visual separator for conversation topics with metadata.

**Features**:
- Topic identification
- Timestamp display
- Visual hierarchy

## Component Architecture Patterns

### 1. Props Interface Pattern
All components follow consistent TypeScript interface patterns:
```typescript
interface ComponentNameProps {
  // Required props
  requiredProp: Type;
  // Optional props with defaults
  optionalProp?: Type;
  // Event handlers
  onEvent?: (param: Type) => void;
}
```

### 2. Context Integration Pattern
Components access shared state through the `useAppContext()` hook:
```typescript
const { stateValue, handlerFunction } = useAppContext();
```

### 3. Styling Pattern
Components use Tailwind CSS classes with custom CSS variables:
```typescript
<div className="glass-pane rounded-xl p-4 border border-white/10">
```

### 4. Accessibility Pattern
All interactive components include proper ARIA attributes:
```typescript
<button
  role="switch"
  aria-checked={enabled}
  aria-label="Toggle feature"
>
```

### 5. Error Handling Pattern
Components handle errors gracefully with user feedback:
```typescript
{error && (
  <p className="text-red-400 text-sm">{error}</p>
)}
```

## Usage Examples

### Basic Component Usage
```typescript
import { ToggleSwitch } from './components/ToggleSwitch';

function SettingsSection() {
  const [featureEnabled, setFeatureEnabled] = useState(false);

  return (
    <ToggleSwitch
      label="Enable Feature"
      description="This feature provides additional functionality"
      enabled={featureEnabled}
      onChange={setFeatureEnabled}
    />
  );
}
```

### Message Input with Attachment
```typescript
import { MessageInput } from './components/MessageInput';

function ChatInterface() {
  const handleSendMessage = (text: string, attachment?: Attachment) => {
    // Handle message sending logic
  };

  return (
    <MessageInput
      onSendMessage={handleSendMessage}
      placeholder="Type your message..."
    />
  );
}
```

### Modal Integration
```typescript
import { SettingsModal } from './components/SettingsModal';

function App() {
  const { isSettingsOpen, setIsSettingsOpen } = useAppContext();

  return (
    <>
      <button onClick={() => setIsSettingsOpen(true)}>
        Open Settings
      </button>
      {isSettingsOpen && <SettingsModal />}
    </>
  );
}
```

## Component Integration Guidelines

### 1. State Management
- Use `useAppContext()` for shared state
- Prefer local state for component-specific data
- Follow the established state update patterns

### 2. Styling Consistency
- Use established CSS custom properties
- Follow the glassmorphism design system
- Maintain responsive design principles

### 3. Accessibility Standards
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

### 4. Performance Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Consider virtualization for large lists
- Optimize re-renders with useMemo/useCallback

### 5. Error Handling
- Provide user-friendly error messages
- Implement graceful degradation
- Include fallback states
- Log errors appropriately

## Testing Considerations

### Component Testing Strategy
- Unit tests for individual component logic
- Integration tests for component interactions
- Accessibility testing with automated tools
- Visual regression testing for styling changes

### Test Patterns
```typescript
describe('ToggleSwitch', () => {
  it('renders with correct label', () => {
    // Test implementation
  });

  it('calls onChange when clicked', () => {
    // Test implementation
  });

  it('has correct ARIA attributes', () => {
    // Accessibility test
  });
});
```

This component library provides a solid foundation for building complex, interactive user interfaces while maintaining consistency, accessibility, and performance standards throughout the Monica application.