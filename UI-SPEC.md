# Akka Console UI Design System

A framework-ready specification for building web applications that match the Akka Console visual language. This document defines the complete design system -- design tokens, component library, layout system, page patterns, and code conventions -- derived from the Akka local console codebase.

Use this as a reference when prompting AI tools (e.g., `/akka:specify`, `/akka:implement`) to generate frontend code that matches this design system.

---

## 1. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19+ with TanStack Router (file-based routing) |
| State | TanStack Query (`useQuery`, `useMutation`) for server state; React hooks for local state |
| Forms | TanStack Form (`@tanstack/react-form`) with schema validation |
| HTTP | Fetch-based API clients via TanStack Query |
| Styling | Tailwind CSS 4+ with HeroUI component library (`@heroui/*`) |
| UI Components | HeroUI (Button, Card, Modal, Chip, Dropdown, Input, etc.) with custom wrappers |
| Routing | TanStack Router with file-based route generation (`routeTree.gen.ts`) |
| Build | Vite with `@vitejs/plugin-react` |
| Testing | Vitest + Testing Library |
| Fonts | Instrument Sans Variable (sans), Roboto Mono Variable (mono) |
| Icons | Custom SVG icon components (no icon library dependency) |
| Monorepo | pnpm workspaces + Turborepo |

---

## 2. Design Tokens

All visual decisions are centralized through Tailwind CSS + HeroUI theme configuration. The system supports **light and dark modes** with automatic system preference detection.

### 2.1 Color Palette

#### Gray Scale (shared between themes)

```
gray-50:  #fafafa
gray-100: #f4f4f5
gray-200: #e4e4e7
gray-300: #d4d4d8
gray-400: #a1a1aa
gray-500: #71717a
gray-600: #52525b
gray-700: #3f3f46
gray-800: #27272a
gray-900: #18181b
black:    #000000
white:    #ffffff
```

#### Light Theme Colors

| Token | Hex | Name | Use |
|-------|-----|------|-----|
| `background` | `#ffffff` | White | Page background |
| `foreground` | `#1a1a1a` | Near-black | Default text |
| `primary` | `#f5b60b` | Circuit Yellow | Primary actions, brand accent, active states |
| `secondary` | `#02a4a7` | Storm Blue | Links, focus rings, secondary actions |
| `success` | `#5aa547` | Aurora Green | Ready, healthy, positive states |
| `warning` | `#e67d05` | Glow Orange | Paused, attention-needed states |
| `danger` | `#d9331a` | Tweaked Red | Error, unavailable, destructive actions |
| `focus` | `#02a4a7` | Storm Blue | Focus outline color |
| `divider` | `rgba(17,17,17,0.1)` | -- | Border/divider lines |
| `content1` | `#ffffff` | White | Card surface (level 1) |
| `content2` | `#f4f4f5` | gray-100 | Card surface (level 2), table cells, inputs |
| `content3` | `#e4e4e7` | gray-200 | Hover state for table cells |
| `content4` | `#d4d4d8` | gray-300 | Input borders, tertiary surfaces |

#### Dark Theme Colors

| Token | Hex | Name | Use |
|-------|-----|------|-----|
| `background` | `#000000` | Black | Page background |
| `foreground` | `#ffffff` | White | Default text |
| `primary` | `#ffce4a` | Spark Yellow | Primary actions, brand accent, active states |
| `secondary` | `#00d8dd` | River Blue | Links, focus rings, secondary actions |
| `success` | `#72d35b` | Electric Green | Ready, healthy, positive states |
| `warning` | `#ff9925` | Kindle Orange | Paused, attention-needed states |
| `danger` | `#fa3823` | Tweaked Red | Error, unavailable, destructive actions |
| `focus` | `#00d8dd` | River Blue | Focus outline color |
| `divider` | `rgba(255,255,255,0.15)` | -- | Border/divider lines |
| `content1` | `#18181b` | gray-900 | Card surface (level 1) |
| `content2` | `#27272a` | gray-800 | Card surface (level 2), table cells, inputs |
| `content3` | `#3f3f46` | gray-700 | Hover state for table cells |
| `content4` | `#52525b` | gray-600 | Input borders, tertiary surfaces |

