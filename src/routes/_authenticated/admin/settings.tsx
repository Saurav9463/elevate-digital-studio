import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: Page });
function Page() {
  return <ComingSoon title="Site settings" description="Contact info, social links, and homepage copy." />;
}
