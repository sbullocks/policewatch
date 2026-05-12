import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET = 'policewatch-videos';

export async function uploadVideo(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const key = `videos/${Date.now()}-${filename}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, buffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Video upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

export async function deleteObject(key: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
