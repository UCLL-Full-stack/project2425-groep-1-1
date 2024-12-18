import speedrunEventDb from '../repository/speedrun_event.db';
import userDb from "../repository/user.db";
import { SpeedrunEventAddParticipantsInput, SpeedrunEventInput } from "../types";
import { SpeedrunEvent } from "../model/speedrun_event";

const getAllSpeedrunEvents = async () => {
  return speedrunEventDb.getAllSpeedrunEvents();
}

const createSpeedrunEvent = async ({ name, startDate, endDate }: SpeedrunEventInput) => {
  if (name?.trim() == "") {
    throw new Error("Name is required");
  }
  if (!startDate) {
    throw new Error("Start date is required");
  }
  if (!endDate) {
    throw new Error("End date is required");
  }

  const speedrunEvent = new SpeedrunEvent({ name, startDate, endDate, participants: [] })
  return await speedrunEventDb.addSpeedrunEvent(speedrunEvent);
}

const addParticipantsToSpeedrunEvent = async ({speedrunEventInput, userInputs }: SpeedrunEventAddParticipantsInput) => {
  if (!speedrunEventInput.id) {
    throw new Error("Speedrun event id is required.");
  }
  if (!userInputs.length) {
    throw new Error("At least one user is required.")
  }

  const speedrunEvent: SpeedrunEvent | null = await speedrunEventDb.getSpeedrunEventById({ id: speedrunEventInput.id });
  if (!speedrunEvent) {
    throw new Error("Speedrun event not found.");
  }
  const participants = await Promise.all(
    userInputs.map(async (userInput) => {
      if (!userInput.id) {
        throw new Error('Student id is required');
      }
      const user = await userDb.getUserById({ id: userInput.id });
      if (!user) {
        throw new Error(`User with id ${userInput.id} not found`);
      }
      return user;
    })
  );

  participants.forEach((participant) => { speedrunEvent.addParticipant(participant); });

  return await speedrunEventDb.updateSpeedrunEventParticipants(speedrunEvent);
}

export default { getAllSpeedrunEvents, createSpeedrunEvent, addParticipantsToSpeedrunEvent };