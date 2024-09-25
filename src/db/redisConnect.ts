import { Redis } from "ioredis";
const serviceUri = process.env.AIVEN_REDIS_URI || "";
const redis = new Redis(serviceUri);

// const redis = new Redis({
//   port: 23500,
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD,
//   // retryStrategy(times) {
//   //   const delay = Math.min(times * 50, 2000);
//   //   return delay;
//   // },
// });
// console.log("<-------------------- REDIS ----------------------->");
// console.log(redis);
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

export default redis;
