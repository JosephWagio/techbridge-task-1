'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');
const BLOB_PATH = 'techbridge/tasks.json';

class PersistenceConfigurationError extends Error {
  constructor() {
    super('Connect a Vercel Blob store to this project to save task updates.');
    this.name = 'PersistenceConfigurationError';
  }
}

function usesVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readTasks() {
  if (usesVercelBlob()) {
    const { get } = require('@vercel/blob');
    const blob = await get(BLOB_PATH, { access: 'private', useCache: false });
    if (blob?.statusCode === 200 && blob.stream) {
      return JSON.parse(await new Response(blob.stream).text());
    }
  }

  return JSON.parse(await fs.readFile(TASKS_FILE, 'utf8'));
}

async function writeTasks(tasks) {
  if (usesVercelBlob()) {
    const { put } = require('@vercel/blob');
    await put(BLOB_PATH, JSON.stringify(tasks, null, 2), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60
    });
    return;
  }

  if (process.env.VERCEL === '1') throw new PersistenceConfigurationError();
  await fs.writeFile(TASKS_FILE, `${JSON.stringify(tasks, null, 2)}\n`, 'utf8');
}

module.exports = { PersistenceConfigurationError, readTasks, writeTasks, usesVercelBlob };
