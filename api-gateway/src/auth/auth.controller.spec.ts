import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('UsersController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signIn: jest.fn().mockImplementation((loginUserDto) => ({
      _id: expect.any(String),
      email: loginUserDto.email,
      access_token: expect.any(String),
    })),
    signUp: jest.fn().mockImplementation((userDTO) => ({
      ...userDTO,
      _id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 5,
          max: 100,
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signin a user', async () => {
    const loginUserDto = {
      email: 'ajpirez1994@gmail.com',
      password: '123Ale',
    };
    const result = await controller.signIn(loginUserDto);
    expect(result).toEqual({
      email: expect.any(String),
      _id: expect.any(String),
      access_token: expect.any(String),
    });
    expect(mockAuthService.signIn).toHaveBeenCalled();
    expect(mockAuthService.signIn).toHaveBeenCalledWith(loginUserDto);
  });

  it('should signup a user', async () => {
    const userDTO = {
      name: 'ajpirez',
      email: 'maye1999@gmail.com',
      phone: '535-401-56-45',
      age: 29,
      password: '123Ale',
    };
    const result = await controller.signUp(userDTO);
    expect(result).toEqual({
      _id: expect.any(String),
      name: 'ajpirez',
      email: 'maye1999@gmail.com',
      phone: '535-401-56-45',
      age: 29,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(mockAuthService.signUp).toHaveBeenCalled();
    expect(mockAuthService.signUp).toHaveBeenCalledWith(userDTO);
  });
});
