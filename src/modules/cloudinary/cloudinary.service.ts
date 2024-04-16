import { Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { v2 } from 'cloudinary';
@Injectable()
export class CloudinaryService {
    async uploadFile(
        file: Express.Multer.File,
    ) {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({ folder: "upload", resource_type: "auto" }, (error, result) => {
                if (error) { console.log(error); return reject(error) };
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
    }
}
