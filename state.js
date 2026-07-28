const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'seen.json');

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { newsIds: [], calendarKeys: [] };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  // Keep only the most recent 500 of each to stop the file growing forever
  state.newsIds = state.newsIds.slice(-500);
  state.calendarKeys = state.calendarKeys.slice(-500);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

module.exports = { loadState, saveState };