### 2.2 Semantic Color Mapping

Colors carry meaning. Apply them consistently:

| Meaning | Token | Use for |
|---------|-------|---------|
| Brand / primary action | `primary` | Active nav highlights, primary buttons, brand elements |
| Info / links / focus | `secondary` | Links, focus rings, secondary actions, informational chips |
| Success / positive | `success` | Ready, healthy, completed, approved, update-in-progress |
| Warning / attention | `warning` | Paused, pending, expiring soon |
| Danger / negative | `danger` | Error, unavailable, failed, destructive actions |
| Neutral / muted | `foreground-500` | Deleted, disabled, placeholder text |

### 2.3 Typography

```css
:root {
  --font: "Instrument Sans Variable", sans-serif;
  --font-mono: "Roboto Mono Variable", monospace;
}
```

| Token | Size | Use |
|-------|------|-----|
| `text-tiny` / `text-xs` | 14px (0.875rem) | Table cells, form labels, body text, status text |
| `text-small` / `text-sm` | 15px (0.9375rem) | Buttons (medium), slightly larger body text |
| `text-medium` / `text-md` | 16px (1rem) | Toast titles, medium emphasis text |
| `text-large` / `text-lg` | 18px (1.125rem) | Section headings |
| `text-xxs` | 13px (0.8125rem) | Nav items, compact chips, notice banners |
| `text-2xl` | -- | Page headings (h1) |

**Font weights**: Use `font-[550]` for light mode emphasis, `font-[500]` for dark mode emphasis (pattern: `font-[550] dark:font-[500]`). Regular text uses the variable font's default weight.

### 2.4 Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded-small` | 3px | Buttons (sm), chips, inputs, nav item highlights |
| `rounded-medium` | 6px | Cards, modals, description lists, containers |
| `rounded-large` | 9px | Larger cards, panels |

### 2.5 Shadows

| Token | Light | Dark |
|-------|-------|------|
| `shadow-small` | Subtle drop shadow | Subtle + inset glow |
| `shadow-medium` | Medium drop shadow | Medium + inset glow |
| `shadow-large` | Heavy drop shadow | Heavy + inset glow |
| `shadow-dropdownmenu` | `0 12px 36px 0 rgb(0,0,0,.6), 0 0 8px 0 rgb(0,0,0,.4)` | Same |
| `shadow-divider` | `0 1px 0 0 rgba(255,255,255,.05)` | Same |

Dark mode shadows include `inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)` to create a subtle inner glow that lifts surfaces off the black background.

### 2.6 Spacing Extensions

| Token | Value | Use |
|-------|-------|-----|
| `spacing-1.75` | 0.4375rem | Input vertical padding |
| `spacing-3.75` | 0.9375rem | -- |
| `spacing-17` | 4.25rem | Header offset |
| `spacing-30` | 7.5rem | -- |

### 2.7 Animations

| Name | Definition | Use |
|------|------------|-----|
| `animate-spin` | Standard spin | Loading spinners |
| `animate-spin-slow` | 3s linear infinite | Updating status icon |
| `animate-spin-very-slow` | 6s linear infinite | Background indicators |
| `animate-pulse-fast` | 1.5s ease-in-out, opacity 1->0.5->1 | Loading status text |
| `animate-pulse-heavy` | 2s cubic-bezier, opacity 1->0.2->1 | Paused/warning states |

### 2.8 View Transitions

The local console uses the View Transitions API for page navigation:

