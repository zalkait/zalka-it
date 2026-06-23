const BASE = 'https://api.getsong.co';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const key = process.env.GETSONGBPM_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });

  const { q, id } = req.query;
  let url;

  if (id) {
    url = `${BASE}/song/?api_key=${key}&id=${encodeURIComponent(id)}`;
  } else if (req.query.bpm) {
    const bpmVal = parseInt(req.query.bpm);
    if (isNaN(bpmVal)) return res.status(400).json({ error: 'Invalid BPM' });
    url = `${BASE}/tempo/?api_key=${key}&bpm=${bpmVal}&limit=8`;
  } else if (q) {
    const type = ['song','artist','both'].includes(req.query.type) ? req.query.type : 'both';
    url = `${BASE}/search/?api_key=${key}&type=${type}&lookup=${encodeURIComponent(q)}&limit=8`;
  } else {
    return res.status(400).json({ error: 'Missing parameter: q or id' });
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Upstream error' });
  }
};