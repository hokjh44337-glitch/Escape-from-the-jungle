const player = document.getElementById('player');
const monster = document.getElementById('monster');
const scoreEl = document.getElementById('score');
const coinsEl = document.getElementById('coins');

let lane = 1;
let score = 0;
let coins = 0;

let speed = 4;
let maxSpeed = 12;
let startTime = Date.now();

let isJumping = false;
let isSliding = false;

/* 레인 위치 */
function laneX(l) {
  return window.innerWidth / 2 + (l - 1) * 80;
}

function updatePlayer() {
  player.style.left = laneX(lane) + 'px';
  monster.style.left = player.style.left;
}

/* 점프 */
function jump() {
  if (isJumping) return;
  isJumping = true;
  player.classList.add('jump');

  setTimeout(() => {
    player.classList.remove('jump');
    isJumping = false;
  }, 400);
}

/* 슬라이드 */
function slide() {
  isSliding = true;
  player.classList.add('slide');

  setTimeout(() => {
    player.classList.remove('slide');
    isSliding = false;
  }, 400);
}

/* 키보드 */
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && lane > 0) lane--;
  if (e.key === 'ArrowRight' && lane < 2) lane++;
  if (e.key === 'ArrowUp') jump();
  if (e.key === 'ArrowDown') slide();

  updatePlayer();
});

/* 모바일 */
let sx, sy;

document.addEventListener('touchstart', e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - sx;
  let dy = e.changedTouches[0].clientY - sy;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && lane < 2) lane++;
    else if (dx < -30 && lane > 0) lane--;
  } else {
    if (dy < -30) jump();
    else if (dy > 30) slide();
  }

  updatePlayer();
});

/* 장애물 생성 */
function spawnObstacle() {
  const el = document.createElement('div');

  const rand = Math.random();
  let type;

  if (rand < 0.33) type = 'rock-top';
  else if (rand < 0.66) type = 'rock-hole';
  else type = 'hole';

  el.className = 'obstacle ' + type;

  const arrow = document.createElement('div');
  arrow.className = 'arrow';
  arrow.innerText = (type === 'rock-hole') ? '↓' : '↑';
  el.appendChild(arrow);

  const l = Math.floor(Math.random() * 3);
  el.style.left = laneX(l) - 40 + 'px';
  el.style.top = '-60px';

  document.body.appendChild(el);

  let pos = -60;

  const int = setInterval(() => {
    pos += speed;
    el.style.top = pos + 'px';

    if (pos > innerHeight) {
      el.remove();
      clearInterval(int);
    }

    if (Math.abs(pos - (innerHeight - 120)) < 40 && l === lane) {
      if (type === 'rock-top' && !isJumping) gameOver();
      if (type === 'rock-hole' && !isSliding) gameOver();
      if (type === 'hole' && !isJumping) gameOver();

      el.remove();
      clearInterval(int);
    }
  }, 30);
}

/* 코인 */
function spawnCoin() {
  const el = document.createElement('div');
  el.className = 'coin';

  const l = Math.floor(Math.random() * 3);
  el.style.left = laneX(l) - 10 + 'px';
  el.style.top = '-20px';

  document.body.appendChild(el);

  let pos = -20;

  const int = setInterval(() => {
    pos += speed;
    el.style.top = pos + 'px';

    if (pos > innerHeight) {
      el.remove();
      clearInterval(int);
    }

    if (Math.abs(pos - (innerHeight - 120)) < 30 && l === lane) {
      coins++;
      coinsEl.textContent = coins;

      el.remove();
      clearInterval(int);
    }
  }, 30);
}

/* 게임오버 */
function gameOver() {
  alert('괴수에게 잡혔다!');
  location.reload();
}

/* 속도 증가 */
setInterval(() => {
  let t = Math.min((Date.now() - startTime) / 180000, 1);
  speed = 4 + (maxSpeed - 4) * t;
}, 1000);

/* 루프 */
setInterval(spawnObstacle, 800);
setInterval(spawnCoin, 2000);

setInterval(() => {
  score++;
  scoreEl.textContent = score;
}, 200);

updatePlayer();
