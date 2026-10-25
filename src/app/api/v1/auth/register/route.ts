import { registerSchema } from "@/lib/validations/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);
    const user = await registerUser(input);

    return apiSuccess(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
      },
      201,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return apiError("CONFLICT", "Cette adresse e-mail est déjà utilisée.", 409);
    }
    return handleApiError(error);
  }
}