```css
--view-transition-duration: 200ms;
--view-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

- Forward navigation: slide content left-to-right
- Back navigation: slide content right-to-left (via `slide-back` view-transition-type)
- Respects `prefers-reduced-motion: reduce`

---

## 3. Project Structure

```
src/
├── assets/                            # Static assets (favicons, images)
├── components/                        # App-specific composed components
│   ├── Breadcrumbs/                   # Entity-specific breadcrumb metadata
│   ├── CardView/                      # Service card grid components
│   ├── PrimaryNav/                    # App-specific nav items
│   ├── Header.tsx                     # App header composition
│   ├── Layout.tsx                     # Root layout shell
│   ├── PageWithHeader.tsx             # Page template with header
│   └── {Feature}Page.tsx              # Feature-level page components
│
├── features/                          # Domain feature modules
│   └── data/                          # API hooks, data layer
│       ├── hooks.ts                   # TanStack Query hooks
│       └── localApi.ts                # API client functions
│
├── hooks/                             # Custom React hooks
├── providers/                         # Context providers
├── routes/                            # TanStack Router file-based routes
│   ├── -components/                   # Route-scoped components (prefixed with -)
│   │   ├── LocalHeader.tsx            # Header with navigation tabs
│   │   └── ServicesContext.tsx         # Route-level context
│   ├── __root.tsx                     # Root route (providers, layout shell)
│   ├── index.tsx                      # Home redirect
│   ├── services.tsx                   # Services layout route
│   ├── services.index.tsx             # Services list page
│   ├── services.$serviceName.tsx      # Service layout (dynamic segment)
│   └── services/$serviceName/         # Nested service routes
│       ├── dashboard.tsx
│       └── components/
│           ├── $componentId.tsx        # Component detail layout
│           └── $componentId/          # Sub-routes (state, traces, etc.)
│
├── utils/                             # Utility functions
├── main.tsx                           # Bootstrap entry
├── routeTree.gen.ts                   # Auto-generated route tree
└── index.css                          # Design tokens + view transitions
```

### Shared Packages Structure

```
packages/
├── common/                            # Shared utilities, types, branding
│   ├── branding/                      # Product name, docs URL, feature flags
│   ├── ui-utils/                      # Component types, status enums
│   ├── grpc-data/                     # gRPC data types
│   └── logging/                       # Logger utility
│
└── components/                        # Shared component library
    ├── src/
    │   ├── v2/                        # Current component generation
    │   │   ├── Header/                # App shell header
    │   │   ├── PrimaryNav/            # Sidebar navigation system
    │   │   ├── Icons/                 # SVG icon components
    ��   │   ├── Forms/                 # Form components
    │   │   ├── ComponentDetails/      # Domain-specific detail views
    ��   │   ├── Table/                 # Data table components
    │   │   ├── CardView/              # Card grid components
    │   │   ├── NoticeBanner/          # Alert/notice banners
    │   │   ├── RequestBuilderWidget/  # API request builder
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Chip.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Toast.tsx
    │   │   ├── Dropdown.tsx
    │   │   ├── ThemeDropdown.tsx
    ���   │   └── ...
    │   ├── css/
    │   │   └── globals.css            # Base Tailwind imports + utilities
    │   ├── PageHeader.tsx
    │   └── LayoutContext.tsx
    └── tailwind.config.ts             # Design token definitions
```

**Conventions**:
- `routes/` -- file-based routing with TanStack Router. `$param` for dynamic segments, `-components/` for route-scoped helpers.
- `components/` -- app-specific composed components.
- `packages/components/` -- shared, reusable components across cloud and local console apps.
- `features/` -- domain logic (API hooks, data transforms).
- `v2/` prefix -- current generation components; older components exist at package root.

---

## 4. Layout System

### Main Shell (Sidebar + Content)

A CSS Grid with a left sidebar and scrollable main content area:

```
┌──────────────┬─────────────────────────────────────┐
│              │                                     │
│   SIDEBAR    │          MAIN CONTENT               │
│   (auto)     │          (scrollable)               │
│              │                                     │
│  ┌────────┐  │  ┌───────────────────────────────┐  │
│  │ Logo   │  │  │  Breadcrumbs                  │  │
│  ├────────┤  │  │  PageHeader: h1 + actions     │  │
│  │ Nav    │  │  │  Content...                   │  │
│  │ items  │  │  │                               │  │
│  │        │  │  │                               │  │
│  └─��──────┘  │  └───────────────────────────────┘  │
└─────��────────┴─────────────────────────────────────┘
```

```tsx
// Layout.tsx
<div className="grid h-screen w-full
  [grid-template-columns:auto_minmax(0,_1fr)]
  [grid-template-rows:minmax(0,_1fr)]
  overflow-hidden
  pt-[49px] md:pt-0
  [grid-template-areas:'primary-nav_main']">
  {children}
