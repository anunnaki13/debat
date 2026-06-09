import { notFound } from "next/navigation";
import { MockArena } from "@/components/dev/MockArena";

export const metadata = {
  title: "Mock Arena | Republik Argumen",
};

export default function MockArenaPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MockArena />;
}
