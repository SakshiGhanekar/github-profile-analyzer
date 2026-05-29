CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  github_id INT UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  bio TEXT,
  company VARCHAR(255),
  location VARCHAR(255),
  public_repos INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  account_age_days INT DEFAULT 0,
  profile_score FLOAT DEFAULT 0,
  total_stars INT DEFAULT 0,
  most_used_language VARCHAR(255),
  avatar_url VARCHAR(255),
  github_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
