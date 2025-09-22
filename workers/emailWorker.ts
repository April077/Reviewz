import dotenv from "dotenv";
import { Worker } from "bullmq";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { redis } from "../lib/redis";
import { join } from "path";

// Load .env
dotenv.config({ path: join(__dirname, "..", ".env") });

console.log("===== ENV VARIABLES =====");
console.log("BREVO_API_KEY set?", !!process.env.BREVO_API_KEY);
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);
console.log("=========================");

// Setup Brevo client
const brevo = new TransactionalEmailsApi();
brevo.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

console.log("✅ Brevo client configured");

// Initialize email worker
const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(`\n🚀 Processing email job ${job.id}`);
    console.log("Job data:", job.data);

    const { to, name, subject, email, rating, text, sentiment, tags } =
      job.data;

    if (!to || !subject) {
      console.error("❌ Missing recipient or subject");
      throw new Error("Missing recipient or subject.");
    }

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL || "tanmaymajee18@gmail.com",
        name: "Review Alerts",
      },
      to: [{ email: to, name: name || "Owner" }],
      subject,
      textContent: `
Hello ${name || "Owner"},

A new negative review was submitted for your space.

Reviewer: ${name || "N/A"} (${email || "N/A"})
Rating: ${rating || "N/A"}
Comment: ${text || "No comment"}
Sentiment: ${sentiment || "N/A"}
Tags: ${Array.isArray(tags) ? tags.join(", ") : "None"}

Please log in to your dashboard to review further.
      `,
    };

    console.log("📨 Sending email via Brevo...");
    console.log("Email payload:", sendSmtpEmail);

    try {
      const response = await brevo.sendTransacEmail(sendSmtpEmail);
      console.log("✅ Brevo API response:", response);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      console.error("Payload was:", sendSmtpEmail);
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
