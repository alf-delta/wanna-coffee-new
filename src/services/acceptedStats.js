// Fetch accepted suggestions stats from a published CSV (Google Sheets → Publish to web → CSV).
// Expected headers: id,authorName,shopId,shopName,acceptedAt

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = [];
    // naive CSV split (works if fields do not contain commas). For robust parsing, replace later.
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current);
    const row = {};
    headers.forEach((h, idx) => row[h] = (values[idx] || '').replace(/^\"|\"$/g, ''));
    return row;
  });
}

export async function fetchAcceptedCountForAuthor(authorName) {
  try {
    const url = import.meta.env.VITE_ACCEPTED_CSV_URL;
    if (!url || !authorName) return 0;
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const rows = parseCsv(text);
    const norm = (s) => (s || '').trim().toLowerCase();
    const target = norm(authorName);
    return rows.filter(r => norm(r.authorName) === target).length;
  } catch (e) {
    console.warn('fetchAcceptedCountForAuthor error', e);
    return 0;
  }
}


