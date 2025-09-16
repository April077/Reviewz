"use client";

import { useState } from "react";

export interface Filter {
  sentiment: string | null;
  tag: string | null;
}

interface FilterBarProps {
  onFilter: ({ sentiment, tag }: Filter) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const tags = ["quality", "price", "delivery", "service", "packaging"];

  const handleSentimentClick = (value: string) => {
    const newSentiment = value === sentiment ? null : value;
    setSentiment(newSentiment);
    onFilter({ sentiment: newSentiment, tag });
  };

  const handleTagClick = (value: string) => {
    const newTag = value === tag ? null : value;
    setTag(newTag);
    onFilter({ sentiment, tag: newTag });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      {/* Sentiment Buttons */}
      <div className="flex gap-2">
        {[
          { label: "Positive", value: "positive", color: "green" },
          { label: "Negative", value: "negative", color: "red" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleSentimentClick(btn.value)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer ${
              sentiment === btn.value
                ? `bg-${btn.color}-500 text-white`
                : `bg-white border border-${btn.color}-400 text-${btn.color}-600 hover:bg-${btn.color}-100`
            }`}
          >
            {btn.value === "positive" ? "🟢" : "🔴"} {btn.label}
          </button>
        ))}
      </div>

      {/* Tag Buttons */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => handleTagClick(t)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer ${
              tag === t
                ? "bg-blue-500 text-white"
                : "bg-white border border-blue-400 text-blue-600 hover:bg-blue-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
