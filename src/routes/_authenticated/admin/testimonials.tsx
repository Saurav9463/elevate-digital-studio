import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { fetchAllTestimonials } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({ component: Page });
function Page() {
  const { data } = useQuery({ queryKey: ["admin", "testimonials"], queryFn: fetchAllTestimonials });
  return <ComingSoon title="Testimonials" description="Manage client testimonials shown on /testimonials." count={data?.length} />;
}
