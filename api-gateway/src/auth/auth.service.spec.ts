import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyRestaurant } from '../common/proxy/client-proxy';
import { RedisCacheModule } from '../redis/redis.module';
import { UserMSG } from '../common/constants';

describe('UsersService', () => {
  let service: AuthService;

  const mockClientProxyUserSend = jest.fn(() => ({}));
  const mockClientProxyUsers = {
    send: mockClientProxyUserSend,
  };

  // @ts-ignore
  mockClientProxyUserSend.mockImplementation((msg: string, data: any) => {
    const result = {
      CREATE_USER: (data) => {
        return [
          {
            _id: expect.any(String),
            ...data,
            password: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ];
      },
      VALID_USER: () => {
        return true;
      },
    };
    return result[msg](data);
  });

  const mockClientProxyRestaurant = {
    ClientProxyUsers: jest.fn(() => mockClientProxyUsers),
  };

  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 5,
          max: 100,
        }),
        RedisCacheModule,
      ],
      providers: [
        AuthService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .fn()
              .mockImplementation((loginUserDto) => expect.any(String)),
          },
        },
        {
          provide: ClientProxyRestaurant,
          useValue: mockClientProxyRestaurant,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup a user', async () => {
    const createUserDto = {
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-78',
      age: 29,
      password: expect.any(String),
    };

    expect(await service.signUp(createUserDto)[0]).toEqual({
      _id: expect.any(String),
      ...createUserDto,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should signin a user', async () => {
    const loginUserDto = {
      email: 'ajpirez1994@gmail.com',
      password: '123Ale',
    };

    jest.spyOn(service, 'validateUser').mockResolvedValue({
      _id: '60f57c9a118f8c001ffca9e5',
      email: loginUserDto.email,
    });
    // jest.spyOn(redisCacheService, 'set').mockResolvedValue(null);
    expect(await service.signIn(loginUserDto)).toEqual({
      _id: expect.any(String),
      email: loginUserDto.email,
      access_token: expect.any(String),
    });
  });

  // it('should create a new user record and return that', async () => {
  //   expect(
  //     await service.create({
  //       username: 'ajpirez',
  //       password: '123',
  //     }),
  //   ).toEqual({
  //     id: expect.any(Number),
  //     authStrategy: expect.any(String),
  //     username: 'ajpirez',
  //     password: '123',
  //     createdAt: expect.any(Date),
  //   });
  // });
  //
  // it('should return all users', async () => {
  //   const response = await service.findAll();
  //   expect(response).toEqual([
  //     {
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       password: expect.any(String),
  //       createdAt: expect.any(Date),
  //       authStrategy: expect.any(String),
  //       profile: expect.any(Object),
  //       posts: expect.any(Array),
  //       groups: expect.any(Array),
  //     },
  //     {
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       password: expect.any(String),
  //       createdAt: expect.any(Date),
  //       authStrategy: expect.any(String),
  //       profile: expect.any(Object),
  //       posts: expect.any(Array),
  //       groups: expect.any(Array),
  //     },
  //   ]);
  // });
  //
  // it('should return one user by id', async () => {
  //   const response = await service.findOne(1);
  //   expect(response).toEqual({
  //     id: 1,
  //     username: expect.any(String),
  //     password: expect.any(String),
  //     createdAt: expect.any(Date),
  //     authStrategy: expect.any(String),
  //     profile: expect.any(Object),
  //     posts: expect.any(Array),
  //     groups: expect.any(Array),
  //   });
  // });
  //
  // it('should update one user by id', async () => {
  //   const response = await service.update(1, {
  //     username: 'ajpirez',
  //     password: '123',
  //   });
  //   expect(response).toEqual({
  //     id: 1,
  //     username: 'ajpirez',
  //     password: '123',
  //     createdAt: expect.any(Date),
  //     authStrategy: expect.any(String),
  //     profile: expect.any(Object),
  //     posts: expect.any(Array),
  //     groups: expect.any(Array),
  //   });
  // });
  //
  // it('should delete one user by id', async () => {
  //   const response = await service.remove(1);
  //   expect(response).toBeNull();
  // });
});
