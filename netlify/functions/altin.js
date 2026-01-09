
export async function handler(event, context) {
  try {
    const upstream = 'https://canlipiyasalar.haremaltin.com/tmp/altin.json';
    const r = await fetch(upstream);
    const data = await r.json();
    const items = data.data || {};
    const key = Object.keys(items).find(k => k.toLowerCase().includes('gram')) || 'ALTIN';
    const gram = items[key];
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        alis: gram.alis,
        satis: gram.satis,
        tarih: gram.tarih
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
