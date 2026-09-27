const yearLabel = document.getElementById('year');
if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const internshipTracks = {
  'data-analytics': {
    name: 'Data Analytics',
    tasks: [
      {
        number: 1,
        day: 1,
        title: 'Data Cleaning Basics',
        description: 'Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.',
        difficulty: 'Beginner'
      },
      {
        number: 2,
        day: 4,
        title: 'Formulas & Pivot Tables',
        description: 'Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.',
        difficulty: 'Beginner'
      },
      {
        number: 3,
        day: 8,
        title: 'Data Visualization',
        description: 'Create charts and a simple dashboard that communicate useful insights from a dataset.',
        difficulty: 'Beginner → Intermediate'
      },
      {
        number: 4,
        day: 11,
        title: 'Introduction to SQL',
        description: 'Practice basic SQL queries and use them to answer real-world questions about data.',
        difficulty: 'Beginner → Intermediate'
      },
      {
        number: 5,
        day: 15,
        title: 'SQL Joins & Aggregations',
        description: 'Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.',
        difficulty: 'Intermediate'
      },
      {
        number: 6,
        day: 19,
        title: 'Lookup Functions & Data Wrangling',
        description: 'Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.',
        difficulty: 'Intermediate'
      },
      {
        number: 7,
        day: 22,
        title: 'Mini Analysis Project',
        description: 'Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.',
        difficulty: 'Intermediate'
      },
      {
        number: 8,
        day: 26,
        title: 'Capstone Project',
        description: 'Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.',
        difficulty: 'Intermediate'
      }
    ]
  },
  'web-development': {
    name: 'Web Development',
    tasks: [
      {
        number: 1,
        day: 1,
        title: 'Build the TechBridge Homepage',
        description: 'Create the first version of the TechBridge website using HTML and CSS.',
        difficulty: 'Beginner'
      },
      {
        number: 2,
        day: 4,
        title: 'Build the TechBridge Programs Experience',
        description: "Create a Programs experience presenting TechBridge's available learning programs.",
        difficulty: 'Beginner'
      },
      {
        number: 3,
        day: 8,
        title: 'Build the Internship Tasks Experience',
        description: 'Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.',
        difficulty: 'Beginner → Intermediate'
      },
      {
        number: 4,
        day: 11,
        title: 'Build an Interactive Internship Roadmap',
        description: 'Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.',
        difficulty: 'Beginner → Intermediate'
      },
      {
        number: 5,
        day: 15,
        title: 'Build the Intern Registration Experience',
        description: 'Create a professional registration and onboarding interface for TechBridge interns.',
        difficulty: 'Intermediate'
      },
      {
        number: 6,
        day: 19,
        title: 'Build the Task Submission System',
        description: 'Create an interface through which interns can prepare and submit their task work.',
        difficulty: 'Intermediate'
      },
      {
        number: 7,
        day: 22,
        title: 'Build the Intern Dashboard',
        description: 'Create a dashboard where an intern can view their profile, progress, tasks and submissions.',
        difficulty: 'Intermediate'
      },
      {
        number: 8,
        day: 26,
        title: 'Build the Complete TechBridge Internship Platform',
        description: 'Combine the different components created during the internship into a complete TechBridge platform.',
        difficulty: 'Intermediate'
      }
    ]
  }
};

const trackButtons = document.querySelectorAll('[data-track]');
const taskList = document.getElementById('task-list');
const selectedTrackHeading = document.getElementById('selected-track-heading');
const trackCurrentLabel = document.getElementById('track-current');
let currentTrack = 'web-development';

