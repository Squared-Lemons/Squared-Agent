# Canvas Panel Navigation System - Implementation Guide

## Overview

The Canvas Panel Navigation System is a horizontal, infinite-scrolling navigation pattern that enables cross-entity navigation without page transitions. It provides a multi-panel interface where users can open, view, and navigate between related entities in a seamless, context-preserving experience.

**Key Principle:** Entities are displayed in resizable panels arranged horizontally. Users can navigate between related entities (e.g., from a testimonial to its associated event) by opening new panels, while maintaining the navigation context. The system supports URL synchronization, keyboard navigation, and unsaved changes tracking.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Concepts](#core-concepts)
3. [Component Structure](#component-structure)
4. [Implementation Guide](#implementation-guide)
5. [Patterns and Best Practices](#patterns-and-best-practices)
6. [Visual Layout](#visual-layout)
7. [API Reference](#api-reference)
8. [Migration Guide](#migration-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANVAS NAVIGATION SYSTEM                            │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                      CanvasProvider                                 │     │
│  │  ┌──────────────────────────────────────────────────────────────┐  │     │
│  │  │  State Management:                                            │  │     │
│  │  │  • Panel stack (array of PanelState)                          │  │     │
│  │  │  • Active panel ID                                            │  │     │
│  │  │  • URL synchronization (query params)                          │  │     │
│  │  │  • Panel lifecycle (open/close/activate)                       │  │     │
│  │  └──────────────────────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                          │
│                                    ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    CanvasContainer                                 │     │
│  │  ┌──────────────────────────────────────────────────────────────┐  │     │
│  │  │  Horizontal Scroll Container:                                 │  │     │
│  │  │  • Keyboard navigation (Arrow keys, Home/End)                 │  │     │
│  │  │  • Auto-scroll to active panel                                │  │     │
│  │  │  • Panel layout (flex, horizontal)                            │  │     │
│  │  └──────────────────────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                          │
│                                    ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                        Panel Stack                                 │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │     │
│  │  │  Panel 1 │→ │  Panel 2 │→ │  Panel 3 │→ │  Panel 4 │→ ...     │     │
│  │  │  (List)  │  │  Entity  │  │  Entity  │  │  Entity  │          │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │     │
│  │     (fixed)      (closable)    (closable)    (closable)           │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                          │
│                                    ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                      BasePanel (wrapper)                           │     │
│  │  • Header (badge, title, actions)                                  │     │
│  │  • Content area                                                    │     │
│  │  • Resize handle                                                   │     │
│  │  • Save/Delete/Preview buttons                                     │     │
│  │  • Unsaved changes dialog                                          │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                          │
│                                    ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │              Entity Panel Wrappers                                 │     │
│  │  • EntityPanelEvent, EntityPanelTestimonial, etc.                  │     │
│  │  • Manages save/dirty state                                        │     │
│  │  • Provides navigation callbacks                                   │     │
│  │  • Wraps entity editors                                            │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Panel State

A **Panel** represents a single view in the canvas navigation system. Each panel has:

```typescript
interface PanelState {
  id: string                    // Unique panel identifier
  entityType: EntityType        // Type of entity displayed
  entityId?: string             // Entity identifier (optional for list panels)
  parentPanelId?: string        // ID of parent panel (for navigation tree)
  title?: string                // Display title (optional, defaults to entity name)
}
```

**Panel Types:**
- **List Panel**: Root panel showing a list of entities (cannot be closed)
- **Entity Panel**: Detail panel showing a single entity (can be closed)

### 2. Entity Types

Entity types define what kind of content can be displayed in a panel:

```typescript
type EntityType = 
  | 'list'                    // List view (root panel)
  | 'event'                   // Event entity
  | 'venue'                   // Venue entity
  | 'series'                  // Series entity
  | 'package'                 // Package entity
  | 'talent'                  // Talent entity
  | 'faq'                     // FAQ entity
  | 'testimonial'             // Testimonial entity
  | 'brand_quote'             // Brand quote entity
  | 'page'                    // Page entity
  | 'merch_group'             // Merchandising group
  | 'merch_campaign'          // Merchandising campaign
  | 'merch_output_type'       // Merchandising output type
  | 'content_template'        // Content template
  | 'block_type'              // Block type
  | 'page_context'            // Page context
  // ... add custom entity types as needed
```

Each entity type should have:
- A unique identifier
- A display label
- A color-coded badge (for visual distinction)
- Associated editor component
- Panel wrapper component

### 3. Navigation Flow

```
User Action: Click entity in list
    ↓
openPanel(entityType, entityId, fromPanelId, title)
    ↓
Create new PanelState
    ↓
Add to panels array (removing panels after fromPanelId)
    ↓
Set as active panel
    ↓
Scroll to new panel
    ↓
Update URL query params
```

**Key Behaviors:**
- Opening a new panel from an existing panel removes all panels after the source panel
- If the same entity is already open, activate the existing panel instead of creating a duplicate
- List panel (index 0) cannot be closed
- Panel state is serialized to URL for sharing/bookmarking

### 4. URL Synchronization

Panel state is stored in URL query parameters for:
- Browser back/forward navigation support
- Shareable/bookmarkable URLs
- Page refresh state restoration

**Format:** `?panels=entityType:id,entityType:id,...`

**Example:**
```
/testimonials?panels=testimonial:abc123,event:xyz789
```

**Serialization:**
- List panels: `list` (no ID)
- Entity panels: `entityType:entityId`
- Multiple panels: comma-separated

---

## Component Structure

### 1. CanvasProvider

**Purpose:** Context provider that manages panel state and provides navigation functions.

**Location:** `components/canvas/canvas-context.tsx`

**Key Features:**
- Panel state management (array of PanelState)
- Active panel tracking
- URL synchronization (serialize/deserialize)
- Panel lifecycle functions (open, close, activate)
- Scroll container registration

**Exports:**
```typescript
// Context hook
export function useCanvas(): CanvasContextValue

// Navigation hook (scoped to panel)
export function usePanelNavigation(panelId: string): NavigateCallback

// Types
export type EntityType = ...
export type PanelState = ...
export type NavigateCallback = (entityType: EntityType, entityId: string, title?: string) => void
```

**Context Value:**
```typescript
interface CanvasContextValue {
  panels: PanelState[]
  activePanelId: string | null
  openPanel: (entityType: EntityType, entityId?: string, fromPanelId?: string, title?: string) => void
  closePanel: (panelId: string) => void
  closePanelsAfter: (panelId: string) => void
  setActivePanel: (panelId: string) => void
  scrollToPanel: (panelId: string) => void
  registerScrollRef: (ref: HTMLDivElement | null) => void
  getPanelIndex: (panelId: string) => number
  getScrollContainer: () => HTMLDivElement | null
}
```

### 2. CanvasContainer

**Purpose:** Horizontal scroll container that renders panels and handles keyboard navigation.

**Location:** `components/canvas/canvas-container.tsx`

**Features:**
- Horizontal scrolling layout
- Keyboard navigation (Arrow Left/Right, Home/End)
- Auto-scroll to active panel
- Scroll container registration with context

**Keyboard Shortcuts:**
- `Arrow Left`: Focus previous panel
- `Arrow Right`: Focus next panel
- `Home`: Focus first panel
- `End`: Focus last panel

**Optional:** CanvasBreadcrumbs component for navigation path display

### 3. BasePanel

**Purpose:** Base wrapper component for all panels with header, controls, and resize functionality.

**Location:** `components/canvas/base-panel.tsx`

**Props:**
```typescript
interface BasePanelProps {
  panelId: string
  entityType: EntityType
  title?: string
  showClose?: boolean              // Show close button (default: true)
  showBack?: boolean               // Show back button (default: false)
  children: ReactNode
  className?: string
  width?: number                   // Initial width (default: 960px)
  minWidth?: number                // Min width (default: 320px)
  maxWidth?: number                // Max width (default: 1600px)
  resizable?: boolean              // Allow resizing (default: true)
  headerActions?: ReactNode        // Custom header actions
  onClose?: () => void
  onWidthChange?: (width: number) => void
  hasUnsavedChanges?: boolean      // Track dirty state
  onSave?: () => Promise<void>     // Save callback
  isSaving?: boolean               // Saving state
  entityId?: string                // For review badges
  orgSlug?: string                 // For review links
  onDelete?: () => Promise<void>   // Delete callback
  previewUrl?: string | null       // Preview URL
}
```

**Features:**
- Header with entity type badge (color-coded)
- Title display
- Back button (closes panel)
- Close button (X)
- Save button (when `onSave` provided, highlights when `hasUnsavedChanges`)
- Delete button (when `onDelete` provided, disabled when `hasUnsavedChanges`)
- Preview button (when `previewUrl` provided)
- Review badge (when `entityId` provided)
- Resize handle (right edge, drag to resize)
- Unsaved changes confirmation dialog
- Active state styling (shadow, border highlight)
- Focus management

**Default Styling (REQUIRED):**
Panels must include these base styles out of the box:
```tsx
// Panel container defaults
className="p-4 gap-4 rounded-lg shadow border bg-background"

// Active panel indicator (ring on focus)
className={cn(
  "rounded-lg shadow border bg-background",
  isActive && "ring-2 ring-primary ring-offset-2"
)}
```

| Style | Value | Purpose |
|-------|-------|---------|
| Padding | `p-4` | Internal spacing |
| Gap | `gap-4` | Spacing between children |
| Border radius | `rounded-lg` | Consistent rounded corners |
| Shadow | `shadow` | Depth/elevation |
| Border | `border` | Visual boundary |
| Active ring | `ring-2 ring-primary` | Focus indicator |

**Entity Type Configuration:**
Each entity type needs configuration in `entityTypeConfig`:
```typescript
const entityTypeConfig: Record<EntityType, { label: string; color: string }> = {
  list: { label: 'List', color: 'bg-slate-500' },
  event: { label: 'Event', color: 'bg-blue-500' },
  venue: { label: 'Venue', color: 'bg-emerald-500' },
  // ... add all entity types
}
```

### 4. EntityPanelList

**Purpose:** Root list panel wrapper (cannot be closed).

**Location:** `components/canvas/entity-panel-list.tsx`

**Props:**
```typescript
interface EntityPanelListProps {
  panelId: string
  title?: string                   // Default: 'List'
  children: ReactNode
  width?: number                   // Default: 1040px
  headerActions?: ReactNode        // Custom header actions
}
```

**Usage:**
Wraps list tables/components. Always rendered as the first panel (index 0).

### 5. Entity Panel Wrappers

**Purpose:** Entity-specific wrapper components that handle save/dirty state and navigation.

**Location:** `components/canvas/entity-panel-[entity].tsx`

**Pattern:**
```typescript
export function EntityPanel[Entity]({
  panelId,
  entityId,
  organizationSlug,
  title,
  onUpdate,
  onDelete,
}: EntityPanel[Entity]Props) {
  const navigate = usePanelNavigation(panelId)
  const { closePanel } = useCanvas()
  const editorRef = useRef<[Entity]EditorHandle>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Handle save
  const handleSave = useCallback(async () => {
    if (editorRef.current) {
      setIsSaving(true)
      try {
        await editorRef.current.save()
        setHasUnsavedChanges(false)
      } finally {
        setIsSaving(false)
      }
    }
  }, [])

  // Handle dirty state
  const handleDataChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges)
  }, [])

  // Handle delete
  const handleDelete = useCallback(async () => {
    // Delete logic
    closePanel(panelId)
  }, [entityId, closePanel, panelId])

  return (
    <BasePanel
      panelId={panelId}
      entityType="[entity]"
      title={title}
      showClose={true}
      showBack={true}
      width={1040}
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      isSaving={isSaving}
      entityId={entityId}
      orgSlug={organizationSlug}
      onDelete={handleDelete}
    >
      <[Entity]Editor
        ref={editorRef}
        entityId={entityId}
        onClose={handleClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
        showHeader={false}
        onDataChange={handleDataChange}
        onNavigate={navigate}
      />
    </BasePanel>
  )
}
```

**Key Responsibilities:**
- Create navigation callback using `usePanelNavigation(panelId)`
- Manage `hasUnsavedChanges` and `isSaving` state
- Expose editor's `save()` method via ref
- Track dirty state via `onDataChange` callback
- Pass `onNavigate` to editor for cross-entity navigation
- Handle delete operations
- Wrap editor with `showHeader={false}`

---

## Implementation Guide

### Step 1: Set Up Core Components

1. **Create Canvas Context:**
   - Create `components/canvas/canvas-context.tsx`
   - Implement `CanvasProvider` component
   - Implement `useCanvas()` hook
   - Implement `usePanelNavigation()` hook
   - Define `EntityType` union type
   - Define `PanelState` interface
   - Implement URL serialization/deserialization

2. **Create Canvas Container:**
   - Create `components/canvas/canvas-container.tsx`
   - Implement `CanvasContainer` component
   - Add keyboard navigation handlers
   - Register scroll container ref with context

3. **Create Base Panel:**
   - Create `components/canvas/base-panel.tsx`
   - Implement `BasePanel` component
   - Add entity type configuration
   - Implement resize functionality
   - Implement unsaved changes dialog
   - Add header with badges, buttons, actions

4. **Create Entity Panel List:**
   - Create `components/canvas/entity-panel-list.tsx`
   - Simple wrapper around `BasePanel` with `entityType="list"`

### Step 2: Define Entity Types

1. **Add to EntityType union:**
```typescript
export type EntityType = 'list' | 'your_entity_type' | ...
```

2. **Add to entityTypeConfig:**
```typescript
const entityTypeConfig: Record<EntityType, { label: string; color: string }> = {
  // ... existing types
  your_entity_type: { label: 'Your Entity', color: 'bg-purple-500' },
}
```

### Step 3: Create Entity Panel Wrapper

1. **Create wrapper component:**
   - Create `components/canvas/entity-panel-[entity].tsx`
   - Follow the pattern outlined in "Entity Panel Wrappers" section
   - Import and use your entity editor component

2. **Export from index:**
```typescript
// components/canvas/index.ts
export { EntityPanel[Entity] } from './entity-panel-[entity]'
```

### Step 4: Update Editor Component

Editor components must support canvas integration:

1. **Add forwardRef with useImperativeHandle:**
```typescript
export interface [Entity]EditorHandle {
  save: () => Promise<void>
}

export const [Entity]Editor = forwardRef<[Entity]EditorHandle, [Entity]EditorProps>(
  (props, ref) => {
    // ... component implementation

    useImperativeHandle(ref, () => ({
      save: async () => {
        // Save logic
      }
    }), [/* dependencies */])

    // ...
  }
)
```

2. **Add props:**
```typescript
interface [Entity]EditorProps {
  // ... existing props
  showHeader?: boolean                      // Default: true, set to false in canvas
  onDataChange?: (hasChanges: boolean) => void
  onNavigate?: NavigateCallback
}
```

3. **Conditionally render header:**
```typescript
{showHeader !== false && (
  <div className="header">
    {/* Header content */}
  </div>
)}
```

4. **Track changes and call onDataChange:**
```typescript
useEffect(() => {
  const hasChanges = /* determine if form has changes */
  onDataChange?.(hasChanges)
}, [formValues, onDataChange])
```

5. **Use onNavigate for cross-entity links:**
```typescript
// Instead of:
router.push(`/events/${eventId}`)

// Use:
onNavigate?.('event', eventId, eventName)
```

6. **Implement proper scrolling for tabbed editors:**
See "Tabbed Editor Scrolling Pattern" section below.

### Step 5: Implement Page with Canvas Navigation

1. **Wrap page with CanvasProvider:**
```typescript
export default function [Entity]Page() {
  return (
    <CanvasProvider>
      <[Entity]CanvasContent />
    </CanvasProvider>
  )
}
```

2. **Create canvas content component:**
```typescript
function [Entity]CanvasContent() {
  const { panels, openPanel } = useCanvas()
  
  // Handle entity selection
  const handleEntitySelect = useCallback((entityId: string) => {
    const listPanelId = panels.find(p => p.entityType === 'list')?.id
    openPanel('[entity]', entityId, listPanelId, entityName)
  }, [openPanel, panels])

  return (
    <CanvasContainer>
      {panels.map((panel) => {
        switch (panel.entityType) {
          case 'list':
            return (
              <EntityPanelList
                key={panel.id}
                panelId={panel.id}
                title="[Entities]"
              >
                {/* List component */}
              </EntityPanelList>
            )
          
          case '[entity]':
            return panel.entityId ? (
              <EntityPanel[Entity]
                key={panel.id}
                panelId={panel.id}
                entityId={panel.entityId}
                title={panel.title}
              />
            ) : null
          
          // Add cases for all navigable entity types
          case 'event':
            return panel.entityId ? (
              <EntityPanelEvent
                key={panel.id}
                panelId={panel.id}
                eventId={panel.entityId}
                title={panel.title}
              />
            ) : null
          
          default:
            return null
        }
      })}
    </CanvasContainer>
  )
}
```

3. **Add renderPanel function (optional, for complex pages):**
```typescript
const renderPanel = useCallback((panel: PanelState) => {
  switch (panel.entityType) {
    case '[entity]':
      return (
        <EntityPanel[Entity]
          key={panel.id}
          panelId={panel.id}
          entityId={panel.entityId!}
          title={panel.title}
        />
      )
    // ... other cases
    default:
      return null
  }
}, [/* dependencies */])
```

---

## Patterns and Best Practices

### 1. Tabbed Editor Scrolling Pattern

**Critical:** When editors use tabs inside canvas panels, vertical scrolling requires a specific flex chain pattern.

**Problem:** Flex items default to `min-height: auto`, preventing shrinking below content size, which breaks overflow scrolling.

**Solution:** Apply `min-h-0` throughout the flex chain.

**Required Pattern:**
```typescript
<form className="flex-1 flex flex-col min-h-0">
  <Tabs className="flex-1 flex flex-col min-h-0">
    <TabsList>
      {/* Tabs */}
    </TabsList>
    <TabsContent
      forceMount
      className="data-[state=inactive]:hidden m-0 flex-1 overflow-hidden"
    >
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Tab content */}
        </div>
      </ScrollArea>
    </TabsContent>
  </Tabs>
</form>
```

**Key Rules:**
1. Every flex container in the chain needs `min-h-0`
2. `forceMount` on TabsContent requires `data-[state=inactive]:hidden` to hide inactive tabs
3. `TabsContent` needs `flex-1 overflow-hidden`
4. Wrap scrollable content in `<ScrollArea className="h-full">`
5. `EntityMediaSlots` and similar components have NO internal scrolling - always wrap in ScrollArea

### 2. Save/Dirty State Pattern

**Editor Responsibilities:**
- Expose `save()` method via `useImperativeHandle`
- Track form state changes
- Call `onDataChange(hasChanges)` when state changes

**Panel Wrapper Responsibilities:**
- Manage `hasUnsavedChanges` state
- Manage `isSaving` state
- Provide `handleSave` that calls editor's `save()`
- Pass state to `BasePanel`

**BasePanel Responsibilities:**
- Show save button (highlighted when `hasUnsavedChanges`)
- Disable save button when `isSaving`
- Show unsaved changes dialog when closing with changes
- Prevent delete when `hasUnsavedChanges`

**Example:**
```typescript
// Editor
useEffect(() => {
  const hasChanges = formValues.name !== originalData.name
  onDataChange?.(hasChanges)
}, [formValues, originalData, onDataChange])

// Panel Wrapper
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
const handleDataChange = useCallback((hasChanges: boolean) => {
  setHasUnsavedChanges(hasChanges)
}, [])

// BasePanel (automatic)
<BasePanel
  hasUnsavedChanges={hasUnsavedChanges}
  onSave={handleSave}
  isSaving={isSaving}
/>
```

### 3. Cross-Entity Navigation Pattern

**Flow:**
1. Panel wrapper creates navigation function: `const navigate = usePanelNavigation(panelId)`
2. Pass to editor: `<Editor onNavigate={navigate} />`
3. Editor calls navigation: `onNavigate?.('entity_type', entityId, entityName)`
4. Parent page's `renderPanel` switch handles the entity type

**Editor Implementation:**
```typescript
// Instead of router navigation:
const handleEventClick = (eventId: string) => {
  router.push(`/events/${eventId}`)
}

// Use canvas navigation:
const handleEventClick = (eventId: string, eventName: string) => {
  onNavigate?.('event', eventId, eventName)
}
```

**Page Implementation:**
```typescript
// Must include cases for all navigable entity types
switch (panel.entityType) {
  case '[entity]':
    return <EntityPanel[Entity] ... />
  case 'event':
    return <EntityPanelEvent ... />
  case 'venue':
    return <EntityPanelVenue ... />
  // ... all navigable types
}
```

### 4. Panel Width Management

**Default Widths:**
- List panel: 1040px
- Entity panels: 960px (configurable)

**Constraints:**
- Minimum: 320px
- Maximum: 1600px
- Resizable: Yes (drag right edge)

**Best Practices:**
- List panels can be wider (more content visible)
- Entity panels should accommodate editor forms comfortably
- Users can resize to preference
- Consider content type when setting defaults

### 5. URL State Management

**Serialization Format:**
```
?panels=entityType:id,entityType:id,...
```

**Rules:**
- List panels: `list` (no ID)
- Entity panels: `entityType:entityId`
- Multiple panels: comma-separated
- Empty/single list panel: no query param

**Implementation:**
- Serialize on panel changes (after initial mount)
- Deserialize on page load
- Use `router.replace()` to avoid history pollution
- Skip initial mount to prevent duplicate URL updates

### 6. Keyboard Navigation

**Supported Keys:**
- `Arrow Left`: Previous panel
- `Arrow Right`: Next panel
- `Home`: First panel
- `End`: Last panel
- `Escape`: Close active panel (if not first)

**Implementation:**
- Handle in `CanvasContainer` (container-level)
- Handle in `BasePanel` (panel-level for Escape)
- Scroll to focused panel
- Focus panel element

---

## Visual Layout

### Initial State (List Panel Only)

```
┌────────────────────────────────────────────────────────────────────┐
│  Canvas Container (horizontal scroll container)                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Panel 1: List Panel (EntityPanelList)                      │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ [List] Entities                        [+ Add] [×]     │  │ │
│  │  │────────────────────────────────────────────────────────│  │ │
│  │  │                                                        │  │ │
│  │  │  Search: [____________]  Filter: [All ▼]             │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │ │
│  │  │  │ Entity List Table                               │  │  │ │
│  │  │  │ • Entity 1                                      │  │  │ │
│  │  │  │ • Entity 2                                      │  │  │ │
│  │  │  │ • Entity 3                                      │  │  │ │
│  │  │  └─────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### After Selecting an Entity (Two Panels)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  Canvas Container (horizontal scroll, can scroll left/right)                            │
│  ┌──────────────────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │  Panel 1: List (cannot close)    │  │  Panel 2: Entity Detail (new panel)        │  │
│  │  ┌────────────────────────────┐  │  │  ┌──────────────────────────────────────┐  │  │
│  │  │ [List] Entities            │  │  │  │ [Entity] Entity Name          [💾]  │  │  │
│  │  │────────────────────────────│  │  │  │ ← Back                            [×]│  │  │
│  │  │                            │  │  │  │──────────────────────────────────────│  │  │
│  │  │  Search: [____________]    │  │  │  │                                      │  │  │
│  │  │                            │  │  │  │  Entity Editor Content                │  │  │
│  │  │  ┌──────────────────────┐ │  │  │  │  ┌────────────────────────────────┐  │  │  │
│  │  │  │ • Entity 1 (selected)│ │  │  │  │  │ Name: Entity Name               │  │  │  │
│  │  │  │ • Entity 2           │ │  │  │  │  │ Description: ...                │  │  │  │
│  │  │  │ • Entity 3           │ │  │  │  │  │                                  │  │  │  │
│  │  │  └──────────────────────┘ │  │  │  │  │ [Linked Entity: Click →]        │  │  │  │
│  │  └────────────────────────────┘  │  │  │  └────────────────────────────────┘  │  │  │
│  └──────────────────────────────────┘  │  └──────────────────────────────────────┘  │  │
│                                         │  ║ (resize handle)                        │  │
└─────────────────────────────────────────┴────────────────────────────────────────────┘
```

### Cross-Entity Navigation (Three Panels)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Canvas Container                                                                                      │
│  ┌───────────────┐  ┌──────────────────────┐  ┌─────────────────────────────────────────────────┐  │
│  │ Panel 1: List │  │ Panel 2: Entity A    │  │ Panel 3: Entity B (navigated from Entity A)    │  │
│  │               │  │                      │  │                                                  │  │
│  │ [List]        │  │ [EntityA] Name       │  │ [EntityB] Name                       [💾]  │  │
│  │ Entities      │  │ Details      [💾]   │  │ ← Back                                [×]│  │
│  │               │  │                      │  │──────────────────────────────────────────────│  │
│  │ • Entity A    │  │ Content: ...         │  │                                              │  │
│  │ • Entity B    │  │                      │  │  Entity B Editor Content                     │  │
│  │               │  │ [Entity B: Click →]✓ │  │  • Field 1: Value                           │  │
│  └───────────────┘  └──────────────────────┘  │  • Field 2: Value                           │  │
│                                                └─────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Panel Header Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│ ← [Event] Summer Music Festival  [👁️ Preview] [✓ Reviews] [💾 Save] [🗑️ Delete] [×] │
└────────────────────────────────────────────────────────────────────────┘
 │   │      │                           │            │          │          │        │
 │   │      │                           │            │          │          │        └─ Close button
 │   │      │                           │            │          │          └─ Delete button (red)
 │   │      │                           │            │          └─ Save button (highlighted if unsaved)
 │   │      │                           │            └─ Review badge (if entity has reviews)
 │   │      │                           └─ Preview button (opens in new tab)
 │   │      └─ Title (entity name)
 │   │
 │   └─ Entity type badge (color-coded: Event=blue, Venue=green, etc.)
 │
 └─ Back button (closes this panel, returns to previous)
```

### Active vs Inactive Panel States

**Active Panel:**
- Shadow/border highlight
- Focused state
- Scrolls into view when activated
- Keyboard events handled

**Inactive Panel:**
- No highlight
- Muted appearance
- Can still be clicked to activate

---

## API Reference

### CanvasProvider

**Props:**
```typescript
interface CanvasProviderProps {
  children: ReactNode
  initialPanels?: PanelState[]    // Optional initial panels (overrides URL)
}
```

**Usage:**
```typescript
<CanvasProvider>
  <YourCanvasContent />
</CanvasProvider>
```

### useCanvas Hook

**Returns:**
```typescript
interface CanvasContextValue {
  panels: PanelState[]
  activePanelId: string | null
  openPanel: (entityType: EntityType, entityId?: string, fromPanelId?: string, title?: string) => void
  closePanel: (panelId: string) => void
  closePanelsAfter: (panelId: string) => void
  setActivePanel: (panelId: string) => void
  scrollToPanel: (panelId: string) => void
  registerScrollRef: (ref: HTMLDivElement | null) => void
  getPanelIndex: (panelId: string) => number
  getScrollContainer: () => HTMLDivElement | null
}
```

**Usage:**
```typescript
const { panels, openPanel, closePanel } = useCanvas()
```

### usePanelNavigation Hook

**Signature:**
```typescript
function usePanelNavigation(panelId: string): NavigateCallback

type NavigateCallback = (entityType: EntityType, entityId: string, title?: string) => void
```

**Usage:**
```typescript
const navigate = usePanelNavigation(panelId)
navigate('event', eventId, 'Event Name')
```

### CanvasContainer

**Props:**
```typescript
interface CanvasContainerProps {
  children: ReactNode
  className?: string
}
```

**Usage:**
```typescript
<CanvasContainer>
  {panels.map(panel => (
    <YourPanel key={panel.id} />
  ))}
</CanvasContainer>
```

### BasePanel

See "Component Structure" section for full props interface.

**Usage:**
```typescript
<BasePanel
  panelId={panelId}
  entityType="event"
  title="Event Name"
  hasUnsavedChanges={hasUnsavedChanges}
  onSave={handleSave}
  isSaving={isSaving}
  entityId={entityId}
  onDelete={handleDelete}
>
  {/* Panel content */}
</BasePanel>
```

### EntityPanelList

See "Component Structure" section for props interface.

**Usage:**
```typescript
<EntityPanelList
  panelId={panelId}
  title="Entities"
  width={1040}
  headerActions={<YourActions />}
>
  {/* List component */}
</EntityPanelList>
```

---

## Migration Guide

### Migrating from Split-Panel Layout

**Old Pattern (ResizablePanelGroup):**
```typescript
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={40}>
    {/* List */}
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={60}>
    {/* Editor */}
  </ResizablePanel>
</ResizablePanelGroup>
```

**New Pattern (Canvas):**
```typescript
<CanvasProvider>
  <CanvasContainer>
    <EntityPanelList>
      {/* List */}
    </EntityPanelList>
    {/* Entity panels rendered dynamically */}
  </CanvasContainer>
</CanvasProvider>
```

**Key Changes:**
1. Replace `ResizablePanelGroup` with `CanvasProvider` + `CanvasContainer`
2. List becomes `EntityPanelList` (first panel, cannot close)
3. Editor becomes entity panel wrapper (opens on selection)
4. Multiple entities can be open simultaneously
5. URL synchronization replaces local state

### Migrating Editor Components

**Before:**
```typescript
export function EntityEditor({ entityId, onClose, onUpdate }: Props) {
  // Editor implementation
  return (
    <div>
      <header>Title</header>
      {/* Editor content */}
    </div>
  )
}
```

**After:**
```typescript
export interface EntityEditorHandle {
  save: () => Promise<void>
}

export const EntityEditor = forwardRef<EntityEditorHandle, Props>(
  ({ entityId, onClose, onUpdate, showHeader = true, onDataChange, onNavigate }, ref) => {
    // Track changes
    useEffect(() => {
      onDataChange?.(hasChanges)
    }, [formState, onDataChange])

    // Expose save
    useImperativeHandle(ref, () => ({
      save: async () => {
        // Save logic
      }
    }), [/* deps */])

    return (
      <div>
        {showHeader !== false && <header>Title</header>}
        {/* Editor content */}
        {/* Use onNavigate instead of router.push */}
      </div>
    )
  }
)
```

### Adding Canvas Navigation to Existing Page

1. **Wrap page with CanvasProvider:**
```typescript
export default function Page() {
  return (
    <CanvasProvider>
      <PageContent />
    </CanvasProvider>
  )
}
```

2. **Create canvas content component:**
```typescript
function PageContent() {
  const { panels, openPanel } = useCanvas()
  // ... existing state/logic
  
  const handleEntitySelect = (id: string) => {
    const listPanelId = panels.find(p => p.entityType === 'list')?.id
    openPanel('entity', id, listPanelId)
  }

  return (
    <CanvasContainer>
      {panels.map(panel => {
        switch (panel.entityType) {
          case 'list':
            return (
              <EntityPanelList key={panel.id} panelId={panel.id}>
                {/* Existing list component */}
              </EntityPanelList>
            )
          case 'entity':
            return (
              <EntityPanelEntity
                key={panel.id}
                panelId={panel.id}
                entityId={panel.entityId!}
              />
            )
          default:
            return null
        }
      })}
    </CanvasContainer>
  )
}
```

3. **Create entity panel wrapper:**
   - Follow pattern from "Entity Panel Wrappers" section

4. **Update editor:**
   - Add forwardRef/useImperativeHandle
   - Add showHeader, onDataChange, onNavigate props
   - Update navigation calls

---

## Checklist for Implementation

Use this checklist when implementing canvas navigation for a new entity type:

- [ ] Add entity type to `EntityType` union in `canvas-context.tsx`
- [ ] Add entity type config to `entityTypeConfig` in `base-panel.tsx`
- [ ] Create `EntityPanel[Entity]` wrapper component
- [ ] Export wrapper from `components/canvas/index.ts`
- [ ] Update editor component:
  - [ ] Add `forwardRef` with `useImperativeHandle` exposing `save()`
  - [ ] Add `showHeader?: boolean` prop (default true)
  - [ ] Add `onDataChange?: (hasChanges: boolean) => void` prop
  - [ ] Add `onNavigate?: NavigateCallback` prop
  - [ ] Track changes and call `onDataChange`
  - [ ] Use `onNavigate` for cross-entity links
  - [ ] Implement proper scrolling pattern for tabbed editors
- [ ] Update page component:
  - [ ] Wrap with `CanvasProvider`
  - [ ] Use `CanvasContainer`
  - [ ] Create `EntityPanelList` for list panel
  - [ ] Add `renderPanel` switch cases for entity type
  - [ ] Add cases for all navigable entity types
- [ ] Test:
  - [ ] Panel opens/closes correctly
  - [ ] Navigation between entities works
  - [ ] Save/dirty state tracking works
  - [ ] Unsaved changes dialog appears
  - [ ] URL synchronization works
  - [ ] Keyboard navigation works
  - [ ] Panel resizing works
  - [ ] Browser back/forward works

---

## Summary

The Canvas Panel Navigation System provides a powerful, flexible pattern for managing interconnected entities in admin interfaces. Key benefits:

1. **Context Preservation**: Users can navigate between related entities while maintaining context
2. **URL Synchronization**: Panel state is shareable and bookmarkable
3. **Keyboard Accessible**: Full keyboard navigation support
4. **Flexible Layout**: Resizable panels adapt to content and user preference
5. **State Management**: Built-in unsaved changes tracking and confirmation
6. **Extensible**: Easy to add new entity types

By following this guide, you can implement canvas navigation in any application that needs to manage related entities with a seamless, context-preserving navigation experience.
