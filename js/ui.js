/* ---------- UI nhạc: đổi bài ở góc trái, mute/unmute ở góc phải ---------- */
const ui = $('#ui');
const nextBtn = $('#nextBtn');
const muteBtn = $('#muteBtn');

const musicCfg = (WED && WED.music) || { tracks: [], volume: 0.65, autoplay: false, loop: true, muted: false };
const tracks = Array.isArray(musicCfg.tracks) ? musicCfg.tracks.filter(Boolean) : [];
const audio = new Audio();
audio.preload = 'auto';
audio.volume = Number(musicCfg.volume || 0.65);
audio.loop = !!musicCfg.loop;
audio.muted = !!musicCfg.muted;

let currentTrack = 0;
let playing = false;
let hasUnlockedAudio = false;

function updateMuteUi() {
  if (muteBtn) {
    muteBtn.classList.toggle('muted', audio.muted);
    muteBtn.setAttribute('aria-label', audio.muted ? 'Bật tiếng' : 'Tắt tiếng');
  }
}

function updatePlayingUi() {
  if (ui) {
    ui.classList.toggle('playing', playing && tracks.length > 0);
  }
  if (nextBtn) {
    nextBtn.setAttribute('aria-label', playing ? 'Đổi bài' : 'Phát nhạc');
  }
}

function loadTrack(index) {
  if (!tracks.length) return;
  currentTrack = (index + tracks.length) % tracks.length;
  audio.src = tracks[currentTrack];
  audio.load();
}

async function playCurrentTrack({ forceUnmute = false } = {}) {
  if (!tracks.length) return;
  loadTrack(currentTrack);
  try {
    if (forceUnmute) {
      audio.muted = false;
    } else if (!hasUnlockedAudio && musicCfg.autoplay) {
      audio.muted = true;
    }
    await audio.play();
    hasUnlockedAudio = true;
    if (forceUnmute || !musicCfg.muted) {
      audio.muted = false;
    }
    playing = true;
    updateMuteUi();
    updatePlayingUi();
  } catch (e) {
    playing = false;
    updateMuteUi();
    updatePlayingUi();
  }
}

function unlockMusicPlayback() {
  if (!tracks.length) return;
  if (!hasUnlockedAudio) {
    playCurrentTrack({ forceUnmute: true }).catch(() => {});
  }
}

window.startWeddingMusic = unlockMusicPlayback;

if (nextBtn) {
  nextBtn.addEventListener('click', async () => {
    if (!tracks.length) return;
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (!playing) {
      playing = true;
    }
    updatePlayingUi();
    try {
      audio.muted = false;
      await audio.play();
    } catch (e) {}
    try { localStorage.setItem('music', playing ? '1' : '0'); } catch (e) {}
  });
}

if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteUi();
    try { localStorage.setItem('music-muted', audio.muted ? '1' : '0'); } catch (e) {}
    if (!audio.muted && !playing) {
      audio.play().catch(() => {});
      playing = true;
      updatePlayingUi();
    }
  });
}

audio.addEventListener('ended', () => {
  if (musicCfg.loop !== false && tracks.length) {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play().catch(() => {});
  } else {
    playing = false;
    updatePlayingUi();
  }
});

if (tracks.length) {
  loadTrack(currentTrack);
  if (musicCfg.autoplay) {
    playCurrentTrack().catch(() => {});
  }
}

if (document.body) {
  document.body.addEventListener('pointerdown', unlockMusicPlayback, { once: true });
  document.body.addEventListener('touchstart', unlockMusicPlayback, { once: true });
  document.body.addEventListener('keydown', unlockMusicPlayback, { once: true });
}

updateMuteUi();
updatePlayingUi();
