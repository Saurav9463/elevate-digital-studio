import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { fetchAllServices } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: Page });
function Page() {
  const { data } = useQuery({ queryKey: ["admin", "services"], queryFn: fetchAllServices });
  return <ComingSoon title="Services" description="Manage the services shown on /services." count={data?.length} />;
}
