import * as fs from 'fs';
import { logError } from './logger';
// import sharp from 'sharp';
// sharp.cache(false);
const deleteImage = (path: string) => {
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
            if (err) {
                logError(err);
                throw new Error("Can't delete image");
            }
        });
    }
};

const compressImage = (path: string) => {
    // fs.readFile(path, (err, data) => {
    //     if (err) {
    //         logError(err);
    //         throw new Error("Can't read image");
    //     } else {
    //         // Xử lý ảnh với Sharp
    //         sharp(data)
    //             // .resize(500, 500)
    //             .jpeg({ quality: 80 })
    //             .png({ quality: 80 })
    //             .webp({ quality: 80 })
    //             .toBuffer((err, processedData) => {
    //                 if (err) {
    //                     logError(err);
    //                     throw new Error("Can't compress image");
    //                 } else {
    //                     // Ghi đè dữ liệu xử lý lên đường dẫn ảnh đầu vào
    //                     fs.writeFile(path, processedData, (err) => {
    //                         if (err) {
    //                             logError(err);
    //                             throw new Error("Can't compress and write image");
    //                         } else {
    //                             console.log('Ảnh đã được ghi đè thành công!');
    //                         }
    //                     });
    //                 }
    //             });
    //     }
    // });
};



export {
    deleteImage,
    compressImage
};

