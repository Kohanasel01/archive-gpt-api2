import fetch from 'node-fetch';

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

  const date = new Date().toISOString().split('T')[0];
  const memoryPath = `memory/${userId}.json`;
  const logPath = `logs/${date}_session1.md`;

  // 1. 기존 memory 파일 불러오기
  const memoryRes = await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  });

  let memoryData;
  if (memoryRes.ok) {
    memoryData = await memoryRes.json();
  } else {
    memoryData = { user_id: userId, emotion: {}, affinity: {}, last_scene: "", notes: "" };
  }

  // 2. 감정 수치 갱신
  const prev = memoryData.emotion[emotion] || 0;
  const after = Math.min(100, Math.max(0, prev + intensity));
  memoryData.emotion[emotion] = after;
  if (scene) memoryData.last_scene = scene;

  const updatedContent = Buffer.from(JSON.stringify(memoryData, null, 2)).toString('base64');

  // 3. GitHub API로 memory 파일 저장
  const shaRes = await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
    headers: { Authorization: `token ${token}` }
  });

  const sha = shaRes.ok ? (await shaRes.json()).sha : undefined;

  await fetch(`https://api.github.com/repos/${repo}/contents/${memoryPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `🧠 감정 업데이트: ${emotion} ${intensity > 0 ? '+' : ''}${intensity}`,
      content: updatedContent,
      branch: 'main',
      committer: { name: username, email: `${username}@users.noreply.github.com` },
      sha
    })
  });

  // 4. 로그 기록 append용 (간단 버전)
  const logContent = `## [${new Date().toLocaleDateString('ko-KR')} - ${userId}]\n- 감정 변화: ${emotion} ${prev} → ${after} (${intensity > 0 ? '+' : ''}${intensity})\n${scene ? `- 장면: ${scene}\n` : ''}\n`;
  const logBase64 = Buffer.from(logContent).toString('base64');

  // 로그 파일 읽기 → 내용 추가 → 다시 업로드
  let existingLog = '';
  let logSha;
  const logCheck = await fetch(`https://api.github.com/repos/${repo}/contents/${logPath}`, {
    headers: { Authorization: `token ${token}` }
  });

  if (logCheck.ok) {
    const logData = await logCheck.json();
    logSha = logData.sha;
    const raw = await fetch(logData.download_url);
    existingLog = await raw.text();
  }

  const finalLog = Buffer.from(existingLog + logContent).toString('base64');

  await fetch(`https://api.github.com/repos/${repo}/contents/${logPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `📘 감정 로그 기록 (${emotion})`,
      content: finalLog,
      branch: 'main',
      committer: { name: username, email: `${username}@users.noreply.github.com` },
      sha: logSha
    })
  });

  return res.status(200).json({
    message: 'Emotion updated & logged to GitHub',
    data: { userId, emotion, before: prev, after, scene: scene || null }
  });
}
