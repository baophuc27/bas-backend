import { BadRequestException } from '@bas/api/errors';
import { Request } from 'express';
import { log } from './logger';

import multer, { FileFilterCallback } from 'multer';

import * as fs from 'fs';
import { AVATAR_FOLDER_PATH, LOGO_FOLDER_PATH } from '@bas/constant/path';
import { IMAGE_CHARACTER_SIZE, IMAGE_SIZE } from '@bas/constant';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

let path = require('path');
let limits = {
  fieldNameSize: IMAGE_CHARACTER_SIZE, // 100 characters
  fileSize: IMAGE_SIZE, // 1MB
};

const storageAvatar = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    if (!fs.existsSync(AVATAR_FOLDER_PATH)) {
      fs.mkdirSync(AVATAR_FOLDER_PATH);
    }
    cb(null, AVATAR_FOLDER_PATH);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    log('file------' + file);

    cb(null, `${req.identification.userId + path.extname(file.originalname)}`);
  },
});

const storageLogo = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    if (!fs.existsSync(LOGO_FOLDER_PATH)) {
      fs.mkdirSync(LOGO_FOLDER_PATH);
    }
    cb(null, LOGO_FOLDER_PATH);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    log('file------' + file);
    cb(null, `logo.png`);
  },
});


const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  let filetypes = /jpeg|jpg|png|webp/;
  let mimetype = filetypes.test(file.mimetype);
  if (!mimetype) {
    cb(new BadRequestException('invalid format image'));
  }
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadAvatar = multer({ storage: storageAvatar, limits, fileFilter: imageFilter });
const uploadLogo = multer({ storage: storageLogo, limits, fileFilter: imageFilter });

export { uploadAvatar, uploadLogo };
