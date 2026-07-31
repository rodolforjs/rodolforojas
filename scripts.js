// ── NAVEGACIÓN ENTRE PROYECTOS (dinámica) ─────────────────────
const _proyectosNav = [
  { file: 'proyecto-mapi.html', nombre: 'Mapi' },
  { file: 'proyecto-cyclers.html', nombre: 'Cyclers' },
  { file: 'proyecto-natito.html', nombre: 'Ñatito Libros' },
  { file: 'proyecto-consorcio.html',         nombre: 'Banco Consorcio' },
  { file: 'proyecto-tesla.html',             nombre: 'Tesla' },
  { file: 'proyecto-altic.html',             nombre: 'Altic' },
  { file: 'proyecto-freshy.html', nombre: 'Freshy' },
  { file: 'proyecto-puntos-suspensivos.html', nombre: 'Puntos Suspensivos' },
  { file: 'proyecto-jackboy.html', nombre: 'Jack Boy' },
  
];
(function () {
  const prev = document.querySelector('.nav-proyecto-prev');
  const next = document.querySelector('.nav-proyecto-next');
  if (!prev || !next) return;
  const path = window.location.pathname.replace(/\/$/, '');
  let pagina = path.split('/').pop();
  if (pagina && !pagina.endsWith('.html')) pagina += '.html';
  const idx = _proyectosNav.findIndex(p => p.file === pagina);
  if (idx === -1) return;
  const total = _proyectosNav.length;
  const anterior  = _proyectosNav[(idx - 1 + total) % total];
  const siguiente = _proyectosNav[(idx + 1) % total];
  prev.href = anterior.file;
  prev.querySelector('.nav-proyecto-titulo').innerHTML = `<span class="nav-proyecto-arrow">↖</span> ${anterior.nombre}`;
  next.href = siguiente.file;
  next.querySelector('.nav-proyecto-titulo').innerHTML = `${siguiente.nombre} <span class="nav-proyecto-arrow">↗</span>`;
})();

// ── MENÚ OVERLAY ─────────────────────────────────────────────
function abrirMenu() { document.getElementById('menuOverlay').classList.add('open'); }
function cerrarMenu() { document.getElementById('menuOverlay').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrarMenu(); cerrarGaleria(); } });

// ── RELOJ BREADCRUMB ─────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const c = document.getElementById('clock');
  if (c) c.textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── INTERSECTIONOBSERVER: animación de entrada ────────────────
const _secciones = document.querySelectorAll('.seccion');
_secciones.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
const _scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      _scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
_secciones.forEach(el => _scrollObserver.observe(el));

// ── CAROUSEL DE PROYECTOS (index.html + areaux.html) ──────────
const proyectos = [
  { id: 'consorcio', tipo: 'video',  src: 'images/ConsorcioVideoPromocional.mp4', audio: true },
  { id: 'mapi',      tipo: 'video',  src: 'images/MAPI_SPOT_7.mp4', audio: true },
  { id: 'cyclers',   tipo: 'video',  src: 'images/Cyclers_POT_1.mp4', audio: true }
];
let indiceActual = 0;

const _iconMuted = `<svg class="audio-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const _iconOn    = `<svg class="audio-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;

function toggleCarouselAudio(btn) {
  const video = document.getElementById('carousel-video');
  if (!video) return;
  video.muted = !video.muted;
  btn.innerHTML = video.muted ? _iconMuted : _iconOn;
}

function toggleProyectoAudio() {
  const video = document.querySelector('.custom-proyectovisual');
  const btn = document.getElementById('audio-btn-proyecto');
  if (!video || !btn) return;
  video.muted = !video.muted;
  btn.innerHTML = video.muted ? _iconMuted : _iconOn;
}

// Inicializa icono del botón de audio en nav (proyecto pages)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('audio-btn-proyecto');
  if (btn) btn.innerHTML = _iconMuted;
});

