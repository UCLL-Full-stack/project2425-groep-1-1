import { User } from './user';

export class SpeedrunEvent {
    private id?: number;
    private name: string;
    private startDate: Date;
    private endDate: Date;
    private participants: Array<User>;

    constructor(speedrunEvent: {
        id?: number;
        name: string;
        startDate: Date;
        endDate: Date;
        participants: Array<User>;
    }) {
        this.validate(speedrunEvent);

        this.id = speedrunEvent.id;
        this.name = speedrunEvent.name;
        this.startDate = speedrunEvent.startDate;
        this.endDate = speedrunEvent.endDate;
        this.participants = speedrunEvent.participants || [];
    }

    validate(speedrunEvent: {
        id?: number;
        name: string;
        startDate: Date;
        endDate: Date;
        participants: Array<User>;
    }) {
        if (!speedrunEvent.name?.trim()) {
            throw new Error('Name is required.');
        }
        if (!speedrunEvent.startDate) {
            throw new Error('Start date is required.');
        }
        if (!speedrunEvent.endDate) {
            throw new Error('End date is required.');
        }
        if (speedrunEvent.endDate < speedrunEvent.startDate) {
            throw new Error('Start date must be before end date.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getParticipants(): Array<User> {
        return this.participants;
    }

    equals(speedrunEvent: SpeedrunEvent) {
        return (
            this.id === speedrunEvent.getId() &&
            this.name === speedrunEvent.getName() &&
            this.startDate.getTime() === speedrunEvent.getStartDate().getTime() &&
            this.endDate.getTime() === speedrunEvent.getEndDate().getTime() &&
            this.participants.every((participant, index) =>
                participant.equals(speedrunEvent.getParticipants()[index])
            )
        );
    }
}
