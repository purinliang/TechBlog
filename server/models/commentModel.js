// server/models/commentModel.js

const { dbClient, dbType } = require("../utils/dbClient");

const CommentModel = {
  getByPostId: async (postId) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("comments")
        .select("*, profiles(username)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data.map((c) => ({
        ...c,
        author_username: c.profiles?.username || "Unknown",
      }));
    } else {
      const result = await dbClient.query(
        `SELECT c.*, pr.username AS author_username
         FROM comments c
         LEFT JOIN profiles pr ON c.author_id = pr.id
         WHERE c.post_id = $1
         ORDER BY c.created_at ASC`,
        [postId]
      );
      return result.rows;
    }
  },

  create: async ({ post_id, author_id, content, parent_comment_id = null }) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("comments")
        .insert({ post_id, author_id, content, parent_comment_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const result = await dbClient.query(
        `INSERT INTO comments (post_id, author_id, content, parent_comment_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [post_id, author_id, content, parent_comment_id]
      );
      return result.rows[0];
    }
  },

  update: async (id, content) => {
    if (dbType === "supabase") {
      const { error, data } = await dbClient
        .from("comments")
        .update({ content })
        .eq("id", id)
        .select();
      if (error) throw error;
      return { changes: data.length };
    } else {
      const result = await dbClient.query(
        `UPDATE comments SET content = $1 WHERE id = $2`,
        [content, id]
      );
      return { changes: result.rowCount };
    }
  },

  delete: async (id) => {
    if (dbType === "supabase") {
      const { error, data } = await dbClient
        .from("comments")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { changes: Array.isArray(data) ? data.length : 0 };
    } else {
      const result = await dbClient.query(
        "DELETE FROM comments WHERE id = $1",
        [id]
      );
      return { changes: result.rowCount };
    }
  },
};

module.exports = CommentModel;
