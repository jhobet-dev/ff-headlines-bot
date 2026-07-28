const { EmbedBuilder } = require('discord.js');

function hotStoryEmbed({ title, description, source = 'Forex Factory', age, timestamp = new Date() }) {
  return new EmbedBuilder()
    .setColor(0x3B82F6) // blue
    .setAuthor({ name: 'Forex Factory News' })
    .setTitle(`Hot Story: ${title}`)
    .setDescription(description)
    .addFields(
      { name: 'Source', value: source, inline: true },
      { name: 'Age', value: age, inline: true }
    )
    .setFooter({ text: 'News / Hot Story' })
    .setTimestamp(timestamp);
}

function calendarWarningEmbed({ eventTitle, currency, time, forecast, previous, timestamp = new Date() }) {
  return new EmbedBuilder()
    .setColor(0xEF4444) // red
    .setAuthor({ name: 'Forex Factory Calendar Alert' })
    .setTitle(`30 Minute Warning: ${eventTitle}`)
    .setDescription('High-impact red-folder news is coming soon.')
    .addFields(
      { name: 'Currency', value: currency, inline: true },
      { name: 'Time', value: time, inline: true },
      { name: 'Forecast', value: forecast, inline: true },
      { name: 'Previous', value: previous, inline: true }
    )
    .setFooter({ text: '30 Minute Warning' })
    .setTimestamp(timestamp);
}

module.exports = { hotStoryEmbed, calendarWarningEmbed };
