require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'github_analyzer',
  },
  github: {
    token: process.env.GITHUB_TOKEN,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  }
};
