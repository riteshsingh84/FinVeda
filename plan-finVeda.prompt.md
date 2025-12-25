Plan: Link and Simplify Prototype

TL;DR: Build a simple, fully connected static site from the prototype by defining a clean sitemap, standardizing navigation and footer, converting all placeholder href="#" to real relative paths across pages, and ensuring fragment anchors exist. Keep paths minimal or normalize them, then validate the user flows end-to-end (auth → dashboard → portfolio → transactions → intelligence → plan → settings → support/education/news).

Steps
1. Define sitemap and URL schema from existing pages: Prototype/index.html, Prototype/about-us-code.html, Prototype/09-news-feeds-code.html, Prototype/11-education-center-code.html, Prototype/12-support-center-code.html, Prototype/UserLogins/user-login-code.html, Prototype/UserLogins/new-user-registration-code.html, Prototype/UserLogins/user-forgot-password-code.html, Prototype/UsersSmartInvesting/01-dashboard-code.html, Prototype/UsersSmartInvesting/02-portfolio-code.html, Prototype/UsersSmartInvesting/03-transaction-history-code.html, Prototype/UsersSmartInvesting/04-behavioral-finance-code.html, Prototype/UsersSmartInvesting/05-projections-code.html, Prototype/UsersSmartInvesting/06-risk-profiling-code.html, Prototype/UsersSmartInvesting/07-tax-optimization-code.html, Prototype/UsersSmartInvesting/08-financial-goals-code.html, Prototype/UsersSmartInvesting/10-alerts-code.html, Prototype/UsersSmartInvesting/13-user-settings-code.html.
2. Choose path strategy: keep current filenames or normalize (e.g., /app/dashboard.html, /users/login.html); document mapping for all href updates.
3. Create minimal shared header/nav/footer content to use across pages; include links to Home, News, Education, Support, Login/Register, and app sections (Dashboard, Portfolio, Transactions, Behavioral, Projections, Risk, Tax, Goals, Alerts, Settings).
4. Replace placeholder href="#" with relative links per sitemap; update nav, sidebar, and footer across pages; ensure fragments like #notifications exist in Prototype/UsersSmartInvesting/13-user-settings-code.html or adjust links.
5. Establish primary flows: Login/Register → Dashboard → Portfolio → Transactions; Intelligence (Behavioral/Projections/Risk/Tax) and Plan (Goals/Alerts) reachable from sidebar; Resources (Support/Education/News) reachable from header/footer.
6. Validate links end-to-end (local navigation clicking) and fix orphans; ensure every page has inbound/outbound links and consistent active states or visual cues.

Further Considerations
1. Path strategy: Option A keep existing paths; Option B normalize to /app and /users; Option C hybrid.
2. Missing pages: add or remove footer links for Privacy/Terms/Contact; keep placeholders only if planned.
3. Assets: keep Tailwind/Fonts via CDN for simplicity or add local CSS; unify logo/image references.

Draft for review
- Confirm sitemap option (keep vs normalize), whether to include Privacy/Terms pages, and if you want a shared header/footer applied uniformly across all pages.