function seleccionarProyecto(idProyecto, tipoMedia, rutaArchivo) {
  proyectos.forEach(p => {
    const card  = document.getElementById('card-'  + p.id);
    const titulo = document.getElementById('titulo-' + p.id);
    const meta  = document.getElementById('meta-'  + p.id);
    if (!card) return;
    if (p.id === idProyecto) {
      card.className = 'col-lg-6 col-12 p-3 carousel-visible';
      titulo.className = 'carousel-titulo-activo';
      meta.classList.replace('d-none', 'd-block');
    } else {
      card.className = 'col-lg-3 col-12 p-3';
      titulo.className = 'carousel-titulo-desactivo';
      meta.classList.replace('d-block', 'd-none');
    }
  });
  const contenedor = document.getElementById('contenedor-media');
  if (!contenedor) return;
  const proyecto = proyectos.find(p => p.id === idProyecto);
  const conAudio = proyecto && proyecto.audio;
  if (tipoMedia === 'video') {
    contenedor.innerHTML =
      `<video class="media-principal" id="carousel-video" autoplay muted loop playsinline><source src="${rutaArchivo}" type="video/mp4"></video>` +
      (conAudio ? `<button class="audio-btn" onclick="toggleCarouselAudio(this)" aria-label="Toggle audio">${_iconMuted}</button>` : '');
  } else {
    contenedor.innerHTML = `<img class="media-principal" src="${rutaArchivo}" alt="Proyecto">`;
  }
}

function irAProyecto(indice) {
  indiceActual = indice;
  const p = proyectos[indice];
  seleccionarProyecto(p.id, p.tipo, p.src);
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('activo', i === indice);
  });
}

const contenedorMedia = document.getElementById('contenedor-media');
if (contenedorMedia) {
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => irAProyecto(parseInt(dot.dataset.index)));
  });
  let touchStartX = 0;
  contenedorMedia.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  contenedorMedia.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    irAProyecto(diff > 0
      ? (indiceActual + 1) % proyectos.length
      : (indiceActual - 1 + proyectos.length) % proyectos.length);
  });
  irAProyecto(0);
}

// ── STRIP EXPLORACIONES DINÁMICO (index.html) ────────────────
const _exploracionesStrip = [
  { src: 'images/HugoBossAzul.JPG',       titulo: 'HUGO BOSS MOON',         cat: 'Fotografía · Photoshop' },
  { src: 'images/FoxReel.mp4',            titulo: 'MR. FOX',                cat: 'Motion · After Effects' },
  { src: 'images/HugoBossClaro.jpg',      titulo: 'HUGO BOSS FADE',         cat: 'Fotografía · Photoshop' },
  { src: 'images/NewBalanceReel.mp4',     titulo: 'NEW BALANCE REEL',       cat: 'Motion · After Effects' },
  { src: 'images/HugoBossOscuro.JPG',     titulo: 'HUGO BOSS ÍNTIMO',       cat: 'Fotografía · Photoshop' },
  { src: 'images/ReelRaid.mp4',           titulo: 'RAID ANUNCIO',           cat: 'Motion · After Effects' },
  { src: 'images/CaseDSApertura.gif',     titulo: 'CASE DS',                cat: '3D · Electrónica'       },
  { src: 'images/NEW BALANCE.mp4',        titulo: 'NEW BALANCE LOGO',       cat: 'Motion · After Effects' },
  { src: 'images/PatrickJP1.jpg',         titulo: 'PATRICK DEMARCHELIER',   cat: 'Fotografía · Photoshop' },
  { src: 'images/SPOTIFY.mp4',            titulo: 'SPOTIFY LOGO',           cat: 'Motion · After Effects' },
  { src: 'images/PatrickJP2.jpg',         titulo: 'PATRICK DEMARCHELIER',   cat: 'Fotografía · Photoshop' },
  { src: 'images/PATH MORPH.mp4',         titulo: 'MARCAS PERSONALES',      cat: 'Motion · After Effects' },
  { src: 'images/PatrickJP3.png',         titulo: 'PATRICK DEMARCHELIER',   cat: 'Fotografía · Photoshop' },
  { src: 'images/LOGO TWITTER.mp4',       titulo: 'TWITTER LOGO',           cat: 'Motion · After Effects' },
  { src: 'images/PortadaPYMA.png',        titulo: 'PYMA',                   cat: 'Figma · UI Design'      },
  { src: 'images/LollaHero.png',          titulo: 'LOLLAPALOOZA',           cat: 'HTML · CSS · Bootstrap' },
  { src: 'images/Bird3DMOV.mp4',          titulo: 'PÁJARO',                 cat: 'Fusion 360'             },
  { src: 'images/Tacdesign.jpeg',         titulo: 'TAC',                    cat: 'Fusion 360 · Diseño Industrial' },
];

