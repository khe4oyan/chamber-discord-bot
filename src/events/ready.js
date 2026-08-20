// libs
import { Events } from "discord.js";

// servcies
import LoggerService from "../services/Logger.service.js";
import SettingsService from "../services/Settings.service.js";

const ready = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const LOGGER = new LoggerService(client);
    await LOGGER.info("Bot started");
    const lastUpdate = await SettingsService.getByTitle("last_update");

    if (lastUpdate) {
      const clientVersion = 5;
      if (clientVersion > lastUpdate.version) {
        const changeLog = [
          "WHAT's NEW",
          "- Updated design",
          "- Update message when start bot",
        ];

        await LOGGER.info(changeLog.join("\n"));
        await SettingsService.updateVersion("last_update", clientVersion);
      }
    } else {
      await SettingsService.create("last_update");
    }
  },
};

export default ready;
