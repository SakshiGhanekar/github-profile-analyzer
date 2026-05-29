const app = require('./src/app');
const { sequelize } = require('./src/config/database');
const PORT = process.env.PORT || 3000;

// Test DB Connection and Sync Models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Sync models (in production use migrations instead of sync)
    return sequelize.sync({ alter: true });
  })
  .catch(err => {
    console.error('Unable to connect to the database. Running without DB sync:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
