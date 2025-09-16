"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Copy } from "lucide-react";
import FilterBar from "@/app/components/FilterBar";


export interface Review {
  id: string;
  spaceId: string;
  name: string;
  email: string;
  rating: number;
  text?: string | null;
  videoUrl?: string | null;
  sentiment?: "positive" | "negative" | "neutral" | null;
  sentimentScore?: number | null;
  tags?: string[] | null;
  createdAt: string; 
  updatedAt: string;
}


interface Space {
  id: string;
  name: string;
  reviews: Review[];
}

interface SpaceResponse {
  space: Space;
}

export default function SpaceDetailsPage() {
  const params = useParams();
  const spaceId = params?.id as string | undefined;
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!spaceId) return;
    const fetchSpace = async () => {
      try {
        const res = await axios.get<SpaceResponse>(`/api/spaces/${spaceId}`);
        setSpace(res.data.space);
        console.log("Fetched space details:", res.data.space);
        setFilteredReviews(res.data.space.reviews);
      } catch (err) {
        console.error("Error fetching space details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceId]);

  const handleFilter = ({
    sentiment,
    tag,
  }: {
    sentiment: string | null;
    tag: string | null;
  }) => {
    if (!space) return;
    let filtered = space.reviews;
    if (sentiment) {
      filtered = filtered.filter((r) => r.sentiment === sentiment);
    }
    if (tag) {
      filtered = filtered.filter((r) => r.tags?.includes(tag));
    }

    setFilteredReviews(filtered);
  };

  const copyLink = () => {
    if (!spaceId) return;
    const link = `${window.location.origin}/reviews/${spaceId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <p className="text-center mt-12 text-gray-600 text-lg font-medium">
        Loading space details...
      </p>
    );

  if (!space)
    return (
      <p className="text-center mt-12 text-gray-600 text-lg font-medium">
        Space not found.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
          {space.name}
        </h1>
        <p className="text-gray-500 text-lg">
          Manage and view all customer reviews in one place
        </p>
      </div>

      {/* Share Link Card */}
      <div className="bg-gray-50 shadow-md rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 border border-gray-200 transition hover:shadow-lg">
        <div className="mb-4 sm:mb-0 sm:flex-1">
          <p className="text-sm text-gray-500 mb-1">
            Share this link with customers:
          </p>
          <Link
            href={`/reviews/${spaceId}`}
            className="text-indigo-600 font-medium break-all hover:underline"
          >
            {`${window.location.origin}/reviews/${spaceId}`}
          </Link>
        </div>
        <button
          onClick={copyLink}
          className="ml-0 sm:ml-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Customer Reviews
      </h2>
      <FilterBar onFilter={handleFilter} />
      {space.reviews.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No reviews yet. Share the link above to collect them.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const sentimentColor =
              review.sentiment === "positive"
                ? "bg-green-100 text-green-700"
                : review.sentiment === "negative"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600";

            return (
              <div
                key={review.id}
                className="p-6 bg-white rounded-2xl shadow-lg transition border border-gray-100 flex flex-col"
              >
                {/* Reviewer Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-lg">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {review.name}
                    </h3>
                    <p className="text-sm text-gray-500">{review.email}</p>
                  </div>
                  {/* Sentiment Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${sentimentColor}`}
                  >
                    {review.sentiment ?? "neutral"}
                  </span>
                </div>

                {/* Rating as stars */}
                <div className="flex items-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Text Review */}
                {review.text && (
                  <p className="text-gray-700 mb-3 italic leading-relaxed">
                    “{review.text}”
                  </p>
                )}

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {review.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
