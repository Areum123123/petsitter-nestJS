import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  getMulterS3Storage(): multer.StorageEngine {
    return multerS3({
      s3: this.s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (
        req: Request,
        file: Express.Multer.File,
        cb: (err: any, key?: string) => void,
      ) => {
        const fileName = `${uuid()}-${file.originalname}`;
        cb(null, fileName);
      },
    }) as multer.StorageEngine;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${uuid()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(
        params,
        (err: any, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err);
          }
          resolve(data.Location);
        },
      );
    });
  }
}
