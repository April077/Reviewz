import "dotenv/config";
import { Worker } from "bullmq";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { redis } from "./redis";

// Setup Brevo client
const brevo = new TransactionalEmailsApi();
brevo.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(`📧 Sending email for job ${job.id}`, job.data);

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL || "tanmaymajee18@gmail.com",
        name: "Review Alerts",
      },
      to: [
        {
          email: job.data.to,
          name: job.data.name || "Owner",
        },
      ],
      subject: job.data.subject,
      textContent: `
Hello ${job.data.name || "Owner"},

A new negative review was submitted for your space.

Reviewer: ${job.data.name} (${job.data.email || "N/A"})
Rating: ${job.data.rating || "N/A"}
Comment: ${job.data.text || "No comment"}
Sentiment: ${job.data.sentiment || "N/A"}
Tags: ${(job.data.tags || []).join(", ")}

Please log in to your dashboard to review further.
      `,
    };

    await brevo.sendTransacEmail(sendSmtpEmail);
  },
  { connection: redis }
);

emailWorker.on("completed", (job) =>
  console.log(`✅ Email job ${job.id} completed`)
);
emailWorker.on("failed", (job, err) =>
  console.error(`❌ Email job ${job?.id} failed:`, err)
);
