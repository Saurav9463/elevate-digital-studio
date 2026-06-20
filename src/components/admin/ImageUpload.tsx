import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/uploads";
import { toast } from "sonner";

export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[4/5]",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className={`${aspect} relative w-full overflow-hidden rounded-md border border-border bg-muted/50`}>
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 rounded-md bg-background/90 p-1 text-foreground shadow"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
          <Upload className="mr-2 size-3.5" /> Upload
        </Button>
        <Input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Input
          placeholder="…or paste image URL"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
