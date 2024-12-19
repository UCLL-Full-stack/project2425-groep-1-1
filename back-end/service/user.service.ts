import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationRequest, AuthenticationResponse, Role, UserInput } from '../types';
import bcrypt from "bcrypt";
import { generateJwtToken } from '../util/jwt';

const getAllUsers = async ({ username, role}: { username: string, role: Role }): Promise<User[]> => {
  if (role === 'Admin' || role === 'Organizer') {
    return userDb.getAllUsers();
  } else {
    const user = await userDb.getUserByUsername({ username });
    if (!user) {
      throw new Error('User not found.')
    }
    return [user]
  }
};

const createUser = async (userInput: UserInput): Promise<User> => {
  const existingUser = await userDb.getUserByUsername({username: userInput.username});
  if (existingUser) {
    throw new Error('User with username already exists.');
  }
  const encryptedPassword = await bcrypt.hash(userInput.password, 12);
  const newUser = new User({
    username: userInput.username,
    email: userInput.email,
    role: 'User',
    password: encryptedPassword,
    signUpDate: new Date(),
  });

  return await userDb.addUser(newUser);
}

const authenticate = async ({ username, password }: AuthenticationRequest): Promise<AuthenticationResponse> => {
  const user = await userDb.getUserByUsername({ username });
  if (!user) {
    throw new Error(`Incorrect login, please try again.`);
  }

  const id = user.getId()!;
  const role = user.getRole();

  const isValidPassword = await bcrypt.compare(password, user.getPassword());

  if (!isValidPassword) {
    throw new Error('Incorrect login, please try again.');
  }
  return {
    token: generateJwtToken({ username, role }),
    id: id,
    username: username,
    role: role
  };
};

const getUserById = async (userId: number) => {
  const user = await userDb.getUserById({id: userId});
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
}


  export default { createUser, authenticate, getAllUsers, getUserById };