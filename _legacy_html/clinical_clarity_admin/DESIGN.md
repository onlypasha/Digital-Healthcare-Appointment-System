---
name: Clinical Clarity Admin
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '300'
    lineHeight: 44px
    letterSpacing: 0.15em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  body-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.20em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  sidebar-width: 260px
  header-height: 64px
---

## Brand & Style

The design system for the administrative suite focuses on **Corporate / Modern** principles with a heavy emphasis on **Minimalism** to ensure operational efficiency. The brand personality is disciplined, professional, and authoritative, designed to foster a sense of "Expert Medical Precision."

The UI is optimized for high-density information management, utilizing a pristine white canvas and "Slate Ground" backdrops to minimize eye strain during long working sessions. The visual language favors clarity over decoration, using hairline dividers and generous whitespace to organize complex healthcare data into digestible units. The emotional response is one of operational dependability and trust, ensuring administrators feel in total control of the clinical ecosystem.

## Colors

The palette is anchored by **Clinical Royal Blue**, used strategically for interactive focal points and brand reinforcement. The background utilizes a non-glare **Slate Ground Canvas** to provide a subtle contrast against the pure white surfaces of cards and data tables.

- **Primary (#2563eb):** Reserved for primary CTAs, active navigation states, and focus rings.
- **Secondary (#3b82f6):** Used for informative charting elements and secondary interactive cues.
- **Surface (#ffffff):** All data containers, cards, and input fields reside on this layer.
- **Neutral (#0f172a):** Primary text color for maximum legibility (AAA compliant).
- **Status Tones:** Success (#10b981), Warning (#f59e0b), and Error (#ef4444) are used with low-opacity container fills to denote clinical states without overwhelming the visual hierarchy.

## Typography

**Inter** is the exclusive typeface, chosen for its exceptional readability in data-dense environments and clinical precision. 

### Scale & Hierarchy
- **Headlines:** Use Semi-Bold weights to provide clear orientation. `headline-md` is the default for page titles.
- **Body:** Standardized at `14px` with a relaxed `1.5x` line-height to assist in scanning long rows of patient data.
- **Label Caps:** Strictly used for form labels and table headers. It must always be uppercase with expanded tracking (`0.20em`) to create a structured, architectural feel.
- **Captions:** Used for status pills and small telemetry data.

On mobile, `display-lg` should be avoided; use `headline-md` for primary headings to maintain spatial efficiency.

## Layout & Spacing

This design system uses a **12-column fluid grid** for the main workspace, adapting to the available screen real estate while maintaining strict margins.

### Structural Logic
- **Sidebar:** A fixed `260px` vertical navigation on desktop, collapsing into a slide-over panel on tablet/mobile.
- **Grid Strategy:** Operational KPIs typically span 3 columns (`lg:col-span-3`), while primary data tables span 8 columns (`lg:col-span-8`) to prioritize visibility.
- **Rhythm:** An 8px spacing system governs the layout. Cards and major sections use `24px` (lg) padding on desktop, reducing to `16px` (md) on mobile.
- **Dividers:** Hairline `1px` borders in Slate-200 are the primary method for partitioning content, replacing heavy shadows or color blocks.

## Elevation & Depth

Visual hierarchy is primarily established through **Tonal Layers** and **Low-Contrast Outlines**.

- **Background:** The base layer is `#f8fafc` (Slate 50).
- **Surface Layer:** Cards and containers are `#ffffff` (White) with a `1px` border of `#e2e8f0` (Slate 200). 
- **Shadows:** Use a single, highly-diffused "Ambient Shadow" for primary cards (`shadow-sm`). It should be nearly imperceptible, serving only to lift the white surface slightly from the slate background.
- **Interactive Depth:** On hover, interactive rows or ghost buttons should not "lift" via shadows; instead, they should apply a tonal shift to `#f1f5f9` (Slate 100) or `#eff6ff` (Blue 50) to maintain a flat, clinical aesthetic.

## Shapes

The shape language is **Rounded**, balancing professional discipline with modern approachability.

- **Standard Elements:** Buttons, inputs, and small widgets use a `0.5rem` (8px) radius.
- **Large Containers:** KPI cards and data panels use `rounded-xl` (12px) to define major workspace boundaries.
- **Status Pills:** Use `rounded-full` to create high-contrast, easily identifiable state indicators.

## Components

### Buttons
- **Primary:** Solid `#2563eb` with white text. Height `40px`. Focus state features a 2px offset ring.
- **Secondary:** White background with `#cbd5e1` border and `#475569` text.
- **Ghost/Icon:** Symmetrical `36px` targets, no border, highlighting with a Slate-100 background on hover.

### Data Tables
- **Headers:** `#f8fafc` background, `label-caps` typography, `14px` vertical padding.
- **Rows:** `48px` minimum height, zebra-striped on even rows (`even:bg-slate-50/50`), with a Royal Blue (`#2563eb`) left-edge indicator for "active" or "selected" states.

### Form Fields
- **Inputs:** White background, `1px` Slate-300 border. On focus, the border transitions to Royal Blue with a soft Blue-100 outer halo.
- **Labels:** Positioned above the field using `label-caps` style in Slate-500.

### Status Pills
- Compact badges (`24px` height) using semi-bold `11px` text. Always use high-contrast text on a lightened version of the state color (e.g., Emerald-50 background for Emerald-500 text).

### Navigation
- **Vertical Sidebar:** Active links are indicated by a `4px` vertical Royal Blue bar on the left edge and a background shift to `#eff6ff`.