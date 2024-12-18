import speedrunEventDb from '../repository/speedrun_event.db';
import {SpeedrunEventAddParticipantsInput, SpeedrunEventInput} from "../types";
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

const addParticipantToSpeedrunEvent = async ({ speedrunEventInput, userInputs }: SpeedrunEventAddParticipantsInput): Promise<SpeedrunEvent> => {
  throw new Error("Not implemented.");
}

export default { getAllSpeedrunEvents, createSpeedrunEvent, addParticipantToSpeedrunEvent };