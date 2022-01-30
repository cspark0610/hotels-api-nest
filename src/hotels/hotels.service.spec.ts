import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import APIFeatures from '../utils/apiFeatures.util';
import { HotelsService } from './hotels.service';
import { Hotel } from './schemas/hotel.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { mockHotel, mockUser, newHotel } from '../constants/mock.contants';

const mockHotelsService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('HotelsService', () => {
  let service: HotelsService;
  let model: Model<Hotel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsService,
        {
          provide: getModelToken(Hotel.name),
          useValue: mockHotelsService,
        },
      ],
    }).compile();

    service = module.get<HotelsService>(HotelsService);
    model = module.get<Model<Hotel>>(getModelToken(Hotel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of hotels', async () => {
      //mirar lo que hace hotelModel dentro del metodo findAll
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockHotel]),
            }),
          } as any),
      );
      const hotels = await service.findAll({ keyword: '1' });
      expect(hotels).toEqual([mockHotel]);
      expect(hotels).toBeInstanceOf(Array);
    });
  });
  describe('create', () => {
    it('should create a new hotel', async () => {
      jest
        .spyOn(APIFeatures, 'getHotelLocation')
        .mockImplementationOnce(
          () => Promise.resolve(mockHotel.location) as any,
        );
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockHotel));
      const result = await service.create(newHotel as any, mockUser as any);
      expect(result).toEqual(mockHotel);
    });
  });

  describe('findById', () => {
    it('should return a hotel by a valid mongoose id', async () => {
      const hotel = { ...mockHotel, _id: new mongoose.Types.ObjectId() };
      jest
        .spyOn(model, 'findById')
        .mockImplementationOnce(() => Promise.resolve(hotel) as any);
      const foundHotelById = await service.findById(hotel._id.toString());
      expect(foundHotelById._id).toEqual(hotel._id);
    });

    it('should throw wrong mongoose id error', async () => {
      await expect(service.findById('wrong_id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw hotel not found error', async () => {
      const _id = new mongoose.Types.ObjectId().toString();
      const mockError = new NotFoundException('Hotel not found');
      jest.spyOn(model, 'findById').mockRejectedValue(mockError);

      await expect(service.findById(_id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {
    it('should update a hotel by a valid mongoose id', async () => {
      const updateBody = { name: 'updated name' };
      const hotel = { ...mockHotel, name: 'updated name' };
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(hotel as any);
      const updatedHotel = await service.updateById(
        hotel._id,
        updateBody as any,
      );
      expect(updatedHotel.name).toEqual(updateBody.name);
    });
  });

  describe('deleteById', () => {
    it('should delete hotel by passing a valid mongooseID', async () => {
      const deleteMessage = { deleted: true };
      const hotel = { ...mockHotel, _id: new mongoose.Types.ObjectId() };

      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockImplementationOnce(() => Promise.resolve(deleteMessage) as any);
      const result = (await service.deleteById(hotel._id.toString())) as any;
      expect(result.deleted).toBe(true);
    });
  });

  describe('upload images correctly', () => {
    it('should upload images correctly on S3 bucket', async () => {
      const image1 = {
        ETag: '',
        Location:
          'https://hotels-api-bucket.s3.amazonaws.com/hotels/image1.jepg',
        key: 'hotels/image1.jepg',
        Key: 'hotels/image1.jepg',
        Bucket: 'hotels-api-bucket',
      };

      const mockImages = [image1];
      const updatedHotel = {
        ...mockHotel,
        images: mockImages,
        _id: new mongoose.Types.ObjectId().toString(),
      };
      jest
        .spyOn(APIFeatures, 'uploadImagesToS3')
        .mockResolvedValueOnce(mockImages);

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updatedHotel as any);
      const files = [
        {
          fieldname: 'files',
          originalname: 'image1.jpeg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
        },
      ];
      const result = await service.uploadImages(mockHotel._id, files as any);
      expect(result).toEqual(updatedHotel);
    });
  });

  describe('delete images', () => {
    it('should delete images correctly from S3 bucket', async () => {
      const mockImages = [
        {
          ETag: '',
          Location:
            'https://hotels-api-bucket.s3.amazonaws.com/hotels/image1.jepg',
          key: 'hotels/image1.jepg',
          Key: 'hotels/image1.jepg',
          Bucket: 'hotels-api-bucket',
        },
      ];
      jest.spyOn(APIFeatures, 'deleteImagesFromS3').mockResolvedValueOnce(true);

      const result = await service.deleteImages(mockImages);

      expect(result).toEqual(true);
    });
  });
});
