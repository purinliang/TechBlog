// server/models/userModel.js
const { dbClient, dbType } = require("../utils/dbClient");

const UserModel = {
  create: async (username, hashedPassword) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("profiles")
        .insert({ username, password_hash: hashedPassword })
        .select()
        .single();
      if (error) throw error;
      return { id: data.id, username: data.username };
    } else {
      const result = await dbClient.query(
        "INSERT INTO profiles (username, password_hash) VALUES ($1, $2) RETURNING id, username",
        [username, hashedPassword]
      );
      return { id: result.rows[0].id, username: result.rows[0].username };
    }
  },

  getByUsername: async (username) => {
    if (dbType === "supabase") {
      const { data, error } = await dbClient
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        if (error.code == "PGRST116") {
          return null; // user not exist
        } else {
          throw error;
        }
      }
      return data;
    } else {
      const result = await dbClient.query(
        "SELECT * FROM profiles WHERE username = $1",
        [username]
      );
      return result.rows[0];
    }
  },
};

module.exports = UserModel;
