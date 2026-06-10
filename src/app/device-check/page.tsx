import { DeviceCheckScreen } from "@/components/device/DeviceCheckScreen";
import type { DebateInputMode } from "@/types/debate";

function parseInputMode(value: string | undefined): DebateInputMode {
  if (value === "VOICE" || value === "VOICE_CAMERA" || value === "TEXT") {
    return value;
  }

  return "VOICE";
}

export default async function DeviceCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; input?: string }>;
}) {
  const params = await searchParams;

  return (
    <DeviceCheckScreen
      sessionId={params.sessionId ?? ""}
      requestedInputMode={parseInputMode(params.input)}
    />
  );
}
