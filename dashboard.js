const dashboard = document.getElementById('dashboard-task-list');

if (dashboard) {
  const API_BASE = '/api';
  const trackPicker = document.getElementById('dashboard-track');
  const dashboardLoading = document.getElementById('dashboard-loading');
  const dashboardError = document.getElementById('dashboard-error');
  const dashboardEmpty = document.getElementById('dashboard-empty');
  const taskDialog = document.getElementById('dashboard-task-dialog');
  let selectedTrack = trackPicker.value;
  let activeStatusFilter = 'all';
  let currentTasks = [];
  let loadSequence = 0;

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

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  async function requestJson(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error('The backend returned an unreadable response.');
    }
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
  }

  function updateApiStatus(status, message) {
    const indicator = document.getElementById('api-status');
    indicator.classList.remove('is-loading', 'is-connected', 'is-offline');
    indicator.classList.add(`is-${status}`);
    document.getElementById('api-status-label').textContent = message;
  }

  function statusLabel(status) {
    return status === 'in-progress' ? 'In progress' : status === 'not-started' ? 'Not started' : 'Completed';
  }

  function updateProgress() {
    const completed = currentTasks.filter(task => task.status === 'completed').length;
    const inProgress = currentTasks.filter(task => task.status === 'in-progress').length;
    const notStarted = currentTasks.filter(task => task.status === 'not-started').length;
    const total = 8;
    const remaining = total - completed;
    const percent = (completed / total) * 100;
    const percentLabel = Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(1)}%`;
    const currentTask = currentTasks.find(task => task.status !== 'completed');
    const trackName = currentTasks[0]?.trackName || (selectedTrack === 'data-analytics' ? 'Data Analytics' : 'Web Development');

    document.getElementById('intern-track-name').textContent = `${trackName} Intern`;
    document.getElementById('completed-count').textContent = String(completed);
    document.getElementById('progress-percent').textContent = percentLabel;
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-track').setAttribute('aria-valuenow', String(completed));
    document.getElementById('remaining-count').textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
    document.getElementById('active-task-label').textContent = currentTasks.length === 0
      ? 'Tasks appear when the backend connects'
      : currentTask ? `Next up: Task ${currentTask.number}` : 'All tasks completed';
    document.getElementById('stat-completed').textContent = String(completed);
    document.getElementById('stat-progress').textContent = String(inProgress);
    document.getElementById('stat-upcoming').textContent = String(notStarted);
    document.getElementById('filter-count-all').textContent = String(currentTasks.length);
    document.getElementById('filter-count-completed').textContent = String(completed);
    document.getElementById('filter-count-in-progress').textContent = String(inProgress);
    document.getElementById('filter-count-not-started').textContent = String(notStarted);
  }

  function renderTasks() {
    const matchingTasks = currentTasks.filter(task => activeStatusFilter === 'all' || task.status === activeStatusFilter);
    dashboard.replaceChildren();

    matchingTasks.forEach(task => {
      const status = task.status;
      const card = makeElement('article', `dashboard-task-card status-${status}`);
      const number = makeElement('span', 'dashboard-task-number', String(task.number).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');

      const content = makeElement('div', 'dashboard-task-content');
      const headingRow = makeElement('div', 'dashboard-task-heading');
      const heading = makeElement('div', 'dashboard-task-title-wrap');
      heading.append(makeElement('p', 'task-kicker', `Task ${task.number} · Day ${task.day}`));
      heading.append(makeElement('h3', '', task.title));

      const badge = makeElement('span', `dashboard-status-badge status-badge-${status}`);
      const dot = makeElement('span', 'status-dot', '');
      dot.setAttribute('aria-hidden', 'true');
      badge.append(dot, document.createTextNode(statusLabel(status)));
      headingRow.append(heading, badge);
      content.append(headingRow, makeElement('p', 'dashboard-task-description', task.description));

      const actions = makeElement('div', 'dashboard-task-actions');
      const detailsButton = makeElement('button', 'btn btn-ghost dashboard-view-task', 'View task');
      detailsButton.type = 'button';
      detailsButton.dataset.taskId = String(task.id);
      detailsButton.setAttribute('aria-haspopup', 'dialog');

      const isComplete = status === 'completed';
      const statusButton = makeElement('button', isComplete ? 'dashboard-complete-button is-done' : 'dashboard-complete-button', isComplete ? 'Undo completion' : 'Mark as completed');
      statusButton.type = 'button';
      statusButton.dataset.updateTaskId = String(task.id);
      statusButton.disabled = Boolean(task.saving);
      actions.append(detailsButton, statusButton);
      content.append(actions);
      card.append(number, content);
      dashboard.append(card);
    });

    dashboardEmpty.hidden = currentTasks.length === 0 || matchingTasks.length > 0;
    updateProgress();
  }

  function updateFilterButtons(value) {
    document.querySelectorAll('[data-status-filter]').forEach(button => {
      const selected = button.dataset.statusFilter === value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function showApiError(message, title = 'Unable to load tasks.') {
    document.getElementById('dashboard-error-title').textContent = title;
    document.getElementById('dashboard-error-message').textContent = message;
    dashboardError.hidden = false;
    updateApiStatus('offline', 'Backend status: Offline');
  }

  async function loadTasks() {
    const sequence = ++loadSequence;
    const requestedTrack = selectedTrack;
    currentTasks = [];
    dashboard.replaceChildren();
    dashboardEmpty.hidden = true;
    dashboardError.hidden = true;
    dashboardLoading.hidden = false;
    updateApiStatus('loading', 'Backend status: Connecting');
    updateProgress();

    try {
      const result = await requestJson(`/tasks?track=${encodeURIComponent(requestedTrack)}`);
      if (sequence !== loadSequence) return;
      if (!Array.isArray(result.tasks)) throw new Error('The backend response did not include a task list.');
      currentTasks = result.tasks;
      dashboardLoading.hidden = true;
      updateApiStatus('connected', 'Backend status: Connected');
      renderTasks();
    } catch (error) {
      if (sequence !== loadSequence) return;
      dashboardLoading.hidden = true;
      showApiError(`${error.message} Check that the backend is running, then try again.`);
      renderTasks();
    }
  }

  async function showTaskDetails(taskId) {
    const taskTitle = document.getElementById('task-dialog-title');
    const taskDescription = document.getElementById('task-dialog-description');
    const taskMeta = document.getElementById('task-dialog-meta');
    document.getElementById('task-dialog-track').textContent = selectedTrack === 'data-analytics' ? 'Data Analytics' : 'Web Development';
    document.getElementById('task-dialog-number').textContent = 'Loading task details…';
    taskTitle.textContent = 'Loading task…';
    taskDescription.textContent = 'Requesting this task from the TechBridge API.';
    taskMeta.replaceChildren();
    taskDialog.showModal();

    try {
      const result = await requestJson(`/tasks/${encodeURIComponent(taskId)}?track=${encodeURIComponent(selectedTrack)}`);
      const task = result.task;
      if (!task) throw new Error('The backend did not return this task.');
      document.getElementById('task-dialog-number').textContent = `Task ${task.number} · Day ${task.day}`;
      taskTitle.textContent = task.title;
      taskDescription.textContent = task.description;
      taskMeta.replaceChildren(
        makeElement('span', `challenge-track-tag ${task.track}`, task.trackName),
        makeElement('span', 'difficulty-tag', task.difficulty),
        makeElement('span', 'difficulty-tag', statusLabel(task.status))
      );
      updateApiStatus('connected', 'Backend status: Connected');
    } catch (error) {
      document.getElementById('task-dialog-number').textContent = 'Task details';
      taskTitle.textContent = 'Task details unavailable';
      taskDescription.textContent = `${error.message} Check that the backend is running and try again.`;
      showApiError('The task details could not be retrieved. Check the backend connection and try again.', 'Unable to load task details.');
    }
  }

  async function updateTaskStatus(task, button) {
    const requestedTrack = selectedTrack;
    const nextStatus = task.status === 'completed' ? 'not-started' : 'completed';
    button.disabled = true;
    button.textContent = 'Saving…';

    try {
      const result = await requestJson(`/tasks/${encodeURIComponent(task.id)}?track=${encodeURIComponent(requestedTrack)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!result.task) throw new Error('The backend did not confirm the task update.');
      if (requestedTrack === selectedTrack) {
        currentTasks = currentTasks.map(item => item.id === result.task.id ? result.task : item);
      }
      dashboardError.hidden = true;
      updateApiStatus('connected', 'Backend status: Connected');
      renderTasks();
    } catch (error) {
      button.disabled = false;
      button.textContent = task.status === 'completed' ? 'Undo completion' : 'Mark as completed';
      showApiError(`${error.message} Your task status was not changed.`, 'Unable to update task.');
    }
  }

  dashboard.addEventListener('click', event => {
    const statusButton = event.target.closest('[data-update-task-id]');
    if (statusButton) {
      const task = currentTasks.find(item => String(item.id) === statusButton.dataset.updateTaskId);
      if (task) updateTaskStatus(task, statusButton);
      return;
    }

    const detailsButton = event.target.closest('[data-task-id]');
    if (detailsButton) showTaskDetails(detailsButton.dataset.taskId);
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
    loadTasks();
  });

  document.getElementById('retry-task-load').addEventListener('click', loadTasks);
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
    const technologyLink = document.getElementById('technology-link');
    technologyLink.href = item.link;
    technologyLink.textContent = `${item.linkLabel} ↗`;

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

  loadTasks();
}
