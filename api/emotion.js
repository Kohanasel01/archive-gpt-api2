import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 인증 없이 받기
  const { userId, emotion, intensity, scene } = req.body;

  if (!userId || !emotion || intensity === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // 경로 정의
  const memoryPath = path.join(process.cwd(), 'memory', `${userId}.json`);
  const logPath = path.join(process.cwd(), 'logs', `${new Date().toISOString().split('T')[0]}_session1.md`);

  // 기존 데이터 불러오기 또는 새로 생성
  let userData;
  try {
    userData = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
  } catch {
    userData = { user_id: userId, emotion: {}, affinity: {}, last_scene: "", notes: "" };
  }

  // 감정 수치 업데이트
  const before = userData.emotion[emotion] || 0;
  const after = Math.min(100, Math.max(0, before + intensity));
  userData.emotion[emotion] = after;

  if (scene) {
    userData.last_scene = scene;
  }

  // memory 저장
  fs.writeFileSync(memoryPath, JSON.stringify(userData, null, 2), 'utf8');

  // 로그 기록
  const logText =
    `## [${new Date().toLocaleDateString('ko-KR')} - ${userId}]\n` +
    `- 감정 변화: ${emotion} ${before} → ${after} (${intensity > 0 ? '+' : ''}${intensity})\n` +
    (scene ? `- 장면: ${scene}\n` : '') +
    '\n';

  fs.appendFileSync(logPath, logText, 'utf8');

  // 응답
  console.log(`Emotion from ${userId}: ${emotion} (${intensity})`);

  return res.status(200).json({
    message: 'Emotion stored successfully',
    data: {
      userId,
      emotion,
      before,
      after,
      scene: scene || null
    }
  });
}
