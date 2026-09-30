'use strict';

const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');
const PORT = Number(process.env.PORT) || 3000;
const VALID_TRACKS = new Set(['web-development', 'data-analytics']);
const VALID_STATUSES = new Set(['completed', 'in-progress', 'not-started']);
const FRONTEND_PAGES = ['/', '/index.html', '/programs.html', '/internship-tasks.html', '/challenges.html', '/dashboard.html'];
const FRONTEND_ASSETS = ['/style.css', '/script.js', '/dashboard.js'];

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

let tasks;
let writeQueue = Promise.resolve();

async function loadTasks() {
  const fileContents = await fs.readFile(TASKS_FILE, 'utf8');
  const parsed = JSON.parse(fileContents);
  if (!Array.isArray(parsed)) throw new Error('backend/data/tasks.json must contain a JSON array.');
  return parsed;
}

function saveTasks() {
  const snapshot = `${JSON.stringify(tasks, null, 2)}\n`;
  const pendingWrite = writeQueue.catch(() => {}).then(() => fs.writeFile(TASKS_FILE, snapshot, 'utf8'));
  writeQueue = pendingWrite;
  return pendingWrite;
}

function getTrackFromQuery(req, res) {
  const requestedTrack = req.query.track || 'web-development';
  if (!VALID_TRACKS.has(requestedTrack)) {
    res.status(400).json({ error: 'Invalid track. Use web-development or data-analytics.' });
    return null;
  }
  return requestedTrack;
}

function findTask(id, track) {
  return tasks.find(task => task.id === id && task.track === track);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'connected', taskCount: tasks.length, tracks: [...VALID_TRACKS] });
});

app.get('/api/tasks', (req, res) => {
  if (req.query.track === undefined) {
    return res.json({ tasks: [...tasks].sort((a, b) => a.track.localeCompare(b.track) || a.number - b.number) });
  }

  const track = getTrackFromQuery(req, res);
  if (!track) return;
  res.json({ track, tasks: tasks.filter(task => task.track === track).sort((a, b) => a.number - b.number) });
});

app.get('/api/tasks/:id', (req, res) => {
  const track = getTrackFromQuery(req, res);
  if (!track) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Task id must be a positive integer.' });

  const task = findTask(id, track);
  if (!task) return res.status(404).json({ error: `Task ${id} was not found for ${track}.` });
  res.json({ task });
});

app.put('/api/tasks/:id', async (req, res, next) => {
  const track = getTrackFromQuery(req, res);
  if (!track) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Task id must be a positive integer.' });

  const task = findTask(id, track);
  if (!task) return res.status(404).json({ error: `Task ${id} was not found for ${track}.` });
  const { status } = req.body || {};
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Status must be completed, in-progress, or not-started.' });
  }

  const previousStatus = task.status;
  task.status = status;
  try {
    await saveTasks();
    res.json({ task });
  } catch (error) {
    task.status = previousStatus;
    next(error);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

app.get(FRONTEND_PAGES, (req, res, next) => {
  const requestedFile = req.path === '/' ? 'index.html' : req.path.slice(1);
  res.sendFile(path.join(PROJECT_ROOT, requestedFile), error => {
    if (error) next(error);
  });
});

app.get(FRONTEND_ASSETS, (req, res, next) => {
  res.sendFile(path.join(PROJECT_ROOT, req.path.slice(1)), error => {
    if (error) next(error);
  });
});

app.use('/images', express.static(path.join(PROJECT_ROOT, 'images'), { fallthrough: false }));

app.use((req, res) => {
  res.status(404).type('text/plain').send('Page not found.');
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error(error);
  res.status(500).json({ error: 'The server could not complete the request.' });
});

loadTasks()
  .then(loadedTasks => {
    tasks = loadedTasks;
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`TechBridge Task API running at http://127.0.0.1:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Could not load task data:', error.message);
    process.exitCode = 1;
  });
