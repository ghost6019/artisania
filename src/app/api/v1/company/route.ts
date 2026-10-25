import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyAccess, requireCompanyWrite } from "@/lib/session";
import {
  companySettingsSchema,
  artisanProfileSchema,
} from "@/lib/validations/company";
import {
  getCompanyWithProfile,
  updateArtisanProfile,
  updateCompanySettings,
} from "@/services/company.service";

export async function GET() {
  try {
    const { companyId } = await requireCompanyAccess();
    const company = await getCompanyWithProfile(companyId);
    if (!company) return apiError("NOT_FOUND", "Entreprise introuvable.", 404);
    return apiSuccess(company);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { session, companyId } = await requireCompanyWrite();
    const body = await request.json();
    const section = body.section as string | undefined;

    if (section === "profile") {
      const input = artisanProfileSchema.parse(body.data ?? body);
      const profile = await updateArtisanProfile(
        companyId,
        session.user.id,
        input,
      );
      return apiSuccess(profile);
    }

    const input = companySettingsSchema.parse(body.data ?? body);
    const company = await updateCompanySettings(companyId, input);
    return apiSuccess(company);
  } catch (error) {
    return handleApiError(error);
  }
}