</div>
```

**Key characteristics**:
- Full viewport height (`h-screen`) with `overflow-hidden` on the shell
- Sidebar width is `auto` (content-driven), not a fixed pixel value
- Main content area scrolls independently
- On mobile: sidebar collapses to a hamburger drawer, content gets `pt-[49px]` for fixed top bar

### Header Anatomy

The header is a **left-column sidebar** element (not a top bar):

- **Top bar section** (fixed on mobile, static on desktop): Logo + action buttons (theme toggle, more menu, hamburger on mobile)
- **Drawer content**: Navigation items, expandable service tree
- Border: `border-r border-divider` on desktop, `border-b` on mobile top bar
- Hamburger menu appears only on `md:` breakpoint and below
- Drawer slides in from right on mobile with `translate-x` animation (300ms ease-in-out)
- Backdrop: `bg-black/50` overlay on mobile when drawer is open

### Sidebar / Primary Navigation Anatomy

```tsx
<nav className="w-full flex flex-col p-3">
  {/* PrimaryNavSection groups */}
  {/* PrimaryNavItem entries */}
</nav>
```

- **Navigation items**: 13px (`text-xxs`), `min-h-8`, `p-1`, `rounded-small`
- **Active state**: `bg-primary/50` highlight on the label area, `bg-primary/10` on the container when `activeContainerBg` is true
- **Hover**: `bg-foreground/10`
- **Expandable items**: Chevron icon rotates -90deg when collapsed, animated via `transition-transform`
- **Tree lines**: Visual tree hierarchy with branch/leaf connectors at nested depths
- **Expand/collapse**: Grid-based animation (`grid-template-rows: 1fr -> 0fr`, 300ms ease-in-out)

### Topbar Actions (Header Right)

- Navigation tabs (Services, Documentation) as `Button` components with `variant="solid"` (active) or `variant="light"` (inactive)
- Theme dropdown (light/dark/system)
- "More" dropdown (Documentation, Version info)
- All items use `gap-x-1` on mobile, `gap-x-2` on desktop

---

## 5. Component Library

### Button

Wraps HeroUI `Button` with consistent styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Button label (also used as `aria-label` when `iconOnly`) |
| `Icon` | `IconComponentType` | -- | Leading icon component |
| `iconOnly` | `boolean` | `false` | Render icon-only button |
| `variant` | `'solid' \| 'bordered' \| 'light' \| 'ghost'` | `'bordered'` | Visual variant |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `loadingText` | `string` | -- | Text shown during loading |

**Size specs**:
- `sm`: `min-w-8 h-8`, `rounded-small`, `text-tiny` (14px)
- `md`: `min-w-9 h-9`, `rounded-medium`, `text-small` (15px)
- `lg`: `min-w-12 h-12`, `rounded-large`, `text-medium` (16px)

**Styling**: `antialiased font-[550] dark:font-[500] gap-1.5`. Icons are `w-5 h-5 fill-current`. Disabled state: `0.5 opacity`.

### Card

Wraps HeroUI `Card` with hover outline effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hoverable` | `boolean` | `false` | Enable hover effect |
| `pressable` | `boolean` | `false` | Enable press/click |
| `classNames` | `{ base?, header?, body?, footer? }` | `{}` | Class overrides |

**Hover effect**: `outline-2 outline-transparent -> outline-content4` with 200ms transition. Background stays `bg-content1` on hover (no darkening). Uses `shadow-sm` by default.

### Chip (Badge/Status Pill)

Wraps HeroUI `Chip` for status indicators.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Semantic color |
| `compact` | `boolean` | `false` | Smaller variant (`text-xxs`, minimal padding) |
| `fontFamily` | `'default' \| 'mono'` | `'default'` | Font family |
| `pillShaped` | `boolean` | `false` | Full radius (pill) vs small radius |
| `tooltip` | `ReactNode` | -- | Tooltip on hover |

**Visual**: `size="sm"`, `rounded-sm` by default (3px). Text: `text-tiny` (14px) or `text-xxs` (13px) when compact. Font weight: `font-[450] dark:font-[400]`.

### Table

Custom table components (not HeroUI) with scroll shadows.

