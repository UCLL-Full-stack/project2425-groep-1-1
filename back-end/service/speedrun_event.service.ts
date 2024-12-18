import speedrunEventDb from '../repository/speedrun_event.db';
import {SpeedrunEventAddParticipantsInput, SpeedrunEventInput} from "../types";
import { SpeedrunEvent } from "../model/speedrun_event";

const getAllSpeedrunEvents = async () => {
  return speedrunEventDb.getAllSpeedrunEvents();
}

const createSpeedrunEvent = async ({ name, startDate, endDate }: SpeedrunEventInput) => {
  throw new Error("Not implemented.")
}

const addParticipantToSpeedrunEvent = async ({ speedrunEventInput, userInputs }: SpeedrunEventAddParticipantsInput): Promise<SpeedrunEvent> => {
  throw new Error("Not implemented.");
}

export default { getAllSpeedrunEvents, createSpeedrunEvent, addParticipantToSpeedrunEvent };