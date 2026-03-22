import { supabase } from "@/integrations/supabase/client";
export { supabase };

export function generateTxCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "RAJ-";
  for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
