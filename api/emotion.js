// api/emotion.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 인증 제거됨! 🎉
  const { userId, emotion, intensity } = req.body;

  if (!userId || !emotion || intensity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Emotion from ${userId}: ${emotion} (${intensity})`);

  return res.status(200).json({
    message: 'Emotion stored successfully',
    data: { userId, emotion, intensity }
  });
}
