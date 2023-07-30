import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxyRestaurant } from '../common/proxy/client-proxy';
import { UserController } from './user.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { UserMSG } from '../common/constants';
import { firstValueFrom, of } from 'rxjs';

describe('UsersController', () => {
  let controller: UserController;

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
      FIND_USERS: () => {
        return [
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
        ];
      },
      FIND_USER: (_id) => {
        return {
          _id,
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(Date),
          age: expect.any(Number),
          password: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        };
      },
      UPDATE_USER: (data) => {
        return {
          data,
          // ...data,
          // createdAt: expect.any(Date),
          // updatedAt: expect.any(Date),
        };
      },
      DELETE_USER: (_id) => {
        return {
          _id,
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(Date),
          age: expect.any(Number),
          password: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        };
      },
      VALID_USER: () => {
        return {};
      },
    };
    return result[msg](data);
  });

  const mockClientProxyRestaurant = {
    ClientProxyUsers: jest.fn(() => mockClientProxyUsers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 5,
          max: 100,
        }),
      ],
      controllers: [UserController],
      providers: [ClientProxyRestaurant],
    })
      .overrideProvider(ClientProxyRestaurant)
      .useValue(mockClientProxyRestaurant)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-78',
      age: 29,
      password: expect.any(String),
    };
    const result = await controller.create(createUserDto);
    expect(mockClientProxyUserSend).toHaveBeenCalledWith(
      UserMSG.CREATE,
      createUserDto,
    );
    expect(result[0]).toEqual({
      _id: expect.any(String),
      ...createUserDto,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return an array of users', async () => {
    const users = await controller.findAll();
    expect(mockClientProxyUserSend).toHaveBeenCalledWith(UserMSG.FIND_ALL, '');
    expect(users).toEqual([
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
  it('should update a user', async () => {
    const updateUserDto = {
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-78',
      age: 29,
      password: expect.any(String),
    };
    const user = { id: '64c568a6e0775574b59cd6aa', ...updateUserDto };
    jest.spyOn(controller, 'findOne').mockReturnValue(of(user));
    mockClientProxyUserSend.mockReturnValueOnce(of(user));
    const result = await firstValueFrom(
      await controller.update('64c568a6e0775574b59cd6aa', updateUserDto),
    );
    expect(controller.findOne).toHaveBeenCalledWith('64c568a6e0775574b59cd6aa');
    expect(mockClientProxyUserSend).toHaveBeenCalledWith(UserMSG.UPDATE, {
      id: '64c568a6e0775574b59cd6aa',
      userDTO: updateUserDto,
    });

    expect(result).toEqual({
      id: '64c568a6e0775574b59cd6aa',
      name: 'ajpirez',
      email: 'ajpirez1994@gmail.com',
      phone: '535-401-56-78',
      age: 29,
      password: expect.any(String),
    });
  });

  it('should find one user by Id', async () => {
    const result = await controller.findOne('64c568a6e0775574b59cd6aa');
    expect(mockClientProxyUserSend).toHaveBeenCalledWith(
      UserMSG.FIND_ONE,
      '64c568a6e0775574b59cd6aa',
    );
    expect(result).toEqual({
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

  it('should delete one user by Id', async () => {
    const result = await controller.delete('64c568a6e0775574b59cd6aa');
    expect(mockClientProxyUserSend).toHaveBeenCalledWith(
      UserMSG.DELETE,
      '64c568a6e0775574b59cd6aa',
    );
    expect(result).toEqual({
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
});
