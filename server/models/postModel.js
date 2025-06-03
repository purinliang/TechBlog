const db = require('../database/db');

const PostModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  create: (title, content) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO posts (title, content) VALUES (?, ?)',
        [title, content],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  },

  update: (id, title, content) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  },
};

module.exports = PostModel;
