import { set } from 'date-fns';
import { User } from '../../model/user';
import { SpeedrunEvent } from '../../model/speedrun_event';

const name: string = 'SGDR 2024';
const startDate: Date = set(new Date(), { date: 22, month: 11, year: 2024 });
const endDate: Date = set(new Date(), { date: 24, month: 11, year: 2024 });
const participants: Array<User> = [];

test(`given: valid values for speedrun event, when: speedrunEvent is created, then: speedrunEvent is created with those values`, () => {
    // given

    // when
    const speedrunEvent = new SpeedrunEvent({
        name,
        startDate,
        endDate,
        participants,
    });
    // then
    expect(speedrunEvent.getName()).toEqual(name);
    expect(speedrunEvent.getStartDate()).toEqual(startDate);
    expect(speedrunEvent.getEndDate()).toEqual(endDate);
    expect(speedrunEvent.getParticipants()).toEqual(participants);
});

test(`given: invalid name, when: speedrun event is created, then: an error is thrown`, () => {
    // given
    const invalidName = ' ';
    // when
    const createSpeedrunEvent = () => {
        new SpeedrunEvent({
            name: invalidName,
            startDate,
            endDate,
            participants,
        });
    };
    // then
    expect(createSpeedrunEvent).toThrow('Name is required.');
});

test(`given: invalid start date, when: speedrun event is created, then: an error is thrown`, () => {
    // given
    const invalidStartDate: Date = null as any;
    // when
    const createSpeedrunEvent = () => {
        new SpeedrunEvent({
            name,
            startDate: invalidStartDate,
            endDate,
            participants,
        });
    };
    // then
    expect(createSpeedrunEvent).toThrow('Start date is required.');
});

test(`given: invalid end date, when: speedrun event is created, then: an error is thrown`, () => {
    // given
    const invalidEndDate: Date = null as any;
    // when
    const createSpeedrunEvent = () => {
        new SpeedrunEvent({
            name,
            startDate,
            endDate: invalidEndDate,
            participants,
        });
    };
    // then
    expect(createSpeedrunEvent).toThrow('End date is required.');
});

test(`given: end date is before start date, when: speedrun event is created, then: an error is thrown`, () => {
    // given
    const invalidEndDate: Date = set(new Date(), { date: 20, month: 10, year: 2020 });
    // when
    const createSpeedrunEvent = () => {
        new SpeedrunEvent({
            name,
            startDate,
            endDate: invalidEndDate,
            participants,
        });
    };
    // then
    expect(createSpeedrunEvent).toThrow('Start date must be before end date.');
});

test(`given: valid speedrun event, when: adding a valid user as a participant, then: the user is added as a participant`, () => {
    // given
    const speedrunEvent = new SpeedrunEvent({
        name,
        startDate,
        endDate,
        participants,
    });
    const participant = new User({
        username: 'speedy-gonzales',
        email: 'speedy.gonzales@email.com',
        password: 'password123',
        role: 'User',
        signUpDate: new Date('1953-08-29T00:00:00.000Z'),
    });
    // when
    speedrunEvent.addParticipant(participant);
    // then
    expect(speedrunEvent.getParticipants().length).toEqual(1);
    expect(speedrunEvent.getParticipants()[0]).toEqual(participant);
});

test(`given: valid speedrun event, when: adding a null as a participant, then: an error is thrown`, () => {
    // given
    const speedrunEvent = new SpeedrunEvent({
        name,
        startDate,
        endDate,
        participants,
    });
    const participant = null as any;
    // when
    const addParticipant = () => speedrunEvent.addParticipant(participant);
    // then
    expect(addParticipant).toThrow("Participant is required.");
});

test(`given: valid speedrun event, when: adding an existing user as a participant, then: an error is thrown`, () => {
    // given
    const speedrunEvent = new SpeedrunEvent({
        name,
        startDate,
        endDate,
        participants,
    });
    const participant = new User({
        username: 'speedy-gonzales',
        email: 'speedy.gonzales@email.com',
        password: 'password123',
        role: 'User',
        signUpDate: new Date('1953-08-29T00:00:00.000Z'),
    });
    speedrunEvent.addParticipant(participant);
    // when
    const addExistingParticipant = () => speedrunEvent.addParticipant(participant);
    // then
    expect(addExistingParticipant).toThrow('User is already a participant.');
})
