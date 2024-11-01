import { Game } from './game';

export class Category {
    private id?: number;
    private name: string;
    private description: string;
    private game: Game;

    constructor(category: { id?: number; name: string; description: string; game: Game }) {
        this.validate(category);

        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.game = category.game;
    }

    validate(category: { id?: number; name: string; description: string; game: Game }) {
        if (!category.name?.trim()) {
            throw new Error('Name is required.');
        }
        if (!category.description?.trim()) {
            throw new Error('Description is required.');
        }
        if (!category.game) {
            throw new Error('Game is required.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getGame(): Game {
        return this.game;
    }

    equals(category: Category): boolean {
        return (
            this.id === category.getId() &&
            this.name === category.getName() &&
            this.description === category.getDescription() &&
            this.game.equals(category.game)
        );
    }
}
