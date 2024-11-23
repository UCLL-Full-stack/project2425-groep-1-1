export class Game {
    private id?: number;
    private name: string;
    private genre: string;
    private description: string;
    private releaseDate: string;

    constructor(game: {
        id?: number;
        name: string;
        genre: string;
        description: string;
        releaseDate: string;
    }) {
        this.validate(game);

        this.id = game.id;
        this.name = game.name;
        this.genre = game.genre;
        this.description = game.description;
        this.releaseDate = game.releaseDate;
        this.createdAt = game.createdAt;
        this.updatedAt = game.updatedAt;
    }

    validate(game: {
        id?: number;
        name: string;
        genre: string;
        description: string;
        releaseDate: string;
    }) {
        if (!game.name?.trim()) {
            throw new Error('Name is required.');
        }
        if (!game.genre?.trim()) {
            throw new Error('Genre is required.');
        }
        if (!game.description?.trim()) {
            throw new Error('Description is required.');
        }
        if (!game.releaseDate) {
            throw new Error('Release date is required.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getGenre(): string {
        return this.genre;
    }

    getDescription(): string {
        return this.description;
    }

    getReleaseDate(): Date {
        return this.releaseDate;
    }

    equals(game: Game): boolean {
        return (
            this.id === game.getId() &&
            this.name === game.getName() &&
            this.genre === game.getGenre() &&
            this.description === game.getDescription() &&
            this.releaseDate === game.getReleaseDate() &&
            this.createdAt === game.getCreatedAt() &&
            this.updatedAt === game.getUpdatedAt()
        );
    }
}
