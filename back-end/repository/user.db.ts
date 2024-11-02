import { User } from '../model/user';

const users: User[] = [];

const getAllUsers = (): User[] => users;

const getUserById = (userId: number) => {
    return users.find((user) => user.getId() === userId);
};

const addUser = (user: User) => {
    users.push(user);
};

const user1 = new User({
    id: 1,
    username: 'PlayerOne',
    email: 'playerone@example.com',
    password: 'securepassword123',
    signUpDate: '2024-11-11',
    role: 'User',
});

addUser(user1);

export default {
    getAllUsers,
    addUser,
    getUserById,
};
