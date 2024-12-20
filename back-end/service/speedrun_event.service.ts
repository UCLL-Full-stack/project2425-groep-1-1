import speedrunEventDb from '../repository/speedrun_event.db';
import userDb from "../repository/user.db";
import { SpeedrunEventAddParticipantsInput, SpeedrunEventInput } from "../types";
import { SpeedrunEvent } from "../model/speedrun_event";

const getAllSpeedrunEvents = async () => {
  return speedrunEventDb.getAllSpeedrunEvents();
}

const createSpeedrunEvent = async ({ name, startDate, endDate }: SpeedrunEventInput) => {
  if (name?.trim() == "") {
    throw new Error("Name is required.");
  }
  if (!startDate) {
    throw new Error("Start date is required.");
  }
  if (!endDate) {
    throw new Error("End date is required.");
  }
  if (startDate < new Date()) {
    throw new Error("Start date can't be in the past.")
  }
  if (endDate < startDate) {
    throw new Error("End date must be after Start date.");
  }

  const speedrunEvent = new SpeedrunEvent({ name, startDate, endDate, participants: [] })
  return await speedrunEventDb.addSpeedrunEvent(speedrunEvent);
}

const addParticipantsToSpeedrunEvent = async (userInputs: number[], speedrunEventId: number) => {
  if (!speedrunEventId) {
    throw new Error("Speedrun event id is required.");
  }
  if (!userInputs.length) {
    throw new Error("At least one user is required.")
  }

  const speedrunEvent: SpeedrunEvent | null = await speedrunEventDb.getSpeedrunEventById({ id: speedrunEventId });
  if (!speedrunEvent) {
    throw new Error("Speedrun event not found.");
  }
  const participants = await Promise.all(
    userInputs.map(async (userInput) => {
      if (!userInput) {
        throw new Error('User id is required');
      }
      const user = await userDb.getUserById({ id: userInput });
      if (!user) {
        throw new Error(`User with id ${userInput} not found`);
      }
      return user;
    })
  );

  participants.forEach((participant) => { speedrunEvent.addParticipant(participant); });

  return await speedrunEventDb.updateSpeedrunEventParticipants(speedrunEvent);
}


const deleteSpeedrunEvent = async (eventId: number) => {
  const event = await speedrunEventDb.getSpeedrunEventById({ id:eventId });
  if (!event) {
    throw new Error(`Event with id ${eventId} not found`);
  }
  
  speedrunEventDb.deleteSpeedrunEvent(eventId);
  return (`Event ${event.name} was succesfully deleted.`);
  }


export default { getAllSpeedrunEvents, createSpeedrunEvent, addParticipantsToSpeedrunEvent, deleteSpeedrunEvent };