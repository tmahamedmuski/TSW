const express = require('express');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projects');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getProjects)
    .post(adminAuth, createProject);

router.route('/:id')
    .put(adminAuth, updateProject)
    .delete(adminAuth, deleteProject);

module.exports = router;
