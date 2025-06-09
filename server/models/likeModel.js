const { dbClient, dbType } = require("../utils/dbClient");

const LikeModel = {
  //   getLikesCount: async (postId) => {
  //     const { dbClient, dbType } = await connectDatabase();

  //     if (dbType === "supabase") {
  //       const { count, error } = await dbClient
  //         .from("likes")
  //         .select("*", { count: "exact", head: true })
  //         .eq("post_id", postId);
  //       if (error) throw error;
  //       return count;
  //     } else {
  //       const result = await dbClient.query(
  //         "SELECT COUNT(*) FROM likes WHERE post_id = $1",
  //         [postId]
  //       );
  //       return parseInt(result.rows[0].count, 10);
  //     }
  //   },

  //   checkIfLiked: async (postId, userId) => {
  //     const { dbClient, dbType } = await connectDatabase();

  //     if (dbType === "supabase") {
  //       const { data, error } = await dbClient
  //         .from("likes")
  //         .select("id")
  //         .eq("post_id", postId)
  //         .eq("user_id", userId)
  //         .limit(1)
  //         .single();

  //       if (error && error.code !== "PGRST116") throw error;
  //       return !!data;
  //     } else {
  //       const result = await dbClient.query(
  //         "SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2 LIMIT 1",
  //         [postId, userId]
  //       );
  //       return result.rowCount > 0;
  //     }
  //   },

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
