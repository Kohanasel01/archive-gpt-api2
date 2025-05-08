export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, emotions, affinities, hp, sceneId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  console.log(`[STATE] ${userId} - scene: ${sceneId}`);
  console.log(`[STATE] Emotions:`, emotions);
  console.log(`[STATE] Affinities:`, affinities);

  return res.status(200).json({
    message: 'State stored successfully',
    data: {
      userId,
      sceneId,
      emotions,
      affinities,
      hp,
    }
  });
}
