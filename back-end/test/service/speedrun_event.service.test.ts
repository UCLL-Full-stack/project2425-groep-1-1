import { User } from "../../model/user";
import { SpeedrunEvent } from "../../model/speedrun_event";
import { set } from "date-fns";
import speedrunEventService from "../../service/speedrun_event.service";
import speedrunEventDb from "../../repository/speedrun_event.db";
import userDb from "../../repository/user.db";
import { SpeedrunEventAddParticipantsInput, SpeedrunEventInput, UserInput } from "../../types";

let mockSpeedrunEventDbCreateSpeedrunEvent: jest.Mock;
let mockSpeedrunEventDbGetSpeedrunEventById: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockSpeedrunEventDbUpdateSpeedrunEventParticipants: jest.Mock;
let mockSpeedrunEventDbDeleteSpeedrunEvent: jest.Mock;


const userId: number = 1;
const username = 'user1';
const email = 'user1@example.com';
const password = 'password';
const user = new User({
  id: userId,
  username,
  email,
  password,
  signUpDate: new Date('2022-10-10T00:00:00.000Z'),
  role: 'User',
});

const speedrunEventId = 1;
const name = "GDQ";
const startDate = set(new Date(), { year: (new Date()).getFullYear() + 1, hours: 10 });
const endDate = set(new Date(), { year: (new Date()).getFullYear() + 1, hours: 22 });
const createdAt = new Date();
const updatedAt = new Date();


let speedrunEvent: SpeedrunEvent;


beforeEach(() => {

  speedrunEvent = new SpeedrunEvent({
    id: speedrunEventId,
    name,
    startDate,
    endDate,
    participants: [],
    createdAt,
    updatedAt,
  });

  mockSpeedrunEventDbCreateSpeedrunEvent = jest.fn().mockImplementation((speedrunEvent: SpeedrunEvent) => speedrunEvent);

  mockSpeedrunEventDbGetSpeedrunEventById = jest.fn().mockResolvedValue(speedrunEvent);
  mockSpeedrunEventDbUpdateSpeedrunEventParticipants = jest.fn().mockImplementation((speedrunEvent: SpeedrunEvent) => speedrunEvent);
  mockUserDbGetUserById = jest.fn().mockResolvedValue(user);
  mockSpeedrunEventDbDeleteSpeedrunEvent = jest.fn();
})

afterEach(() => {
  jest.clearAllMocks();
})

test(`given: a valid speedrun event input, when: creating a speedrun event, then: a speedrun event is created`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name, startDate, endDate };

  // when
  await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(mockSpeedrunEventDbCreateSpeedrunEvent).toHaveBeenCalledTimes(1);
  expect(mockSpeedrunEventDbCreateSpeedrunEvent).toHaveBeenCalledWith(new SpeedrunEvent({ name, startDate, endDate, participants: [] }));
});

test(`given: name is null, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name: null as any, startDate, endDate };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("Name is required.");
});

test(`given: name is empty, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name: " ", startDate, endDate };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("Name is required.");
});

test(`given: startDate is null, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name, startDate: null as any, endDate };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("Start date is required.");
});

test(`given: startDate is in the past, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name, startDate: new Date("1999-10-10T00:00:00.000Z"), endDate };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("Start date can't be in the past.");
});

test(`given: endDate is null, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name, startDate, endDate: null as any };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("End date is required.");
});

test(`given: endDate is before startDate, when: creating a speedrun event, then: an error is thrown`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { name, startDate: endDate, endDate: startDate };

  // when
  const createSpeedrunEvent = async () => await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(createSpeedrunEvent).rejects.toThrow("End date must be after Start date.");
});

test(`given: a speedrun event add participants input, when: adding a valid user as participant, then: the user is added as a participant`, async () => {
  // given
  const speedrunEventInput: SpeedrunEventInput = { id: speedrunEventId, name, startDate, endDate};
  const userInput = [userId]


  speedrunEventDb.getSpeedrunEventById = mockSpeedrunEventDbGetSpeedrunEventById;
  speedrunEventDb.updateSpeedrunEventParticipants = mockSpeedrunEventDbUpdateSpeedrunEventParticipants;
  userDb.getUserById = mockUserDbGetUserById;

  // when
  const result = await speedrunEventService.addParticipantsToSpeedrunEvent(userInput, speedrunEventId);

  // then
  expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
  expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: userId });
  expect(mockSpeedrunEventDbGetSpeedrunEventById).toHaveBeenCalledTimes(1);
  expect(mockSpeedrunEventDbGetSpeedrunEventById).toHaveBeenCalledWith({ id: speedrunEventId });
  expect(mockSpeedrunEventDbUpdateSpeedrunEventParticipants).toHaveBeenCalledTimes(1);
  expect(result?.getParticipants()).toContain(user);
});


test('given an existing speedrun event, when deleting said speedrunevent, then speedrunevent is deleted', async () => {
  //given
  speedrunEventDb.deleteSpeedrunEvent = mockSpeedrunEventDbDeleteSpeedrunEvent.mockReturnValue('Speedrun succesfully deleted.')
  speedrunEventDb.getSpeedrunEventById = mockSpeedrunEventDbGetSpeedrunEventById.mockReturnValue(speedrunEvent)

  //when
  const result = await speedrunEventService.deleteSpeedrunEvent(speedrunEventId);

  //then
  expect(mockSpeedrunEventDbGetSpeedrunEventById).toHaveBeenCalledWith({ id: speedrunEventId });
  expect(mockSpeedrunEventDbDeleteSpeedrunEvent).toHaveBeenCalledWith(speedrunEventId);
  expect(result).toEqual('Speedrun succesfully deleted.')
  
});