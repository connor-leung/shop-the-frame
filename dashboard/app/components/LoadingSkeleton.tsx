export function LoadingSkeleton() {
  return (
    <div className="bg-[#212121] rounded-xl overflow-hidden">
      <div className="flex gap-3 p-3 animate-pulse">
        {/* Image skeleton */}
        <div className="w-24 h-24 flex-shrink-0 bg-[#3f3f3f] rounded-lg" />

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="h-4 bg-[#3f3f3f] rounded w-full mb-2" />
          <div className="h-4 bg-[#3f3f3f] rounded w-3/4 mb-3" />
          <div className="mt-auto flex items-center justify-between">
            <div className="h-4 bg-[#3f3f3f] rounded w-20" />
            <div className="h-3 bg-[#3f3f3f] rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
