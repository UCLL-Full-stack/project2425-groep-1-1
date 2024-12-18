type Role = 'User' | 'Organizer' | 'Admin';

type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
    createdAt?: Date;
    updatedAt?: Date;
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

type SpeedrunEventInput = {
    id?: number;
    name: string;
    startDate: Date;
    endDate: Date;
    participants?: Array<UserInput>;
    createdAt?: Date;
    updatedAt?: Date;
}

type SpeedrunEventAddParticipantsInput = {
    userInputs: UserInput[];
    speedrunEventInput: SpeedrunEventInput;
}

type AuthenticationRequest = {
    username: string;
    password: string;
}

type AuthenticationResponse = {
    token: string;
    id: number
    username: string;
    role: Role;
};

export { Role, SpeedrunInput, UserInput, SpeedrunEventInput, SpeedrunEventAddParticipantsInput, AuthenticationRequest, AuthenticationResponse };