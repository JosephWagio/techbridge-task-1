'use strict';

const { PersistenceConfigurationError, readTasks, writeTasks, usesVercelBlob } = require('./task-store');

const VALID_TRACKS = new Set(['web-development', 'data-analytics']);
const VALID_STATUSES = new Set(['completed', 'in-progress', 'not-started']);

function send(res, status, payload) {
  res.status(status).json(payload);
}

function getTrack(req, res) {
  const requestedTrack = req.query.track || 'web-development';
  if (!VALID_TRACKS.has(requestedTrack)) {
    send(res, 400, { error: 'Invalid track. Use web-development or data-analytics.' });
    return null;
  }
  return requestedTrack;
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

async function handleApi(req, res, route) {
  try {
    const tasks = await readTasks();
    if (route === 'health') {
      return send(res, 200, {
        status: 'connected',
        persistence: usesVercelBlob() ? 'vercel-blob' : process.env.VERCEL === '1' ? 'read-only' : 'local-json',
        taskCount: tasks.length,
        tracks: [...VALID_TRACKS]
      });
    }

    if (route === 'collection') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return send(res, 405, { error: 'Method not allowed.' });
      }
      if (req.query.track === undefined) {
        return send(res, 200, { tasks: [...tasks].sort((a, b) => a.track.localeCompare(b.track) || a.number - b.number) });
      }
      const track = getTrack(req, res);
      if (!track) return;
      return send(res, 200, { track, tasks: tasks.filter(task => task.track === track).sort((a, b) => a.number - b.number) });
    }

    const track = getTrack(req, res);
    if (!track) return;
    const id = Number(route);
    if (!Number.isInteger(id) || id < 1) return send(res, 400, { error: 'Task id must be a positive integer.' });
    const task = tasks.find(item => item.id === id && item.track === track);
    if (!task) return send(res, 404, { error: `Task ${id} was not found for ${track}.` });

    if (req.method === 'GET') return send(res, 200, { task });
    if (req.method !== 'PUT') {
      res.setHeader('Allow', 'GET, PUT');
      return send(res, 405, { error: 'Method not allowed.' });
    }

    const { status } = parseBody(req);
    if (!VALID_STATUSES.has(status)) {
      return send(res, 400, { error: 'Status must be completed, in-progress, or not-started.' });
    }

    task.status = status;
    await writeTasks(tasks);
    return send(res, 200, { task });
  } catch (error) {
    if (error instanceof PersistenceConfigurationError) {
      return send(res, 503, { error: error.message, code: 'PERSISTENCE_NOT_CONFIGURED' });
    }
    console.error('TechBridge API error:', error);
    return send(res, 500, { error: 'The server could not complete the request.' });
  }
}

module.exports = handleApi;
