export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  const { userId, emotion, intensity } = req.body;

  if (!userId || !emotion || intensity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Emotion from ${userId}: ${emotion} (${intensity})`);

  return res.status(200).json({
    message: 'Emotion stored',
    data: { userId, emotion, intensity }
  });
}
