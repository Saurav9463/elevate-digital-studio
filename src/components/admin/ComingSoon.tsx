import { Construction } from "lucide-react";
import { PageTitle } from "./AdminShell";

export function ComingSoon({ title, description, count }: { title: string; description: string; count?: number }) {
  return (
    <>
      <PageTitle title={title} description={description} />
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-16 text-center">
          <Construction className="size-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Editor coming next</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {typeof count === "number" ? `${count} ${title.toLowerCase()} are already seeded in the database and visible on the public site. ` : ""}
            Full create / edit / image-upload UI lands in the next pass.
          </p>
        </div>
      </div>
    </>
  );
}
