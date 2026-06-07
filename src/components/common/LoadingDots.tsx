export function LoadingDots({ label = "Memproses" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-cyan-100">
      <span>{label}</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-cyan-200"
            style={{
              animation: "loading-bounce 1.1s infinite ease-in-out",
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
      </span>
    </span>
  );
}
