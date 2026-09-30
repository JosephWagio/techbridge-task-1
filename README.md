# TechBridge website

TechBridge by Baselink Services Limited — **Bridging Learning to Real-World Experience**.

This is a responsive multi-page website for TechBridge's learning programs and practical internship. It uses HTML5, CSS3, vanilla JavaScript, and a Node.js API for the intern dashboard. The API runs locally with Express and on Vercel as serverless functions.

## Pages

- `index.html` — TechBridge homepage, organization introduction, programs overview, 30-day internship, application, and community links.
- `programs.html` — Data Analytics and Web Development program details and skills.
- `internship-tasks.html` — an interactive 30-day roadmap where visitors can switch between Data Analytics and Web Development and explore eight tasks for each track.
- `challenges.html` — an interactive Challenge Hub with track and difficulty filters and an in-page detail dialog.
- `dashboard.html` — a two-track intern dashboard that loads tasks and statuses from the API, with progress, filters, task details, Challenge Hub preview, and technology explorer.

## Web Development track

| Task | Day | Project |
| --- | ---: | --- |
| 1 | 1 | Build the TechBridge Homepage |
| 2 | 4 | Build the TechBridge Programs Experience |
| 3 | 8 | Build the Internship Tasks Experience |
| 4 | 11 | Build an Interactive Internship Roadmap |
| 5 | 15 | Build the Intern Registration Experience |
| 6 | 19 | Build the Task Submission System |
| 7 | 22 | Build the Intern Dashboard |
| 8 | 26 | Build the Complete TechBridge Internship Platform |

## Data Analytics track

| Task | Day | Project |
| --- | ---: | --- |
| 1 | 1 | Data Cleaning Basics |
| 2 | 4 | Formulas & Pivot Tables |
| 3 | 8 | Data Visualization |
| 4 | 11 | Introduction to SQL |
| 5 | 15 | SQL Joins & Aggregations |
| 6 | 19 | Lookup Functions & Data Wrangling |
| 7 | 22 | Mini Analysis Project |
| 8 | 26 | Capstone Project |

The track selector defaults to Web Development to continue from the original Tasks 1–3 path. Both task arrays contain the title, day, description, and difficulty supplied by the internship briefs. The roadmap is informational and does not store individual learner progress.

## Challenge Hub

The Challenge Hub contains six practical examples across both tracks:

- **Data Analytics:** Monthly Sales Snapshot, Customer Segment Profile, and Operating Expense Review.
- **Web Development:** Responsive Launch Page, Portfolio Showcase, and Interactive Contact Form.

Visitors can filter by track and difficulty at the same time, reset both filters, and open a challenge dialog for its objective, skills, tools, and deliverable. Challenge content is stored as JavaScript objects in `script.js` and rendered without a page refresh.

## Intern Dashboard

The dashboard switches between Data Analytics and Web Development and loads each track's eight tasks from the API. It filters API data by status, requests task details when **View task** is selected, and sends status changes to the server. Counts and progress update from the returned task data. The sample intern name is Alex. Locally, task statuses are saved to `backend/data/tasks.json`; the demo has no accounts.

The technology explorer introduces Next.js, Vue.js, Angular, and backend development. Its Backend view includes Node.js, Express.js, and Django, with links to their documentation.

## Task Management API

Locally, the Express API runs at `http://127.0.0.1:3000`. On Vercel, matching serverless functions live under `api/`. Task IDs (1–8) are track-specific; the `track` query parameter selects a track and defaults to `web-development`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the backend is running. |
| GET | `/api/tasks` | Get tasks for both tracks. |
| GET | `/api/tasks?track=web-development` | Get the eight tasks for one track (`data-analytics` is also supported). |
| GET | `/api/tasks/:id?track=web-development` | Get one task; `track` is optional and defaults to Web Development. |
| PUT | `/api/tasks/:id?track=web-development` | Update a task status with a JSON body such as `{"status":"completed"}`. Valid statuses are `completed`, `in-progress`, and `not-started`. |

The dashboard uses same-origin `fetch()` requests, so it works locally and on the Vercel site without cross-origin configuration. Local status changes use the JSON file. Vercel functions cannot persist writes to the deployment filesystem, so production status changes use a private Vercel Blob object at `techbridge/tasks.json`.

### Connect persistent storage on Vercel

1. Open the TechBridge project in Vercel and select **Storage**.
2. Create a **Blob** store and connect it to this project for Production (and Preview if you want preview deployments to save changes).
3. Vercel adds the `BLOB_READ_WRITE_TOKEN` environment variable. Redeploy the site so the functions receive it.
4. Check `https://<your-deployment>/api/health`; its `persistence` value should be `vercel-blob`.

Without a connected Blob store, the production API can read the tasks bundled with the site, but task updates return `503` with `PERSISTENCE_NOT_CONFIGURED`. This avoids showing a success state for updates that would disappear when a serverless instance restarts.

## Run locally

From the `backend` directory, install dependencies and start the server:

```sh
npm install
npm start
```

Then open [http://127.0.0.1:3000/dashboard.html](http://127.0.0.1:3000/dashboard.html). The server serves the other site pages too. Use `npm run dev` to restart the server automatically while editing backend files.

## Project structure

```text
Techbridge/
├── images/
│   ├── logo.png
│   └── logo-light.png
├── index.html
├── programs.html
├── internship-tasks.html
├── challenges.html
├── dashboard.html
├── style.css
├── script.js
├── dashboard.js
├── .gitignore
├── package.json
├── api/
│   ├── health.js
│   ├── tasks.js
│   └── tasks/
│       └── [id].js
├── backend/
│   ├── task-store.js
│   ├── vercel-api.js
│   ├── data/
│   │   └── tasks.json
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── README.md
```

## Project history

- **Task 1:** Created the TechBridge homepage using the organization details, application and community links, and responsive HTML/CSS from the assignment brief.
- **Task 2:** Added the Programs experience for Data Analytics and Web Development, including skills and navigation between the homepage and programs page.
- **Task 3:** Added an internship roadmap that presents the Web Development tasks in order and connects with the existing pages.
- **Task 4:** Added the interactive two-track roadmap. Visitors can switch between the eight Data Analytics tasks and the eight Web Development tasks without a page refresh.
- **Task 5:** Added the Challenge Hub with six track-specific challenges, combined track and difficulty filtering, reset controls, and an accessible detail dialog.
- **Task 6:** Added the Intern Dashboard with task status tracking, progress calculations, status filters, task details, a Challenge Hub link, and an interactive modern technology explorer.
- **Task 7:** Added a Node.js/Express task API, JSON task data for both tracks, dashboard API loading/error/connection states, task detail GET requests, and persisted task-status updates.
- **Vercel deployment:** Added serverless API routes and private Blob-backed task persistence, while keeping the local Express/JSON workflow. Connect a Blob store to the Vercel project to enable durable production status updates.
