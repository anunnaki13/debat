import { notFound } from "next/navigation";
import { UiPlayground } from "@/components/dev/UiPlayground";

export const metadata = {
  title: "UI Playground | Republik Argumen",
};

export default function UiPlaygroundPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <UiPlayground />;
}
