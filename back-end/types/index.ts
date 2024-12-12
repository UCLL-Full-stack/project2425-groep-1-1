export type Role = 'User' | 'Organizer' | 'Admin';

export type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
};
