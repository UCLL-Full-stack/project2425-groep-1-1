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


beforeEach(() => {
    mockUserDbCreateUser = jest.fn();
    mockUserDbAuthenticate = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbGetUserByUsername = jest.fn()
    mockBcryptHash = jest.fn();
    mockUserDbAddUser = jest.fn();
    mockBcryptCompare = jest.fn();
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
