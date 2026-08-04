import { Redis } from '@upstash/redis'
import { envVars } from './env.js';
export const redis = new Redis({
  url: envVars.UPSTASH_REDIS_REST_URL,
  token: envVars.UPSTASH_REDIS_REST_TOKEN,
})

await redis.set("foo", "bar");
await redis.get("foo");