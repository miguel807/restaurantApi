import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RESTAURANT, ORDER } from '../common/models/models';
import { getModelToken } from '@nestjs/mongoose';
import { IRestaurant } from './interfaces/restaurant.interface';
import { Model } from 'mongoose';
import { IOrder } from './interfaces/order.interface';

describe('UsersService', () => {
  let service: RestaurantService;
  let userModelRestaurant: Model<IRestaurant>;
  let userModelOrder: Model<IOrder>;

  const mockRestaurantRepository = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        _id: expect.any(String),
        ...dto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    find: jest.fn(() => ({
      populate: jest.fn(() => ({
        select: jest.fn().mockImplementation(() => {
          return Promise.resolve([
            {
              _id: expect.any(String),
              name: expect.any(String),
              address: expect.any(String),
              capacity: expect.any(Number),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              client: expect.any(Array),
            },
            {
              _id: expect.any(String),
              name: expect.any(String),
              address: expect.any(String),
              capacity: expect.any(Number),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              client: expect.any(Array),
            },
          ]);
        }),
      })),
    })),
    findById: jest.fn((id) => ({
      populate: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          _id: id,
          name: expect.any(String),
          address: expect.any(String),
          capacity: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          client: expect.any(Array),
        });
      }),
    })),

    findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => {
      return Promise.resolve({
        _id: id,
        ...dto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }),
    findByIdAndDelete: jest.fn().mockImplementation((id) => {
      return null;
    }),
  };

  const mockOrderRepository = {
    create: jest.fn(() => ({
      populate: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          _id: expect.any(String),
          description: 'test',
          client: expect.any(Object),
          restaurant: expect.any(Object),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      }),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getModelToken(RESTAURANT.name),
          useValue: mockRestaurantRepository,
        },
        {
          provide: getModelToken(ORDER.name),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    userModelRestaurant = module.get<Model<IRestaurant>>(
      getModelToken(RESTAURANT.name),
    );
    userModelOrder = module.get<Model<IOrder>>(getModelToken(ORDER.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const restaurantDto = {
      name: 'Restaurante 2',
      address: 'Airbus A344',
      capacity: 30,
    };

    const result = await service.create(restaurantDto);

    expect(result).toEqual({
      _id: expect.any(String),
      ...restaurantDto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return all restaurants', async () => {
    const response = await service.findAll();
    expect(response).toEqual([
      {
        _id: expect.any(String),
        name: expect.any(String),
        address: expect.any(String),
        capacity: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        client: expect.any(Array),
      },
      {
        _id: expect.any(String),
        name: expect.any(String),
        address: expect.any(String),
        capacity: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        client: expect.any(Array),
      },
    ]);
  });

  it('should return one restaurant by id', async () => {
    const response = await service.findOne('64c568a6e0775574b59cd6aa');
    expect(response).toEqual({
      _id: '64c568a6e0775574b59cd6aa',
      name: expect.any(String),
      address: expect.any(String),
      capacity: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      client: expect.any(Array),
    });
  });

  it('should update one restaurant by id', async () => {
    const updateUserDto = {
      name: 'Restaurante 2',
      address: 'Airbus A344',
      capacity: 30,
    };
    const response = await service.update(
      '64c568a6e0775574b59cd6aa',
      updateUserDto,
    );
    expect(response).toEqual({
      _id: '64c568a6e0775574b59cd6aa',
      ...updateUserDto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should delete one restaurant by id', async () => {
    const response = await service.delete('64c568a6e0775574b59cd6aa');
    expect(response).toBeNull();
  });

  it('should add a Restaurant and create a new order for that userId', async () => {
    const result = await service.addRestaurantOrderToUser(
      '64c568a6e0775574b59cd6ab',
      '64c568a6e0775574b59cd6ab',
      'test',
    );
    expect(result).toEqual({
      _id: '64c568a6e0775574b59cd6ac',
      description: 'test',
      client: expect.any(Object),
      restaurant: expect.any(Object),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
