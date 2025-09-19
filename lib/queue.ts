import { Queue } from "bullmq";
import { redis } from "./redis";

export const sentimentQueue = new Queue("reviews", {
  connection: redis,
});

export const emailQueue = new Queue("emails", {
  connection: redis,
});
