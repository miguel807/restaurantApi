import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
describe('UsersController', () => {
  let controller: UserController;
  const mockUsersService = {
    create: jest.fn((createUserDto) => {
      return {
        _id: expect.any(String),
        ...createUserDto,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
    }),
    // update: jest.fn().mockImplementation((id, updateUserDto) => ({
    //   id,
    //   ...updateUserDto,
    // })),
    findAll: jest.fn(() => {
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
    }),
    // findOne: jest.fn().mockImplementation((id) => {
    //   return {
    //     id,
    //     username: expect.any(String),
    //     password: expect.any(String),
    //     createdAt: expect.any(Date),
    //     authStrategy: expect.any(String),
    //     profile: expect.any(Object),
    //     posts: expect.any(Array),
    //     groups: expect.any(Array),
    //   };
    // }),
    // remove: jest.fn().mockImplementation((id) => {
    //   return null;
    // }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const UserDTO = {
  //     name: 'ajpirez',
  //     email: 'ajpirez1994@gmail.commm',
  //     phone: '535-401-56-11',
  //     age: 25,
  //     password: '123Ale',
  //   };
  //   const result = await controller.create(UserDTO);
  //   expect(result).toEqual({
  //     _id: expect.any(String),
  //     ...UserDTO,
  //     password: expect.any(String),
  //     createdAt: expect.any(Date),
  //     updatedAt: expect.any(Date),
  //   });
  //
  //   expect(mockUsersService.create).toHaveBeenCalled();
  //   expect(mockUsersService.create).toHaveBeenCalledWith(UserDTO);
  // });
  // it('should update a user', async () => {
  //   const updateUserDto = {
  //     username: 'ajpirez',
  //     password: '123',
  //     createdAt: new Date(),
  //   };
  //   const result = await controller.update(17, updateUserDto);
  //
  //   expect(result).toEqual({
  //     id: 17,
  //     ...updateUserDto,
  //   });
  //
  //   expect(mockUsersService.update).toHaveBeenCalled();
  // });
  //
  it('should find all user', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
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

    expect(mockUsersService.findAll).toHaveBeenCalled();
  });
  //
  // it('should find one user by Id', async () => {
  //   const result = await controller.findOne(1);
  //   expect(result).toEqual({
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
  // it('should delete one user by Id', async () => {
  //   const result = await controller.remove(1);
  //   expect(result).toBeNull();
  // });
});
