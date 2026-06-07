import { ResultScreen } from "@/components/judge/ResultScreen";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <ResultScreen sessionId={sessionId} />;
}
