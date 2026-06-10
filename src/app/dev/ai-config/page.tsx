import { notFound } from "next/navigation";
import { DevAiConfig } from "@/components/dev/DevAiConfig";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "AI Config | Republik Argumen",
};

export default function DevAiConfigPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <PageShell className="space-y-6">
      <DevAiConfig />
    </PageShell>
  );
}
