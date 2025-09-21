# Repetitive Tasks and Workflows

## Add New AI Agent
**Last performed:** [Not yet performed]
**Files to modify:**
- `constants/agentConstants.ts` - Add new agent to `DEFAULT_AGENTS` array
- `types/agent.ts` - Update `Agent` interface if new properties are needed
- `contexts/hooks/useChatHandler.ts` - Update if the new agent affects chat logic
- `contexts/hooks/useConversationManager.ts` - Update if the new agent affects conversation management

**Steps:**
1. Define agent properties (id, name, job, role, goals, specializations, model, systemInstruction, color, textColor, outputFormat, knowledge, tools)
2. Add agent to DEFAULT_AGENTS array in agentConstants.ts
3. Update TypeScript interfaces if new properties are introduced
4. Test agent creation and functionality in the UI
5. Verify agent appears correctly in agent selection and conversation

**Important notes:**
- Ensure agent ID is unique across all agents
- Choose appropriate color scheme that doesn't conflict with existing agents
- Test systemInstruction with actual API calls to ensure it works correctly
- Consider accessibility when choosing colors (contrast ratios)

## Add New Tool Integration
**Last performed:** [Not yet performed]
**Files to modify:**
- `services/tools/` - Create a new tool file (e.g., `newTool.ts`)
- `services/tools/index.ts` - Export the new tool
- `contexts/hooks/useChatHandler.ts` - Integrate the new tool into the chat handler
- `types/tools.ts` - Add new tool types if necessary

**Steps:**
1. Create tool service file following existing pattern (calculator.ts, weather.ts, etc.)
2. Implement tool function with proper error handling
3. Export tool from tools index file
4. Add tool to agent tools array if it should be available by default
5. Test tool integration with MCP protocol
6. Update documentation if needed

**Important notes:**
- Follow MCP protocol standards for tool implementation
- Include proper error handling and validation
- Consider rate limiting for external API calls
- Test tool with various input scenarios

## Update Component Styling
**Last performed:** [Not yet performed]
**Files to modify:**
- `/styles/components/` - Component-specific CSS files
- `/styles/utilities/` - Utility classes and animations
- `/components/` - Component files if inline styles need updates

**Steps:**
1. Identify component that needs styling updates
2. Check existing CSS structure and naming conventions
3. Update or create component-specific CSS file
4. Test styling across different screen sizes and themes
5. Verify accessibility compliance (contrast, focus states)
6. Update any related utility classes if needed

**Important notes:**
- Follow established CSS architecture patterns
- Use CSS custom properties for theming
- Ensure responsive design principles
- Test with different color schemes and dark/light modes

## Add New Conversation Mode
**Last performed:** [Not yet performed]
**Files to modify:**
- `/types/conversation.ts` - Add new mode to ConversationMode type
- `/contexts/StateProvider.tsx` - Update conversation mode handling
- `/components/` - Update mode selection UI components
- `/services/chat/` - Update chat service logic for new mode

**Steps:**
1. Define new conversation mode in type definitions
2. Update StateProvider to handle new mode
3. Add mode to UI selection components
4. Implement mode-specific logic in chat services
5. Test mode switching and functionality
6. Update documentation and help text

**Important notes:**
- Consider how new mode affects agent selection logic
- Update keyboard shortcuts if needed
- Ensure backward compatibility with existing conversations
- Test edge cases and error scenarios

## Update API Integration
**Last performed:** [Not yet performed]
**Files to modify:**
- `/services/gemini/client.ts` - Update client configuration
- `/constants/agentConstants.ts` - Update model references
- `/types/` - Update model-related types
- `/services/` - Update any model-specific services

**Steps:**
1. Update Gemini client configuration for new API version
2. Update model constants and references
3. Update TypeScript types for new API response format
4. Test API calls with new configuration
5. Update error handling for new API error types
6. Update documentation with new API capabilities

**Important notes:**
- Maintain backward compatibility during transition
- Update API key validation if format changes
- Test with existing conversations to ensure no data loss
- Consider migration strategy for existing users

## Add New Modal Component
**Last performed:** [Not yet performed]
**Files to modify:**
- `/components/` - Create new modal component
- `/contexts/hooks/useModalManager.ts` - Add modal state management
- `/contexts/StateProvider.tsx` - Wire up modal to global state
- `/types/` - Add modal-related types if needed

**Steps:**
1. Create modal component following existing patterns
2. Add modal state to useModalManager hook
3. Wire modal to StateProvider context
4. Add modal to App.tsx component tree
5. Test modal opening, closing, and functionality
6. Update keyboard shortcuts if needed

**Important notes:**
- Follow established modal patterns and animations
- Ensure proper focus management and accessibility
- Test modal behavior on different screen sizes
- Consider mobile-specific interactions

## Update Testing Suite
**Last performed:** [Not yet performed]
**Files to modify:**
- `/src/test-utils.tsx` - Update test utilities
- `/components/*.test.tsx` - Update component tests
- `/services/tests/` - Update service tests
- `package.json` - Update test scripts if needed

**Steps:**
1. Update test utilities for new dependencies or patterns
2. Update component tests for UI changes
3. Update service tests for API changes
4. Run full test suite to ensure no regressions
5. Add new tests for new functionality
6. Update test configuration if needed

**Important notes:**
- Maintain test coverage standards
- Update tests for any breaking changes
- Add integration tests for new features
- Ensure tests run in CI/CD pipeline

## Performance Optimization
**Last performed:** [Not yet performed]
**Files to modify:**
- `/components/` - Optimize component re-renders
- `/hooks/` - Optimize custom hooks
- `/services/` - Optimize API calls and caching
- `/styles/` - Optimize CSS and animations

**Steps:**
1. Identify performance bottlenecks using React DevTools
2. Optimize component re-renders with React.memo and useMemo
3. Implement proper caching strategies for API calls
4. Optimize images and assets
5. Review and optimize bundle size
6. Test performance improvements

**Important notes:**
- Use React DevTools Profiler for performance analysis
- Implement proper loading states for slow operations
- Consider code splitting for large features
- Monitor memory usage in long-running sessions

## Accessibility Improvements
**Last performed:** [Not yet performed]
**Files to modify:**
- `/components/` - Update components for accessibility
- `/styles/` - Update CSS for accessibility compliance
- `/types/` - Add accessibility-related types if needed

**Steps:**
1. Audit components for accessibility compliance
2. Add proper ARIA labels and roles
3. Ensure keyboard navigation works correctly
4. Verify color contrast ratios meet WCAG standards
5. Add screen reader support
6. Test with accessibility tools

**Important notes:**
- Follow WCAG 2.1 AA standards
- Test with screen readers and keyboard-only navigation
- Ensure all interactive elements are accessible
- Consider users with different disabilities

## Database Migration
**Last performed:** [Not yet performed]
**Files to modify:**
- `/database/migrations/` - Create new migration files
- `/services/` - Update services for new schema
- `/types/` - Update types for new data structures
- `/contexts/` - Update state management for new data

**Steps:**
1. Create database migration script
2. Update TypeScript types for new schema
3. Update services to handle new data structure
4. Update state management for new data
5. Test migration with sample data
6. Update documentation

**Important notes:**
- Ensure backward compatibility during migration
- Test migration scripts thoroughly
- Consider data backup strategies
- Plan rollback procedures if needed