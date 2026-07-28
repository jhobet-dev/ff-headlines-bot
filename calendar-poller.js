const axios = require('axios');
const xml2js = require('xml2js');
const { sendCalendarWarning } = require('./sender');

const CALENDAR_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';
const WARNING_WINDOW_MIN = 25;
const WARNING_WINDOW_MAX = 30;

// Takes the shared state object, mutates state.calendarKeys in place, returns nothing.
async function checkCalendar(state) {
  const res = await axios.get(CALENDAR_URL);
  const { weeklyevents } = await xml2js.parseStringPromise(res.data, { explicitArray: false });
  const events = Array.isArray(weeklyevents.event) ? weeklyevents.event : [weeklyevents.event];

  const seen = new Set(state.calendarKeys);
  const now = new Date();

  for (const ev of events) {
    if (ev.impact !== 'High' || ev.country !== 'USD') continue;

    const evTime = new Date(`${ev.date} ${ev.time}`);
    const minsUntil = (evTime - now) / 60000;
    if (minsUntil <= WARNING_WINDOW_MIN || minsUntil > WARNING_WINDOW_MAX) continue;

    const key = `${ev.title}-${ev.date}-${ev.time}`;
    if (seen.has(key)) continue;

    seen.add(key);
    state.calendarKeys.push(key);

    await sendCalendarWarning({
      eventTitle: ev.title,
      currency: ev.country,
      time: evTime.toLocaleString(),
      forecast: ev.forecast || 'n/a',
      previous: ev.previous || 'n/a'
    });
  }
}

module.exports = checkCalendar;
