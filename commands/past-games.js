const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("past-games")
    .setDescription("Show past games of Switzerland"),

  async execute(interaction) {
    await interaction.deferReply();
    const playerResult = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=134506`
    );
    const fetchResult = await playerResult.json();
    const result = await fetchResult.results;

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("The last 5 games of the Swiss national team:")
      .setThumbnail(result[0].strSquare)
      .setFooter({
        text: "Only home games are shown.",
      });

    for (let i = 0; i < result.length; i++) {
      exampleEmbed.addFields({
        name: `${i + 1}. ${result[i].strEvent}`,
        value: `*${result[i].strLeague}  (${result[i].strSeason})* \n ${result[i].dateEvent} \n **${result[i].intHomeScore} : ${result[i].intAwayScore}**`,
      });
    }

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
