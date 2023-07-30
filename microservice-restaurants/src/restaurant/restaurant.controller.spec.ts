import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/restaurant.dto';

describe('UsersController', () => {
  let controller: RestaurantController;
  const mockRestaurantsService = {
    create: jest.fn((restaurantDto) => {
      return {
        _id: expect.any(String),
        ...restaurantDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    update: jest.fn((updateUserDto) => {
      return {
        _id: expect.any(String),
        ...updateUserDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    findAll: jest.fn(() => {
      return [
        {
          _id: expect.any(String),
          name: expect.any(String),
          address: expect.any(String),
          capacity: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          _id: expect.any(String),
          name: expect.any(String),
          address: expect.any(String),
          capacity: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ];
    }),
    findOne: jest.fn().mockImplementation((_id) => {
      return {
        _id,
        name: expect.any(String),
        address: expect.any(String),
        capacity: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    delete: jest.fn().mockImplementation((id) => {
      return null;
    }),
    addRestaurantOrderToUser: jest.fn().mockImplementation(() => {
      return {
        _id: '64c568a6e0775574b59cd6ac',
        description: 'test',
        client: expect.any(Array),
        restaurant: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [RestaurantService],
    })
      .overrideProvider(RestaurantService)
      .useValue(mockRestaurantsService)
      .compile();

    controller = module.get<RestaurantController>(RestaurantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a restaurant', async () => {
    const restaurantDto = {
      name: 'Restaurante 2',
      address: 'Airbus A344',
      capacity: 30,
    };
    jest.spyOn(controller, 'findOneByName').mockResolvedValue(null);
    const result = await controller.create(restaurantDto);
    expect(result).toEqual({
      _id: expect.any(String),
      ...restaurantDto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(mockRestaurantsService.create).toHaveBeenCalled();
    expect(mockRestaurantsService.create).toHaveBeenCalledWith(restaurantDto);
  });
  it('should update a restaurant', async () => {
    const updateUserDto = {
      name: 'Restaurante 2',
      address: 'Airbus A344',
      capacity: 30,
    };
    jest.spyOn(controller, 'findOne').mockResolvedValue(null);

    jest.spyOn(mockRestaurantsService, 'update').mockResolvedValue({
      ...updateUserDto,
      _id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    const result = await controller.update({
      ...updateUserDto,
      _id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(result).toEqual({
      _id: '64c568a6e0775574b59cd6aa',
      ...updateUserDto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(mockRestaurantsService.update).toHaveBeenCalled();
  });

  it('should find all restaurants', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        _id: expect.any(String),
        name: expect.any(String),
        address: expect.any(String),
        capacity: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        _id: expect.any(String),
        name: expect.any(String),
        address: expect.any(String),
        capacity: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);

    expect(mockRestaurantsService.findAll).toHaveBeenCalled();
  });
  it('should find one restaurant by Id', async () => {
    const result = await controller.findOne('64c568a6e0775574b59cd6ab');
    expect(result).toEqual({
      _id: expect.any(String),
      name: expect.any(String),
      address: expect.any(String),
      capacity: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should delete one restaurant by Id', async () => {
    jest.spyOn(controller, 'findOne').mockResolvedValue(null);
    const result = await controller.delete('64c568a6e0775574b59cd6ab');
    expect(result).toBeNull();
  });

  it('should add a Restaurant and create a new order for that userId', async () => {
    const payload = {
      restaurantId: '64c568a6e0775574b59cd6ab',
      userId: '64c568a6e0775574b59cd6ab',
      description: 'test',
    };
    jest.spyOn(controller, 'findOne').mockResolvedValue({
      _id: expect.any(String),
      name: expect.any(String),
      address: expect.any(String),
      capacity: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      clients: [],
    });

    jest
      .spyOn(mockRestaurantsService, 'addRestaurantOrderToUser')
      .mockResolvedValue({
        _id: '64c568a6e0775574b59cd6ac',
        description: 'test',
        client: expect.any(Array),
        restaurant: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

    const result = await controller.addRestaurantOrderToUser({ payload });
    expect(result).toEqual({
      _id: '64c568a6e0775574b59cd6ac',
      description: 'test',
      client: expect.any(Array),
      restaurant: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
