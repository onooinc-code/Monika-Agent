# Styling System

## Overview

Monica's visual identity is built on a sophisticated "Future World" aesthetic that combines cutting-edge design principles with practical usability. The styling system leverages a hybrid approach using Tailwind CSS for utility-first styling combined with custom CSS for advanced visual effects and theming.

## Core Technologies

### Tailwind CSS
- **Utility-First Approach**: Rapid development with consistent design tokens
- **Responsive Design**: Mobile-first responsive utilities
- **Custom Configuration**: Extended with project-specific design tokens

### Custom CSS Architecture
- **Organized Structure**: Modular CSS organization by concern
- **CSS Variables**: Centralized theming system
- **Advanced Effects**: Glassmorphism, animations, and visual enhancements

## "Future World" Aesthetic

### Design Philosophy
The "Future World" aesthetic creates an immersive, futuristic interface that feels both cutting-edge and accessible. Key principles include:

- **Glassmorphism**: Translucent panels with backdrop blur effects
- **Neon Accents**: Subtle glows and highlights for interactive elements
- **Dark Mode First**: Deep backgrounds with strategic light elements
- **Micro-interactions**: Smooth transitions and hover effects
- **Depth & Layering**: Visual hierarchy through transparency and shadows

### Visual Language
```css
/* Core aesthetic variables */
:root {
  --color-bg: #0a0a0f;           /* Deep space background */
  --color-pane: rgba(23, 26, 43, 0.7);  /* Translucent panels */
  --color-border: rgba(129, 140, 248, 0.2);  /* Subtle borders */
  --color-neon-indigo: rgba(129, 140, 248, 1);  /* Primary accent */
  --color-neon-cyan: rgba(34, 211, 238, 1);     /* Secondary accent */
}
```

## CSS Architecture

### Directory Structure
```
styles/
├── main.css                    # Main stylesheet entry point
├── animations/                 # Animation systems
│   ├── classes.css            # Animation utility classes
│   ├── keyframes.css          # Keyframe definitions
│   └── sidebar.css            # Sidebar-specific animations
├── components/                 # Component-specific styles
│   ├── card-styles.css        # Card component styling
│   ├── context-menu.css       # Context menu styling
│   ├── header.css             # Header component styling
│   ├── message-input.css      # Message input styling
│   ├── modal.css              # Modal system styling
│   └── switch.css             # Switch component styling
├── layout/                     # Layout utilities
│   ├── background.css         # Background effects
│   ├── effects.css            # Visual effects
│   └── scrollbar.css          # Custom scrollbar styling
└── utilities/                  # Utility classes
    ├── prose-agent.css        # Agent message prose styling
    └── prose-user.css         # User message prose styling
```

### CSS Organization Patterns

#### 1. Main Entry Point
```css
/* styles/main.css */
@import './animations/keyframes.css';
@import './animations/classes.css';
@import './layout/background.css';
@import './layout/effects.css';
/* Component-specific imports */
```

#### 2. Component-Specific Styling
```css
/* styles/components/modal.css */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}

.modal-content {
  @apply glass-pane rounded-xl border border-white/10;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

#### 3. Animation Systems
```css
/* styles/animations/keyframes.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes animated-gradient-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## Glassmorphism Implementation

### Core Glass Pane Class
```css
.glass-pane {
  background-color: var(--color-pane);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border);
}
```

### Usage Examples
```tsx
// Basic glassmorphism panel
<div className="glass-pane rounded-xl p-6">
  <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
  {/* Content */}
</div>

// Enhanced with hover effects
<div className="glass-pane rounded-xl p-6 transition-all duration-300 hover:bg-white/5">
  <h2 className="text-xl font-semibold text-white mb-4">Interactive Panel</h2>
  {/* Content */}
</div>
```

### Glassmorphism Variants
```css
/* Subtle glass effect */
.glass-pane-subtle {
  background-color: rgba(23, 26, 43, 0.4);
  backdrop-filter: blur(8px) saturate(120%);
}

