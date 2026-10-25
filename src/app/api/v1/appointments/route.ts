import { apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyAccess, requireCompanyWrite } from "@/lib/session";
import { appointmentSchema } from "@/lib/validations/appointment";
import {
  createAppointment,
  listAppointments,
} from "@/services/appointment.service";

export async function GET(request: Request) {
  try {
    const { companyId } = await requireCompanyAccess();
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const appointments = await listAppointments(companyId, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    return apiSuccess(appointments);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { companyId } = await requireCompanyWrite();
    const body = await request.json();
    const input = appointmentSchema.parse(body);
    const appointment = await createAppointment(companyId, input);
    return apiSuccess(appointment, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
