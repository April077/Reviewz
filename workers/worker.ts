import { Worker } from "bullmq";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { analyzeSentiment, extractTags } from "../lib/ai";
import { emailQueue } from "../lib/queue";

// Define the job data type
interface ReviewJobData {
  spaceId: string;
  name: string;
  email: string;
  rating: number;
  text?: string;
}

const reviewWorker = new Worker<ReviewJobData>(
  "reviews",
  async (job) => {
    console.log(`🚀 Processing review job ${job.id}`, job.data);

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

    // Save review to DB
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

    // Send email alert if negative
    if (sentiment?.toLowerCase() === "negative") {
      const space = await prisma.space.findUnique({
        where: { id: job.data.spaceId },
        select: { owner: true },
      });

      if (space?.owner.email) {
        await emailQueue.add(
          "sendAlert",
          {
            to: space.owner.email,
            name: job.data.name,
            subject: "Negative Review Alert",
            rating: review.rating,
            text: review.text,
            sentiment: review.sentiment,
            tags: review.tags,
          },
          { attempts: 3, backoff: 10000 }
        );
        console.log(`📧 Email job queued for ${space.owner.email}`);
      }
    }
  },
  { connection: redis }
);

reviewWorker.on("completed", (job) =>
  console.log(`✅ Review job ${job.id} completed`)
);
reviewWorker.on("failed", (job, err) =>
  console.error(`❌ Review job ${job?.id} failed:`, err)
);

console.log("📌 Review worker is running...");
