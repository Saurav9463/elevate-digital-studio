import { supabase } from "@/integrations/supabase/client";

const BUCKET = "site-media";

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  // Long-lived signed URL (1 year). Workspace blocks public buckets.
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw signErr;
  return data.signedUrl;
}
