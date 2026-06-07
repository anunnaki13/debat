import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/debate";

export function apiError(
  code: ApiErrorResponse["error"]["code"],
  message: string,
  retryable: boolean,
  status = 500,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        retryable,
      },
    },
    { status },
  );
}
