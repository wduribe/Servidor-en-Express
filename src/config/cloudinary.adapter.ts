import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';

interface Config {
    cloud_name: string,
    api_key: string,
    api_secret: string,
    secure?: boolean,
}

export class Cloudinary {

    private readonly cloudinary = cloudinary;

    constructor(config: Config) {
        const { cloud_name, api_key, api_secret, secure = true } = config;
        this.cloudinary.config({ cloud_name, api_key, api_secret, secure });
    }

    uploadImage = async (buffer: UploadApiOptions) => {

        try {

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = this.cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                });
                uploadStream.end(buffer);
            })

            return {
                url: result.secure_url,
                publicId: result.public_id
            };

        } catch (error) {
            throw error;
        }
    }

    deleteImage = async (id: string) => {
        return await this.cloudinary.uploader.destroy(id);
    }

}