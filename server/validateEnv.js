// server/validateEnv.js
require("dotenv").config();

function validateEnv() {
  const errors = [];

  // Required variables
  if (!process.env.PORT) errors.push("PORT is required");
  if (!process.env.JWT_SECRET_KEY) errors.push("JWT_SECRET_KEY is required");

  // Database source selection
  const useLocal = process.env.USE_LOCAL_POSTGRESQL === "true";
  const useSupabase = process.env.USE_SUPABASE === "true";

  // One and only one of the database options must be enabled
  if (!useLocal && !useSupabase) {
    errors.push(
      "Either USE_LOCAL_POSTGRESQL or USE_SUPABASE must be set to true"
    );
  }
  if (useLocal && useSupabase) {
    errors.push(
      "Only one of USE_LOCAL_POSTGRESQL or USE_SUPABASE can be true at the same time"
    );
  }

  // Local PostgreSQL URL is required if USE_LOCAL_POSTGRESQL is true
  if (useLocal && !process.env.LOCAL_POSTGRESQL_URL) {
    errors.push(
      "LOCAL_POSTGRESQL_URL is required when USE_LOCAL_POSTGRESQL is true"
    );
  }

  // Supabase URL and Service Role Key are required if USE_SUPABASE is true
  if (useSupabase) {
    if (!process.env.SUPABASE_URL) {
      errors.push("SUPABASE_URL is required when USE_SUPABASE is true");
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      errors.push(
        "SUPABASE_SERVICE_ROLE_KEY is required when USE_SUPABASE is true"
      );
    }
  }

  // Output validation results
  if (errors.length > 0) {
    console.error("❌ Environment variable validation failed:");
    errors.forEach((err) => console.error(" - " + err));
    process.exit(1); // Stop the server if validation fails
  } else {
    console.log("✅ Environment variables validated successfully.");
  }
}

module.exports = validateEnv;
