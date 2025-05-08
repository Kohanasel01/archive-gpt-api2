export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, emotion, intensity, timestamp } = req.body;

  if (!userId || !emotion || intensity === undefined || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Emotion at ${timestamp} by ${userId}: ${emotion} (${intensity})`);

  return res.status(200).json({
    message: 'Emotion timeline stored successfully',
    data: { userId, emotion, intensity, timestamp }
  });
}
