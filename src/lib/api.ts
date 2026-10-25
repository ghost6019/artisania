import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "BAD_REQUEST";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "VALIDATION_ERROR",
      "Les données fournies sont invalides.",
      400,
      error.issues,
    );
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentification requise.", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Accès refusé.", 403);
    }
    if (error.message === "NOT_FOUND") {
      return apiError("NOT_FOUND", "Ressource introuvable.", 404);
    }
  }

  console.error("[api]", error instanceof Error ? error.message : "Unknown error");
  return apiError("INTERNAL_ERROR", "Une erreur interne est survenue.", 500);
}
