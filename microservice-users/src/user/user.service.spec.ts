import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER } from '../common/models/models';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UserService;
  let userModel: Model<IUser>;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        _id: expect.any(String),
        ...dto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        {
          _id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(Date),
          age: expect.any(Number),
          password: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          _id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(Date),
          age: expect.any(Number),
          password: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    }),
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve({
        _id: id,
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(Date),
        age: expect.any(Number),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(USER.name),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<IUser>>(getModelToken(USER.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const userDto = {
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-11',
      age: 25,
      password: '123Ale',
    };
    const hash = 'encryptedPassword';

    jest.spyOn(service, 'hashPassword').mockResolvedValue(hash);

    const result = await service.create(userDto);

    expect(result).toEqual({
      _id: expect.any(String),
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-11',
      age: 25,
      password: hash,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return all users', async () => {
    const response = await service.findAll();
    expect(response).toEqual([
      {
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(Date),
        age: expect.any(Number),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(Date),
        age: expect.any(Number),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);
  });

  it('should return one user by id', async () => {
    const response = await service.findOne('64c568a6e0775574b59cd6aa');
    expect(response).toEqual({
      _id: '64c568a6e0775574b59cd6aa',
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(Date),
      age: expect.any(Number),
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should update one user by id', async () => {
    const updateUserDto = {
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-11',
      age: 25,
      password: '123Ale',
    };
    const hash = 'encryptedPassword';

    jest.spyOn(service, 'hashPassword').mockResolvedValue(hash);

    const response = await service.update(
      '64c568a6e0775574b59cd6aa',
      updateUserDto,
    );
    expect(response).toEqual({
      _id: '64c568a6e0775574b59cd6aa',
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-11',
      age: 25,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should delete one user by id', async () => {
    const response = await service.remove('64c568a6e0775574b59cd6aa');
    expect(response).toBeNull();
  });
});
