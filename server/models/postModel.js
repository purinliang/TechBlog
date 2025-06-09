const { dbClient, dbType } = require("../utils/dbClient");

const PostModel = {
  getAllPublic: async () => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select(
          `
          *,
          profiles(username)
        `
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((post) => ({
        ...post,
        author_username: post.profiles?.username || "Unknown",
      }));
    } else {
      const result = await dbClient.query(`
        SELECT
          p.*,
          pr.username AS author_username
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        ORDER BY p.created_at DESC;
      `);
      return result.rows;
    }
  },

  getMyAllPublic: async (userId) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select(
          `
          *,
          profiles(username)
        `
        )
        .eq("author_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((post) => ({
        ...post,
        author_username: post.profiles?.username || "Unknown",
      }));
    } else {
      const result = await dbClient.query(
        `
        SELECT
          p.*,
          pr.username AS author_username
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        WHERE p.author_id = $1
        ORDER BY p.created_at DESC;
      `,
        [userId]
      );
      return result.rows;
    }
  },

  getByIdPublic: async (postId) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select(
          `
          *,
          profiles(username)
        `
        )
        .eq("id", postId)
        .single();
      if (error) throw error;
      return {
        ...data,
        author_username: data.profiles?.username || "Unknown",
      };
    } else {
      const result = await dbClient.query(
        `
        SELECT
          p.*,
          pr.username AS author_username
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        WHERE p.id = $1;
      `,
        [postId]
      );
      return result.rows[0];
    }
  },

  create: async (title, content, author_id) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .insert({ title, content, author_id })
        .select()
        .single();
      if (error) throw error;
      return { id: data.id };
    } else {
      const result = await dbClient.query(
        "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id",
        [title, content, author_id]
      );
      return { id: result.rows[0].id };
    }
  },

  update: async (id, title, content) => {
    if (dbType === "supabase") {
      const { error, data } = await dbClient
        .from("posts")
        .update({ title, content })
        .eq("id", id)
        .select();
      if (error) throw error;
      return { changes: data.length };
    } else {
      const result = await dbClient.query(
        "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
        [title, content, id]
      );
      return { changes: result.rowCount };
    }
  },

  delete: async (id) => {
    if (dbType === "supabase") {
      const { error, data } = await dbClient
        .from("posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      const changes = Array.isArray(data) ? data.length : 0;
      return { changes };
    } else {
      const result = await dbClient.query("DELETE FROM posts WHERE id = $1", [
        id,
      ]);
      return { changes: result.rowCount };
    }
  },
};

module.exports = PostModel;
