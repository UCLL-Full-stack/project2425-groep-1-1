import { User } from '../model/user';
import database from "../util/database";

const getAllUsers = async (): Promise<User[]> => {
    try{
        const userPrismas = await database.user.findMany();
        return userPrismas.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
}

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({where: {id}});
        return userPrisma ? User.from(userPrisma) : null;
    }catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const addUser = async ({ username, email, password, signUpDate, role }: User): Promise<User> => {
    try{
        const userPrisma = await database.user.create({data: {username, email, password, signUpDate, role,}})
        return User.from(userPrisma);
    }catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }}


export default {
    getAllUsers,
    addUser,
    getUserById,
};
