import { User as UserPrisma } from "@prisma/client"
import { Role } from '../types';
import * as EmailValidator from 'email-validator';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly signUpDate: Date;
    readonly role: Role;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        signUpDate: Date;
        role: Role;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.signUpDate = user.signUpDate;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    validate(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        signUpDate: Date;
        role: Role;
    }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required.');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required.');
        }
        if (!EmailValidator.validate(user.email)) {
            throw new Error('Email must be valid.');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        }
        if (!user.role?.trim() || !(user.role === 'Admin' || user.role === 'Validator' || user.role === 'Organizer' || user.role === 'User')) {
            throw new Error('Role is required.');
        }
    }

    static from({
        id,
        username,
        email,
        password,
        signUpDate,
        role,
        createdAt,
        updatedAt,
}: UserPrisma): User {
        return new User({
            id,
            username,
            email,
            password,
            signUpDate,
            role: role as Role,
            createdAt,
            updatedAt,
        })
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getSignUpDate(): Date {
        return this.signUpDate;
    }

    getRole(): Role {
        return this.role;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    equals(user: User): boolean {
        return (
            this.id === user.getId() &&
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.signUpDate === user.getSignUpDate() &&
            this.role === user.getRole() &&
            this.createdAt === user.getCreatedAt() &&
            this.updatedAt === user.getUpdatedAt()
        );
    }
}
