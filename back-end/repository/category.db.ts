import { Category } from '../model/category';
import database from "../util/database";

const getAllCategories = async () : Promise<Category[]> => {
    try{
        const categoryPrismas = await database.category.findMany({
            include: {
                game: true,
            }
        });
        return categoryPrismas.map((categoryPrisma) => Category.from(categoryPrisma));
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const getCategoryById = async ({ id }: {id : number}) : Promise<Category | null> => {
    try{
        const categoryPrisma = await database.category.findUnique({where: {id}, include: {game: true}});
        return categoryPrisma ? Category.from(categoryPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const getAllCategoriesForGame = async ({gameId}: {gameId: number}) : Promise<Category[]> => {
    try{
        const categoryPrismas = await database.category.findMany({where: {gameId}, include: {game: true}});
        return categoryPrismas.map((categoryPrisma) => Category.from(categoryPrisma));
    } catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};

const addCategory = async ({ name, description, game }: Category) : Promise<Category> => {
    try{
        const categoryPrisma = await database.category.create({
            data: {
                name,
                description,
                game: { connect: { id: game.id }},
            },
            include: { game: true},
        });
        return Category.from(categoryPrisma);
    }catch (error) {
        console.log(error);
        throw new Error("Database error, see console for more information.");
    }
};


export default {
    getAllCategories,
    getAllCategoriesForGame,
    addCategory,
    getCategoryById,
};
