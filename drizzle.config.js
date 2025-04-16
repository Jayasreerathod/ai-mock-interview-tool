
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./utils/schema.js",
    dialect: "postgresql",
    out: "./drizzle",
    dbCredentials : {
        url : 'postgresql://Jayasree:npg_lAV6TEy8xrwU@ep-winter-thunder-a5ee357y-pooler.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }
});
