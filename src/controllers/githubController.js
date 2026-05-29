const Profile = require('../models/Profile');
const githubService = require('../services/githubService');
const profileAnalyzer = require('../utils/profileAnalyzer');

// 1. Analyze and Store Profile
const analyzeAndStoreProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    // Check if profile already exists in DB
    let existingProfile = await Profile.findOne({ where: { username } });
    if (existingProfile) {
      // Could also update here, but we'll just return the existing for now
      return res.status(200).json({
        success: true,
        message: 'Profile already exists in database',
        data: existingProfile
      });
    }

    // Fetch user data from GitHub
    const githubUser = await githubService.getGithubProfile(username);
    
    // Fetch user repos analytics
    let repoAnalytics = {};
    try {
      repoAnalytics = await githubService.getUserRepositories(username);
    } catch (error) {
      console.error('Error fetching repo analytics:', error.message);
      // Proceed even if repos fail, but default to empty/zero
    }
    
    // Analyze core insights
    const insights = profileAnalyzer.analyzeProfile(githubUser, repoAnalytics);

    // Save to Database
    const newProfile = await Profile.create({
      github_id: githubUser.github_id,
      username: githubUser.username,
      name: githubUser.name,
      bio: githubUser.bio,
      company: githubUser.company,
      location: githubUser.location,
      public_repos: githubUser.public_repos,
      followers: githubUser.followers,
      following: githubUser.following,
      account_age_days: insights.account_age_days,
      profile_score: insights.profile_score,
      total_stars: insights.total_stars,
      most_used_language: insights.most_used_language,
      avatar_url: githubUser.avatar_url,
      github_url: githubUser.github_url
    });

    res.status(201).json({
      success: true,
      message: 'Profile analyzed successfully',
      data: newProfile
    });

  } catch (error) {
    if (error.message === 'GitHub user not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
};

// 2. Fetch all stored analyzed profiles
const getAllProfiles = async (req, res, next) => {
  try {
    // Extract query parameters with defaults
    let { page = 1, limit = 10, search, sortBy, order = 'DESC' } = req.query;
    
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // Build query options
    const queryOptions = {
      offset,
      limit,
    };

    // Add search by username if provided
    if (search) {
      const { Op } = require('sequelize');
      queryOptions.where = {
        username: {
          [Op.like]: `%${search}%`
        }
      };
    }

    // Add sorting if provided
    const validSortFields = ['followers', 'public_repos', 'profile_score'];
    if (sortBy && validSortFields.includes(sortBy)) {
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      queryOptions.order = [[sortBy, sortOrder]];
    } else {
      // Default sorting by created_at DESC
      queryOptions.order = [['created_at', 'DESC']];
    }

    const { count, rows } = await Profile.findAndCountAll(queryOptions);

    res.status(200).json({
      success: true,
      total: count,
      page,
      profiles: rows
    });
  } catch (error) {
    next(error);
  }
};

// 3. Fetch data of a single profile from database by username
const getProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const profile = await Profile.findOne({ where: { username } });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found in database' });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Optional: Delete a profile
const deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const deletedCount = await Profile.destroy({ where: { username } });
    
    if (deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    
    res.status(200).json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeAndStoreProfile,
  getAllProfiles,
  getProfileByUsername,
  deleteProfile
};
