import { User } from "../../model/user";
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";
import bcrypt from "bcrypt";
import { generateJwtToken } from '../../util/jwt'

let mockUserDbCreateUser: jest.Mock;
let mockUserDbAuthenticate: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockBcryptHash: jest.Mock;
let mockUserDbAddUser: jest.Mock;
let mockBcryptCompare: jest.Mock;
let mockUserDbGetAllUsers: jest.Mock;


beforeEach(() => {
    mockUserDbCreateUser = jest.fn();
    mockUserDbAuthenticate = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbGetUserByUsername = jest.fn()
    mockBcryptHash = jest.fn();
    mockUserDbAddUser = jest.fn();
    mockBcryptCompare = jest.fn();
    mockUserDbGetAllUsers = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid userId, when getting user by id, then the correct user is returned', async () => {
    // Given
    const validUser: User = new User({
        id: 1,
        username: "validUser",
        email: "valid.user@test.com",
        password: "validpassword",
        signUpDate: new Date("2023-01-01"),
        role: "User",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-02"),
    });

    userDb.getUserById = mockUserDbGetUserById.mockReturnValue(validUser);

    // When
    const result = await userService.getUserById(validUser.id!);

    // Then
    expect(mockUserDbGetUserById).toHaveBeenCalledWith({id: 1});
    expect(result).toBe(validUser);
});

test('given an invalid userId, when getting user by id, then an error is thrown', async () => {
    // Given
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(null);

    // When
    const result = async() => {await userService.getUserById(99);}

    // Then
    expect(result).rejects.toThrow('User not found.');
});

test('given valid user input, when creating a user, then the user is successfully created', async () => {
    // Given
    const userInput = {
        username: "newUser",
        email: "new.user@test.com",
        password: "securepassword",
    };

    const encryptedPassword = "encryptedSecurePassword";
    const createdUser = new User({
        id: 1,
        username: userInput.username,
        email: userInput.email,
        password: encryptedPassword,
        signUpDate: new Date("2024-01-01"),
        role: "User",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    });

    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(null);
    bcrypt.hash = mockBcryptHash.mockResolvedValue(encryptedPassword);
    userDb.addUser = mockUserDbAddUser.mockResolvedValue(createdUser);

    // When
    const result = await userService.createUser(userInput);

    // Then
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username: userInput.username });
    expect(mockBcryptHash).toHaveBeenCalledWith(userInput.password, 12);
    expect(mockUserDbAddUser).toHaveBeenCalledWith(expect.objectContaining({
        username: userInput.username,
        email: userInput.email,
        password: encryptedPassword,
    }));
    expect(result).toBe(createdUser);
});


test('given user with username already exists, when creating user, then error is thrown.', async () => {
    //given
    const userInput = {
        username: "newUser",
        email: "new.user@test.com",
        password: "securepassword",
    };
    const existingUser = new User({
        id: 1,
        username: userInput.username,
        email: userInput.email,
        password: "encryptedPassword",
        signUpDate: new Date("2024-01-01"),
        role: "User",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    });

    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(existingUser);

    //when
    const result = async () => {await userService.createUser(userInput)};

    //then
    expect(result).rejects.toThrow('User with username already exists.');
})

test('given valid username and password, when authenticating, then a valid authentication response is returned.', async () => {
    // Given
    const authenticationRequest = {
        username: "validUser",
        password: "correctPassword",
    };

    const userMock = {
        getId: jest.fn().mockReturnValue(1),
        getRole: jest.fn().mockReturnValue("User"),
        getPassword: jest.fn().mockReturnValue("encryptedPassword"),
    };

    const secretKey = "mockSecretKey";
    process.env.JWT_SECRET = secretKey;

    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(userMock);
    bcrypt.compare = mockBcryptCompare.mockResolvedValue(true);

    // When
    const result = await userService.authenticate(authenticationRequest);

    const decodedToken = require("jsonwebtoken").verify(result.token, secretKey);

    // Then
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username: authenticationRequest.username });
    expect(mockBcryptCompare).toHaveBeenCalledWith(authenticationRequest.password, userMock.getPassword());
    expect(decodedToken).toMatchObject({
        username: authenticationRequest.username,
        role: userMock.getRole(),
    });
    expect(result).toEqual({
        token: result.token,
        id: userMock.getId(),
        username: authenticationRequest.username,
        role: userMock.getRole(),
    });
});


