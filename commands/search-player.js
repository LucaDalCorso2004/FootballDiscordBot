const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-player")
    .setDescription("Find a player with a search query")
    .addStringOption((option) =>
      option.setName("name").setDescription("Player search").setRequired(true)
    ),

  async execute(interaction) {
    const search = interaction.options.getString("name");
    await interaction.deferReply();

    try {
      const playerResult = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${search}`
      );
      const fetchobj = await playerResult.json();
      const result = await fetchobj.player[0];

      const resultEmbed = new EmbedBuilder()
        .setColor(0xa6e015)
        .setTitle(`Result: ${result.strPlayer}`)
        .addFields(
          { name: "National team", value: `${result.strTeam2}` },
          { name: "Club", value: `${result.strTeam}` },
          { name: "Birth date", value: `${result.dateBorn}` },
          { name: "Position", value: `${result.strPosition}` },
          { name: "Height", value: `${result.strHeight}` }
        )
        .setThumbnail(result.strThumb)
        .setFooter({
          text: "If this isn't the correct result, try searching more exactly!",
        });

      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (error) {
      await interaction.editReply(
        `No player named '${search}' was found! Using the full name might help.`
      );
      await console.log(error);
    }
  },
};