(function () {
  const strip = document.getElementById('strip-exploraciones');
  if (!strip) return;
  const track = strip.querySelector('.strip-track');
  const items = _exploracionesStrip.map(d => {
    const esVideo = d.src.endsWith('.mp4');
    const media = esVideo
      ? '<video autoplay muted loop playsinline><source src="' + d.src + '" type="video/mp4"></video>'
      : '<img src="' + d.src + '" alt="' + d.titulo + '">';
    return '<a href="exploraciones.html" class="strip-item">' +
      media +
      '<div class="strip-item-overlay">' +
        '<p class="strip-item-titulo">' + d.titulo + '</p>' +
        '<span class="strip-item-cat">' + d.cat + '</span>' +
      '</div>' +
    '</a>';
  }).join('');
  track.innerHTML = items + items;
})();

// ── HOVER ÁREAS (index.html) ──────────────────────────────────
document.querySelectorAll('.area-item').forEach(item => {
  item.addEventListener('mouseenter', () => item.classList.add('activo'));
  item.addEventListener('mouseleave', () => item.classList.remove('activo'));
  item.addEventListener('touchstart', () => {
    const yaActivo = item.classList.contains('activo');
    document.querySelectorAll('.area-item').forEach(i => i.classList.remove('activo'));
    if (!yaActivo) item.classList.add('activo');
  }, { passive: true });
});

// ── FILTRO PROYECTOS (proyectos.html) ─────────────────────────
(function () {
  const contador = document.getElementById('contador');
  if (!contador) return;
  const total = document.querySelectorAll('.proyecto-card-wrap').length;
  contador.textContent = total + (total === 1 ? ' Función' : ' Funciones');
})();

function filtrar(boton) {
  const filtro = boton.dataset.filtro;
  document.querySelectorAll('.filtro-item').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');
  const cards = document.querySelectorAll('.proyecto-card-wrap');
  let visibles = 0;
  cards.forEach(card => {
    const mostrar = filtro === 'todos' || card.dataset.cat.includes(filtro);
    card.style.display = mostrar ? '' : 'none';
    if (mostrar) visibles++;
  });
  document.getElementById('contador').textContent = visibles + (visibles === 1 ? ' Función' : ' Funciones');
  document.getElementById('sin-resultados').classList.toggle('d-none', visibles > 0);
}

// ── FORMULARIO CONTACTO (contacto.html) ───────────────────────
function toggleInteres(el) {
  el.classList.toggle('selected');
}

function enviarFormulario() {
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  if (!nombre || !correo) {
    alert('Por favor completa al menos nombre y correo.');
    return;
  }
  alert(`¡Gracias ${nombre}! Nos pondremos en contacto pronto.`);
}

// ── FILTRO GALERÍA EXPLORACIONES ─────────────────────────────
(function () {
  const contador = document.getElementById('contador-galeria');
  if (!contador) return;
  const total = document.querySelectorAll('.galeria-item').length;
  contador.textContent = total + (total === 1 ? ' pieza' : ' piezas');
})();

