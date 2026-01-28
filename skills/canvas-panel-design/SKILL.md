---
name: canvas-panel-design
description: Canvas Panel Navigation System - a horizontal multi-panel UI pattern for admin interfaces and entity management. Use when building list-detail views, admin dashboards, CRM interfaces, or any UI that needs cross-entity navigation without page transitions. Triggers on "canvas panel", "panel navigation", "multi-panel", "list-detail layout", or "horizontal panel" mentions.
---

# Canvas Panel Navigation System

A horizontal, infinite-scrolling navigation pattern that enables cross-entity navigation without page transitions. Entities display in resizable panels arranged horizontally — users open, view, and navigate between related entities while maintaining full context.

## Complementary Skills

This skill works with other available skills. Invoke them at the right stage:

| Skill | When to Invoke | Purpose |
|-------|---------------|---------|
| `frontend-design` | When building panel UI components | Ensures distinctive, production-grade visual design — avoids generic AI aesthetics for panel headers, badges, active states, resize handles |
| `vercel-react-best-practices` | When implementing CanvasProvider, panel rendering, state management | React performance: memoization of panel renders, avoiding waterfalls, proper Suspense boundaries for panel content loading |
| `web-design-guidelines` | When finalizing panel layout and interactions | Accessibility compliance: keyboard navigation, focus management, ARIA attributes for panel roles, screen reader support |
| `better-auth-best-practices` | When panels display auth-gated entities | Auth integration: session-aware panel content, protected entity access |

**Invocation order for new canvas implementations:**
1. `frontend-design` — establish visual direction for the panel system
2. This skill (`canvas-panel-design`) — implement the architecture and components
3. `vercel-react-best-practices` — optimize render performance across panels
4. `web-design-guidelines` — audit accessibility and UX compliance

## When to Apply This Pattern

Apply this pattern when the user needs:
- **List + detail views** where clicking items opens detail panels alongside the list
- **Cross-entity navigation** (e.g., from a testimonial to its linked event) without losing context
- **Admin/CRM interfaces** managing multiple related entity types
- **Multi-panel workflows** where users compare or edit multiple records simultaneously

Do NOT apply when:
- Simple single-page forms or wizards
- Read-only content pages
- Mobile-first interfaces (this is desktop-oriented)

## Architecture

```
CanvasProvider (state management + URL sync)
  └── CanvasContainer (horizontal scroll + keyboard nav)
       ├── EntityPanelList (root list panel, cannot close)
       ├── EntityPanel[Type] (detail panel, closable)
       ├── EntityPanel[Type] (opened via cross-entity nav)
       └── ... (infinite horizontal panels)
```

## Core Data Model

```typescript
interface PanelState {
  id: string                    // Unique panel identifier
  entityType: EntityType        // Type of entity displayed
  entityId?: string             // Entity identifier (optional for list panels)
  parentPanelId?: string        // ID of parent panel (navigation tree)
  title?: string                // Display title
}

// Define per-project — these are examples
type EntityType = 'list' | 'event' | 'venue' | 'user' | 'order' // ... etc
```

## Key Behaviors

1. **Panel stacking**: New panels open to the right of the source panel, removing panels after it
2. **Deduplication**: If the same entity is already open, activate it instead of creating a duplicate
3. **Root protection**: List panel (index 0) cannot be closed
4. **URL sync**: Panel state serialized to `?panels=entityType:id,entityType:id,...`
5. **Keyboard nav**: Arrow Left/Right, Home/End, Escape to close

## Component Structure

### 1. CanvasProvider (`components/canvas/canvas-context.tsx`)

Context provider managing all panel state. Exports:

```typescript
export function useCanvas(): {
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

export function usePanelNavigation(panelId: string): NavigateCallback
// Returns: (entityType, entityId, title?) => void
```

**URL sync**: Serialize on panel changes, deserialize on page load, use `router.replace()` to avoid history pollution.

**Performance** (`vercel-react-best-practices`): Memoize `openPanel`, `closePanel`, and other context functions with `useCallback`. Use `useMemo` for the context value object to prevent unnecessary re-renders across all consuming panels. Consider splitting frequently-changing state (activePanelId) from stable state (panel operations) into separate contexts if panel count grows large.

### 2. CanvasContainer (`components/canvas/canvas-container.tsx`)

Horizontal scroll container with keyboard navigation:
- `Arrow Left/Right`: Previous/next panel
- `Home/End`: First/last panel
- Auto-scrolls to active panel