**Components**: `Table`, `TableHead`, `TableHeadRow`, `TableHeadCell`, `TableBody`, `TableRow`, `TableCell`, `TableSkeletonRows`, `TableErrorRow`

**Table container**: Horizontal scroll with gradient scroll shadows (light/dark variants) that appear/disappear based on scroll position.

**TableHeadCell**: `bg-content2 dark:bg-content1`, `font-[550] dark:font-[500]`, `p-2 px-3`, `text-tiny`, rounded corners on first/last cells.

**TableCell**: `p-2 px-3`, `bg-content2 dark:bg-content1`, hover: `bg-content3 dark:bg-content2` (via `group-hover`). Bottom row gets rounded corners.

**Table element**: `border-separate border-spacing-0.5` (creates subtle gaps between cells).

**Skeleton rows**: Pulsing `bg-gray-200 dark:bg-gray-700 rounded animate-pulse` bars.

### PageHeader

Page-level heading with optional icon and action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Page heading text |
| `subtitle` | `ReactNode` | -- | Description below title |
| `Icon` | `IconComponentType` | -- | Leading icon (`w-8 h-8`) |
| `children` | `ReactNode` | -- | Action buttons (right-aligned) |

**Visual**: `mb-9`, flex row with `gap-x-6 gap-y-3`. Title: `text-2xl font-[550] dark:font-[500] leading-none`. Subtitle: `text-tiny text-foreground-500 mt-1`.

### DescriptionList

Key-value pair display in a horizontal or vertical layout.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `list` | `{ term: string, definition: ReactNode }[]` | required | Key-value pairs |
| `floating` | `boolean` | `true` | Horizontal wrap vs vertical stack |
| `boxed` | `boolean` | `true` | Background + rounded container |

**Visual**: `bg-content2 rounded-medium`, items with `p-2 px-3`. Term: `text-tiny font-[550] dark:font-[500] pb-1.5`. Definition: `flex flex-wrap gap-1`.

### Modal

Wraps HeroUI `Modal` with consistent styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | required | Dialog title |
| `showCloseButton` | `boolean` | `true` | Show close button in footer |
| `ActionButton` | `ReactElement` | -- | Primary action button |
| `size` | `ModalSizeType` | `'lg'` | Width variant |
| `scrollBehavior` | `'inside' \| 'outside' \| 'normal'` | `'outside'` | Scroll behavior |

**Visual**: Centered placement, `rounded-md`, `backdrop="opaque"`. Dark mode backdrop: `bg-overlay/80`. Footer: `justify-start pt-0 mt-8 pb-8`. Header: `font-[550] dark:font-[500] text-foreground`.

### Toast (Notifications)

Uses `sonner` library with custom rendering.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | required | Toast heading |
| `description` | `ReactNode` | -- | Body text |
| `variant` | `'regular' \| 'success' \| 'warning' \| 'error'` | `'regular'` | Severity |
| `persistent` | `boolean` | `true` | Stay until dismissed (vs 6s auto-dismiss) |

**Visual**: `bg-content1 shadow-small rounded-small p-4 pl-10`. Icon positioned `absolute top-4 left-3 w-5 h-5`. Close button at `absolute top-1 right-1`. Title colors: `text-success`, `text-warning`, `text-danger`, or default.

### NoticeBanner

Inline alert/notice strip.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `severity` | `'warning' \| 'secondary'` | `'warning'` | Color scheme |
| `variant` | `'default' \| 'ghost'` | `'default'` | Visual variant |
| `dismissible` | `boolean` | -- | Show dismiss button |

**Visual**: `inline-flex items-center gap-1.5 text-xxs text-foreground/80`. Default variant: `border border-{color}/25 bg-{color}/10 rounded`. Ghost variant: no border/background.

### ServiceStatusIndicator

Status display with animated icon and colored text.

| Status | Color | Animation |
|--------|-------|-----------|
| Loading | `foreground` | `animate-spin` icon, `animate-pulse` text |
| Ready | `success` | None |
| Paused | `warning` | `animate-pulse` on both |
| Deleted | `foreground-500` | None |
| Updating | `success` | `animate-spin-slow` icon |
| Unavailable | `danger` | None |
| Partially Ready | `success` | None |

