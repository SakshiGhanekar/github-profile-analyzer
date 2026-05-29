const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { validateAnalyzeProfile } = require('../middleware/validator');

/**
 * @swagger
 * /api/github/analyze/{username}:
 *   post:
 *     summary: Analyze and store a GitHub profile
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Profile analyzed successfully
 */
router.post('/analyze/:username', validateAnalyzeProfile, githubController.analyzeAndStoreProfile);

/**
 * @swagger
 * /api/github/profiles:
 *   get:
 *     summary: Retrieve a list of analyzed profiles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of profiles
 */
router.get('/profiles', githubController.getAllProfiles);

/**
 * @swagger
 * /api/github/profile/{username}:
 *   get:
 *     summary: Get a single profile by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The profile data
 */
router.get('/profile/:username', githubController.getProfileByUsername);

/**
 * @swagger
 * /api/github/profile/{username}:
 *   delete:
 *     summary: Delete a profile
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete('/profile/:username', githubController.deleteProfile);

module.exports = router;
