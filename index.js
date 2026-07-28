require('dotenv').config();

const { loadState, saveState } = require('./state');
const checkCalendar = require('./calendar-poller');
const checkNews = require('./news-poller');

async function run() {
  const state = loadState();

  // Run sequentially (not Promise.all) since both mutate the same state object.
  await checkCalendar(state).catch(err => console.error('Calendar check failed:', err.message));
  await checkNews(state).catch(err => console.error('News check failed:', err.message));

  saveState(state);
  console.log('Check complete.');
}

run();