**Accessibility** (`web-design-guidelines`): The container should have `role="tablist"` with `aria-orientation="horizontal"`. Each panel acts as a `role="tabpanel"`. Announce panel changes to screen readers with `aria-live="polite"`. Ensure focus is visually distinct and moves predictably with keyboard navigation.

### 3. BasePanel (`components/canvas/base-panel.tsx`)

Wrapper for every panel. Props:

```typescript
interface BasePanelProps {
  panelId: string
  entityType: EntityType
  title?: string
  showClose?: boolean              // default: true
  showBack?: boolean               // default: false
  children: ReactNode
  width?: number                   // default: 960px
  minWidth?: number                // default: 320px
  maxWidth?: number                // default: 1600px
  resizable?: boolean              // default: true
  headerActions?: ReactNode
  hasUnsavedChanges?: boolean
  onSave?: () => Promise<void>
  isSaving?: boolean
  onDelete?: () => Promise<void>
  previewUrl?: string | null
  entityId?: string
}
```

Features: Color-coded entity badge, resize handle, save/delete/preview buttons, unsaved changes dialog, active state styling.

**Design** (`frontend-design`): Panel headers, entity badges, active/inactive states, resize handles, and action buttons should follow the project's design direction — not generic defaults. Use the `frontend-design` skill to establish a distinctive visual language for the panel chrome (borders, shadows, badge colors, transitions). The unsaved changes indicator and save button highlight state should feel intentional, not stock.

**Accessibility** (`web-design-guidelines`): Each panel needs `role="tabpanel"`, `aria-label` with the entity name, and `tabindex="0"` for focus. The close button needs `aria-label="Close [entity name] panel"`. Unsaved changes dialog must trap focus. Save/delete buttons need clear disabled states communicated via `aria-disabled`.

**Entity type config** (define per project):
```typescript
const entityTypeConfig: Record<EntityType, { label: string; color: string }> = {
  list: { label: 'List', color: 'bg-slate-500' },
  event: { label: 'Event', color: 'bg-blue-500' },
  venue: { label: 'Venue', color: 'bg-emerald-500' },
  // ... add per entity type
}
```

### 4. EntityPanelList (`components/canvas/entity-panel-list.tsx`)

Root list panel wrapper. Always panel index 0, cannot be closed. Default width 1040px.

### 5. Entity Panel Wrappers (`components/canvas/entity-panel-[entity].tsx`)

One per entity type. Each wrapper:

```typescript
export function EntityPanelEvent({ panelId, entityId, title, onUpdate, onDelete }: Props) {
  const navigate = usePanelNavigation(panelId)
  const { closePanel } = useCanvas()
  const editorRef = useRef<EventEditorHandle>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await editorRef.current?.save()
      setHasUnsavedChanges(false)
    } finally {
      setIsSaving(false)
    }
  }, [])

  return (
    <BasePanel
      panelId={panelId}
      entityType="event"
      title={title}
      showClose showBack
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      isSaving={isSaving}
      onDelete={async () => { /* delete logic */ closePanel(panelId) }}
    >
      <EventEditor
        ref={editorRef}
        entityId={entityId}
        showHeader={false}
        onDataChange={setHasUnsavedChanges}
        onNavigate={navigate}
      />
    </BasePanel>
  )
}
```

## Editor Integration Requirements

Existing editors need these additions to work in canvas panels:

1. **forwardRef + useImperativeHandle** exposing `save()`:
```typescript
export interface EditorHandle { save: () => Promise<void> }

export const Editor = forwardRef<EditorHandle, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    save: async () => { /* save logic */ }
  }), [deps])
  // ...
})
```

2. **New props**: `showHeader?: boolean`, `onDataChange?: (hasChanges: boolean) => void`, `onNavigate?: NavigateCallback`

3. **Conditional header**: `{showHeader !== false && <Header />}`

4. **Change tracking**: Call `onDataChange(hasChanges)` when form state changes

5. **Canvas navigation** instead of router navigation:
```typescript
// Before: router.push(`/events/${eventId}`)
// After:  onNavigate?.('event', eventId, eventName)
```

## Page Implementation Pattern

**Performance** (`vercel-react-best-practices`): Wrap each entity panel's data-fetching content in `<Suspense>` boundaries so opening a new panel doesn't block the existing ones. Use `React.memo` on panel wrappers — panels that haven't changed shouldn't re-render when a sibling is added/removed. Avoid passing new object/array references as props on every render.