**Visual**: `flex items-center`, icon `w-4 h-4`, text `pl-1.5 text-tiny font-[550] dark:font-[500] leading-none`.

### Form Components

#### FormInput

```tsx
<div className="mb-3">
  <FormLabel label={label} id={id} required={required} />
  <input className="block max-w-full p-2 py-1.75 rounded-none appearance-none
    bg-content2 border border-content4 text-content2-foreground rounded-small
    focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus
    placeholder:text-foreground-500 text-tiny leading-5 w-80" />
  <FormErrors errors={errors} />
</div>
```

- Default width: `w-80` (20rem)
- Error state: `outline outline-2 outline-offset-2 outline-danger`
- Focus: `outline-focus` (secondary color)

#### FormLabel

```tsx
<label className="block mb-1 text-tiny font-[550] dark:font-[500]">
  {label}{required ? " *" : ""}
</label>
```

### ThemeDropdown

Three-option dropdown: Light, Dark, System. Uses `next-themes` (or equivalent) for persistence. Renders current theme icon in a bordered, icon-only small button.

---

## 6. Utility Patterns

### Font Weight Pattern

Throughout the system, emphasis text uses a dual-weight pattern for optimal readability across themes:

```
font-[550] dark:font-[500]
```

This applies to: button text, table headers, form labels, page headings, description list terms, chip text, nav items, toast titles, modal headers.

### Link Style

```css
@utility link {
  @apply text-secondary font-[550] dark:font-[500] focus:outline-focus;
  &:hover {
    @apply underline underline-offset-2 decoration-2;
  }
}
```

### Content Surface Layering

| Level | Light | Dark | Use |
|-------|-------|------|-----|
| Background | `#ffffff` | `#000000` | Page canvas |
| Content 1 | `#ffffff` | `#18181b` (gray-900) | Cards, toasts, primary surfaces |
| Content 2 | `#f4f4f5` (gray-100) | `#27272a` (gray-800) | Table cells, inputs, description lists |
| Content 3 | `#e4e4e7` (gray-200) | `#3f3f46` (gray-700) | Hover states |
| Content 4 | `#d4d4d8` (gray-300) | `#52525b` (gray-600) | Borders |

### Scroll Shadows

Horizontal-scrollable containers (tables) use gradient pseudo-elements:

- Light: `linear-gradient(to right, #ffffffcc, #f4f4f500 48px)` (left) / reversed (right)
- Dark: `linear-gradient(to right, #000000cc, #00000000 48px)` (left) / reversed (right)
- Appear/disappear based on scroll position via `opacity-0/100` transitions

### Grid Layouts

```css
/* Services layout */
grid-template-columns: auto minmax(0, 1fr);
grid-template-rows: auto minmax(0, 1fr);
```

---

## 7. Page Layout Patterns

### Services Dashboard Page

```
┌──────────────────────────────────────────────────┐
│ PageHeader: Service name + status indicator      │
│ subtitle: component type label                   │
├──────────────────────────────────────────────────┤
│ DescriptionList (boxed, floating)                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ Status   │ │ URL      │ │ Region   │         │
│ │ Ready    │ │ ...      │ │ ...      │         │
│ └──────────┘ └──────────┘ └──────────┘         │
├──────────────────────────────────────────────────┤
│ Card grid (services as cards)                    │
│ ┌──────────────┐ ┌──────────────┐               │
│ │ ServiceCard  │ │ ServiceCard  │               │
│ │  name        │ │  name        │               │
│ │  status      │ │  status      │               │
│ │  components  │ │  components  │               │
│ └──────────��───┘ └──────────────┘               │
└───────��──────────────────────────────────────────┘
```

### Service Detail Page (with sidebar nav)

```
┌──────────┬───────────────────────────────────────┐
│ Primary  │ Breadcrumbs (entity > parent > child)  │
│ Nav      │ PageHeader: Component name + icon      │
│          ├───────────────────────────────────────┤
│ Services │ DescriptionList (key metadata)         │
│  ├ Svc1  ├───────────────────────────────────────┤
│  │ ├Comp │ Content section (tables, details)      │
│  │ └Comp │                                        │
│  └ Svc2  │ Table                                  │
│          │ ┌──────┬────────┬────────┬───────┐    │
│          │ │ Name │ Type   │ Status │ ...   │    │
│          │ ├──────┼────────┼────────┼───────┤    │
│          │ │ ...  │ chip   │ chip   │ ...   │    │
│          │ └──────┴────────┴────────┴───────┘    │
└──────────┴─────────────────────────────────────���─┘
```

