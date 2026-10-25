import { auth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyAccess, requireSession } from "@/lib/session";
import { serviceRequestSchema } from "@/lib/validations/service-request";
import {
  createServiceRequest,
  listAuthorServiceRequests,
  listCompanyServiceRequests,
} from "@/services/service-request.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") ?? "company";

    if (scope === "mine") {
      const session = await requireSession();
      const requests = await listAuthorServiceRequests(session.user.id);
      return apiSuccess(requests);
    }

    const { companyId } = await requireCompanyAccess();
    const requests = await listCompanyServiceRequests(companyId);
    return apiSuccess(requests);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const input = serviceRequestSchema.parse(body);
    const created = await createServiceRequest(input, session?.user?.id ?? null);
    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