```typescript
export default function EntityPage() {
  return (
    <CanvasProvider>
      <EntityPageContent />
    </CanvasProvider>
  )
}

function EntityPageContent() {
  const { panels, openPanel } = useCanvas()

  const handleSelect = (entityId: string, name: string) => {
    const listPanelId = panels.find(p => p.entityType === 'list')?.id
    openPanel('entity_type', entityId, listPanelId, name)
  }

  return (
    <CanvasContainer>
      {panels.map(panel => {
        switch (panel.entityType) {
          case 'list':
            return (
              <EntityPanelList key={panel.id} panelId={panel.id} title="Entities">
                <EntityListTable onSelect={handleSelect} />
              </EntityPanelList>
            )
          case 'entity_type':
            return panel.entityId ? (
              <EntityPanelEntity key={panel.id} panelId={panel.id} entityId={panel.entityId} title={panel.title} />
            ) : null
          // Add cases for all navigable entity types
          default:
            return null
        }
      })}
    </CanvasContainer>
  )
}
```

## Critical: Tabbed Editor Scrolling

When editors use tabs inside panels, apply `min-h-0` throughout the flex chain:

```typescript
<form className="flex-1 flex flex-col min-h-0">
  <Tabs className="flex-1 flex flex-col min-h-0">
    <TabsList>{/* tabs */}</TabsList>
    <TabsContent forceMount className="data-[state=inactive]:hidden m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">{/* content */}</div>
      </ScrollArea>
    </TabsContent>
  </Tabs>
</form>
```

Rules: Every flex container needs `min-h-0`. Use `forceMount` + `data-[state=inactive]:hidden`. Wrap scrollable content in `<ScrollArea className="h-full">`.

## Implementation Checklist

When applying this pattern to a new project or entity:

**Design Phase** (invoke `frontend-design` skill first):
- [ ] Establish visual direction for panel chrome (headers, badges, borders, shadows, transitions)
- [ ] Define entity badge color palette that fits the project aesthetic
- [ ] Design active/inactive panel states, resize handle, action button styles

**Build Phase** (this skill):
- [ ] Create `components/canvas/canvas-context.tsx` (CanvasProvider, useCanvas, usePanelNavigation)
- [ ] Create `components/canvas/canvas-container.tsx` (horizontal scroll + keyboard nav)
- [ ] Create `components/canvas/base-panel.tsx` (panel wrapper with header, resize, save/dirty)
- [ ] Create `components/canvas/entity-panel-list.tsx` (root list wrapper)
- [ ] Define `EntityType` union and `entityTypeConfig` for all entity types
- [ ] For each entity type:
  - [ ] Create `entity-panel-[entity].tsx` wrapper
  - [ ] Update editor: add forwardRef, useImperativeHandle, showHeader, onDataChange, onNavigate
  - [ ] Add switch case in page's panel renderer
- [ ] Wrap page with `CanvasProvider`
- [ ] Use `CanvasContainer` with panel map/switch rendering

**Performance Phase** (invoke `vercel-react-best-practices`):
- [ ] Memoize context value and all context functions
- [ ] `React.memo` on panel wrapper components
- [ ] `<Suspense>` boundaries around panel data-fetching content
- [ ] Verify no unnecessary re-renders when opening/closing siblings

**Accessibility Phase** (invoke `web-design-guidelines`):
- [ ] `role="tablist"` on CanvasContainer, `role="tabpanel"` on each panel
- [ ] `aria-label` on panels with entity name, `aria-live="polite"` for panel changes
- [ ] Focus management: keyboard nav, visible focus ring, focus trap in dialogs
- [ ] Close/save/delete buttons have descriptive `aria-label`
- [ ] Unsaved changes dialog traps focus and is announced

**Test Phase:**
- [ ] Panel open/close, cross-entity nav, save/dirty, URL sync
- [ ] Keyboard navigation (Arrow keys, Home/End, Escape)
- [ ] Panel resizing, browser back/forward
- [ ] Screen reader testing (panel announcements, button labels)

## Migration from Split-Panel Layout

Replace `ResizablePanelGroup` with `CanvasProvider` + `CanvasContainer`. List becomes `EntityPanelList` (panel 0). Editor becomes entity panel wrapper. Multiple entities can be open simultaneously. URL sync replaces local state.
