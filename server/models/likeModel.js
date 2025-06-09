const { dbClient, dbType } = require("../utils/dbClient");

const LikeModel = {
  getPostIdsLikedByUser: async (userId) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("likes")
        .select("post_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data.map((row) => row.post_id);
    } else {
      const result = await dbClient.query(
        "SELECT post_id FROM likes WHERE user_id = $1",
        [userId]
      );
      return result.rows.map((row) => row.post_id);
    }
  },

  getLikeCountForPost: async (postId) => {
    if (dbType === "supabase") {
      const { count, error } = await dbClient
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("post_id", postId);
      if (error) throw error;
      return count;
    } else {
      const result = await dbClient.query(
        "SELECT COUNT(*) FROM likes WHERE post_id = $1",
        [postId]
      );
      return parseInt(result.rows[0].count, 10);
    }
  },

  addLike: async (postId, userId) => {
    if (dbType === "supabase") {
      const { error } = await dbClient
        .from("likes")
        .insert({ post_id: postId, user_id: userId });
      if (error) throw error;
    } else {
      await dbClient.query(
        "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
        [postId, userId]
      );
    }
  },

  removeLike: async (postId, userId) => {
    if (dbType === "supabase") {
      const { error } = await dbClient
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      await dbClient.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );
    }
  },
};

module.exports = LikeModel;
