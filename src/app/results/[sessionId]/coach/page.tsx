import { DeliveryCoachScreen } from "@/components/judge/DeliveryCoachScreen";

export default async function DeliveryCoachPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <DeliveryCoachScreen sessionId={sessionId} />;
}
