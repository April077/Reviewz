import dotenv from "dotenv";
import { Worker } from "bullmq";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { redis } from "../lib/redis";
import { join } from "path";

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env") });

// Setup Brevo client
const brevo = new TransactionalEmailsApi();
brevo.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

console.log("✅ Brevo client configured");

// Job type
interface EmailJobData {
  to: string;
  name?: string;
  subject: string;
  rating?: number;
  text?: string;
  sentiment?: string;
  tags?: string[];
}

const emailWorker = new Worker<EmailJobData>(
  "emails",
  async (job) => {
    console.log(`🚀 Processing email job ${job.id}`, job.data);

    const { to, name, subject, rating, text, sentiment, tags } = job.data;

    if (!to || !subject) {
      console.error("❌ Missing recipient or subject");
      throw new Error("Missing recipient or subject.");
    }

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL || "noreply@example.com",
        name: "Review Alerts",
      },
      to: [{ email: to, name: name || "Owner" }],
      subject,
      textContent: `
Hello ${name || "Owner"},

A new negative review was submitted for your space.

Reviewer: ${name || "N/A"} (${text ? "has comment" : "no comment"})
Rating: ${rating || "N/A"}
Comment: ${text || "No comment"}
Sentiment: ${sentiment || "N/A"}
Tags: ${Array.isArray(tags) ? tags.join(", ") : "None"}

Please log in to your dashboard to review further.
      `,
    };

    console.log("📨 Sending email via Brevo...");
    try {
      const response = await brevo.sendTransacEmail(sendSmtpEmail);
      console.log("✅ Brevo API response:", response);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  },
  { connection: redis }
);

emailWorker.on("completed", (job) =>
  console.log(`✅ Email job ${job.id} completed successfully`)
);
emailWorker.on("failed", (job, err) =>
  console.error(`❌ Email job ${job?.id} failed:`, err)
);

console.log("📌 Email worker is running...");
