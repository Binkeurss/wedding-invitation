/* ---------- UI cố định: nút nhạc chỉ đổi trạng thái (chưa gắn file âm thanh) ---------- */
const ui = $('#ui'), playBtn = $('#playBtn'), playIco = $('#playIco');
let playing = false;
playBtn.addEventListener('click', () => {
  playing = !playing; ui.classList.toggle('playing', playing);
  playIco.innerHTML = playing ? '<path d="M8 5v14M16 5v14" stroke="#fff" fill="none"/>' : '<path d="M8 5 L19 12 L8 19 Z" fill="#fff" stroke="none"/>';
  try { localStorage.setItem('music', playing ? '1' : '0'); } catch (e) {}
});
