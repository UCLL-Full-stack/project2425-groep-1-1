import { Category } from './category';
import { Game } from './game';
import { User } from './user';

export class Speedrun {
    private id?: number;
    // TODO: How do we want to store time? in milliseconds (number) or something else
    private time: number;
    private submitDate: string;
    private videoLink: string;
    private speedrunner: User;
    private isValidated: boolean;
    private validator?: User;
    private game: Game;
    private category: Category;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(speedrun: {
        id?: number;
        time: number;
        submitDate: string;
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
        submitDate: string;
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
        if (!speedrun.submitDate) {
            throw new Error('Submit date is required.');
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

    getSubmitDate(): string {
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
