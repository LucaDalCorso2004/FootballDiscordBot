const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-seasion")
    .setDescription("Find games of the Super League.")
    .addStringOption((option) =>
      option.setName("start").setDescription("Season starting year").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("end").setDescription("Season ending year (usually 1 year later)").setRequired(true)
    ),
  async execute(interaction) {
    const seasonStart = interaction.options.getString("start");
    const seasonEnd = interaction.options.getString("end");
    await interaction.deferReply();

    try {
      const teamResult = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4675&s=${seasonStart}-${seasonEnd}`
      );
      const fetchResult = await teamResult.json();

      const resultEmbed = new EmbedBuilder().setTitle(
        `Season ${seasonStart} - ${seasonEnd} at the Swiss Super League`
      );

      for (let i = 0; i < 10; i++) {
        let currentObj = fetchResult.table[i];
        resultEmbed.addFields({
          name: `#${i + 1} ${currentObj.strTeam}`,
          value: `${currentObj.intPlayed} | ${currentObj.intWin} | ${currentObj.intDraw} | ${currentObj.intLoss} | ${currentObj.intGoalsFor} | ${currentObj.intGoalsAgainst} | **${currentObj.intPoints}**`,
        });
      }
      resultEmbed.setFooter({
        text: "Format: Games / Wins / Draws / Losses / Goals for / Goals against / Points",
      });

      await interaction.editReply({ embeds: [resultEmbed] });
    } catch {
      await interaction.editReply(
        `Your input "${seasonStart} - ${seasonEnd}" is not a valid season!\n(A season usually lasts between 2 years, for example 2019-2020)`
      );
    }
  },
};
