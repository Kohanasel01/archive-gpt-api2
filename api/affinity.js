export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, characterId, affinity } = req.body;

  if (!userId || !characterId || affinity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Affinity for ${characterId} by ${userId}: ${affinity}`);

  return res.status(200).json({
    message: 'Affinity stored successfully',
    data: { userId, characterId, affinity }
  });
}
