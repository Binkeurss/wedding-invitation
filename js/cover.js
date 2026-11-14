function startWeddingMusic() {
  const trackUrl = '/music/i_lay_my_love_on_you.mp3';

  if (!window.__weddingAudio) {
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.muted = false;
    window.__weddingAudio = audio;
  }

  const audio = window.__weddingAudio;
  const tryPlay = () => {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  tryPlay();
  document.addEventListener('pointerdown', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
  document.addEventListener('keydown', tryPlay, { once: true });
}

window.startWeddingMusic = startWeddingMusic;

(() => {
  startWeddingMusic();

  const cover = document.getElementById('cover');
  const openButton = document.getElementById('openInvitation');
  if (!cover || !openButton) {
    window.__heroGo = true;
    window.dispatchEvent(new Event('scroll'));
    return;
  }
  document.body.classList.add('cover-locked');
  const snow = document.getElementById('snow');
  if (snow) {
    const r = (a, b) => a + Math.random() * (b - a);
    const n = window.innerWidth < 520 ? 34 : 52;
    for (let k = 0; k < n; k++) {
      const f = document.createElement('span');
      const flower = k % 9 === 0;
      f.className = 'snowflake' + (flower ? ' flower' : '');
      if (flower) f.textContent = '✻';
      f.style.cssText = `--x:${r(0, 98).toFixed(1)}%;--s:${flower ? r(10, 17).toFixed(0) : r(4, 12).toFixed(1)}px;--o:${r(.6, 1).toFixed(2)};--t:${r(10, 22).toFixed(1)}s;--delay:${(-r(0, 22)).toFixed(1)}s;--drift:${r(-46, 46).toFixed(0)}px`;
      snow.appendChild(f);
    }
  }
  openButton.addEventListener('click', () => {
    cover.classList.add('is-hidden');
    window.setTimeout(() => { window.__heroGo = true; window.dispatchEvent(new Event('scroll')); }, 250);
    document.body.classList.remove('cover-locked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startWeddingMusic();
    window.setTimeout(() => cover.setAttribute('aria-hidden', 'true'), 850);
  });
})();
