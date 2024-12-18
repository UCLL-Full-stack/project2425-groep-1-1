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
const startDate = set(new Date(), { hours: 10 });
const endDate = set(new Date(), { hours: 22 });
const createdAt = new Date();
const updatedAt = new Date();



beforeEach(() => {

  const speedrunEvent = new SpeedrunEvent({
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
})

afterEach(() => {
  jest.clearAllMocks();
})

test(`given: a valid speedrun event input, when: creating a speedrun event, then: a speedrun event is created`, async () => {
  // given
  speedrunEventDb.addSpeedrunEvent = mockSpeedrunEventDbCreateSpeedrunEvent
  const speedrunEventInput: SpeedrunEventInput = { id: speedrunEventId, name, startDate, endDate};

  // when
  await speedrunEventService.createSpeedrunEvent(speedrunEventInput);

  // then
  expect(mockSpeedrunEventDbCreateSpeedrunEvent).toHaveBeenCalledTimes(1);
  expect(mockSpeedrunEventDbCreateSpeedrunEvent).toHaveBeenCalledWith(new SpeedrunEvent({ name, startDate, endDate, participants: [] }));
});

test(`given: a speedrun event add participants input, when: adding a valid user as participant, then: the user is added as a participant`, async () => {
  // given
  const speedrunEventInput: SpeedrunEventInput = { id: speedrunEventId, name, startDate, endDate};
  const userInput: UserInput = {
    id: userId,
    username,
    email,
    password,
  }
  const speedRunEventAddParticipantsInput: SpeedrunEventAddParticipantsInput = {
    userInputs: [userInput],
    speedrunEventInput,
  }

  speedrunEventDb.getSpeedrunEventById = mockSpeedrunEventDbGetSpeedrunEventById;
  speedrunEventDb.updateSpeedrunEventParticipants = mockSpeedrunEventDbUpdateSpeedrunEventParticipants;
  userDb.getUserById = mockUserDbGetUserById;

  // when
  const result = await speedrunEventService.addParticipantToSpeedrunEvent(speedRunEventAddParticipantsInput);

  // then
  expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
  expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: userId });
  expect(mockSpeedrunEventDbGetSpeedrunEventById).toHaveBeenCalledTimes(1);
  expect(mockSpeedrunEventDbGetSpeedrunEventById).toHaveBeenCalledWith({ id: speedrunEventId });
  expect(mockSpeedrunEventDbUpdateSpeedrunEventParticipants).toHaveBeenCalledTimes(1);
  expect(result?.getParticipants()).toContain(user);
});


