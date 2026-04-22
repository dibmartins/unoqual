import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint: process.env.STORAGE_ENDPOINT, // For R2/Cloudflare
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || "";

export class StorageService {
  /**
   * Generates a pre-signed URL for uploading a file to S3/R2.
   * This ensures only authenticated users can upload directly from the frontend.
   */
  static async getUploadUrl(key: string, contentType: string, expiresIn: number = 900) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Generates a pre-signed URL for downloading a file.
   * This is used for "Proteção de Evidências", so files are not public.
   */
  static async getDownloadUrl(key: string, expiresIn: number = 900) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Generates a unique key for the file based on organization and inspection.
   */
  static generateKey(organizationId: string, inspectionId: string, fileName: string) {
    const timestamp = Date.now();
    return `org_${organizationId}/insp_${inspectionId}/${timestamp}_${fileName}`;
  }
}
