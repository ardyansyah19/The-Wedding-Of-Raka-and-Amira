/* ================= GUEST NAME FROM URL ?to= ================= */
(function(){
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  if(to){ document.getElementById('guestName').textContent = decodeURIComponent(to.replace(/\+/g,' ')); }
})();

/* ================= FALLING PETALS ON COVER ================= */
(function(){
  const holder = document.getElementById('petalsHolder');
  const colors = ['#f3d9dd','#e3a8b4','#fff'];
  for(let i=0;i<14;i++){
    const p = document.createElement('div');
    p.className='petal';
    p.style.left = Math.random()*100+'%';
    p.style.width = p.style.height = (6+Math.random()*8)+'px';
    p.style.background = colors[i%colors.length];
    p.style.borderRadius = '0 100% 0 100%';
    p.style.animationDuration = (6+Math.random()*6)+'s';
    p.style.animationDelay = (Math.random()*6)+'s';
    holder.appendChild(p);
  }
})();

/* ================= OPEN INVITATION ================= */
document.body.style.overflow='hidden';
document.getElementById('openBtn').addEventListener('click', function(){
  document.getElementById('cover').classList.add('opened');
  document.body.style.overflow='auto';
  startMusic();
});

/* ================= COUNTDOWN ================= */
(function(){
  const target = new Date('2026-12-20T08:00:00+07:00').getTime();
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    document.getElementById('cd-day').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-hour').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-min').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-sec').textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick,1000);
})();

/* ================= SCROLL REVEAL ================= */
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} });
  },{ threshold:0.15 });
  els.forEach(el=>obs.observe(el));
})();

/* ================= GALLERY GRID + LIGHTBOX ================= */
(function(){
  const grid = document.getElementById('galGrid');
  for(let i=0;i<9;i++){
    const g = document.createElement('div');
    g.className='g';
    grid.appendChild(g);
  }
  const lb = document.getElementById('lightbox');
  grid.addEventListener('click', ()=> lb.classList.add('show'));
  lb.querySelector('.close').addEventListener('click', ()=> lb.classList.remove('show'));
  lb.addEventListener('click', (e)=>{ if(e.target===lb) lb.classList.remove('show'); });
})();

/* ================= COPY BANK NUMBER ================= */
document.querySelectorAll('.copy-btn').forEach(btn=>{
  btn.addEventListener('click', function(){
    const val = this.getAttribute('data-copy');
    navigator.clipboard.writeText(val).then(()=>{
      this.textContent='Tersalin!';
      this.classList.add('copied');
      setTimeout(()=>{ this.textContent='Salin'; this.classList.remove('copied'); }, 1800);
    }).catch(()=>{ this.textContent='Gagal, salin manual'; });
  });
});

/* ================= RSVP / GUESTBOOK (in-memory only) ================= */
(function(){
  const wishes = [];
  const list = document.getElementById('wishesList');
  function render(){
    if(wishes.length===0){
      list.innerHTML = '<div class="wishes-empty">Jadilah yang pertama mengirimkan ucapan &#128149;</div>';
      return;
    }
    list.innerHTML = wishes.slice().reverse().map(w=>`
      <div class="wish">
        <div class="who">${w.name} <span class="att">${w.attend}</span></div>
        <div class="msg">${w.msg}</div>
      </div>
    `).join('');
  }
  document.getElementById('rsvpForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('rName').value.trim();
    const attend = document.getElementById('rAttend').value;
    const msg = document.getElementById('rMsg').value.trim();
    if(!name || !attend || !msg) return;
    wishes.push({ name: escapeHtml(name), attend: escapeHtml(attend), msg: escapeHtml(msg) });
    render();
    this.reset();
  });
  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
  render();
})();

/* ================= MUSIC TOGGLE (auto-plays uploaded mp3 once invitation opens) ================= */
let musicOn = false;
const bgMusic = document.getElementById('bgMusic');

function startMusic(){
  // Dipanggil otomatis saat tombol "Buka Undangan" ditekan (klik = izin browser untuk autoplay audio)
  bgMusic.volume = 0.85;
  bgMusic.play().then(()=>{
    musicOn = true;
    document.getElementById('musicToggle').classList.remove('paused');
  }).catch(()=>{
    // Jika browser tetap memblokir autoplay, tombol musik tetap bisa dipakai manual
    musicOn = false;
    document.getElementById('musicToggle').classList.add('paused');
  });
}

document.getElementById('musicToggle').addEventListener('click', function(){
  musicOn = !musicOn;
  this.classList.toggle('paused', !musicOn);
  if(musicOn){ bgMusic.play(); } else { bgMusic.pause(); }
});
