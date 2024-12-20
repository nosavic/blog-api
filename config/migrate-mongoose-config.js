const mongoose = require("mongoose");

module.exports = {
  mongodb: mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 30000,
  }),
  migrationsDir: "migrations", // the folder where migrations are stored
  changelogCollectionName: "changelog", // to track migration history
};
