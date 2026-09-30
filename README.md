# TechBridge website

TechBridge by Baselink Services Limited — **Bridging Learning to Real-World Experience**.

This is a responsive multi-page website for TechBridge's learning programs and practical internship. It is built with HTML5 and CSS3, with vanilla JavaScript for the mobile navigation, current year, interactive internship roadmap, Challenge Hub, and intern dashboard.

## Pages

- `index.html` — TechBridge homepage, organization introduction, programs overview, 30-day internship, application, and community links.
- `programs.html` — Data Analytics and Web Development program details and skills.
- `internship-tasks.html` — an interactive 30-day roadmap where visitors can switch between Data Analytics and Web Development and explore eight tasks for each track.
- `challenges.html` — an interactive Challenge Hub with track and difficulty filters and an in-page detail dialog.
- `dashboard.html` — a sample intern dashboard with a two-track task tracker, progress summary, task details, Challenge Hub preview, and interactive technology explorer.

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

The dashboard lets a sample intern switch between Data Analytics and Web Development, view all eight track tasks, filter by task status, open task details, and mark tasks complete. Counts and the progress bar update without reloading. Per-track progress is saved in browser local storage on that device; use **Reset demo progress** to restore the sample state (two completed tasks, one in progress, and five not started). This is a frontend demo and does not use accounts or a server.

The technology explorer introduces Next.js, Vue.js, Angular, and backend development. Its Backend view includes Node.js, Express.js, and Django, with links to their documentation.

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
└── README.md
```

## Run locally

Open `index.html` in a browser. The pages link to each other using relative paths and do not require a build step or server.

## Project history

- **Task 1:** Created the TechBridge homepage using the organization details, application and community links, and responsive HTML/CSS from the assignment brief.
- **Task 2:** Added the Programs experience for Data Analytics and Web Development, including skills and navigation between the homepage and programs page.
- **Task 3:** Added an internship roadmap that presents the Web Development tasks in order and connects with the existing pages.
- **Task 4:** Added the interactive two-track roadmap. Visitors can switch between the eight Data Analytics tasks and the eight Web Development tasks without a page refresh.
- **Task 5:** Added the Challenge Hub with six track-specific challenges, combined track and difficulty filtering, reset controls, and an accessible detail dialog.
- **Task 6:** Added the Intern Dashboard with task status tracking, progress calculations, status filters, task details, browser-local progress saving, a Challenge Hub link, and an interactive modern technology explorer.
