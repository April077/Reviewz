import Redis from "ioredis";

export const redis = new Redis(
  "rediss://default:AaFJAAIncDFjMmNjYjE1MzQyYTg0ZDZjYWM5MGY2MGU1NmVkYjg0ZHAxNDEyODk@merry-fish-41289.upstash.io:6379",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }
);
