const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Generate a secure random 32-byte string
const jwtSecret = crypto.randomBytes(32).toString("hex");

// Path to the .env file
const envFilePath = path.join(__dirname, ".env");

// Append the JWT_SECRET to the `.env` file
const envContent = `JWT_SECRET=${jwtSecret}\n`;

if (!fs.existsSync(envFilePath)) {
  fs.writeFileSync(envFilePath, envContent);
  console.log(".env file created with JWT_SECRET");
} else {
  const envData = fs.readFileSync(envFilePath, "utf8");
  if (!envData.includes("JWT_SECRET")) {
    fs.appendFileSync(envFilePath, envContent);
    console.log("JWT_SECRET added to existing .env file");
  } else {
    console.log(".env file already contains a JWT_SECRET");
  }
}

console.log("Generated JWT_SECRET:", jwtSecret);
