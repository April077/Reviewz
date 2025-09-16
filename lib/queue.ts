import { Queue } from "bullmq";
import { redis } from "./redis";

export const reviewQueue = new Queue("reviews", {
  connection: redis,
});
