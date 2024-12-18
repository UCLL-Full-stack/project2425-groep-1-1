type Role = 'User' | 'Validator' | 'Organizer' | 'Admin';

type SpeedrunInput = {
    userId: number;
    gameId: number;
    categoryId: number;
    videoLink: string;
    time: number;
    createdAt?: Date;
    updatedAt?: Date;
};

type SpeedrunValidationRequest = {
    id: number;
    validatorId: number;
}

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
    userInputs: number[];
    speedrunEventId: number;
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

export { Role, SpeedrunInput, SpeedrunValidationRequest, UserInput, SpeedrunEventInput, SpeedrunEventAddParticipantsInput, AuthenticationRequest, AuthenticationResponse };