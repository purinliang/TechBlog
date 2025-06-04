const { createClient } = require("@supabase/supabase-js");
const { Client } = require("pg");
require("dotenv").config();

let dbClient = null;
let dbType = null;

const connectDatabase = async () => {
  if (dbClient) return { dbClient, dbType };

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
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
      );
    }

    dbClient = createClient(supabaseUrl, supabaseKey);
    dbType = "supabase";
    console.log("Using Supabase");
  }

  if (useLocalPostgres) {
    const localUrl = process.env.LOCAL_POSTGRESQL_URL;

    if (!localUrl) {
      throw new Error("Missing LOCAL_POSTGRESQL_URL in environment variables.");
    }

    dbClient = new Client({ connectionString: localUrl });
    await dbClient.connect();
    dbType = "postgres";
    console.log("Using local PostgreSQL");
  }

  return { dbClient, dbType };
};

module.exports = { connectDatabase };
