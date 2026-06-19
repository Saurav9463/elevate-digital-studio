import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { fetchAllFounders } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/founders")({ component: Page });
function Page() {
  const { data } = useQuery({ queryKey: ["admin", "founders"], queryFn: fetchAllFounders });
  return <ComingSoon title="Founders" description="Manage founder profiles shown on /about." count={data?.length} />;
}