### Component Detail Page

```
┌──────────────────────────────────────────────────┐
│ Breadcrumbs: Service > Component                 │
│ PageHeader: Component name + type icon           │
│             subtitle with docs link              │
│                                    [Action btns] │
├──────────────────────────────────────────────────┤
│ DescriptionList (component metadata)             │
├───────────────────────────────���──────────────────┤
│ Tab navigation or sub-route content:             │
│   - State / Event log / Traces / Requests        │
├──────────────────────────────────────────────────┤
│ Content: Tables, JSON views, trace flows         │
└────��─────────────────────────────────────���───────┘
```

### Empty State

No dedicated empty-state component -- use contextual messaging within the content area. Tables show `TableErrorRow` for errors. Pages show `NoticeBanner` for informational states.

---

## 8. Code Patterns

### TanStack Query Data Fetching

```typescript
// features/data/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi } from "./localApi";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: localApi.getServices,
  });
}

export function useService(serviceName: string) {
  return useQuery({
    queryKey: ["services", serviceName],
    queryFn: () => localApi.getService(serviceName),
    enabled: !!serviceName,
  });
}
```

### Route Component Pattern

```typescript
// routes/services.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import ServicesPage from "../components/ServicesPage";

export const Route = createFileRoute("/services/")({
  component: ServicesPage,
});
```

### Page Component Pattern

```tsx
export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <NoticeBanner severity="warning">Failed to load services</NoticeBanner>;

  return (
    <div>
      <PageHeader title="Services" Icon={ServiceIcon}>
        <Button text="Refresh" Icon={RefreshIcon} onClick={handleRefresh} />
      </PageHeader>

      <div className="grid gap-4">
        {services.map(svc => (
          <ServiceCard key={svc.name} service={svc} />
        ))}
      </div>
    </div>
  );
}
```

### Navigation Composition

```tsx
// Header composed with app-specific navigation
export default function Header({ preMenuContent }: { preMenuContent?: ReactNode }) {
  return (
    <CommonHeader>
      <LocalHeader preMenuContent={preMenuContent} className="ml-auto [grid-area:menu]" />
    </CommonHeader>
  );
}

// LocalHeader contains navigation tabs + dropdowns
function LocalHeader({ className, preMenuContent }: Props) {
  return (
    <div className={`ml-auto flex items-center justify-end gap-x-1 pl-1 sm:gap-x-2 sm:pl-6 ${className}`}>
      {preMenuContent}
      <ul className="hidden items-center sm:flex sm:gap-x-2">
        <TabItem title="Services" Icon={ServiceIcon} link="/services" external={false} />
      </ul>
      <ThemeDropdown />
      <Dropdown title="More" button={{ text: "More", Icon: MoreIcon, iconOnly: true }} items={extraItems} />
    </div>
  );
}
```

### Primary Navigation Tree

```tsx
<PrimaryNav>
  <PrimaryNavSection title="Services">
    <PrimaryNavItem
      title="my-service"
      startContent={<ServiceIcon className="w-4 h-4" />}
      to="/services/my-service"
      isExpandable
      active={isActive}
      activeContainerBg
    >
      <PrimaryNavItem
        title="ShoppingCart"
        startContent={<ComponentIcon className="w-4 h-4" />}
        to="/services/my-service/components/shopping-cart"
        depth={1}
        isLastChild
      />
    </PrimaryNavItem>
  </PrimaryNavSection>
</PrimaryNav>
```

### TanStack Form Pattern

```tsx
import { useForm } from "@tanstack/react-form";

function MyForm() {
  const form = useForm({
    defaultValues: { name: "", type: "" },
    onSubmit: async ({ value }) => {
      await api.create(value);
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="name">
        {(field) => (
          <FormInput
            label="Name"
            id="name"
            required
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <Button text="Submit" type="submit" color="primary" variant="solid" />
    </form>
  );
}
```

