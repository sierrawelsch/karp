import { makeRequest } from '../base';

export async function uploadImage(
  entityType: string,
  entityId: string,
  imageFile: File
): Promise<{ upload_url: string }> {
  const filename = encodeURIComponent(imageFile.name);
  const presignedData = makeRequest<{ upload_url: string; file_url: string }>(
    `/${entityType}/${entityId}/upload-url?filename=${filename}&filetype=${imageFile.type}`,
    'GET'
  );

  const uploadResponse = await fetch((await presignedData).upload_url, {
    method: 'PUT',
    headers: {
      'Content-Type': imageFile.type,
    },
    body: imageFile,
  });

  if (!uploadResponse.ok) {
    throw new Error(
      `Failed to upload image to S3: ${uploadResponse.status} ${uploadResponse.statusText}`
    );
  }

  // Step 3 — Return the file URL (S3 key)
  return { upload_url: (await presignedData).upload_url };
}
