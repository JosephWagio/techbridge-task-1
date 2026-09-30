'use strict';
module.exports = (req, res) => require('../../backend/vercel-api')(req, res, req.query.id);
