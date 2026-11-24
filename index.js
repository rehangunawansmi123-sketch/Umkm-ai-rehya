const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
const GEMINI_KEY = process.env.GEMINI_API_KEY;
app.get('/', (req, res) => {
  res.json({ status: "UMKM AI Indonesia - Aktif", owner: "Rehan" });
});
app.post('/generate', async (req, res) => {
  const { produk, harga, gaya } = req.body;
  if (!produk) return res.json({ error: "produk wajib diisi" });
  const prompt = `Kamu adalah ahli marketing UMKM Indonesia. Buatkan 3 caption jualan untuk produk: ${produk}, harga Rp ${harga || 'cek'}, gaya: ${gaya || 'gaul TikTok'}. Bahasa Indonesia gaul, singkat, ada emoji, ada CTA checkout. Format JSON: {"caption1": "...", "caption2": "...", "caption3": "..."}`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (e) {
    res.json({ error: "Gagal, cek API Key", detail: e.message });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Jalan di port ' + PORT));
