import { Category } from './category';
import { Game } from './game';
import { User } from './user';
import { Speedrun as SpeedrunPrisma, User as UserPrisma, Game as GamePrisma, Category as CategoryPrisma } from '@prisma/client'

export class Speedrun {
    readonly id?: number;
    readonly time: number;
    readonly submitDate?: Date;
    readonly videoLink: string;
    readonly speedrunner: User;
    readonly isValidated: boolean;
    readonly validator?: User;
    readonly game: Game;
    readonly category: Category;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    static from({
        id,
        time,
        submitDate,
        videoLink,
        isValidated,
        speedrunner,
        validator,
        game,
        category,
        createdAt,
        updatedAt,
    } : SpeedrunPrisma & {
        speedrunner: UserPrisma,
        validator?: UserPrisma | null,
        game: GamePrisma,
        category: CategoryPrisma & {game: GamePrisma}
    } ) {
        return new Speedrun({
            id,
            time,
            submitDate,
            videoLink,
            isValidated,
            speedrunner: User.from(speedrunner),
            validator: validator ? User.from(validator) : undefined,
            game: Game.from(game),
            category: Category.from(category),
            createdAt,
            updatedAt,
        })
    }

    constructor(speedrun: {
        id?: number;
        time: number;
        submitDate?: Date;
        videoLink: string;
        isValidated: boolean;
        speedrunner: User;
        validator?: User;
        game: Game;
        category: Category;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(speedrun);

        this.id = speedrun.id;
        this.time = speedrun.time;
        this.submitDate = speedrun.submitDate;
        this.videoLink = speedrun.videoLink;
        this.speedrunner = speedrun.speedrunner;
        this.isValidated = speedrun.isValidated;
        this.validator = speedrun.validator;
        this.game = speedrun.game;
        this.category = speedrun.category;
        this.createdAt = speedrun.createdAt;
        this.updatedAt = speedrun.updatedAt;
    }

    validate(speedrun: {
        id?: number;
        time: number;
        submitDate?: Date;
        videoLink: string;
        isValidated: boolean;
        speedrunner: User;
        validator?: User;
        game: Game;
        category: Category;
    }) {
        if (speedrun.time < 0) {
            throw new Error('Speedrun time cannot be a negative number.');
        }
        if (!speedrun.videoLink?.trim()) {
            throw new Error('Video link is required.');
        }
        /* canParse is found, but the method cannot be called. 
        // if ('canParse' in URL) {
        //     console.log('method found');
        // }
        // if (!URL.canParse(speedrun.videoLink)) {
        //     throw new Error('Video link must be valid.');
        // }
        */
        if (!this.validateVideoLink(speedrun.videoLink)) {
            throw new Error('Video link must be valid.');
        }
        if (!speedrun.speedrunner) {
            throw new Error('Speedrunner is required.');
        }
        if (speedrun.validator && !speedrun.isValidated) {
            throw new Error('Speedruns must have a validator if it is validated.');
        }
        if (speedrun.isValidated && !speedrun.validator) {
            throw new Error('Speedruns must be validated if validator is defined.');
        }
        if (!speedrun.game) {
            throw new Error('Game is required.');
        }
        if (!speedrun.category) {
            throw new Error('Category is required.');
        }
    }

    validateVideoLink(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getTime(): number {
        return this.time;
    }

    getSubmitDate(): Date | undefined {
        return this.submitDate;
    }

    getVideoLink(): string {
        return this.videoLink;
    }

    getSpeedrunner(): User {
        return this.speedrunner;
    }

    getIsValidated(): boolean {
        return this.isValidated;
    }

    getValidator(): User | undefined {
        return this.validator;
    }

    getGame(): Game {
        return this.game;
    }

    getCategory(): Category {
        return this.category;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }


    equals(speedrun: Speedrun): boolean {
        return (
            this.id === speedrun.getId() &&
            this.time === speedrun.getTime() &&
            this.submitDate === speedrun.getSubmitDate() &&
            this.videoLink === speedrun.getVideoLink() &&
            this.speedrunner.equals(speedrun.getSpeedrunner()) &&
            this.isValidated === speedrun.getIsValidated() &&
            ((this.validator === undefined && speedrun.getValidator() === undefined) ||
                this.validator!.equals(speedrun.getValidator()!)) &&
            this.game.equals(speedrun.getGame()) &&
            this.category.equals(speedrun.getCategory()) &&
            this.createdAt === speedrun.getCreatedAt() &&
            this.updatedAt === speedrun.getUpdatedAt()
        );
    }
}
