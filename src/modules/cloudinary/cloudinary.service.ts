import { Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { v2 } from 'cloudinary';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';
@Injectable()
export class CloudinaryService {
    async uploadFile(
        file: Express.Multer.File,
    ) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new httpBadRequest('Unsupported file type. Only JPEG, PNG, and JPG images are allowed.');
        }

        // Check file size
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            throw new httpBadRequest('File size exceeds the limit. Please upload an image smaller than 10MB.');
        }

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({ folder: "upload", resource_type: "auto" }, (error, result) => {
                if (error) { console.log(error); return reject(error) };
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
    }
}
