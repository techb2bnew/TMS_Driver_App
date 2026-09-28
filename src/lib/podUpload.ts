import { supabase } from './supabase';

// Uploads the driver's delivery photo to the `pod-photos` storage bucket and
// records it in `pod_documents`. Requires schema_v4_pod_storage.sql to have
// been run (creates the bucket + its storage RLS policies).
//
// React Native's fetch().blob() is unreliable for this — piping that Blob
// into another fetch (which is what supabase-js's upload does internally)
// throws a generic "Network request failed" on device. arrayBuffer() is the
// approach Supabase's own React Native docs recommend instead.
export async function submitPodPhoto(loadId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const arraybuffer = await response.arrayBuffer();
  const path = `${loadId}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage.from('pod-photos').upload(path, arraybuffer, {
    contentType: 'image/jpeg',
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('pod-photos').getPublicUrl(path);

  await supabase.from('pod_documents').insert({ load_id: loadId, file_url: data.publicUrl });

  return data.publicUrl;
}
