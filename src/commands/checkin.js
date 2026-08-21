// libs
import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

// modalsubmits
import { checkinModalKey } from "../modalSubmits/checkinModal.js";

const generate = {
  cooldown: 10,

  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Generate checkin template"),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId(checkinModalKey)
      .setTitle("Daily Check-in ✅");

    const yesterdayInput = new TextInputBuilder()
      .setCustomId("yesterday")
      .setLabel("What you did yesterday ?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const todayInput = new TextInputBuilder()
      .setCustomId("today")
      .setLabel("What you want to get done today ?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(yesterdayInput),
      new ActionRowBuilder().addComponents(todayInput),
    );

    await interaction.showModal(modal);
  },
};

export default generate;
