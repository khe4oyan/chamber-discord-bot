// libs
import { Collection, Events, MessageFlags } from "discord.js";

// services
import LoggerService from "../services/Logger.service.js";

// modal submits
import { checkinModal, checkinModalKey } from "../modalSubmits/checkinModal.js";

const interactionCreate = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    const LOGGER = new LoggerService(interaction.client);

    if (interaction.isChatInputCommand()) {
      // check commant matching
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        const errorText = `No command matching /${interaction.commandName} was found.`;
        await LOGGER.error(errorText);
        return;
      }

      // check cooldown
      const { cooldowns } = interaction.client;

      // init cooldown for command if not exists
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const defaultCooldownDuration = 3;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1000);
          return interaction.reply({
            content: `You can use it again <t:${expiredTimestamp}:R>.`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => {
        timestamps.delete(interaction.user.id);
      }, cooldownAmount);

      // try to run command
      try {
        await command.execute(interaction);
      } catch (error) {
        await LOGGER.error(`[ERROR]: command run \n ${error}`);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } else if (interaction.isModalSubmit()) {
      try {
        switch (interaction.customId) {
          case checkinModalKey: {
            await checkinModal(interaction);
            break;
          }

          default: {
            await LOGGER.error(
              `Undefined modal submit. Id: ${interaction.customId}`,
            );
            break;
          }
        }
      } catch (error) {
        await LOGGER.error(`[ERROR]: modal submit error \n${error}`);
        await interaction.reply({
          content: "Something went wrong",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default interactionCreate;
