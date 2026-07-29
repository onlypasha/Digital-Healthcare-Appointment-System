---
name: Clinical Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#434655'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
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
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  gutter: 1rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style
The design system is anchored in the principles of reliability, precision, and empathy. It aims to reduce the cognitive load and anxiety often associated with medical scheduling by utilizing a **Corporate Modern** aesthetic with **Minimalist** tendencies. 

The visual language emphasizes high legibility and a sense of "clinical airiness"—using generous whitespace to separate complex medical data. The interface should feel like a high-end modern clinic: sterile but welcoming, efficient but human. Every interaction must reinforce a sense of calm and competence, ensuring that users of all ages and technical abilities feel confident navigating their healthcare journey.

## Colors
This design system utilizes a palette rooted in "Healthcare Blue" to establish immediate trust and authority. 

- **Primary (#2563eb):** Used for main actions, active states, and brand-critical elements.
- **Teal Accents (#0d9488):** Reserved for "success" states, health-positive indicators (e.g., confirmed appointments), and secondary CTAs to provide a refreshing contrast to the blue.
- **Surface & Backgrounds:** We use a hierarchy of soft grays. The main background is `white (#ffffff)`, while `tertiary (#f8fafc)` is used for card backgrounds and section grouping to create soft depth.
- **Status Colors:** High-contrast red for alerts/cancellations and amber for pending actions, always maintaining WCAG AA accessibility standards against white backgrounds.

## Typography
Inter is selected for its exceptional legibility and systematic feel. It provides a "neutral-premium" tone that works well across both dense data tables and friendly onboarding screens.

- **Scale:** Use `headline-lg` for primary page headers. On mobile, swap to `headline-lg-mobile` to prevent excessive line-breaking.
- **Hierarchy:** Use `title-lg` for card titles (e.g., Doctor names). `body-md` is the standard for all paragraph text and form input text.
- **Labels:** `label-sm` should be used in ALL CAPS for overline text or small metadata to distinguish it from interactive body text.

## Layout & Spacing
The layout follows a **Mobile-First, Fluid Grid** philosophy. We use an 8px base grid system to ensure mathematical harmony between all elements.

- **Mobile (< 600px):** Single column layout with `16px (1rem)` side margins. Use vertical stacking for all form elements and action bars.
- **Tablet (600px - 1024px):** 8-column grid with `24px` gutters. Elements like "Doctor Search Results" can transition to a 2-column card grid.
- **Desktop (> 1024px):** 12-column grid with a max-width of `1280px`. Use asymmetrical layouts (e.g., 8 columns for main content, 4 columns for a persistent "Appointment Summary" sidebar).
- **Rhythm:** Use `spacing.lg` to separate distinct sections (e.g., Personal Info vs. Insurance Info).

## Elevation & Depth
Depth in this design system is used functionally to indicate interactivity and information hierarchy rather than for pure decoration.

- **Surface Tiers:** The base layer is `#ffffff`. Use `#f8fafc` for "well" containers (like a background for a list of available time slots).
- **Shadows:** Use a single, consistent "Soft Focus" shadow for floating elements like Modals and Dropdowns: `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)`.
- **Interactivity:** On hover, cards should transition from a `1px` stroke to a very subtle ambient shadow to indicate "lift."
- **Borders:** Use a `1px` solid border in `#e2e8f0` for inactive states (inputs, cards). Increase to `2px` using the Primary color for focused/active states.

## Shapes
The shape language is "Approachable Geometric." We use **Rounded (0.5rem)** corners as the standard to soften the clinical feel without appearing "childish" or overly casual.

- **Buttons & Inputs:** Use the standard `rounded` (0.5rem) setting.
- **Cards & Modals:** Use `rounded-lg` (1rem) to create a distinct containerized look that feels modern and safe.
- **Avatars:** Medical professional photos should always be `full-rounded` (circular) to emphasize the person behind the title.
- **Badges/Chips:** Use `pill-shaped` (2rem) for status indicators like "Available" or "Confirmed."

## Components
Consistent component styling ensures the application feels like a singular, trusted tool.

- **Buttons:**
    - *Primary:* Solid `#2563eb` with white text. High-contrast, bold weight.
    - *Secondary:* Ghost style with `#2563eb` border and text.
    - *Tertiary:* Clear background with primary text for less critical actions (e.g., "Cancel").
- **Input Fields:** Use a `16px` height padding. Labels sit above the field in `label-md` weight. Include a distinct "Focus" state with a 2px Primary border.
- **Appointment Cards:** Use a white background, `rounded-lg` corners, and a subtle `1px` border. Include a left-hand "Teal" or "Blue" accent strip to denote category or status.
- **Time-Slot Chips:** Interactive chips for scheduling. Neutral gray background for inactive, Primary blue for selected, and a diagonal "hashed" pattern for unavailable slots to ensure accessibility for colorblind users.
- **Steppers:** A horizontal progress bar at the top of the mobile view for multi-step booking (e.g., Select Doctor > Choose Time > Insurance > Confirm).