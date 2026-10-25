import { apiSuccess, handleApiError } from "@/lib/api";
import { requirePlatformAdmin } from "@/lib/session";
import { getAdminOverview } from "@/services/admin.service";

export async function GET() {
  try {
    await requirePlatformAdmin();
    const overview = await getAdminOverview();
    return apiSuccess(overview);
  } catch (error) {
    return handleApiError(error);
  }
}
