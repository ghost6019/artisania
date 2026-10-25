export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listCustomers } from "@/services/customer.service";
import { CustomersManager } from "@/components/customers/customers-manager";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const customers = await listCustomers(companyId);

  return <CustomersManager initialCustomers={customers} />;
}
