import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyAccess, requireCompanyWrite } from "@/lib/session";
import { customerSchema } from "@/lib/validations/customer";
import {
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "@/services/customer.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { companyId } = await requireCompanyAccess();
    const customer = await getCustomer(companyId, id);
    if (!customer) return apiError("NOT_FOUND", "Client introuvable.", 404);
    return apiSuccess(customer);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { companyId } = await requireCompanyWrite();
    const body = await request.json();
    const input = customerSchema.parse(body);
    const customer = await updateCustomer(companyId, id, input);
    if (!customer) return apiError("NOT_FOUND", "Client introuvable.", 404);
    return apiSuccess(customer);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { companyId } = await requireCompanyWrite();
    const deleted = await deleteCustomer(companyId, id);
    if (!deleted) return apiError("NOT_FOUND", "Client introuvable.", 404);
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
