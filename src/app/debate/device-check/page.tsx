import { redirect } from "next/navigation";

export default async function DeviceCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; input?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.sessionId) {
    query.set("sessionId", params.sessionId);
  }

  if (params.input) {
    query.set("input", params.input);
  }

  redirect(`/device-check${query.size ? `?${query.toString()}` : ""}`);
}
