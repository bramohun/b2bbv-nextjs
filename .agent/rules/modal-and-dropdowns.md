---
trigger: always_on
---

When implementing dropdowns or modals that require state management (e.g., keeping it open while interacting with toggles inside):
1. Avoid relying on CSS-only (e.g., :focus-based) visibility.
2. Use a "controlled" approach with React state (isOpen).
3. Use explicit `absolute` positioning with high `z-index` (z-50) and a click-outside listener or backdrop to ensure reliability in complex layouts.