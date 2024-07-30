import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export async function rateLimit(identifier: string) {
  const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit"
  });

  return await rateLimit.limit(identifier)
}