---

## 9. Message & Feedback Patterns

### Toast Notifications

```tsx
import pushToast from "@akka-console/components/v2/Toast";

// Success
pushToast({ title: "Service deployed", variant: "success", persistent: false });

// Error
pushToast({ title: "Deployment failed", description: "Connection timeout", variant: "error" });

// With action
pushToast({
  title: "New version available",
  variant: "regular",
  actionContent: <Button text="Update" size="sm" onClick={handleUpdate} />,
});
```

### Notice Banners (Inline)

```tsx
// Warning with border + background
<NoticeBanner severity="warning">
  Service is paused. Resume to restore traffic.
</NoticeBanner>

// Informational ghost (no background)
<NoticeBanner severity="secondary" variant="ghost">
  Traces are sampled at 10% in production.
</NoticeBanner>

// Dismissible
<NoticeBanner severity="warning" dismissible onDismiss={() => setDismissed(true)}>
  Configuration change requires restart.
</NoticeBanner>
```

### Table Error State

```tsx
<Table>
  <TableHead>
    <TableHeadRow>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
    </TableHeadRow>
  </TableHead>
  <TableBody>
    <TableErrorRow colSpan={2} message="Failed to load components." />
  </TableBody>
</Table>
```

### Loading Skeleton

```tsx
<TableBody>
  <TableSkeletonRows columns={[16, 8, 12, 24]} rows={5} />
</TableBody>
```

---

## 10. Icon System

All icons are React components accepting `className` prop with standard SVG sizing:

```tsx
interface IconComponentType {
  (props: { className?: string }): JSX.Element;
}
```

Standard icon sizes:
- Navigation/buttons: `w-5 h-5 fill-current`
- Status indicators: `w-4 h-4`
- Page headers: `w-8 h-8 fill-current`
- Small (notices): `w-3 h-3`

Key icons: `AkkaLogo`, `ServiceIcon`, `DocumentationIcon`, `InfoIcon`, `MoreIcon`, `MenuIcon`, `CloseIcon`, `DropdownIcon`, `SuccessIcon`, `WarningIcon`, `ErrorIcon`, `StatusReadyIcon`, `StatusLoadingIcon`, `StatusPausedIcon`, `StatusUnavailableIcon`, `ThemeDarkIcon`, `ThemeLightIcon`, `ThemeSystemIcon`, `SidebarToggle`

---

## 11. Design Principles

1. **Light and dark theme parity** -- Both themes are first-class citizens. Every color token has a light and dark variant. The dual font weight pattern (`font-[550] dark:font-[500]`) ensures readability across both.

2. **HeroUI foundation with custom wrappers** -- Core components (Button, Card, Modal, Chip) wrap HeroUI primitives with consistent defaults, reducing boilerplate and enforcing design consistency.

3. **Content surface layering** -- Four content levels (background, content1-4) create depth hierarchy. Cards sit on content1, table cells on content2, hovers reveal content3, borders use content4.

4. **Yellow as brand, teal/blue as interaction** -- Primary (yellow) is reserved for brand identity and active navigation. Secondary (teal/blue) is for interactive elements: links, focus rings, informational states.

5. **Subtle, functional animation** -- Spin for loading, pulse for attention, 200ms slide for page transitions, 300ms for expand/collapse. All animations respect `prefers-reduced-motion`.

6. **Tree-based navigation** -- The sidebar uses an expandable tree with visual branch/leaf connectors, supporting deep hierarchies (service > component > sub-route).

7. **Composable headers** -- A shared `Header` component accepts app-specific content via composition, not configuration. Each app (cloud, local) provides its own navigation tabs and menus.

8. **Scroll-aware tables** -- Tables handle horizontal overflow with gradient scroll shadows that appear only when content is clipped, providing subtle navigation cues.

9. **Type-safe routing** -- TanStack Router with file-based route generation ensures type-safe navigation. Dynamic segments use `$param` convention.

10. **Monorepo-shared components** -- Components live in `packages/components` and are shared between cloud and local console apps, ensuring visual consistency across products.
