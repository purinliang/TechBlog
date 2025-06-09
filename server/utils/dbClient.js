// server/utils/dbClient.js
require("dotenv").config();
const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
const { Client: PgClient } = require("pg");

let dbClient;
let dbType;

(async () => {
  const useSupabase = process.env.USE_SUPABASE === "true";
  const useLocalPostgres = process.env.USE_LOCAL_POSTGRESQL === "true";

  if (useSupabase === useLocalPostgres) {
    throw new Error(
      "Exactly one of USE_SUPABASE or USE_LOCAL_POSTGRESQL must be set to 'true'."
    );
  }

  if (useSupabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    }
    dbClient = createSupabaseClient(supabaseUrl, supabaseKey);
    dbType = "supabase";
    console.log("🟢 Using Supabase");
  } else {
    const localUrl = process.env.LOCAL_POSTGRESQL_URL;
    if (!localUrl) {
      throw new Error("Missing LOCAL_POSTGRESQL_URL.");
    }
    dbClient = new PgClient({ connectionString: localUrl });
    await dbClient.connect();
    dbType = "postgres";
    console.log("🟢 Using local PostgreSQL");
  }
})().catch((err) => {
  console.error("🔴 Database initialization failed:", err);
  process.exit(1);
});

module.exports = {
  get dbClient() {
    if (!dbClient) {
      throw new Error("Database client is not initialized yet.");
    }
    return dbClient;
  },
  get dbType() {
    return dbType;
  },
};
