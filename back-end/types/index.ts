type Role = 'User' | 'Admin';

type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
};

export { Role, SpeedrunInput };
