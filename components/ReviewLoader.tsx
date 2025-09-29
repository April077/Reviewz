"use client";

export function SkeletonReviewForm() {
  return (
    <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-6" />

      {/* Input skeletons */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
