export type Game = {
    id?: number;
    name: string;
    genre: string;
    description: string;
    releaseDate: Date;
};

export type Category = {
    id?: number;
    name: string;
    description: string;
    game: Game;
};

export type Speedrun = {
    id?: number;
    time: number;
    submitDate: Date;
    videoLink: string;
    isValidated: boolean;
    speedrunner: User;
    validator?: User;
    game: Game;
    category: Category;
};

export type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
};

export type User = {
    id?: number;
    username: string;
    email: string;
    password: string;
    signUpDate: Date;
    role: Role;
};

export type Role = 'User' | 'Organizer' | 'Admin';

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};
