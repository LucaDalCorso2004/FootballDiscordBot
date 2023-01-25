const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("results-per-matchday")
    .setDescription(
      "Gives match results of a specific matchday of the Super League"
    )
    .addStringOption((option) =>
      option.setName("start").setDescription("Season starting year").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("end").setDescription("Season ending year (usually 1 year later)").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("matchday")
        .setDescription("Day of the matches (1-36)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const seasonstart = interaction.options.getString("start");
    const seasonend = interaction.options.getString("end");
    const matchday = interaction.options.getString("matchday");
    await interaction.deferReply();

    try {
      const gameResult = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4675&r=${matchday}&s=${seasonstart}-${seasonend}`
      );
      const fetchResult = await gameResult.json();

      const resultEmbed = new EmbedBuilder();

      resultEmbed
        .setTitle(
          `Super League season ${seasonstart} - ${seasonend}, Day ${matchday}`
        )
        .setThumbnail(fetchResult.events[0].strThumb);

      for (let i = 0; i < 5; i++) {
        let currentObj = fetchResult.events[i];
        resultEmbed.addFields({
          name: `${currentObj.strEvent}`,
          value: `${currentObj.dateEvent} \n**${currentObj.intHomeScore} : ${currentObj.intAwayScore}**`,
        });
      }
      await interaction.editReply({ embeds: [resultEmbed] });
    } catch {
      await interaction.editReply(
        `No results for season **${seasonstart}-${seasonend}** at day **${matchday}**.`
      );
    }
  },
};