function filtrarGaleria(boton) {
  const filtro = boton.dataset.filtro;
  document.querySelectorAll('.filtro-item').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');
  const items = document.querySelectorAll('.galeria-item');
  let visibles = 0;
  items.forEach(item => {
    const mostrar = filtro === 'todos' || item.dataset.cat === filtro;
    item.style.display = mostrar ? '' : 'none';
    if (mostrar) visibles++;
  });
  const cont = document.getElementById('contador-galeria');
  if (cont) cont.textContent = visibles + (visibles === 1 ? ' pieza' : ' piezas');
}

// ── GALERÍA EXPLORACIONES ─────────────────────────────────────
let _carouselImages = [];
let _carouselIdx    = 0;

function _renderCarousel(imgCol) {
  const src = _carouselImages[_carouselIdx];
  const esVideo = src.endsWith('.mp4');
  const media = esVideo
    ? '<video src="' + src + '" class="galeria-carousel-img" autoplay muted loop playsinline></video>'
    : '<img src="' + src + '" alt="" class="galeria-carousel-img">';
  imgCol.innerHTML =
    '<div class="galeria-carousel-wrap">' +
      media +
      '<button class="galeria-carousel-btn prev" onclick="event.stopPropagation();galeriaCarouselNav(-1)">&#8592;</button>' +
      '<button class="galeria-carousel-btn next" onclick="event.stopPropagation();galeriaCarouselNav(1)">&#8594;</button>' +
      '<div class="galeria-carousel-counter">' + (_carouselIdx + 1) + ' / ' + _carouselImages.length + '</div>' +
    '</div>';
}

function galeriaCarouselNav(dir) {
  _carouselIdx = (_carouselIdx + dir + _carouselImages.length) % _carouselImages.length;
  const imgCol = document.querySelector('.galeria-modal-img-col');
  if (imgCol) _renderCarousel(imgCol);
}

