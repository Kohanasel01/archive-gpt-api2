export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, emotion, intensity } = req.body;

  if (!userId || !emotion || intensity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`📥 감정 수신됨: ${userId} - ${emotion} (${intensity})`);

  return res.status(200).json({
    message: 'Emotion received successfully',
    data: { userId, emotion, intensity }
  });
}
