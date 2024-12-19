import { User } from "../../model/user";
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";

let mockUserDbCreateUser: jest.Mock;
let mockUserDbAuthenticate: jest.Mock;
let mockUserDbGetUserById: jest.Mock


beforeEach(() => {
    mockUserDbCreateUser = jest.fn();
    mockUserDbAuthenticate = jest.fn();
    mockUserDbGetUserById = jest.fn();
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