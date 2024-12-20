const mongoose = require("mongoose");

module.exports = {
  mongodb: mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
  migrationsDir: "migrations", // the folder where migrations are stored
  changelogCollectionName: "changelog", // to track migration history
};
