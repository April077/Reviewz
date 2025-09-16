import { Worker } from "bullmq";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { analyzeSentiment, extractTags } from "./ai";

// Define the job data type
interface ReviewJobData {
  spaceId: string;
  name: string;
  email: string;
  rating: number;
  text?: string;
}

const worker = new Worker<ReviewJobData>(
  "reviews",
  async (job) => {
    console.log(`🚀 Processing job ${job.id}`, job.data);

    let sentiment: string | null = null;
    let sentimentScore: number | null = null;
    let tags: string[] = [];

    if (job.data.text) {
      const sentimentResult = await analyzeSentiment(job.data.text);
      sentiment = sentimentResult.label;
      sentimentScore = sentimentResult.score;
      tags = await extractTags(job.data.text);

      console.log(`🧠 Sentiment: ${sentiment} (${sentimentScore})`);
      console.log(`🏷️ Tags extracted: ${tags.join(", ")}`);
    }

    const review = await prisma.review.create({
      data: {
        spaceId: job.data.spaceId,
        name: job.data.name,
        email: job.data.email,
        rating: job.data.rating,
        text: job.data.text,
        sentiment,
        sentimentScore,
        tags,
      },
    });

    console.log(`💾 Review saved: ${review.id}`);
  },
  { connection: redis }
);

worker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Job ${job?.id} failed:`, err));
