type Role = 'User' | 'Organizer' | 'Admin';

type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
};

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password: string;
    signUpDate?: Date;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
}

type AuthenticationRequest = {
    username: string;
    password: string;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    role: Role;
};

export { Role, SpeedrunInput, UserInput, AuthenticationRequest, AuthenticationResponse };