function renderTrack(trackKey) {
  const track = internshipTracks[trackKey];
  if (!track || !taskList) return;

  taskList.replaceChildren();
  track.tasks.forEach(task => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const marker = document.createElement('span');
    marker.className = 'task-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = String(task.number).padStart(2, '0');

    const card = document.createElement('article');
    card.className = 'task-card';

    const main = document.createElement('div');
    main.className = 'task-card-main';

    const kicker = document.createElement('p');
    kicker.className = 'task-kicker';
    kicker.textContent = `Task ${task.number}`;

    const title = document.createElement('h3');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const day = document.createElement('span');
    day.className = 'task-day';
    day.textContent = `Day ${task.day}`;

    const difficulty = document.createElement('span');
    difficulty.className = 'difficulty-tag';
    difficulty.textContent = task.difficulty;

    main.append(kicker, title, description);
    meta.append(day, difficulty);
    card.append(main, meta);
    item.append(marker, card);
    taskList.append(item);
  });

  taskList.setAttribute('aria-label', `${track.name} internship tasks`);
  selectedTrackHeading.textContent = track.name;
  trackCurrentLabel.textContent = `Currently viewing ${track.name}`;
  trackButtons.forEach(button => {
    const isSelected = button.dataset.track === trackKey;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

trackButtons.forEach(button => {
  button.addEventListener('click', () => {
    const requestedTrack = button.dataset.track;
    if (!Object.prototype.hasOwnProperty.call(internshipTracks, requestedTrack)) return;
    currentTrack = requestedTrack;
    renderTrack(currentTrack);
  });
});

if (taskList) {
  renderTrack(currentTrack);
}

const challenges = [
  {
    id: 'monthly-sales-snapshot',
    title: 'Monthly Sales Snapshot',
    track: 'data-analytics',
    trackName: 'Data Analytics',
    difficulty: 'Beginner',
    description: 'Clean a small sales sheet, compare monthly totals, and spot the products contributing most to revenue.',
    outcome: 'A tidy sales summary with a chart and three clear observations.',
    objective: 'Turn transaction rows into a concise view of monthly sales performance and product trends.',
    skills: ['Spreadsheet cleaning', 'SUM and percentage formulas', 'Pivot Tables', 'Chart selection'],
    tools: ['Google Sheets or Excel'],
    deliverable: 'A one-page dashboard or report with monthly totals, a product comparison, and three evidence-based findings.'
  },
  {
    id: 'customer-segment-profile',
    title: 'Customer Segment Profile',
    track: 'data-analytics',
    trackName: 'Data Analytics',
    difficulty: 'Intermediate',
    description: 'Group sample customer records into useful segments and compare how often each group purchases.',
    outcome: 'A segment comparison that explains which groups are most active and why.',
    objective: 'Use customer attributes and order history to describe a few meaningful customer groups.',
    skills: ['Filtering and grouping', 'Pivot Tables', 'Summary statistics', 'Business-focused analysis'],
    tools: ['Google Sheets or Excel'],
    deliverable: 'A segment summary table or chart with a short recommendation grounded in the data.'
  },
  {
    id: 'expense-review',
    title: 'Operating Expense Review',
    track: 'data-analytics',
    trackName: 'Data Analytics',
    difficulty: 'Intermediate',
    description: 'Review a sample expense ledger, standardize categories, and compare spending across months.',
    outcome: 'A monthly expense breakdown that highlights the largest categories and notable changes.',
    objective: 'Prepare inconsistent expense entries for analysis and identify where spending changed over time.',
    skills: ['Data cleaning', 'Category standardization', 'Monthly aggregation', 'Data visualization'],
    tools: ['Google Sheets or Excel'],
    deliverable: 'A clean expense table, a category chart, and a brief note describing two spending patterns.'
  },
  {
    id: 'responsive-launch-page',
    title: 'Responsive Launch Page',
    track: 'web-development',
    trackName: 'Web Development',
    difficulty: 'Beginner',
    description: 'Create a clear landing page for a fictional digital product, with a strong introduction and one primary action.',
    outcome: 'A polished page that adapts from desktop to mobile and guides visitors to one clear next step.',
    objective: 'Practice structuring and styling a focused, responsive web page with semantic HTML and CSS.',
    skills: ['Semantic HTML', 'CSS layout', 'Responsive design', 'Visual hierarchy'],
    tools: ['HTML', 'CSS', 'Browser developer tools'],
    deliverable: 'A responsive landing page with a headline, product summary, key benefits, and a working call-to-action link.'
  },
  {
    id: 'portfolio-showcase',
    title: 'Portfolio Showcase',
    track: 'web-development',
    trackName: 'Web Development',
    difficulty: 'Beginner',
    description: 'Build a simple portfolio page that introduces its owner and presents a small collection of project work.',
    outcome: 'A mobile-friendly portfolio that makes the projects and their purpose easy to scan.',
    objective: 'Organize profile and project information into a readable page with consistent visual styling.',
    skills: ['HTML structure', 'CSS typography and spacing', 'Responsive grids', 'Accessible links'],
    tools: ['HTML', 'CSS'],
    deliverable: 'A portfolio page with an introduction, at least three project summaries, and clear navigation.'
  },
  {
    id: 'interactive-contact-form',
    title: 'Interactive Contact Form',
    track: 'web-development',
    trackName: 'Web Development',
    difficulty: 'Intermediate',
    description: 'Create a contact form with useful field labels, browser-side validation, and a clear submission confirmation state.',
    outcome: 'A form that helps visitors correct missing or invalid entries and understand what happens next.',
    objective: 'Combine accessible form markup with JavaScript input checks and feedback.',
    skills: ['Form semantics', 'JavaScript events', 'Input validation', 'DOM updates'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    deliverable: 'A responsive form with name, email, and message fields plus inline validation and a confirmation message.'
  }
];

const challengeGrid = document.getElementById('challenge-grid');
const challengeCount = document.getElementById('challenge-count');
const challengeEmpty = document.getElementById('challenge-empty');
const challengeDialog = document.getElementById('challenge-dialog');

function createTag(text, className) {
  const tag = document.createElement('span');
  tag.className = className;
  tag.textContent = text;
  return tag;
}

function getVisibleChallenges() {
  return challenges.filter(challenge => {
    const matchesTrack = activeChallengeFilters.track === 'all' || challenge.track === activeChallengeFilters.track;
    const matchesDifficulty = activeChallengeFilters.difficulty === 'all' || challenge.difficulty.toLowerCase() === activeChallengeFilters.difficulty;
    return matchesTrack && matchesDifficulty;
  });
}

let activeChallengeFilters = { track: 'all', difficulty: 'all' };

function renderChallenges() {
  if (!challengeGrid) return;

  const visibleChallenges = getVisibleChallenges();
  challengeGrid.replaceChildren();
  visibleChallenges.forEach(challenge => {
    const card = document.createElement('article');
    card.className = 'challenge-card';

    const cardTop = document.createElement('div');
    cardTop.className = 'challenge-card-top';
    const tags = document.createElement('div');
    tags.className = 'challenge-tags';
    tags.append(
      createTag(challenge.trackName, `challenge-track-tag ${challenge.track}`),
      createTag(challenge.difficulty, 'difficulty-tag')
    );

    const title = document.createElement('h3');
    title.textContent = challenge.title;

    const description = document.createElement('p');
    description.className = 'challenge-description';
    description.textContent = challenge.description;

    const outcome = document.createElement('p');
    outcome.className = 'challenge-outcome';
    const outcomeLabel = document.createElement('strong');
    outcomeLabel.textContent = 'Expected outcome';
    const outcomeText = document.createElement('span');
    outcomeText.textContent = challenge.outcome;
    outcome.append(outcomeLabel, outcomeText);

    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-ghost challenge-view';
    viewButton.type = 'button';
    viewButton.dataset.challengeId = challenge.id;
    viewButton.setAttribute('aria-haspopup', 'dialog');
    viewButton.textContent = 'View challenge';

    cardTop.append(tags);
    card.append(cardTop, title, description, outcome, viewButton);
    challengeGrid.append(card);
  });

  challengeCount.textContent = visibleChallenges.length === challenges.length
    ? `Showing ${visibleChallenges.length} challenges`
    : `Showing ${visibleChallenges.length} of ${challenges.length} challenges`;
  challengeEmpty.hidden = visibleChallenges.length > 0;
  challengeGrid.hidden = visibleChallenges.length === 0;
}

function updateChallengeFilterButtons(group, activeValue) {
  group.querySelectorAll('[data-filter-value]').forEach(button => {
    const isSelected = button.dataset.filterValue === activeValue;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function showChallengeDetails(challenge) {
  if (!challengeDialog || !challenge) return;

  document.getElementById('challenge-detail-track').textContent = challenge.trackName;
  document.getElementById('challenge-detail-title').textContent = challenge.title;
  document.getElementById('challenge-detail-summary').textContent = challenge.description;

  const meta = document.getElementById('challenge-detail-meta');
  meta.replaceChildren(
    createTag(challenge.trackName, `challenge-track-tag ${challenge.track}`),
    createTag(challenge.difficulty, 'difficulty-tag')
  );

  document.getElementById('challenge-detail-objective').textContent = challenge.objective;
  document.getElementById('challenge-detail-skills').textContent = challenge.skills.join(' · ');
  document.getElementById('challenge-detail-tools').textContent = challenge.tools.join(' · ');
  document.getElementById('challenge-detail-outcome').textContent = challenge.deliverable;
  challengeDialog.showModal();
}

if (challengeGrid) {
  const filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('[data-filter-value]');
      if (!button) return;

      const filterName = group.dataset.filterGroup;
      activeChallengeFilters[filterName] = button.dataset.filterValue;
      updateChallengeFilterButtons(group, activeChallengeFilters[filterName]);
      renderChallenges();
    });
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    activeChallengeFilters = { track: 'all', difficulty: 'all' };
    filterGroups.forEach(group => updateChallengeFilterButtons(group, 'all'));
    renderChallenges();
  });

  challengeGrid.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-challenge-id]');
    if (!viewButton) return;
    const selectedChallenge = challenges.find(challenge => challenge.id === viewButton.dataset.challengeId);
    showChallengeDetails(selectedChallenge);
  });

  document.getElementById('dialog-close').addEventListener('click', () => challengeDialog.close());
  challengeDialog.addEventListener('click', event => {
    if (event.target === challengeDialog) challengeDialog.close();
  });

  renderChallenges();
}
