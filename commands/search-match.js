const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-match")
    .setDescription("Find a match with a search query")
    .addStringOption((option) =>
      option.setName("home").setDescription("Home team").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("away").setDescription("Away team").setRequired(true)
    ),

  async execute(interaction) {
    const home = interaction.options.getString("home");
    const away = interaction.options.getString("away");
    await interaction.deferReply();

    try {
      const matchResult = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${home}_vs_${away}`
      );
      const fetchobj = await matchResult.json();
      const result = await fetchobj.event[0];

      let countryPlayed =
        result.strCountry === null ? result.strCountry : "Unknown";

      let matchScore =
        result.intHomeScore !== null
          ? `${result.strHomeTeam} **${result.intHomeScore} : ${result.intAwayScore}** ${result.strAwayTeam}`
          : "Game hasn't finished yet";

      const resultEmbed = new EmbedBuilder()
        .setColor(0xa6e015)
        .setTitle(`Recent game between ${result.strEvent}`)
        .addFields(
          { name: "League", value: `${result.strLeague} ` },
          { name: "Date", value: `${result.dateEvent} ` },
          {
            name: "Result",
            value: matchScore,
          },
          {
            name: "Country",
            value: countryPlayed,
          }
        )
        .setImage(result.strThumb);
      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (error) {
      await interaction.editReply(
        `No match between **${home}** and **${away}** was found! Did you type the teams' names correctly?`
      );
      await console.log(error);
    }
  },
};
