import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { requireCompanyWrite } from "@/lib/session";
import { appointmentSchema } from "@/lib/validations/appointment";
import {
  deleteAppointment,
  updateAppointment,
} from "@/services/appointment.service";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { companyId } = await requireCompanyWrite();
    const body = await request.json();
    const input = appointmentSchema.parse(body);
    const appointment = await updateAppointment(companyId, id, input);
    if (!appointment) return apiError("NOT_FOUND", "Rendez-vous introuvable.", 404);
    return apiSuccess(appointment);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { companyId } = await requireCompanyWrite();
    const deleted = await deleteAppointment(companyId, id);
    if (!deleted) return apiError("NOT_FOUND", "Rendez-vous introuvable.", 404);
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
