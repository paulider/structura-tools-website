export default async function handler(req, res) {
  try {
    const base = 'https://raw.githubusercontent.com/paulider/structura-tools-website/main/assets/windows-logo-data/';
    const files = ['00.txt', '01.txt', '02.txt', '03.txt', '04.txt', '05.txt'];
    const parts = await Promise.all(files.map(async (file) => {
      const response = await fetch(base + file, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Logo chunk ${file} unavailable`);
      return (await response.text()).trim();
    }));
    const buffer = Buffer.from(parts.join(''), 'base64');
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).send('Logo unavailable');
  }
}
