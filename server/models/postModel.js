const { connectDatabase } = require("../database/db");

const PostModel = {
  getAll: async () => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const result = await dbClient.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
      );
      return result.rows;
    }
  },

  getById: async (id) => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } else {
      const result = await dbClient.query("SELECT * FROM posts WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    }
  },

  create: async (title, content) => {
    const { dbClient, dbType } = await connectDatabase();

    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("posts")
        .insert({ title, content })
        .select()
        .single();
      if (error) throw error;
      return { id: data.id };
    } else {
      const result = await dbClient.query(
        "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id",
        [title, content]
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
      return { changes: data.length };
    } else {
      const result = await dbClient.query("DELETE FROM posts WHERE id = $1", [
        id,
      ]);
      return { changes: result.rowCount };
    }
  },
};

module.exports = PostModel;
