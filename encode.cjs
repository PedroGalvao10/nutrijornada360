const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { execFileSync } = require('child_process');

// Use the original source video
const input = 'C:\\Users\\soare\\.gemini\\antigravity\\scratch\\Video_generation_task_202603231400.mp4';
const output = 'C:\\Users\\soare\\.gemini\\antigravity\\scratch\\site_mariana_react\\public\\hero-video.mp4';

console.log('Running ffmpeg from:', ffmpeg.path);
console.log('Encoding video for frame-by-frame scrubbing... This may take a minute.');

try {
  // -g 1 forces a keyframe on every single frame, making it perfect for forward/backward scrubbing
  execFileSync(ffmpeg.path, [
    '-i', input,
    '-g', '1',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '23',
    '-y',
    output
  ], { stdio: 'inherit' });
  console.log('Video encoded successfully! Scrubbing will now be butter-smooth.');
} catch (e) {
  console.error('Encoding failed:', e.message);
  process.exit(1);
}
