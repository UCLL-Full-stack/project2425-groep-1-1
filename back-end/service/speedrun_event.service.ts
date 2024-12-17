import speedrunEventDb from '../repository/speedrun_event.db';

const getAllSpeedrunEvents = async () => {
  return speedrunEventDb.getAllSpeedrunEvents();
}

export default { getAllSpeedrunEvents };