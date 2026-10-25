export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listAppointments } from "@/services/appointment.service";
import { listCustomers } from "@/services/customer.service";
import { AppointmentsManager } from "@/components/appointments/appointments-manager";

export const metadata = { title: "Agenda" };

export default async function AgendaPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const [appointments, customers] = await Promise.all([
    listAppointments(companyId),
    listCustomers(companyId),
  ]);

  return (
    <AppointmentsManager
      initialAppointments={appointments}
      customers={customers.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
      }))}
    />
  );
}
