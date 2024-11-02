import { Category } from '../model/category';

const categories: Category[] = [];

const getAllCategories = (): Category[] => categories;

const getCategoryById = (categoryId: number) => {
    return categories.find((category) => category.getId() === categoryId);
};

const addCategory = (category: Category) => {
    categories.push(category);
};

export default {
    getAllCategories,
    addCategory,
    getCategoryById,
};
