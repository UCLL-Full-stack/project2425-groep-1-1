import { SpeedrunEvent as SpeedrunEventPrisma, User as UserPrisma } from '@prisma/client'
import { User } from './user';

export class SpeedrunEvent {
    readonly id?: number;
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly participants: Array<User>;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(speedrunEvent: {
        id?: number;
        name: string;
        startDate: Date;
        endDate: Date;
        participants: Array<User>;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(speedrunEvent);

        this.id = speedrunEvent.id;
        this.name = speedrunEvent.name;
        this.startDate = speedrunEvent.startDate;
        this.endDate = speedrunEvent.endDate;
        this.participants = speedrunEvent.participants || [];
        this.createdAt = speedrunEvent.createdAt;
        this.updatedAt = speedrunEvent.updatedAt;
    }

    static from({
        id,
        name,
        startDate,
        endDate,
        participants,
        createdAt,
        updatedAt,
                 }: SpeedrunEventPrisma & {participants: UserPrisma[]}) {
        return new SpeedrunEvent({
            id,
            name,
            startDate,
            endDate,
            participants: participants.map((participant) => User.from(participant)),
            createdAt,
            updatedAt,
        })
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

    addParticipant(participant: User) {
        console.log(participant);
        if (!participant) {
            throw new Error("Participant is required.");
        }
        if (this.participants.includes(participant)) {
            throw new Error("User is already a participant.");
        }
        this.participants.push(participant);
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.createdAt;
    }

    equals(speedrunEvent: SpeedrunEvent) {
        return (
            this.id === speedrunEvent.getId() &&
            this.name === speedrunEvent.getName() &&
            this.startDate.getTime() === speedrunEvent.getStartDate().getTime() &&
            this.endDate.getTime() === speedrunEvent.getEndDate().getTime() &&
            this.participants.every((participant, index) =>
                participant.equals(speedrunEvent.getParticipants()[index])
            ) &&
            this.createdAt === speedrunEvent.getCreatedAt() &&
            this.updatedAt === speedrunEvent.getUpdatedAt()
        );
    }
}
