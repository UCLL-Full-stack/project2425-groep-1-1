import { User } from '../model/user';

const users: User[] = [];

const getAllUsers = (): User[] => users;

const getUserById = (userId: number) => {
    return users.find((user) => user.getId() === userId);
};

const addUser = (user: User) => {
    users.push(user);
};

export default {
    getAllUsers,
    addUser,
    getUserById,
};
