"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

interface Space {
  id: string;
  name: string;
}

type ReviewForm = {
  name?: string;
  email?: string;
  rating: number;
  text?: string;
};

export default function ReviewSubmissionPage() {
  const params = useParams();
  const spaceId = params.spaceId;

  const [spaceName, setSpaceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<ReviewForm>();

  // ✅ Fetch space details
  useEffect(() => {
    if (!spaceId) return;

    const fetchSpace = async () => {
      try {
        const res = await axios.get<Space>(`/api/public/spaces/${spaceId}`);
        if (res.data?.name) {
          setSpaceName(res.data.name);
        } else {
          setError("Space not found.");
        }
      } catch (err) {
        console.error("Failed to load space:", err);
        setError("Failed to load space.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [spaceId]);

  // ✅ Submit review
  const onSubmit = async (data: ReviewForm) => {
    try {
      await axios.post("/api/reviews", { ...data, spaceId });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-medium">{error}</div>
    );

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-green-600">Thank You!</h2>
        <p className="mt-2 text-gray-600">Your review has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Leave Your Review for{" "}
            <span className="text-indigo-600">{spaceName}</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("name")}
              placeholder="Your Name (optional)"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="Your Email (optional)"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <input
              {...register("rating", { required: true, valueAsNumber: true })}
              type="number"
              min={1}
              max={5}
              placeholder="Rating (1-5)"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <textarea
              {...register("text")}
              placeholder="Write your review..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
