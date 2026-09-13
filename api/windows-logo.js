export default async function handler(req, res) {
  const url = 'https://api.github.com/repos/paulider/structura-tools-website/git/blobs/69c544b8db0a379045d34301884359404a900dbb';
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github.raw+json', 'User-Agent': 'structura-tools-website' } });
  if (!response.ok) {
    res.status(response.status).send('Logo unavailable');
    return;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  res.setHeader('Content-Type', 'image/webp');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(buffer);
}
