import dotenv from "dotenv";

dotenv.config();

const loadEnvVariables = () => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "EXPRESS_SESSION_SECRET",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required env variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
  };
};

export const envVars = loadEnvVariables();
