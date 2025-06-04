const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/techblog.db");

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        console.log("Posts table initialized successfully.");
      }
    }
  );
});

module.exports = db;
