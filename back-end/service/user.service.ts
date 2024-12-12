import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from "bcrypt";
import { generateJwtToken } from '../util/jwt';

const getAllUsers = async (): Promise<User[]> => userDb.getAllUsers();

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

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
  const user = await userDb.getUserByUsername({ username });
  if (!user) {
    throw new Error(`User with username: ${username} does not exist.`);
  }

  const role = user.getRole();

  const isValidPassword = await bcrypt.compare(password, user.getPassword());

  if (!isValidPassword) {
    throw new Error('Incorrect login.');
  }
  return {
    token: generateJwtToken({ username, role }),
    username: username,
    role: role
  };
};


  export default { createUser, authenticate, getAllUsers };