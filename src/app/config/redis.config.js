
import { Redis } from "@upstash/redis";
import { envVars } from "./env.js";

export const redisClient = new Redis({
  url: envVars.UPSTASH_REDIS_REST_URL,
  token: envVars.UPSTASH_REDIS_REST_TOKEN,
});

export const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log("Redis Connected");
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};