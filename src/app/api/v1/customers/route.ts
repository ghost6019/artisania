import { apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyAccess, requireCompanyWrite } from "@/lib/session";
import { customerSchema } from "@/lib/validations/customer";
import {
  createCustomer,
  listCustomers,
} from "@/services/customer.service";

export async function GET(request: Request) {
  try {
    const { companyId } = await requireCompanyAccess();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") ?? undefined;
    const customers = await listCustomers(companyId, search);
    return apiSuccess(customers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { session, companyId } = await requireCompanyWrite();
    const body = await request.json();
    const input = customerSchema.parse(body);
    const customer = await createCustomer(companyId, session.user.id, input);
    return apiSuccess(customer, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