/* Strong glass effect */
.glass-pane-strong {
  background-color: rgba(23, 26, 43, 0.9);
  backdrop-filter: blur(24px) saturate(200%);
}
```

## Animation System

### Keyframe Definitions
```css
/* Fade in with upward movement */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Animated gradient backgrounds */
@keyframes animated-gradient-bg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Animated gradient text */
.header-title {
  background-size: 200% 200%;
  animation: animated-gradient-text 5s ease infinite;
}
```

### Animation Utility Classes
```css
/* Smooth transitions */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover lift effect */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Glow on hover */
.glow-on-hover {
  transition: box-shadow 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(129, 140, 248, 0.3);
}
```

## Typography System

### Font Variables
```css
:root {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}
```

### Prose Styling
```css
/* Documentation prose styling */
.prose-docs h1 {
  color: var(--color-neon-cyan);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.prose-docs h2 {
  color: #fff;
}

.prose-docs h3 {
  color: #e5e7eb;
}

.prose-docs strong {
  color: #c7d2fe;
  font-weight: 600;
}

.prose-docs a {
  color: #a5b4fc;
  text-decoration: underline;
  text-decoration-color: var(--color-border);
  transition: color 0.2s, text-shadow 0.2s;
}

.prose-docs a:hover {
  color: var(--color-neon-cyan);
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}
```

### Message-Specific Typography
```css
/* Agent message styling */
.prose-agent {
  color: #e5e7eb;
}

.prose-agent strong {
  color: #c7d2fe;
}

/* User message styling */
.prose-user {
  color: #f3f4f6;
}

.prose-user strong {
  color: #fff;
}
```

## Component Styling Patterns

### Modal System
```css
/* Modal overlay with backdrop blur */
#modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

#modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

/* Modal content with glassmorphism */
#modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
  pointer-events: none;
}

#modal-content.open {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}
```

### Custom Scrollbar
```css
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.6);
}
```

### Responsive Design
```css
/* Mobile-first responsive patterns */
@media (max-width: 768px) {
  .docs-header {
    top: 0.5rem;
    width: calc(100% - 1rem);
    padding: 0.5rem;
  }

  .docs-header h1 {
    font-size: 1.25rem;
  }

  .docs-main {
    padding-top: calc(3.5rem + var(--zoom-level) * 1rem);
  }

  #nav-modal {
    width: 90vw;
  }
}
```

## Usage Guidelines

### Best Practices

#### 1. Consistent Glassmorphism Usage
```tsx
// ✅ Good: Consistent glassmorphism
<div className="glass-pane rounded-xl p-6 border border-white/10">
  <h3 className="text-lg font-semibold text-white mb-4">Card Title</h3>
  <p className="text-gray-300">Card content with proper contrast</p>
</div>

// ❌ Avoid: Inconsistent transparency
<div style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
  <h3>Poor contrast</h3>
</div>
```

#### 2. Animation Performance
```tsx
// ✅ Good: Hardware-accelerated animations
<div className="transition-all duration-300 ease-out transform hover:scale-105">
  Smooth animation
</div>

// ❌ Avoid: Expensive animations
<div className="transition-all duration-1000 ease-in-out">
  Heavy animation
</div>
```

#### 3. Responsive Typography
```tsx
// ✅ Good: Scalable typography
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive heading
</h1>

// ❌ Avoid: Fixed sizing
<h1 style={{fontSize: '24px'}}>
  Fixed size heading
</h1>
```

### Color Palette Usage
```css
/* Primary accents */
--color-neon-indigo: rgba(129, 140, 248, 1);  /* Interactive elements */
--color-neon-cyan: rgba(34, 211, 238, 1);     /* Highlights & CTAs */

/* Semantic colors */
--color-success: rgba(34, 197, 94, 1);        /* Success states */
--color-warning: rgba(245, 158, 11, 1);       /* Warning states */
--color-error: rgba(239, 68, 68, 1);          /* Error states */
```

### Accessibility Considerations
```css
/* Ensure sufficient contrast */
.glass-pane {
  background-color: var(--color-pane);
  border: 1px solid var(--color-border);
}

/* Focus indicators */
.focus-visible {
  outline: 2px solid var(--color-neon-cyan);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
  }
}
```

## Performance Optimization

### CSS Optimization Strategies
```css
/* Use specific selectors to reduce specificity conflicts */
.glass-pane {
  /* Specific glassmorphism styles */
}

.header-title {
  /* Specific header styles */
}

/* Avoid deep nesting when possible */
.nested .deep .selector {
  /* Use sparingly */
}
```

### Animation Performance
```css
/* Use transform and opacity for smooth animations */
.smooth-animation {
  transition: transform 0.3s ease, opacity 0.2s ease;
}

/* Avoid animating layout-affecting properties */
.layout-animation {
  /* transition: width, height, margin, padding; /* Avoid these */
}
```

## Integration Examples

### Component Integration
```tsx
import { useState } from 'react';

export const GlassCard: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        glass-pane rounded-xl p-6 border border-white/10
        transition-all duration-300 cursor-pointer
        ${isHovered ? 'bg-white/5 transform scale-105' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};
```

### Theming Integration
```tsx
// Custom theme hook
export const useTheme = () => {
  return {
    colors: {
      background: 'var(--color-bg)',
      pane: 'var(--color-pane)',
      accent: 'var(--color-neon-cyan)',
    },
    animations: {
      fadeInUp: 'animate-fade-in-up',
      smooth: 'transition-smooth',
    }
  };
};
```

This styling system provides a comprehensive foundation for creating visually stunning, accessible, and performant user interfaces that maintain the "Future World" aesthetic while ensuring excellent user experience across all devices and interaction modes.