import { execSync } from "child_process";

try {
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit", cwd: process.cwd() });
  
  console.log("Pushing schema to database...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", cwd: process.cwd() });
  
  console.log("Database schema pushed successfully!");
} catch (error) {
  console.error("Failed to push schema:", error.message);
  process.exit(1);
}
