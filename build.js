// Runs on every Netlify deploy.
// Reads all files in /homilies/, sorts by date, writes homilies.json.

const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'homilies');
const DEST = path.join(__dirname, 'homilies.json');

try {
  if (!fs.existsSync(SRC)) {
    fs.writeFileSync(DEST, '[]');
    console.log('homilies/ not found — wrote empty homilies.json');
    process.exit(0);
  }

  const files   = fs.readdirSync(SRC).filter(f => f.endsWith('.json'));
  const entries = [];

  files.forEach(function(f) {
    try {
      const raw = fs.readFileSync(path.join(SRC, f), 'utf8');
      entries.push(JSON.parse(raw));
    } catch(e) {
      console.warn('Skipping', f, '—', e.message);
    }
  });

  entries.sort(function(a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });

  fs.writeFileSync(DEST, JSON.stringify(entries, null, 2));
  console.log('homilies.json built with', entries.length, 'entr' + (entries.length === 1 ? 'y' : 'ies'));

} catch(e) {
  console.error('Build failed:', e.message);
  fs.writeFileSync(DEST, '[]');
  process.exit(1);
}
