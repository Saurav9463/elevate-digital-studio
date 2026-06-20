import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const v = draft.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={placeholder}
        className="h-7 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
