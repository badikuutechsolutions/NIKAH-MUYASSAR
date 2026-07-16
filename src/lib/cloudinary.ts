import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `nikah-muyassar/${folder}`,
        public_id: publicId,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'pdf', 'webp'],
        max_file_size: 5000000,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve({ secure_url: result!.secure_url, public_id: result!.public_id })
      }
    )
    uploadStream.end(file)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  crop?: string
  gravity?: string
  quality?: string
  format?: string
}): string {
  const { width = 400, height = 400, crop = 'fill', gravity = 'face', quality = 'auto', format = 'webp' } = options || {}
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    gravity,
    quality,
    format,
    secure: true,
  })
}
