const Parser = require('rss-parser');
const { sendHotStory } = require('./sender');

const parser = new Parser();

const FEED_URL = 'https://www.financialjuice.com/feed.ashx?xy=rss';

const HIGH_IMPACT_KEYWORDS = [
  'fed', 'federal reserve', 'rate decision', 'rate cut', 'rate hike',
  'cpi', 'nfp', 'nonfarm', 'payrolls', 'gdp', 'fomc', 'warsh',
  'tariff', 'sanctions', 'shutdown', 'war', 'invasion', 'strike',
  'attack', 'trump', 'default', 'debt ceiling', 'inflation',
  'unemployment', 'opec', 'oil', 'yellen', 'ecb', 'boe', 'boj',
  'ceasefire', 'missile', 'nuclear', 'emergency'
];

function cleanTitle(title) {
  return title.replace(/^FinancialJuice:\s*/, '').trim();
}

function isHighImpact(title) {
  const t = title.toLowerCase();
  return HIGH_IMPACT_KEYWORDS.some(k => t.includes(k));
}

function timeAgo(pubDate) {
  const mins = Math.floor((Date.now() - new Date(pubDate)) / 60000);
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} hr ${mins % 60} min ago`;
}

// Takes the shared state object, mutates state.newsIds in place, returns nothing.
async function checkNews(state) {
  const feed = await parser.parseURL(FEED_URL);
  const seen = new Set(state.newsIds);

  for (const item of feed.items.reverse()) {
    const id = item.guid || item.link;
    if (seen.has(id)) continue;

    seen.add(id);
    state.newsIds.push(id);

    const title = cleanTitle(item.title);
    if (!isHighImpact(title)) continue; // skip noise, but still marked as seen above

    await sendHotStory({
      title,
      description: item.contentSnippet?.slice(0, 200) || 'No summary available.',
      age: timeAgo(item.pubDate),
      source: 'FinancialJuice'
    });
  }
}

module.exports = checkNews;
