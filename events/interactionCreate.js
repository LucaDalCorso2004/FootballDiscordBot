const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      console.log(interaction);
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
      const currentDate = await new Date();
      await console.log(
        `Executed the ${interaction.commandName} command at ${currentDate}.`
      );
    } catch (error) {
      console.error(error);
      console.error(`Error executing ${interaction.commandName}.`);
    }
  },
};
