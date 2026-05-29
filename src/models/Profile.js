const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  github_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  company: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  public_repos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  account_age_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  profile_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  total_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  most_used_language: {
    type: DataTypes.STRING,
  },
  avatar_url: {
    type: DataTypes.STRING,
  },
  github_url: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Profile;
