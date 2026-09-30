const dashboard = document.getElementById('dashboard-task-list');

if (dashboard && typeof internshipTracks !== 'undefined') {
  const TRACK_STORAGE_KEY = 'techbridge-dashboard-progress-v1';
  const trackPicker = document.getElementById('dashboard-track');
  const totalTasks = 8;
  let selectedTrack = trackPicker.value;
  let activeStatusFilter = 'all';

  const taskStatuses = loadStatuses();
  const technologyContent = {
    nextjs: {
      index: '01', category: 'React framework', title: 'Next.js',
      description: 'Next.js is a React framework for building full-stack web applications. It adds tools and conventions for routing, rendering pages, and connecting a user interface to server-side features.',
      link: 'https://nextjs.org/learn', linkLabel: 'Explore the official guide'
    },
    vue: {
      index: '02', category: 'JavaScript framework', title: 'Vue.js',
      description: 'Vue is a progressive JavaScript framework for building user interfaces. Developers use its component-based approach to make interactive pages and applications, adding it gradually or using it for a full application.',
      link: 'https://vuejs.org/guide/introduction.html', linkLabel: 'Explore the official guide'
    },
    angular: {
      index: '03', category: 'Web application framework', title: 'Angular',
      description: 'Angular is a web framework with a broad set of tools for building applications. Its structure and built-in features make it a common choice for larger products and teams that need a consistent way to organize complex interfaces.',
      link: 'https://angular.dev/overview', linkLabel: 'Explore the official guide'
    },
    backend: {
      index: '04', category: 'Server-side development', title: 'Backend development',
      description: 'Backend development builds the server-side parts of a product: receiving requests from the frontend, applying rules, working with data, and returning a response. The frontend presents that response to the user.',
      link: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side', linkLabel: 'Learn about server-side development'
    }
  };

  function loadStatuses() {
    const initial = {};
    Object.keys(internshipTracks).forEach(trackKey => {
      initial[trackKey] = internshipTracks[trackKey].tasks.map((task, index) =>
        index < 2 ? 'completed' : index === 2 ? 'in-progress' : 'not-started'
      );
    });

    try {
      const saved = JSON.parse(localStorage.getItem(TRACK_STORAGE_KEY));
      Object.keys(initial).forEach(trackKey => {
        if (!Array.isArray(saved?.[trackKey])) return;
        initial[trackKey] = initial[trackKey].map((fallback, index) => {
          const status = saved[trackKey][index];
          return ['completed', 'in-progress', 'not-started'].includes(status) ? status : fallback;
        });
      });
    } catch (error) {
      // Keep the sample progress in memory if storage is unavailable or malformed.
    }
    return initial;
  }

  function saveStatuses() {
    try {
      localStorage.setItem(TRACK_STORAGE_KEY, JSON.stringify(taskStatuses));
    } catch (error) {
      // The dashboard remains interactive when browser storage is disabled.
    }
  }

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function statusLabel(status) {
    return status === 'in-progress' ? 'In progress' : status === 'not-started' ? 'Not started' : 'Completed';
  }

  function updateProgress() {
    const track = internshipTracks[selectedTrack];
    const statuses = taskStatuses[selectedTrack];
    const completed = statuses.filter(status => status === 'completed').length;
    const inProgress = statuses.filter(status => status === 'in-progress').length;
    const notStarted = totalTasks - completed - inProgress;
    const remaining = totalTasks - completed;
    const percent = Math.round((completed / totalTasks) * 100);
    const currentTask = statuses.findIndex(status => status !== 'completed');

    document.getElementById('intern-track-name').textContent = `${track.name} Intern`;
    document.getElementById('completed-count').textContent = String(completed);
    document.getElementById('progress-percent').textContent = `${percent}%`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-track').setAttribute('aria-valuenow', String(completed));
    document.getElementById('remaining-count').textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
    document.getElementById('active-task-label').textContent = currentTask < 0 ? 'All tasks completed' : `Next up: Task ${currentTask + 1}`;
    document.getElementById('stat-completed').textContent = String(completed);
    document.getElementById('stat-progress').textContent = String(inProgress);
    document.getElementById('stat-upcoming').textContent = String(notStarted);
    document.getElementById('filter-count-all').textContent = String(totalTasks);
    document.getElementById('filter-count-completed').textContent = String(completed);
    document.getElementById('filter-count-in-progress').textContent = String(inProgress);
    document.getElementById('filter-count-not-started').textContent = String(notStarted);
  }

  function renderTasks() {
    const track = internshipTracks[selectedTrack];
    const statuses = taskStatuses[selectedTrack];
    const matchingTasks = track.tasks.filter((task, index) => activeStatusFilter === 'all' || statuses[index] === activeStatusFilter);

    dashboard.replaceChildren();
    matchingTasks.forEach(task => {
      const status = statuses[task.number - 1];
      const card = makeElement('article', `dashboard-task-card status-${status}`);
      const number = makeElement('span', 'dashboard-task-number', String(task.number).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');

      const content = makeElement('div', 'dashboard-task-content');
      const headingRow = makeElement('div', 'dashboard-task-heading');
      const heading = makeElement('div', 'dashboard-task-title-wrap');
      heading.append(makeElement('p', 'task-kicker', `Task ${task.number} · Day ${task.day}`));
      heading.append(makeElement('h3', '', task.title));
      const badge = makeElement('span', `dashboard-status-badge status-badge-${status}`);
      badge.append(makeElement('span', 'status-dot', ''));
      badge.lastChild.setAttribute('aria-hidden', 'true');
      badge.append(document.createTextNode(statusLabel(status)));
      headingRow.append(heading, badge);

      content.append(headingRow, makeElement('p', 'dashboard-task-description', task.description));
      const actions = makeElement('div', 'dashboard-task-actions');
      const detailsButton = makeElement('button', 'btn btn-ghost dashboard-view-task', 'View task');
      detailsButton.type = 'button';
      detailsButton.dataset.taskNumber = String(task.number);
      detailsButton.setAttribute('aria-haspopup', 'dialog');
      const statusButton = makeElement('button', status === 'completed' ? 'dashboard-complete-button is-done' : 'dashboard-complete-button', status === 'completed' ? 'Undo completion' : 'Mark as completed');
      statusButton.type = 'button';
      statusButton.dataset.completeTask = String(task.number);
      actions.append(detailsButton, statusButton);
      content.append(actions);
      card.append(number, content);
      dashboard.append(card);
    });

    document.getElementById('dashboard-empty').hidden = matchingTasks.length > 0;
    updateProgress();
  }

  function updateFilterButtons(value) {
    document.querySelectorAll('[data-status-filter]').forEach(button => {
      const selected = button.dataset.statusFilter === value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function showTaskDetails(task) {
    const dialog = document.getElementById('dashboard-task-dialog');
    document.getElementById('task-dialog-track').textContent = internshipTracks[selectedTrack].name;
    document.getElementById('task-dialog-number').textContent = `Task ${task.number} · Day ${task.day}`;
    document.getElementById('task-dialog-title').textContent = task.title;
    document.getElementById('task-dialog-description').textContent = task.description;
    const meta = document.getElementById('task-dialog-meta');
    meta.replaceChildren(
      makeElement('span', `challenge-track-tag ${selectedTrack}`, internshipTracks[selectedTrack].name),
      makeElement('span', 'difficulty-tag', task.difficulty),
      makeElement('span', 'difficulty-tag', statusLabel(taskStatuses[selectedTrack][task.number - 1]))
    );
    dialog.showModal();
  }

  dashboard.addEventListener('click', event => {
    const completeButton = event.target.closest('[data-complete-task]');
    if (completeButton) {
      const taskIndex = Number(completeButton.dataset.completeTask) - 1;
      taskStatuses[selectedTrack][taskIndex] = taskStatuses[selectedTrack][taskIndex] === 'completed' ? 'not-started' : 'completed';
      saveStatuses();
      renderTasks();
      return;
    }

    const viewButton = event.target.closest('[data-task-number]');
    if (viewButton) {
      const task = internshipTracks[selectedTrack].tasks.find(item => item.number === Number(viewButton.dataset.taskNumber));
      showTaskDetails(task);
    }
  });

  document.querySelectorAll('[data-status-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeStatusFilter = button.dataset.statusFilter;
      updateFilterButtons(activeStatusFilter);
      renderTasks();
    });
  });

  trackPicker.addEventListener('change', () => {
    selectedTrack = trackPicker.value;
    activeStatusFilter = 'all';
    updateFilterButtons('all');
    renderTasks();
  });

  document.getElementById('reset-progress').addEventListener('click', () => {
    Object.keys(internshipTracks).forEach(trackKey => {
      taskStatuses[trackKey] = internshipTracks[trackKey].tasks.map((task, index) =>
        index < 2 ? 'completed' : index === 2 ? 'in-progress' : 'not-started'
      );
    });
    activeStatusFilter = 'all';
    updateFilterButtons('all');
    saveStatuses();
    renderTasks();
  });

  const taskDialog = document.getElementById('dashboard-task-dialog');
  document.getElementById('task-dialog-close').addEventListener('click', () => taskDialog.close());
  taskDialog.addEventListener('click', event => {
    if (event.target === taskDialog) taskDialog.close();
  });

  document.getElementById('technology-tabs').addEventListener('click', event => {
    const button = event.target.closest('[data-tech]');
    if (!button) return;
    const item = technologyContent[button.dataset.tech];
    if (!item) return;

    document.querySelectorAll('[data-tech]').forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    document.getElementById('technology-index').textContent = item.index;
    document.getElementById('technology-category').textContent = item.category;
    document.getElementById('technology-title').textContent = item.title;
    document.getElementById('technology-description').textContent = item.description;
    document.getElementById('technology-link').href = item.link;
    document.getElementById('technology-link').textContent = `${item.linkLabel} ↗`;

    const extra = document.getElementById('technology-extra');
    extra.replaceChildren();
    if (button.dataset.tech === 'backend') {
      const backendTools = [
        { name: 'Node.js', detail: 'Runs JavaScript outside the browser, often to build server applications and APIs.', href: 'https://nodejs.org/en/learn' },
        { name: 'Express.js', detail: 'A lightweight Node.js web framework for building routes and HTTP APIs.', href: 'https://expressjs.com/' },
        { name: 'Django', detail: 'A Python web framework with built-in tools for common server-side features.', href: 'https://docs.djangoproject.com/' }
      ];
      const list = makeElement('div', 'backend-tech-list');
      backendTools.forEach(tool => {
        const row = makeElement('article', 'backend-tech-item');
        const link = makeElement('a', '', tool.name);
        link.href = tool.href;
        link.target = '_blank';
        link.rel = 'noopener';
        row.append(link, makeElement('p', '', tool.detail));
        list.append(row);
      });
      extra.append(list);
    }
  });

  renderTasks();
}
