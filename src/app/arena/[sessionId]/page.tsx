import { DebateScreen } from "@/components/debate/DebateScreen";

export default async function ArenaPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <DebateScreen sessionId={sessionId} />;
}
