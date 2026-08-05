# ECOSA Online

ECOSA Online is a React and TypeScript single-page app for the Equatorial College Old Students Association. It supports alumni registration, member discovery, membership payments, community posts, jobs, leadership information, chapters, resources, and project donation flows.

## System Architecture

The project is a client-rendered Vite application. Netlify serves the built static assets from `dist`, and `public/_redirects` rewrites all routes to `index.html` so React Router can handle deep links.

Current runtime layers:

- **Static hosting:** Vite builds the SPA from `src/main.tsx`, `src/App.tsx`, and the route components under `src/pages`.
- **Routing:** `react-router-dom` defines browser routes in `src/App.tsx`.
- **UI shell:** `src/components/Header.tsx` renders the global navigation and ECOSA logo assets from `public`.
- **Data service:** `src/services/mockService.ts` centralizes all member, payment, post, poll, leader, job, and resource operations.
- **Persistence:** The app currently stores demo data in browser `localStorage`. The service layer also attempts requests to `http://localhost:4000/api` for compatible local API endpoints and falls back to local storage if the API is unavailable.
- **Assets:** Static logos and sample media live in `public` and are referenced with root-relative URLs or `import.meta.env.BASE_URL`.

There are no Netlify Functions, database schema, or production backend modules in this repository at the moment.

## User Workflow

1. Visitors land on the home page and can register, pay membership fees, browse community updates, search members, or review ECOSA projects.
2. Registration creates or updates a member record through `registerMember` in the shared service layer.
3. Payments collect member details, create a member when needed, and record a local payment entry. If a local API is running, payment initiation is attempted before falling back to local recording.
4. Community, jobs, leaders, resources, and member pages read from the same service layer so the app can work as a self-contained demo.
5. The dashboard route exists for admin review and publishing community updates, but it is not linked from the public navigation.

## Code Architecture

```text
src/
  main.tsx                 React entry point and BrowserRouter setup
  App.tsx                  Route table and top-level page composition
  index.css                Global styles and responsive layout rules
  components/
    Header.tsx             Site navigation and logo handling
    MemberCard.tsx         Member list card
    MemberLink.tsx         Member-name-to-profile resolver
    PostCard.tsx           Community post interactions
    ProjectsSection.tsx    Featured ECOSA projects
  pages/
    Home.tsx               Landing workflow shortcuts and projects preview
    Register.tsx           Alumni registration form
    Payments.tsx           Membership, donation, event, and project payments
    MembersList.tsx        Searchable member directory
    MemberProfile.tsx      Member detail page
    Community.tsx          Community feed
    JobBoard.tsx           Job listing and posting flow
    Leaders.tsx            Leadership view
    Resources.tsx          Shared resources
    Chapters.tsx           Chapter information
    Dashboard.tsx          Admin-oriented member, payment, and post review
    Projects.tsx           Project listing page
    Login.tsx              Local login form for routes that require a session
  services/
    mockService.ts         API adapter, localStorage fallback, and seeded demo data
```

Important implementation notes:

- `mockService.ts` is the boundary between UI code and persistence. New pages should use this service instead of reading or writing `localStorage` directly.
- Seed data is initialized in the browser when the service module loads.
- Payment buttons currently simulate successful local recording when no local API responds.
- `scripts/ensure-build-deps.cjs` installs dependencies during the build script if `node_modules/.bin/vite` is missing.

## Development

Install dependencies and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

Build command used by the project:

```bash
npm run build
```

Preview a built app locally:

```bash
npm run preview
```

## Deployment

Netlify can deploy this project as a static Vite site.

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- SPA fallback: configured in `netlify.toml` and `public/_redirects`

The repository-level `netlify.toml` keeps these settings with the code so Netlify does not try to build from the repository root.

For a public website, set the production project visibility to **Public** in Netlify under **Project configuration > General > Visitor access > Project visibility**. A private project returns a Netlify login response before the application can load.

If production persistence is added later, replace the local API fallback with Netlify Functions and Netlify Database so registration, payments, posts, votes, resources, and jobs survive across browsers and devices.
