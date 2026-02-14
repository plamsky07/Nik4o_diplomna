import { supabase } from "./supabaseClient";

export async function uploadCarImage(file) {
  const bucket = import.meta.env.VITE_SB_BUCKET || "cars";

  const ext = file.name.split(".").pop();
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = safeName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
