export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, type, result, context } = req.body;

  if (!userId || !type || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log(`[DIVINATION] ${userId} - ${type}`);
  console.log(`[DIVINATION] Result: ${result}`);
  if (context) {
    console.log(`[DIVINATION] Context: ${context}`);
  }

  return res.status(200).json({
    message: 'Divination stored successfully',
    data: {
      userId,
      type,
      result,
      context
    }
  });
}
