Overview of key files retained after cleanup

App core
- `index.html`: Main landing page with UI and scripts
- `header.html` / `footer.html`: Shared navigation and footer includes
- `mega-menu.js`: Accessibility, keyboard navigation, hover/focus, animations
- `home.js`: General UI helpers; no chatbot code remains
- `styles.css` / `styles.min.css`: Base styles, typography, layout, accents
- `dark-theme.css`: Dark theme adjustments and hero overlay tweaks

Pages
- Individual service pages like `ivf-icsi.html`, `iui.html`, `laparoscopy.html`, etc.
- Department/Info pages like `nutrition.html`, `privacy-policy.html`, `terms-of-service.html`

Assets
- `icons/`: SVG icon set used in department cards (non-min versions retained)
- `assets/images/`: Page-specific images (e.g., genetic.jpg via `genetic.css`)

Scripts (support)
- `scripts/`: performance and optimization helpers (image and build-related)
- `i18n.js`: localization wiring used across pages
- `js/department-cards.js`: dynamic department card interactions

Config & Tooling
- `package.json`: dependencies and scripts (dev, preview)
- `vite.config.js`: build tooling
- `tests/`: accessibility tests and setup
- `docs/`: project docs and performance notes

Removed in this cleanup
- Chatbot (`chatbot.js`, `chatbot.css`, `chatbot.html`, `src/chatbot/faq.json`)
- Duplicate/unused icons (`*.min.svg` variants)
- Problematic duplicate script (`home.js.problematic`)

Notes
- Font Awesome `<i>` usage remains across content pages; services dropdown icons are suppressed via CSS.
- Hero overlays unified via CSS; consider standardizing hero markup progressively.