const { connectDatabase } = require("../database/db");
const PostModel = {
  getAll: async (userId = null) => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      let query = dbClient
        .from("posts")
        .select(
          `
          *,
          profiles(username),
          likes(user_id)
        `
        )
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("post model getAll error: ", error);
        throw error;
      }

      return data.map((post) => ({
        ...post,
        author_username: post.profiles?.username || "Unknown",
        like_count: post.likes?.length || 0,
        liked_by_current_user: userId
          ? post.likes?.some((like) => like.user_id === userId)
          : false,
      }));
    } else {
      const result = await dbClient.query(
        `
        SELECT
          p.*,
          pr.username AS author_username,
          COALESCE(lc.like_count, 0) AS like_count,
          CASE
            WHEN $1 IS NOT NULL AND ul.user_id IS NOT NULL THEN true
            ELSE false
          END AS liked_by_current_user
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        LEFT JOIN (
          SELECT post_id, COUNT(*) AS like_count
          FROM likes
          GROUP BY post_id
        ) lc ON p.id = lc.post_id
        LEFT JOIN (
          SELECT post_id, user_id
          FROM likes
          WHERE user_id = $1
        ) ul ON p.id = ul.post_id
        ORDER BY p.created_at DESC;
        `,
        [userId]
      );
      return result.rows;
    }
  },

  getMyAll: async (userId) => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select(
          `
          *,
          profiles:profiles(username),
          likes(user_id)
          `
        )
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("post model getMyAll error: ", error);
        throw error;
      }

      return data.map((post) => ({
        ...post,
        author_username: post.profiles?.username || "Unknown",
        like_count: post.likes?.length || 0,
        liked_by_current_user: userId
          ? post.likes?.some((like) => like.user_id === userId)
          : false,
      }));
    } else {
      const result = await dbClient.query(
        `
        SELECT
          p.*,
          pr.username AS author_username,
          COALESCE(lc.like_count, 0) AS like_count
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        LEFT JOIN (
          SELECT post_id, COUNT(*) AS like_count
          FROM likes
          GROUP BY post_id
        ) lc ON p.id = lc.post_id
        WHERE p.author_id = $1
        ORDER BY p.created_at DESC;
        `,
        [userId]
      );
      return result.rows;
    }
  },

  getById: async (id, userId = null) => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      let query = dbClient
        .from("posts")
        .select(
          `
          *,
          profiles(username),
          likes(user_id)
        `
        )
        .eq("id", id)
        .single();

      const { data, error } = await query;
      if (error) {
        console.error("PostModel getById error: ", error);
        throw error;
      }

      return {
        ...data,
        author_username: data.profiles?.username || "Unknown",
        like_count: data.likes?.length || 0,
        liked_by_current_user: userId
          ? data.likes?.some((like) => like.user_id === userId)
          : false,
      };
    } else {
      const result = await dbClient.query(
        `
        SELECT
          p.*,
          pr.username AS author_username,
          COALESCE(lc.like_count, 0) AS like_count,
          CASE
            WHEN $2 IS NOT NULL AND ul.user_id IS NOT NULL THEN true
            ELSE false
          END AS liked_by_current_user
        FROM posts p
        LEFT JOIN profiles pr ON p.author_id = pr.id
        LEFT JOIN (
          SELECT post_id, COUNT(*) AS like_count
          FROM likes
          GROUP BY post_id
        ) lc ON p.id = lc.post_id
        LEFT JOIN (
          SELECT post_id, user_id
          FROM likes
          WHERE user_id = $2
        ) ul ON p.id = ul.post_id
        WHERE p.id = $1;
        `,
        [id, userId]
      );
      return result.rows[0];
    }
  },

  create: async (title, content, author_id) => {
    const { dbClient, dbType } = await connectDatabase();
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
    const { dbClient, dbType } = await connectDatabase();

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
    const { dbClient, dbType } = await connectDatabase();

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
