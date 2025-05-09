export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, emotion, intensity, scene } = req.body;

  if (!userId || !emotion || intensity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const username = process.env.GITHUB_USERNAME;

  const memoryPath = `memory/${userId}.json`;
  const logPath = `logs/${new Date().toISOString().split('T')[0]}_session1.md`;

  // 기존 메모리 불러오기
  let memoryData = {
    user_id: userId,
    emotion: {},
    affinity: {},
    last_scene: "",
    notes: ""
  };
  let shaMemory;

  const memoryRes = await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  });

  if (memoryRes.ok) {
    memoryData = await memoryRes.json();
    const shaRes = await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
      headers: { Authorization: `token ${token}` }
    });
    shaMemory = (await shaRes.json()).sha;
  }

  const prev = memoryData.emotion[emotion] || 0;
  const after = Math.max(0, Math.min(100, prev + intensity));
  memoryData.emotion[emotion] = after;
  if (scene) memoryData.last_scene = scene;

  const memoryBase64 = Buffer.from(JSON.stringify(memoryData, null, 2)).toString('base64');

  await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `🧠 감정 업데이트: ${emotion} ${intensity}`,
      content: memoryBase64,
      branch: 'main',
      committer: { name: username, email: `${username}@users.noreply.github.com` },
      sha: shaMemory
    })
  });

  return res.status(200).json({ message: 'Emotion updated', data: { userId, emotion, after } });
}
