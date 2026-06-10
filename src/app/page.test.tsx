// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

describe("Home route entry", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("routes the primary CTA to the play flow", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /Mulai Debat AI/i }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/play");
  });

  it("hides API config, fake metrics, and future monetization clutter from the lobby", () => {
    render(<Home />);

    expect(
      screen.queryByLabelText("OpenRouter API Key"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Model lawan/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Tes OpenRouter/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Premium Club/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Live Arena Feed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Karir Politik/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profil Ideologi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Arena Politika/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/menunggu/i)).not.toBeInTheDocument();
  });

  it("links to route-based flow entry points", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /Mulai Flow/i })).toHaveAttribute(
      "href",
      "/play",
    );
    expect(screen.getByRole("link", { name: /Buka Topik/i })).toHaveAttribute(
      "href",
      "/topics",
    );
    expect(screen.getByRole("link", { name: /Buat Topik/i })).toHaveAttribute(
      "href",
      "/topics/new",
    );
  });
});
