import { JwtService } from '@nestjs/jwt';
import * as nodeGeoCoder from 'node-geocoder';
import { Location } from '../hotels/schemas/location.schema';
import { S3 } from 'aws-sdk';

export default class APIFeatures {
  static async getHotelLocation(address) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };
      const geocoder = nodeGeoCoder(options);

      const loc = await geocoder.geocode(address);
      const location: Location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
      };
      return location;
    } catch (error) {
      console.log(error);
    }
  }

  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }

  //upload images to s3 bucket
  static async uploadImagesToS3(files): Promise<object[]> {
    return new Promise((resolve) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const images = [];

      files.forEach(async (file) => {
        const splitFile: string = file.original.split('.');
        const now: number = Date.now();

        const fileName = `${splitFile[0]}_${now}.${splitFile[1]}`;
        const params = {
          Bucket: `${process.env.AWS_BUCKET_NAME}/hotels`,
          Key: fileName,
          Body: file.buffer,
        };
        const uploadResponse = await s3.upload(params).promise();
        images.push(uploadResponse);

        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }

  //delete images from s3 bucket
  static async deleteImagesFromS3(images) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const imagesKeys: Array<{ Key: string }> = images.map((image) => {
      return { Key: image.key };
    });

    const params = {
      Bucket: `${process.env.AWS_BUCKET_NAME}/hotels`,
      Delete: {
        Objects: imagesKeys,
        Quiet: false,
      },
    };
    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, function (err, data) {
        if (err) {
          console.log('err', err);
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
