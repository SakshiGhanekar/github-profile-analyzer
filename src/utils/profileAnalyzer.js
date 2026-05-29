const analyzeProfile = (githubUser, repoAnalytics) => {
  // Extract values from repoAnalytics (or default to 0/null)
  const totalStars = repoAnalytics?.totalStars || 0;
  const totalForks = repoAnalytics?.totalForks || 0;
  const mostUsedLanguage = repoAnalytics?.mostUsedLanguage || null;

  // Calculate Account Age
  let accountAgeDays = 0;
  const createdAt = githubUser.account_created_at || githubUser.created_at;
  if (createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    accountAgeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  // Calculate Profile Score
  let profileScore = 0;

  // Followers logic
  const followers = githubUser.followers || 0;
  if (followers <= 50) {
    profileScore += 10;
  } else if (followers <= 200) {
    profileScore += 20;
  } else if (followers <= 1000) {
    profileScore += 30;
  } else {
    profileScore += 40;
  }

  // Repositories logic
  const reposCount = githubUser.public_repos || 0;
  if (reposCount <= 10) {
    profileScore += 10;
  } else if (reposCount <= 50) {
    profileScore += 20;
  } else {
    profileScore += 30;
  }

  // Stars logic
  if (totalStars <= 50) {
    profileScore += 10;
  } else if (totalStars <= 500) {
    profileScore += 20;
  } else {
    profileScore += 30;
  }

  return {
    profile_score: profileScore,
    account_age_days: accountAgeDays,
    total_stars: totalStars,
    total_forks: totalForks,
    most_used_language: mostUsedLanguage
  };
};

module.exports = {
  analyzeProfile
};