function abrirGaleria(el) {
  const modal = document.getElementById('galeria-modal');
  if (!modal) return;
  const imgCol = modal.querySelector('.galeria-modal-img-col');
  if (el.dataset.images) {
    _carouselImages = JSON.parse(el.dataset.images);
    const img = el.querySelector('.galeria-img');
    _carouselIdx = img && img.dataset.idx ? parseInt(img.dataset.idx) : 0;
    _renderCarousel(imgCol);
  } else if (el.dataset.video) {
    imgCol.innerHTML = '<video src="' + el.dataset.video + '" controls autoplay style="width:100%;border-radius:16px;display:block;max-height:75vh;"></video>';
  } else {
    const src = el.querySelector('.galeria-img') ? el.querySelector('.galeria-img').src : '';
    imgCol.innerHTML = '<img src="' + src + '" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:16px;display:block;">';
  }
  document.getElementById('galeria-modal-titulo').textContent = el.dataset.titulo || '';
  document.getElementById('galeria-modal-desc').textContent = el.dataset.descripcion || '';
  document.getElementById('galeria-modal-herramientas').textContent = el.dataset.herramientas || '';
  const btn = document.getElementById('galeria-modal-btn');
  if (el.dataset.link) {
    btn.href = el.dataset.link;
    btn.textContent = (el.dataset.linkLabel || 'Ver proyecto') + ' →';
    btn.style.display = 'inline-flex';
  } else {
    btn.style.display = 'none';
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarGaleria(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('galeria-modal');
  if (modal) {
    const vid = modal.querySelector('video');
    if (vid) vid.pause();
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
}

// Auto-ciclo para cards multi (imágenes y/o videos)
document.querySelectorAll('.galeria-item--multi').forEach(item => {
  const srcs = JSON.parse(item.dataset.images || '[]');
  if (srcs.length < 2) return;
  const counter = item.querySelector('.galeria-multi-counter');
  let idx = 0;
  setInterval(() => {
    const media = item.querySelector('.galeria-img');
    if (!media) return;
    media.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % srcs.length;
      const src = srcs[idx];
      const esVideo = src.endsWith('.mp4');
      if (esVideo && media.tagName === 'VIDEO') {
        media.src = src; media.load(); media.play();
        media.dataset.idx = idx;
        setTimeout(() => { media.style.opacity = '1'; }, 100);
      } else if (!esVideo && media.tagName === 'IMG') {
        media.src = src; media.dataset.idx = idx;
        media.onload = () => { media.style.opacity = '1'; };
      } else {
        const nuevo = document.createElement(esVideo ? 'video' : 'img');
        nuevo.className = 'galeria-img'; nuevo.dataset.idx = idx;
        if (esVideo) {
          nuevo.autoplay = true; nuevo.muted = true; nuevo.loop = true;
          nuevo.setAttribute('playsinline', ''); nuevo.src = src;
        } else { nuevo.src = src; nuevo.alt = ''; }
        media.replaceWith(nuevo);
        setTimeout(() => { nuevo.style.opacity = '1'; }, 100);
      }
      if (counter) counter.textContent = (idx + 1) + ' / ' + srcs.length;
    }, 400);
  }, 2800);
});

// ── DESTACADOS STEPPER ─────────────────────────────────────────
(function () {
  const section  = document.getElementById('dest-section');
  if (!section) return;

  const sticky   = section.querySelector('.dest-sticky');
  const flash    = document.getElementById('dest-flash');
  const audioBtnEl = document.getElementById('dest-audio-btn');
  const slides   = Array.from(section.querySelectorAll('.dest-slide'));
  const steps    = Array.from(section.querySelectorAll('.dest-step'));
  const mdots    = Array.from(section.querySelectorAll('.dest-mdot'));
  const total    = slides.length;
  // last slide gets extra dwell: it occupies (totalScrollSegments - total + 1) segments
  const totalScrollSegments = 3; // matches 400vh - 100vh = 300vh / 100vh
  let activeIdx  = -1;
  let destMuted  = true;

  // initialise audio button icon
  if (audioBtnEl) audioBtnEl.innerHTML = _iconMuted;

  function triggerFlash() {
    if (!flash) return;
    flash.style.transition = 'opacity 0.1s ease';
    flash.style.opacity    = '0.55';
    setTimeout(() => {
      flash.style.transition = 'opacity 0.3s ease';
      flash.style.opacity    = '0';
    }, 100);
  }

  function syncAudioBtn() {
    if (!audioBtnEl) return;
    audioBtnEl.innerHTML = destMuted ? _iconMuted : _iconOn;
  }

  function setActive(idx) {
    if (idx === activeIdx) return;
    const prev = activeIdx;
    activeIdx  = idx;

    triggerFlash();

    slides.forEach((s, i) => {
      const vid = s.querySelector('.dest-media');
      if (i === idx) {
        s.classList.remove('saliendo');
        s.classList.add('activo');
        if (vid) vid.muted = destMuted;
      } else if (i === prev) {
        s.classList.remove('activo');
        s.classList.add('saliendo');
        if (vid) vid.muted = true;
        setTimeout(() => s.classList.remove('saliendo'), 500);
      } else {
        s.classList.remove('activo', 'saliendo');
        if (vid) vid.muted = true;
      }
    });

    steps.forEach((s, i) => {
      s.classList.toggle('activo', i === idx);
      s.classList.toggle('pasado', i < idx);
      if (i !== idx) s.querySelector('.dest-step-fill').style.height = i < idx ? '100%' : '0%';
    });
    mdots.forEach((d, i) => d.classList.toggle('activo', i === idx));
  }

  window.toggleDestAudio = function () {
    destMuted = !destMuted;
    const vid = slides[activeIdx]?.querySelector('.dest-media');
    if (vid) vid.muted = destMuted;
    syncAudioBtn();
  };

  window.addEventListener('scroll', () => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrolled   = window.scrollY - sectionTop;
    const vh         = window.innerHeight;

    if (scrolled < 0 || scrolled > vh * totalScrollSegments) return;

    // slides 0…(total-2) each take 1 segment; last slide takes the rest
    const raw = scrolled / vh;
    const idx = Math.min(total - 1, Math.floor(raw));
    // progress within the current slide's scroll range
    const segStart = idx;
    const segEnd   = idx < total - 1 ? idx + 1 : totalScrollSegments;
    const prog     = Math.max(0, Math.min(1, (raw - segStart) / (segEnd - segStart)));

    setActive(idx);

    const fill = steps[idx]?.querySelector('.dest-step-fill');
    if (fill) fill.style.height = (prog * 100) + '%';
  }, { passive: true });

  window.destScrollTo = function (idx) {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + idx * window.innerHeight, behavior: 'smooth' });
  };

  // Touch gesture navigation — snap to slide on swipe
  let tY0 = 0, tX0 = 0, tGesture = null; // null=undecided, 'h'=horizontal, 'v'=vertical
  if (sticky) {
    sticky.addEventListener('touchstart', e => {
      tY0 = e.touches[0].clientY;
      tX0 = e.touches[0].clientX;
      tGesture = null;
    }, { passive: true });

    sticky.addEventListener('touchmove', e => {
      if (window.innerWidth >= 768) return; // desktop: let page scroll normally
      const dy = tY0 - e.touches[0].clientY;
      const dx = tX0 - e.touches[0].clientX;
      if (!tGesture && (Math.abs(dx) > 6 || Math.abs(dy) > 6))
        tGesture = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
      if (tGesture !== 'v') return;
      e.preventDefault(); // block all vertical scroll inside section — exits handled in touchend
    }, { passive: false });

    sticky.addEventListener('touchend', e => {
      if (tGesture === 'h') return;
      const dy = tY0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;
      if (dy > 0) { // swipe up → next slide or exit below
        if (activeIdx < total - 1) {
          destScrollTo(activeIdx + 1);
        } else {
          // Last slide: jump past the section
          const end = section.getBoundingClientRect().top + window.scrollY + section.offsetHeight;
          window.scrollTo({ top: end, behavior: 'smooth' });
        }
      } else { // swipe down → prev slide or exit above
        if (activeIdx > 0) {
          destScrollTo(activeIdx - 1);
        } else {
          // First slide: jump just above section
          const top = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: Math.max(0, top - 10), behavior: 'smooth' });
        }
      }
    }, { passive: true });
  }

  setActive(0);
})();

