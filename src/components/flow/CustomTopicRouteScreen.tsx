"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlowStepHeader } from "@/components/flow/FlowStepHeader";
import { PageShell } from "@/components/layout/PageShell";
import { CustomTopicForm } from "@/components/topics/CustomTopicForm";
import {
  getDebateFlowDraft,
  saveDebateFlowDraft,
  type DebateFlowDraft,
} from "@/lib/flow/debateFlowDraft";
import type { DebateTopic, SideSelection } from "@/types/debate";

export function CustomTopicRouteScreen({
  refined = false,
}: {
  refined?: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<DebateFlowDraft>(getDebateFlowDraft);
  const [sideSelection, setSideSelection] =
    useState<SideSelection>(draft.sideSelection);

  useEffect(() => {
    queueMicrotask(() => {
      const nextDraft = getDebateFlowDraft();
      setDraft(nextDraft);
      setSideSelection(nextDraft.sideSelection);
    });
  }, []);

  function handleSideChange(nextSide: SideSelection) {
    setSideSelection(nextSide);
    setDraft(saveDebateFlowDraft({ sideSelection: nextSide }));
  }

  function useTopic(topic: DebateTopic) {
    saveDebateFlowDraft({
      topic,
      sideSelection,
      mode: draft.mode === "KURSI_PANAS_AI" ? draft.mode : "PRIVATE_OPINION",
    });
    router.push("/topics");
  }

  return (
    <PageShell className="space-y-6">
      <FlowStepHeader
        eyebrow={refined ? "Topic Refiner" : "Topik Privat"}
        title={refined ? "Rapikan topik debat" : "Buat topik sendiri"}
        description={
          refined
            ? "Gunakan refiner lokal untuk membuat tesis lebih spesifik, aman, dan siap diserang AI secara sportif."
            : "Tulis tesis privat yang ingin diuji. Setelah dipakai, topik masuk ke draft flow dan bisa dimulai dari halaman topik."
        }
        activeStep="Topik"
        backHref="/topics"
      />

      <CustomTopicForm
        onUseTopic={useTopic}
        onSideChange={handleSideChange}
        refinerFirst={refined}
      />
    </PageShell>
  );
}
