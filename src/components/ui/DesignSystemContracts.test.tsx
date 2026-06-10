// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { LoadingDots } from "@/components/common/LoadingDots";
import {
  BottomSheet,
  Button,
  Chip,
  Input,
  Modal,
  Skeleton,
  Toast,
} from ".";

describe("design system contracts", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps base controls accessible", () => {
    render(
      <div>
        <Button isLoading>Memproses</Button>
        <Chip selected>Siap</Chip>
        <Input label="Tesis utama" name="thesis" helperText="Tulis klaim ringkas." />
      </div>,
    );

    expect(screen.getByRole("button", { name: /Memproses/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Memproses/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("button", { name: /Siap/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(/Tesis utama/i)).toHaveAttribute("name", "thesis");
    expect(screen.getByText(/Tulis klaim ringkas/i)).toBeInTheDocument();
  });

  it("renders feedback, loading, error, and skeleton states with semantic roles", () => {
    render(
      <div>
        <LoadingDots label="AI sedang menyiapkan respons" />
        <Skeleton label="Memuat kartu arena" />
        <Toast title="Mikrofon siap" description="Input suara aktif." />
        <ErrorBanner message="API key belum disimpan." />
      </div>,
    );

    expect(
      screen.getByRole("status", { name: /AI sedang menyiapkan respons/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: /Memuat kartu arena/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status", { name: /Mikrofon siap/i })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/API key belum disimpan/i);
  });

  it("supports modal escape close and focus entry", () => {
    const onOpenChange = vi.fn();

    render(
      <Modal
        open
        title="Periksa Transkrip"
        description="Koreksi sebelum dikirim."
        onOpenChange={onOpenChange}
      >
        <Input label="Transkrip" name="transcript" />
      </Modal>,
    );

    expect(
      screen.getByRole("dialog", { name: /Periksa Transkrip/i }),
    ).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: /Tutup modal/i })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports bottom sheet escape close and focus entry", () => {
    const onOpenChange = vi.fn();

    render(
      <BottomSheet
        open
        title="Delivery Coach"
        description="Sinyal bicara."
        onOpenChange={onOpenChange}
      >
        <p>Kecepatan bicara stabil.</p>
      </BottomSheet>,
    );

    expect(screen.getByRole("dialog", { name: /Delivery Coach/i })).toHaveAttribute(
      "aria-modal",
      "true",
    );
    expect(screen.getByRole("button", { name: /Tutup sheet/i })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders destructive confirmation as an alert dialog", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        title="Hapus sesi?"
        message="Laporan ini akan dihapus dari browser."
        confirmLabel="Hapus"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("alertdialog", { name: /Hapus sesi/i })).toHaveAttribute(
      "aria-modal",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    fireEvent.click(screen.getByRole("button", { name: "Hapus" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
