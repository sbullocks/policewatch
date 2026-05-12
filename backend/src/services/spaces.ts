import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

const client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION ?? 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: false,
});

const BUCKET = process.env.DO_SPACES_BUCKET!;

export async function uploadVideo(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const key = `videos/${Date.now()}-${filename}`;
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    })
  );
  return `${process.env.DO_SPACES_ENDPOINT}/${BUCKET}/${key}`;
}

export async function uploadFrame(buffer: Buffer, key: string): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'private',
    })
  );
  return key;
}

export async function getFrameSignedUrl(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 300 }
  );
}

export async function deleteObject(key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
