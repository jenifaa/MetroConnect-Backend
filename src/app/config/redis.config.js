
import { Redis } from "@upstash/redis";
import { envVars } from "./env.js";

export const redisClient = new Redis({
  url: envVars.UPSTASH_REDIS_REST_URL,
  token: envVars.UPSTASH_REDIS_REST_TOKEN,
});

// No connectRedis needed — Upstash uses HTTP, no persistent connection
export const connectRedis = async () => {
  console.log("Upstash Redis ready ✅");
};