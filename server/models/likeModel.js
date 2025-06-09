//server/models/likeModel.js
const { dbClient, dbType } = require("../utils/dbClient");

const LikeModel = {
  getLikedPostIds: async (userId) => {
    if (!userId) return [];
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
      return result.rows.map((r) => r.post_id);
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
        "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
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
