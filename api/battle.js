export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, enemyId, hp, skills, turn } = req.body;

  if (!userId || !enemyId || hp === undefined || !skills || turn === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Battle update - ${userId} vs ${enemyId}: HP=${hp}, Turn=${turn}`);

  return res.status(200).json({
    message: 'Battle state stored successfully',
    data: { userId, enemyId, hp, skills, turn }
  });
}
