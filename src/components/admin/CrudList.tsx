import { type ReactNode } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ListItem = {
  id: string;
  title: string;
  subtitle?: string;
  thumb?: string | null;
  published?: boolean;
};

export function CrudList({
  items,
  onEdit,
  onDelete,
  onTogglePublish,
  empty,
}: {
  items: ListItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish?: (id: string, next: boolean) => void;
  empty?: ReactNode;
}) {
  if (!items.length) return <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{empty ?? "No records yet."}</div>;
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-background">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-4 px-4 py-3">
          <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
            {i.thumb && <img src={i.thumb} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{i.title}</p>
              {i.published === false && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">Draft</span>
              )}
            </div>
            {i.subtitle && <p className="truncate text-xs text-muted-foreground">{i.subtitle}</p>}
          </div>
          <div className="flex items-center gap-1">
            {onTogglePublish && (
              <Button size="icon" variant="ghost" onClick={() => onTogglePublish(i.id, !i.published)} title={i.published ? "Unpublish" : "Publish"}>
                {i.published ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={() => onEdit(i.id)}><Pencil className="size-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this item?")) onDelete(i.id); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
