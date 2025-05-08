export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, sceneId, choiceId, variables } = req.body;

  if (!userId || !sceneId || !choiceId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log(`Scene ${sceneId} - Choice ${choiceId} by ${userId}`);

  return res.status(200).json({
    message: 'Novel scene progression stored',
    data: { userId, sceneId, choiceId, variables }
  });
}
