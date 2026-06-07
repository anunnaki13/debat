export function ScoreBar({
  label,
  score,
  explanation,
}: {
  label: string;
  score: number;
  explanation: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-sm font-bold text-cyan-100">
          {score}
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-md bg-slate-800">
        <div
          className="h-full rounded-md bg-cyan-300"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{explanation}</p>
    </div>
  );
}
