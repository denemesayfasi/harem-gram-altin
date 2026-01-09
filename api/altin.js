
export default async function handler(req, res) {
  try {
    const upstream = 'https://canlipiyasalar.haremaltin.com/tmp/altin.json';
    const r = await fetch(upstream, { cache: 'no-store' });
    if (!r.ok) return res.status(r.status).json({ error: `Upstream ${r.status}` });

    const data = await r.json();
    const items = data?.data || {};

    // Kaynakta kod isimleri değişebiliyor; öncelik sırası:
    const preferred = ['GRAM ALTIN', 'ALTIN', 'HAS ALTIN', 'KULCEALTIN'];
    let key = preferred.find(k => items[k]);

    // Yedek: adında 'gram' geçen ilk anahtar
    if (!key) {
      const gramKeys = Object.keys(items).filter(k => k.toLowerCase().includes('gram'));
      key = gramKeys[0];
    }

    const gram = key ? items[key] : null;
    if (!gram) return res.status(404).json({ error: 'GRAM ALTIN bulunamadı' });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      key,
      alis: gram.alis,
      satis: gram.satis,
      tarih: gram.tarih
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
