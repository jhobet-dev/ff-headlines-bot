const { WebhookClient } = require('discord.js');
const { hotStoryEmbed, calendarWarningEmbed } = require('./embeds');

const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

async function sendHotStory(item) {
  await webhook.send({
    username: 'Headlines',
    content: '**NEWS / HOT STORY**',
    embeds: [hotStoryEmbed({
      title: item.title,
      description: item.description,
      age: item.age
    })]
  });
}

async function sendCalendarWarning(event) {
  await webhook.send({
    username: 'Headlines',
    content: `@everyone **30 MINUTE RED FOLDER WARNING** \`${event.currency}\``,
    embeds: [calendarWarningEmbed(event)]
  });
}

module.exports = { sendHotStory, sendCalendarWarning };
