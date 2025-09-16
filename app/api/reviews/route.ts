// app/api/reviews/route.ts
import { reviewQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const { spaceId, name, email, rating, text } = await req.json();

    if (!spaceId || !name || !email || !rating) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    console.log("Received review:", {
      spaceId,
      name,
      email,
      rating,
      text,
    });

    const job = await reviewQueue.add("processReview", {
      spaceId,
      name,
      email,
      rating,
      text,
    });

    console.log(`✅ Job added to queue: ${job.id}`);

    return new Response(JSON.stringify({ message: "Review queued" }), {
      status: 202, // 202 = accepted, processing later
    });
  } catch (error) {
    console.error("Error enqueuing review:", error);
    return new Response(JSON.stringify({ error: "Failed to queue review" }), {
      status: 500,
    });
  }
}
