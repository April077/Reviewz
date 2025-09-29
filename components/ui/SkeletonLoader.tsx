export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
