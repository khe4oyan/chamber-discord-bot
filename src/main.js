// libs
import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";

// commands
import { commandsCollection } from "./commands/index.js";

// events
import { events } from "./events/index.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = commandsCollection;
client.cooldowns = new Collection();

// add events
for (let i = 0; i < events.length; ++i) {
  const event = events[i];
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

client.login(process.env.TOKEN);
