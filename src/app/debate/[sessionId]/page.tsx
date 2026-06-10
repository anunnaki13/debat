import { redirect } from "next/navigation";

export default async function DebatePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  redirect(`/arena/${sessionId}`);
}
