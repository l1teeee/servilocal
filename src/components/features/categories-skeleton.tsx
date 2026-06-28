export function CategoriesSkeleton() {
  return (
    <div className="flex h-screen w-full animate-pulse flex-col items-center justify-center bg-primary">
      {/* Icon placeholder */}
      <div className="mb-6 h-16 w-16 rounded-full bg-white/20" />
      {/* Tag badge placeholder */}
      <div className="mb-6 h-6 w-32 rounded-full bg-white/15" />
      {/* Title placeholder */}
      <div className="h-14 w-72 rounded-xl bg-white/20 sm:w-96" />
      {/* Subtitle placeholder */}
      <div className="mt-5 h-4 w-56 rounded-full bg-white/15" />
      {/* CTA placeholder */}
      <div className="mt-10 h-11 w-36 rounded-full bg-white/20" />
      {/* Progress dots */}
      <div className="absolute bottom-10 flex items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-full bg-white/25 ${i === 0 ? 'h-0.75 w-7' : 'h-0.75 w-3'}`}
          />
        ))}
      </div>
    </div>
  )
}
