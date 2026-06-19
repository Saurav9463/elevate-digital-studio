import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { fetchAllProjects } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/projects")({ component: Page });
function Page() {
  const { data } = useQuery({ queryKey: ["admin", "projects"], queryFn: fetchAllProjects });
  return <ComingSoon title="Projects" description="Manage your portfolio shown on /projects." count={data?.length} />;
}
