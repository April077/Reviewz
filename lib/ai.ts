import axios from "axios";

interface HFSentiment {
  label: string;
  score: number;
}

interface HFSentimentResponse extends Array<Array<HFSentiment>> {}

const HF_API_KEY = process.env.HF_API_KEY;

export async function analyzeSentiment(text: string) {
  try {
    console.log("Sending sentiment analysis request to Hugging Face:", text);

    const res = await axios.post<HFSentimentResponse>(
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw sentiment response:", res.data);

    const first = res.data?.[0]?.[0];
    if (!first) throw new Error("Unexpected HF response format");

    console.log("Parsed sentiment result:", first);
    return {
      label: first.label.toLowerCase(),
      score: first.score,
    };
  } catch (error: any) {
    console.error(
      "Error in analyzeSentiment:",
      error.response?.data || error.message
    );
    return { label: null, score: null };
  }
}

interface HFZeroShotResponse {
  labels: string[];
  scores: number[];
}

export async function extractTags(text: string): Promise<string[]> {
  try {
    console.log("Sending tag extraction request to Hugging Face:", text);

    const res = await axios.post<HFZeroShotResponse>(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: text,
        parameters: {
          candidate_labels: [
            "quality",
            "price",
            "delivery",
            "service",
            "packaging",
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw tag extraction response:", res.data);

    // Pick labels with score > 0.2
    const tags = res.data.labels.filter((_, i) => res.data.scores[i] > 0.2);

    console.log("Tags extracted:", tags);
    return tags;
  } catch (error: any) {
    console.error(
      "Error in extractTags:",
      error.response?.data || error.message
    );
    return [];
  }
}