// ── PROYECTOS WHEEL (infinite arc carousel — transform-based) ────
(function () {
  const outer = document.getElementById('wheel-outer');
  const track = document.getElementById('wheel-track');
  if (!outer || !track) return;

  const origCards = Array.from(track.querySelectorAll('.wheel-card'));
  const N   = origCards.length;
  const GAP = 20;

  // Build 3× track: [prepend clones][originals][append clones]
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));
  [...origCards].reverse().forEach(c => track.insertBefore(c.cloneNode(true), track.firstChild));

  let cardW   = 0;
  let unit    = 0;   // cardW + GAP
  let singleW = 0;   // N * unit — one full loop
  let offset  = 0;   // virtual scroll offset, wraps in [0, singleW) via modulo
  let raf     = null;

  // Inertia state
  let velocity  = 0;
  let prevX     = 0;
  let prevT     = 0;
  let inertiaId = null;

  function wrap() {
    if (!singleW) return;
    offset = ((offset % singleW) + singleW) % singleW;
  }

  function render() {
    if (!cardW) return;
    const outerW    = outer.offsetWidth;
    const cards     = Array.from(track.querySelectorAll('.wheel-card'));
    const refCenter = cards[N].offsetLeft + cardW / 2;
    const tx        = outerW / 2 - refCenter - offset;
    track.style.transform = `translateX(${tx.toFixed(1)}px)`;

    cards.forEach(card => {
      const sc   = card.offsetLeft + cardW / 2 + tx; // screen center
      const n    = (sc - outerW / 2) / unit;
      const absN = Math.abs(n);

      if (absN > 2.2) {
        card.style.opacity   = '0';
        card.style.transform = '';
        return;
      }
      const ty      = n * n * 16;
      const scale   = Math.max(0.65, 1 - absN * 0.15);
      const rotateZ = Math.sign(n) * Math.min(absN * 13, 18);
      const opacity = Math.max(0, 1 - absN * 0.35);
      card.style.transform = `translateY(${ty.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateZ(${rotateZ.toFixed(2)}deg)`;
      card.style.opacity   = opacity.toFixed(3);
    });
  }

  // Momentum after release
  function inertia() {
    if (Math.abs(velocity) < 0.3) { velocity = 0; return; }
    offset   += velocity;
    velocity *= 0.94;   // friction: ~10px/frame at release → stops in ~40 frames
    wrap();
    render();
    inertiaId = requestAnimationFrame(inertia);
  }

  function setup() {
    const card = track.querySelector('.wheel-card');
    if (!card) return;
    cardW   = card.offsetWidth;
    unit    = cardW + GAP;
    singleW = N * unit;
    wrap();
    render();
  }

  // ── Mouse drag ──────────────────────────────────────────────
  let isDown = false, startX = 0, initOffset = 0, moved = false;

  outer.addEventListener('mousedown', e => {
    cancelAnimationFrame(inertiaId);
    velocity   = 0;
    isDown     = true;
    moved      = false;
    startX     = e.clientX;
    initOffset = offset;
    prevX      = e.clientX;
    prevT      = Date.now();
    outer.classList.add('grabbing');
  });

  document.addEventListener('mouseup', () => {
    if (isDown) inertiaId = requestAnimationFrame(inertia);
    isDown = false;
    outer.classList.remove('grabbing');
  });

  document.addEventListener('mousemove', e => {
    if (!isDown) return;
    const now = Date.now();
    const dt  = now - prevT || 1;
    velocity  = (prevX - e.clientX) / dt * 16; // px per frame
    prevX     = e.clientX;
    prevT     = now;
    const dx  = startX - e.clientX;
    if (Math.abs(dx) > 4) moved = true;
    offset = initOffset + dx;
    wrap();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  });

  track.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);

  // ── Trackpad / mouse wheel ──────────────────────────────────
  // Only intercept horizontal swipes; vertical passes through to page scroll
  outer.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 1.2) return;
    e.preventDefault();
    cancelAnimationFrame(inertiaId);
    offset += e.deltaX;
    wrap();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  }, { passive: false });

  // ── Touch drag ───────────────────────────────────────────────
  let tStartX = 0, tStartY = 0, tInitOffset = 0, tIsH = false;

  outer.addEventListener('touchstart', e => {
    cancelAnimationFrame(inertiaId);
    velocity    = 0;
    tStartX     = e.touches[0].clientX;
    tStartY     = e.touches[0].clientY;
    tInitOffset = offset;
    tIsH        = false;
    prevX       = tStartX;
    prevT       = Date.now();
  }, { passive: true });

  outer.addEventListener('touchmove', e => {
    const dx = tStartX - e.touches[0].clientX;
    const dy = tStartY - e.touches[0].clientY;
    if (!tIsH && Math.abs(dx) <= Math.abs(dy)) return; // vertical → page scroll
    tIsH = true;
    e.preventDefault();
    const now = Date.now();
    const dt  = now - prevT || 1;
    velocity  = (prevX - e.touches[0].clientX) / dt * 16;
    prevX     = e.touches[0].clientX;
    prevT     = now;
    offset = tInitOffset + dx;
    wrap();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  }, { passive: false });

  outer.addEventListener('touchend', () => {
    inertiaId = requestAnimationFrame(inertia);
  }, { passive: true });

  requestAnimationFrame(setup);
  window.addEventListener('resize', setup);
})();