test('given: non-existing username, when: authenticating, then: an error is thrown', async () => {
  // given
  userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(null);

  // when
  const authenticate = async () => await userService.authenticate({username: "user1", password: "user1"});

  // then
  expect(authenticate).rejects.toThrow('Incorrect login, please try again.');
});

test('given: incorrect password, when: authenticating, then: an error is thrown', async () => {
  // given
  const user = new User({
    id: 2,
    username: "user1",
    email: "user1@test.com",
    password: "user1",
    signUpDate: new Date("2023-01-01"),
    role: "User",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const invalidPassword = "wrong password"
  userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);

  // when
  const authenticate = async () => await userService.authenticate({username: "user1", password: invalidPassword});

  // then
  expect(authenticate).rejects.toThrow('Incorrect login, please try again.');
});

test(`given: valid users, when: getting all users as admin, then: all users are returned`, async () => {
  // given
  const admin = new User({
    id: 1,
    username: "admin1",
    email: "admin1@test.com",
    password: "admin1",
    signUpDate: new Date("2023-01-01"),
    role: "Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const user = new User({
    id: 2,
    username: "user1",
    email: "user1@test.com",
    password: "user1",
    signUpDate: new Date("2023-01-01"),
    role: "User",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const users = [user, admin]
  userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users)

  // when
  const result = await userService.getAllUsers({ username: admin.username, role: admin.role });

  // then
  expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
  expect(result).toBe(users);
});

test(`given: valid users, when: getting all users as organizer, then: all users are returned`, async () => {
  // given
  const organizer = new User({
    id: 1,
    username: "organizer",
    email: "organizer@test.com",
    password: "organizer",
    signUpDate: new Date("2023-01-01"),
    role: "Organizer",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const user = new User({
    id: 2,
    username: "user1",
    email: "user1@test.com",
    password: "user1",
    signUpDate: new Date("2023-01-01"),
    role: "User",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const users = [user, organizer]
  userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users)

  // when
  const result = await userService.getAllUsers({ username: organizer.username, role: organizer.role });

  // then
  expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
  expect(result).toBe(users);
});

test(`given: valid users, when: getting all users as user, then: that user is returned`, async () => {
  // given
  const admin = new User({
    id: 1,
    username: "admin1",
    email: "admin1@test.com",
    password: "admin1",
    signUpDate: new Date("2023-01-01"),
    role: "Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const user = new User({
    id: 2,
    username: "user1",
    email: "user1@test.com",
    password: "user1",
    signUpDate: new Date("2023-01-01"),
    role: "User",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const users = [user, admin]
  userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users)
  userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);

  // when
  const result = await userService.getAllUsers({ username: user.username, role: user.role });

  // then
  expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(0);
  expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
  expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username: user.username });
  expect(result).toEqual([user]);
});

test(`given: valid users, when: getting all users as validator, then: that user is returned`, async () => {
  // given
  const admin = new User({
    id: 1,
    username: "admin1",
    email: "admin1@test.com",
    password: "admin1",
    signUpDate: new Date("2023-01-01"),
    role: "Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const validator = new User({
    id: 2,
    username: "validator1",
    email: "validator1@test.com",
    password: "validator1",
    signUpDate: new Date("2023-01-01"),
    role: "Validator",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const users = [validator, admin]
  userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users)
  userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(validator);

  // when
  const result = await userService.getAllUsers({ username: validator.username, role: validator.role });

  // then
  expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(0);
  expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
  expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username: validator.username });
  expect(result).toEqual([validator]);
});

test(`given: non-existing user or validator, when: getting all users as user or validator, then: an error is thrown`, async () => {
  // given
  const admin = new User({
    id: 1,
    username: "admin1",
    email: "admin1@test.com",
    password: "admin1",
    signUpDate: new Date("2023-01-01"),
    role: "Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const validator = new User({
    id: 2,
    username: "validator1",
    email: "validator1@test.com",
    password: "validator1",
    signUpDate: new Date("2023-01-01"),
    role: "Validator",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  });
  const users = [validator, admin]
  userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users)
  userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(null);

  // when
  const getAllUsers = async () => await userService.getAllUsers({ username: validator.username, role: validator.role });

  // then
  expect(getAllUsers).rejects.toThrow("User not found.");
});
