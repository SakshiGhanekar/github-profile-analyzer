const axios = require('axios');
const cacheService = require('./cacheService');

const getAxiosConfig = () => {
  const config = {
    headers: {}
  };
  if (process.env.GITHUB_TOKEN) {
    config.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return config;
};

const getGithubProfile = async (username) => {
  const cacheKey = `github_profile_${username}`;
  
  // Try Cache
  const cachedData = await cacheService.getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, getAxiosConfig());
    
    const data = response.data;
    
    const profileData = {
      github_id: data.id,
      username: data.login,
      name: data.name,
      bio: data.bio,
      company: data.company,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      avatar_url: data.avatar_url,
      github_url: data.html_url,
      account_created_at: data.created_at
    };
    
    // Save to Cache for 1 hour
    await cacheService.setCache(cacheKey, profileData, 3600);
    
    return profileData;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('GitHub user not found');
      }
      if (error.response.status === 403 || error.response.status === 429) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${error.response.statusText || error.response.status}`);
    }
    throw new Error('Failed to connect to GitHub API');
  }
};

const getUserRepositories = async (username) => {
  const cacheKey = `github_repos_${username}`;
  
  // Try Cache
  const cachedData = await cacheService.getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, getAxiosConfig());
    const repos = response.data;
    
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts = {};
    const repositoryCount = repos.length;

    repos.forEach(repo => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    let mostUsedLanguage = null;
    let maxCount = 0;
    for (const [lang, count] of Object.entries(languageCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsedLanguage = lang;
      }
    }

    const averageStarsPerRepo = repositoryCount > 0 ? (totalStars / repositoryCount).toFixed(2) : 0;

    const repoAnalytics = {
      totalStars,
      totalForks,
      mostUsedLanguage,
      repositoryCount,
      averageStarsPerRepo: parseFloat(averageStarsPerRepo)
    };

    // Save to Cache for 1 hour
    await cacheService.setCache(cacheKey, repoAnalytics, 3600);

    return repoAnalytics;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('GitHub user not found');
      }
      if (error.response.status === 403 || error.response.status === 429) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${error.response.statusText || error.response.status}`);
    }
    throw new Error('Failed to fetch repositories from GitHub API');
  }
};

module.exports = {
  getGithubProfile,
  getUserRepositories
};
