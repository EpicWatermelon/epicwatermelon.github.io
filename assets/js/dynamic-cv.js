const sceneStudio = document.querySelector('#scene-studio');
const searchParams = new URLSearchParams(window.location.search);
const isLocalStudioPreview = ['127.0.0.1', 'localhost', '[::1]'].includes(window.location.hostname) || window.location.protocol === 'file:';
const isSceneStudioMode = Boolean(sceneStudio && isLocalStudioPreview && searchParams.get('studio') === '1');
const saberIdleFrames = [
  'assets/pixel/home/saber-idle-chunky-v2-00.png',
  'assets/pixel/home/saber-idle-chunky-v2-01.png',
  'assets/pixel/home/saber-idle-chunky-v2-02.png',
  'assets/pixel/home/saber-idle-chunky-v2-03.png',
  'assets/pixel/home/saber-idle-chunky-v2-04.png',
  'assets/pixel/home/saber-idle-chunky-v2-05.png',
  'assets/pixel/home/saber-idle-chunky-v2-06.png',
  'assets/pixel/home/saber-idle-chunky-v2-07.png'
];
const saberEyeFrames = {
  open: 'assets/pixel/home/saber-eyes-v2-open.png',
  half: 'assets/pixel/home/saber-eyes-v2-half.png',
  closed: 'assets/pixel/home/saber-eyes-v2-closed.png'
};
const saberBlinkFrames = [saberEyeFrames.open, saberEyeFrames.half, saberEyeFrames.closed, saberEyeFrames.closed, saberEyeFrames.half, saberEyeFrames.open];

function startSaberAnimation(bodyImages, eyeImages, motionPreference, idleFrameDuration) {
  const bodies = [...bodyImages];
  const eyes = [...eyeImages];
  const blinkFrameDuration = 120;
  let idleFrameIndex = 0;
  let blinkFrameIndex = 0;
  let idleBeatsBeforeBlink = 18;
  let timer = 0;

  if (!bodies.length) return;

  const renderBody = (frame) => {
    const maskFrameUrl = new URL(frame, document.baseURI).href;
    bodies.forEach((image) => {
      image.src = frame;
      image.parentElement?.style.setProperty('--saber-frame', `url("${maskFrameUrl}")`);
    });
  };
  const renderEyes = (frame) => {
    eyes.forEach((eye) => {
      eye.src = frame;
    });
  };
  const resetBlinkDelay = () => {
    idleBeatsBeforeBlink = 18 + Math.floor(Math.random() * 18);
  };
  const scheduleIdle = () => {
    window.clearTimeout(timer);
    if (motionPreference.matches) return;
    timer = window.setTimeout(() => {
      idleFrameIndex = (idleFrameIndex + 1) % saberIdleFrames.length;
      idleBeatsBeforeBlink -= 1;
      if (idleBeatsBeforeBlink <= 0) {
        blinkFrameIndex = 0;
        scheduleBlink();
        return;
      }
      renderBody(saberIdleFrames[idleFrameIndex]);
      scheduleIdle();
    }, idleFrameDuration);
  };
  const scheduleBlink = () => {
    renderEyes(saberBlinkFrames[blinkFrameIndex]);
    timer = window.setTimeout(() => {
      blinkFrameIndex += 1;
      if (blinkFrameIndex < saberBlinkFrames.length) {
        scheduleBlink();
        return;
      }
      resetBlinkDelay();
      renderEyes(saberEyeFrames.open);
      scheduleIdle();
    }, blinkFrameDuration);
  };
  const restart = () => {
    window.clearTimeout(timer);
    idleFrameIndex = 0;
    blinkFrameIndex = 0;
    resetBlinkDelay();
    renderBody(saberIdleFrames[idleFrameIndex]);
    renderEyes(saberEyeFrames.open);
    scheduleIdle();
  };

  motionPreference.addEventListener('change', restart);
  restart();
}

if (isSceneStudioMode) {
  initializeSceneStudio(sceneStudio);
} else {
const canvas = document.querySelector('#pixel-cosmos');
const context = canvas.getContext('2d', { alpha: false });
const sections = [...document.querySelectorAll('[data-chapter]')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
const meter = document.querySelector('.scroll-meter span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const homeWindFrameDuration = 260;

const palettes = {
  home: { base: '#03091b', haze: '#0b1835', star: '#b7d0ff', accent: '#f3d49f', gold: '#f3d49f', blue: '#79d8ff' },
  bio: { base: '#03091b', haze: '#10254f', star: '#cfe4ff', accent: '#f3d49f', gold: '#f3d49f', blue: '#79d8ff' },
  education: { base: '#080720', haze: '#31245c', star: '#e7ddff', accent: '#d9c2ff', gold: '#dbc7ff', blue: '#9db6ff' },
  ophthalmic: { base: '#03121e', haze: '#0d4564', star: '#d9fbff', accent: '#7cf8df', gold: '#b7e9ff', blue: '#7cf8df' },
  industrial: { base: '#050c18', haze: '#15324c', star: '#d8e8ff', accent: '#8de9ff', gold: '#edca8a', blue: '#8de9ff' },
  contact: { base: '#09071d', haze: '#292052', star: '#f3eaff', accent: '#c2a8ff', gold: '#f3d49f', blue: '#c2a8ff' }
};

let activeChapter = 'home';
let renderedPalette = { ...palettes.home };
let contactStarlightProgress = 0;
let stars = [];
let scale = 1;
let width = 0;
let height = 0;
let animationFrame = 0;
const meteorDuration = 1050;
const meteorCycleDuration = 42000;
const meteorSchedule = createMeteorSchedule();

function startHomeSceneAnimation(motionPreference) {
  const frames = {
    'tree-sway': [
      'assets/pixel/home/tree-sway-v1-00.png',
      'assets/pixel/home/tree-sway-v1-01.png',
      'assets/pixel/home/tree-sway-v1-02.png',
      'assets/pixel/home/tree-sway-v1-03.png'
    ],
    'meadow-sway': [
      'assets/pixel/home/meadow-sway-v2-00.png',
      'assets/pixel/home/meadow-sway-v2-01.png',
      'assets/pixel/home/meadow-sway-v2-02.png'
    ]
  };
  const animatedImages = [...document.querySelectorAll('[data-home-animation]')];
  const saberImages = animatedImages.filter((image) => image.dataset.homeAnimation === 'saber-idle');
  const saberEyes = [...document.querySelectorAll('[data-saber-eye-layer]')];
  const layers = animatedImages.filter((image) => image.dataset.homeAnimation !== 'saber-idle').map((image) => ({ image, frames: frames[image.dataset.homeAnimation] }));
  let frameIndex = 0;
  let timer = 0;

  if (!layers.length && !saberImages.length) return;

  const render = () => {
    layers.forEach((layer) => {
      if (!layer.frames) return;
      const frame = layer.frames[frameIndex % layer.frames.length];
      layer.image.src = frame;
    });
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (motionPreference.matches) return;
    timer = window.setTimeout(() => {
      frameIndex += 1;
      render();
      schedule();
    }, homeWindFrameDuration);
  };
  const restart = () => {
    frameIndex = 0;
    render();
    schedule();
  };

  motionPreference.addEventListener('change', restart);
  startSaberAnimation(saberImages, saberEyes, motionPreference, homeWindFrameDuration);
  restart();
}

function initializeTreeEasterEgg(motionPreference) {
  const home = document.querySelector('#home');
  const tree = home?.querySelector('[data-tree-easter-egg]');
  const rain = home?.querySelector('[data-fluorescent-rain]');
  const treeScene = home?.querySelector('.home-scene-tree-wrap');
  const saber = home?.querySelector('.home-scene-saber');
  const status = home?.querySelector('[data-tree-easter-egg-status]');
  if (!tree || !rain || !treeScene || !saber) return;

  const clicksToTrigger = 10;
  const resetDelay = 1200;
  const rainDuration = 7800;
  let presses = 0;
  let resetTimer = 0;
  let rainTimer = 0;

  const say = (english, chinese) => {
    if (status) status.textContent = document.documentElement.lang.startsWith('zh') ? chinese : english;
  };
  const clearRain = () => {
    window.clearTimeout(rainTimer);
    rain.classList.remove('is-active');
    rain.replaceChildren();
  };
  const resetPresses = () => {
    presses = 0;
    window.clearTimeout(resetTimer);
  };
  const summonRain = () => {
    clearRain();
    const homeRect = home.getBoundingClientRect();
    const treeRect = treeScene.getBoundingClientRect();
    const saberRect = saber.getBoundingClientRect();
    const canopyDropZones = [
      { x: .43, y: .18, width: .14, height: .16 },
      { x: .56, y: .09, width: .17, height: .19 },
      { x: .71, y: .13, width: .15, height: .17 },
      { x: .82, y: .24, width: .1, height: .16 },
      { x: .6, y: .27, width: .14, height: .13 }
    ];
    const saberPoint = {
      x: saberRect.left - homeRect.left + saberRect.width * .475,
      y: saberRect.top - homeRect.top + saberRect.height * .105
    };
    const starPalette = [
      { core: '#fff8c7', outline: '#f1b951', glow: 'rgb(255 210 91 / 58%)', tail: 'rgb(255 225 138 / 76%)' },
      { core: '#c5e6ff', outline: '#82b9ff', glow: 'rgb(123 189 255 / 54%)', tail: 'rgb(183 220 255 / 72%)' },
      { core: '#f6fbff', outline: '#d9e6ff', glow: 'rgb(220 239 255 / 54%)', tail: 'rgb(235 246 255 / 72%)' },
      { core: '#ffb0a2', outline: '#ee735e', glow: 'rgb(255 122 104 / 48%)', tail: 'rgb(255 174 162 / 68%)' }
    ];
    const starColorOrder = [0, 0, 0, 0, 0, 1, 0, 2, 0, 3];
    const stars = Array.from({ length: 24 }, (_, index) => {
      const star = document.createElement('span');
      const sourceProgress = (index * 37 % 101) / 100;
      const sourceHeight = (index * 19 % 101) / 100;
      const dropZone = canopyDropZones[(index * 3) % canopyDropZones.length];
      const isSaberTarget = index % 11 === 0;
      const color = starPalette[starColorOrder[index % starColorOrder.length]];
      const pointInZone = (zone, xRatio, yRatio) => ({
        x: treeRect.left - homeRect.left + treeRect.width * (zone.x + zone.width * xRatio),
        y: treeRect.top - homeRect.top + treeRect.height * (zone.y + zone.height * yRatio)
      });
      const startPoint = isSaberTarget
        ? {
            x: Math.min(pointInZone(canopyDropZones[1], 1, .5).x, Math.max(pointInZone(canopyDropZones[1], 0, .5).x, saberPoint.x + (index % 3 - 1) * 14)),
            y: pointInZone(canopyDropZones[1], .5, .5).y
          }
        : pointInZone(dropZone, sourceProgress, sourceHeight);
      const endPoint = isSaberTarget
        ? { x: saberPoint.x + (index % 5 - 2) * 2, y: saberPoint.y }
        : {
            x: startPoint.x + (index % 5 - 2) * 12,
            y: Math.min(homeRect.height - 28, startPoint.y + Math.max(172, treeRect.height * (.38 + index % 4 * .06)))
          };
      const fallPath = `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
      star.className = 'fluorescent-rain-star';
      star.style.setProperty('--star-fall-path', `path("${fallPath}")`);
      star.style.setProperty('--star-core', color.core);
      star.style.setProperty('--star-outline', color.outline);
      star.style.setProperty('--star-glow', color.glow);
      star.style.setProperty('--star-tail', color.tail);
      const fallDuration = 2400 + (index * 173 % 2200);
      star.style.setProperty('--star-duration', `${fallDuration}ms`);
      star.style.setProperty('--star-delay', `${index * 120}ms`);
      return star;
    });

    rain.replaceChildren(...stars);
    rain.classList.add('is-active');
    say('Fluorescent rain.', '荧光雨降临。');
    rainTimer = window.setTimeout(clearRain, rainDuration);
  };
  const registerPress = () => {
    if (motionPreference.matches) {
      say('Fluorescent rain is disabled when reduced motion is enabled.', '减少动态效果已启用，荧光雨已关闭。');
      return;
    }

    presses += 1;
    window.clearTimeout(resetTimer);
    if (presses >= clicksToTrigger) {
      resetPresses();
      summonRain();
      return;
    }
    resetTimer = window.setTimeout(resetPresses, resetDelay);
  };

  tree.addEventListener('click', registerPress);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) clearRain();
  });
}

function seededStars(count) {
  return Array.from({ length: count }, (_, index) => ({
    x: (index * 47 % 997) / 997,
    y: (index * 89 % 991) / 991,
    depth: 1 + index % 3,
    size: index % 47 === 0 ? 2 : 1,
    speed: 0.14 + (index % 7) * 0.035,
    phase: (index % 23) / 23 * Math.PI * 2,
    twinkle: index % 29 === 0
  }));
}

function createMeteorSchedule() {
  return [
    { start: 1800, x: 0.89, y: 0.10, travelX: -0.32, travelY: 0.17, length: 0.12 },
    { start: 8200, x: 1.03, y: 0.22, travelX: -0.39, travelY: 0.13, length: 0.14 },
    { start: 15300, x: 0.76, y: 0.08, travelX: -0.27, travelY: 0.19, length: 0.10 },
    { start: 24100, x: 0.95, y: 0.16, travelX: -0.36, travelY: 0.16, length: 0.13 },
    { start: 29900, x: 0.82, y: 0.27, travelX: -0.29, travelY: 0.12, length: 0.11 },
    { start: 37100, x: 1.05, y: 0.06, travelX: -0.41, travelY: 0.21, length: 0.15 }
  ];
}

function resize() {
  const pixelScale = Math.max(3, Math.min(4, Math.floor(window.innerWidth / 480)));
  scale = pixelScale;
  width = Math.max(120, Math.floor(window.innerWidth / pixelScale));
  height = Math.max(78, Math.floor(window.innerHeight / pixelScale));
  canvas.width = width;
  canvas.height = height;
  canvas.style.imageRendering = 'pixelated';
  stars = seededStars(Math.round((width * height) / 920));
  draw(performance.now());
  homeSignalState?.syncAnchors();
  updateHomeSignal(homeSignalState);
}

function drawMeteor(meteor, palette, progress) {
  const eased = 1 - (1 - progress) ** 3;
  const headX = (meteor.x + meteor.travelX * eased) * width;
  const headY = (meteor.y + meteor.travelY * eased) * height;
  const brightness = Math.sin(progress * Math.PI);
  const tailProgress = Math.min(progress * 2.6, 1, (1 - progress) * 2.6);

  for (let segment = 12; segment >= 0; segment -= 1) {
    const delayedProgress = Math.max(0, progress - (segment / 12) * 0.18 * tailProgress);
    const delayedEase = 1 - (1 - delayedProgress) ** 3;
    const trailX = (meteor.x + meteor.travelX * delayedEase) * width;
    const trailY = (meteor.y + meteor.travelY * delayedEase) * height;
    const opacity = brightness * (1 - segment / 15) ** 2;

    context.globalAlpha = opacity;
    context.fillStyle = segment === 0 ? '#fffdf5' : palette.accent;
    context.fillRect(Math.round(trailX), Math.round(trailY), segment < 2 ? 2 : 1, 1);
  }

  context.globalAlpha = brightness;
  context.fillStyle = '#fffdf5';
  context.fillRect(Math.round(headX), Math.round(headY), 2, 2);
  context.globalAlpha = 1;
}

function drawMeteors(palette, time) {
  if (reducedMotion.matches || activeChapter === 'home') return;

  const moment = time % meteorCycleDuration;
  for (const meteor of meteorSchedule) {
    const elapsed = moment - meteor.start;
    if (elapsed >= 0 && elapsed <= meteorDuration) drawMeteor(meteor, palette, elapsed / meteorDuration);
  }
}

function draw(time) {
  const palette = renderedPalette;
  context.fillStyle = palette.base;
  context.fillRect(0, 0, width, height);

  const starfieldDim = 1 - contactStarlightProgress * .62;
  for (const star of stars) {
    const subtlePulse = Math.sin(time * 0.001 * star.speed + star.phase) * 0.22;
    const brightPulse = star.twinkle ? Math.max(0, Math.sin(time * 0.0019 + star.phase)) ** 9 * 0.58 : 0;
    const light = reducedMotion.matches ? 0.58 : 0.28 + subtlePulse + brightPulse + star.depth * 0.08;
    const driftX = reducedMotion.matches ? star.x * width : (star.x * width + time * 0.0025 * star.speed * star.depth) % width;
    context.globalAlpha = Math.max(0.1, light) * starfieldDim;
    context.fillStyle = star.depth === 3 ? palette.accent : palette.star;
    const starSize = star.twinkle && light > 0.78 ? star.size + 1 : star.size;
    context.fillRect(Math.round(driftX), Math.round(star.y * height), starSize, starSize);
  }

  drawMeteors(palette, time);

  context.globalAlpha = 1;
  updateHomeSignalTrail(homeSignalState, time);
  if (!reducedMotion.matches) animationFrame = requestAnimationFrame(draw);
}

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;

  activeChapter = visible.target.dataset.chapter;
  visible.target.classList.add('is-revealed');
  document.body.dataset.activeChapter = activeChapter;
  navLinks.forEach((link) => link.setAttribute('aria-current', String(link.dataset.nav === activeChapter)));
}, { threshold: [0.42, 0.58, 0.74] });

sections.forEach((section) => observer.observe(section));
const homeScene = document.querySelector('[data-home-scene]');
if (homeScene) {
  const homeCanopySparkles = homeScene.querySelector('.home-canopy-sparkles');
  createSkyTwinkles(homeScene.querySelector('.home-sky-twinkles'), { count: 132, scale: 1.2, profile: 'hero' });
  createCanopySparkles(homeCanopySparkles, { count: 52, scale: 1.35 });
  applyCanopyPalette(homeCanopySparkles, 'gold');
}
const homeSignalState = initializeHomeSignal(homeScene, reducedMotion);
initializeTreeEasterEgg(reducedMotion);
startHomeSceneAnimation(reducedMotion);
initializeScrollMotion(sections, reducedMotion);
initializeContactStarlight(document.querySelector('#contact'), reducedMotion);

function updateScrollMeter() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  meter.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  updateHomeSignal(homeSignalState);
}

function mixHexColor(from, to, amount) {
  const fromValue = Number.parseInt(from.slice(1), 16);
  const toValue = Number.parseInt(to.slice(1), 16);
  const channel = (shift) => {
    const start = (fromValue >> shift) & 255;
    const end = (toValue >> shift) & 255;
    return Math.round(start + (end - start) * amount);
  };
  const mixed = (channel(16) << 16) | (channel(8) << 8) | channel(0);
  return `#${mixed.toString(16).padStart(6, '0')}`;
}

function blendChapterPalettes(measurements, viewportHeight) {
  const viewportCenter = viewportHeight * .5;
  const centers = measurements.map(({ rect }) => rect.top + rect.height * .5);
  let fromIndex = 0;

  for (let index = 1; index < centers.length; index += 1) {
    if (centers[index] > viewportCenter) break;
    fromIndex = index;
  }

  const toIndex = Math.min(fromIndex + 1, measurements.length - 1);
  const span = Math.max(1, centers[toIndex] - centers[fromIndex]);
  const mix = fromIndex === toIndex ? 0 : Math.min(1, Math.max(0, (viewportCenter - centers[fromIndex]) / span));
  const easedMix = mix * mix * (3 - 2 * mix);
  const fromPalette = palettes[measurements[fromIndex].chapter.dataset.chapter];
  const toPalette = palettes[measurements[toIndex].chapter.dataset.chapter];

  renderedPalette = Object.fromEntries(
    Object.keys(fromPalette).map((key) => [key, mixHexColor(fromPalette[key], toPalette[key], easedMix)])
  );
  document.body.style.setProperty('--gold', renderedPalette.gold);
  document.body.style.setProperty('--blue', renderedPalette.blue);
}

function initializeScrollMotion(chapters, motionPreference) {
  let renderFrame = 0;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const setLength = (chapter, property, value) => chapter.style.setProperty(property, `${value.toFixed(2)}px`);
  const render = () => {
    renderFrame = 0;
    if (motionPreference.matches) return;

    const viewportHeight = window.innerHeight;
    const amplitude = window.innerWidth <= 720 ? .52 : 1;
    const measurements = chapters.map((chapter) => ({
      chapter,
      rect: chapter.getBoundingClientRect()
    }));
    blendChapterPalettes(measurements, viewportHeight);

    measurements.forEach(({ chapter, rect }) => {
      const centerOffset = rect.top + rect.height * .5 - viewportHeight * .5;
      const travelRange = Math.max(viewportHeight, rect.height) * .72;
      const shift = clamp(centerOffset / travelRange, -1, 1);
      const focus = 1 - Math.abs(shift);
      const opacity = .28 + focus * .72;

      setLength(chapter, '--motion-copy-y', shift * 46 * amplitude);
      setLength(chapter, '--motion-visual-x', shift * -62 * amplitude);
      setLength(chapter, '--motion-visual-y', shift * 18 * amplitude);
      setLength(chapter, '--motion-front-x', shift * -28 * amplitude);
      setLength(chapter, '--motion-back-x', shift * 18 * amplitude);
      chapter.style.setProperty('--motion-visual-scale', (.935 + focus * .065).toFixed(4));
      chapter.style.setProperty('--motion-opacity', opacity.toFixed(4));

      if (chapter.dataset.chapter === 'home') {
        const progress = clamp(-rect.top / Math.max(1, rect.height * .72), 0, 1);
        setLength(chapter, '--motion-home-copy-x', progress * -46 * amplitude);
        setLength(chapter, '--motion-home-copy-y', progress * -22 * amplitude);
        setLength(chapter, '--motion-home-enter-y', progress * -14 * amplitude);
        setLength(chapter, '--motion-home-sky-y', progress * -16 * amplitude);
        chapter.style.setProperty('--motion-home-copy-opacity', clamp(1 - progress * 1.18, 0, 1).toFixed(4));
        chapter.style.setProperty('--motion-home-enter-opacity', clamp(1 - progress * 1.55, 0, 1).toFixed(4));
      }
    });
  };
  const requestRender = () => {
    if (renderFrame || motionPreference.matches) return;
    renderFrame = window.requestAnimationFrame(render);
  };
  const handleMotionPreference = () => {
    if (motionPreference.matches) {
      window.cancelAnimationFrame(renderFrame);
      renderFrame = 0;
      return;
    }
    requestRender();
  };

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  motionPreference.addEventListener('change', handleMotionPreference);
  requestRender();
}

function initializeContactStarlight(contact, motionPreference) {
  const field = document.querySelector('.contact-starlight-field');
  const contactNavLink = document.querySelector('[data-nav="contact"]');
  const links = [...(contact?.querySelectorAll('.contact-links a') ?? [])];
  if (!contact || !field || links.length === 0) return;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const navigationDuration = 1800;
  const particles = Array.from({ length: 24 }, (_, particleIndex) => {
    const element = document.createElement('span');
    const isAnchor = particleIndex % 8 === 0;
    element.className = `contact-starlight-particle${isAnchor ? ' is-anchor' : ''}`;
    field.append(element);
    return { element, particleIndex, isAnchor };
  });
  let renderFrame = 0;
  let navigationStart = 0;

  const getStartPoint = (particleIndex) => {
    const edge = Math.floor(particleIndex / 6);
    const edgeIndex = particleIndex % 6;
    const edgeProgress = (edgeIndex + 1) / 7;
    if (edge === 0) return { x: window.innerWidth * edgeProgress, y: window.innerHeight * .08 };
    if (edge === 1) return { x: window.innerWidth * .94, y: window.innerHeight * edgeProgress };
    if (edge === 2) return { x: window.innerWidth * (1 - edgeProgress), y: window.innerHeight * .92 };
    return { x: window.innerWidth * .06, y: window.innerHeight * (1 - edgeProgress) };
  };

  const render = (frameTime) => {
    renderFrame = 0;
    if (motionPreference.matches) {
      navigationStart = 0;
      contactStarlightProgress = 0;
      field.classList.remove('is-active', 'is-settled');
      contact.style.setProperty('--contact-arrival', '0');
      particles.forEach(({ element }) => element.style.setProperty('--starlight-opacity', '0'));
      return;
    }

    const contactRect = contact.getBoundingClientRect();
    const scrollProgress = clamp((window.innerHeight * 1.12 - contactRect.top) / (window.innerHeight * 1.12), 0, 1);
    const navigationProgress = clamp((frameTime - navigationStart) / navigationDuration, 0, 1);
    const progress = navigationStart > 0 ? navigationProgress : scrollProgress;
    const easedProgress = progress * progress * (3 - 2 * progress);
    const fadeOut = clamp((progress - .78) / .22, 0, 1);
    contactStarlightProgress = progress;
    field.classList.toggle('is-active', progress > .01);
    field.classList.toggle('is-settled', progress > .97);
    contact.style.setProperty('--contact-arrival', clamp((progress - .58) / .42, 0, 1).toFixed(3));

    const linkRects = links.map((link) => link.getBoundingClientRect());
    particles.forEach(({ element, particleIndex, isAnchor }) => {
      const start = getStartPoint(particleIndex);
      const linkRect = linkRects[particleIndex % linkRects.length];
      const anchorAngle = ((particleIndex % 8) / 8) * Math.PI * 2;
      const target = {
        x: linkRect.left + linkRect.width * .5 + Math.cos(anchorAngle) * linkRect.width * .43,
        y: linkRect.top + linkRect.height * .5 + Math.sin(anchorAngle) * linkRect.height * .4
      };
      const direction = particleIndex % 2 === 0 ? 1 : -1;
      const control = {
        x: (start.x + target.x) * .5 + direction * (54 + (particleIndex % 5) * 12),
        y: (start.y + target.y) * .5 - 68 + (particleIndex % 4) * 17
      };
      const inverse = 1 - easedProgress;
      const x = inverse ** 2 * start.x + 2 * inverse * easedProgress * control.x + easedProgress ** 2 * target.x;
      const y = inverse ** 2 * start.y + 2 * inverse * easedProgress * control.y + easedProgress ** 2 * target.y;
      const opacity = isAnchor ? clamp(progress * 1.45, 0, 1) : clamp(progress * 1.65, 0, 1) * (1 - fadeOut);
      const scaleValue = .62 + easedProgress * (isAnchor ? .72 : .42);

      element.style.setProperty('--starlight-opacity', opacity.toFixed(3));
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scaleValue.toFixed(3)})`;
    });

    if (navigationStart > 0 && navigationProgress < 1) {
      renderFrame = window.requestAnimationFrame(render);
    } else if (navigationStart > 0) {
      navigationStart = 0;
    }
  };
  const requestRender = () => {
    if (renderFrame) return;
    renderFrame = window.requestAnimationFrame(render);
  };
  const startNavigationSequence = () => {
    if (motionPreference.matches) return;
    navigationStart = window.performance.now();
    contactStarlightProgress = 0;
    requestRender();
  };
  const stopNavigationSequence = () => {
    if (navigationStart === 0) return;
    navigationStart = 0;
    requestRender();
  };
  const handleMotionPreference = () => {
    if (motionPreference.matches) {
      window.cancelAnimationFrame(renderFrame);
      renderFrame = 0;
      navigationStart = 0;
    }
    requestRender();
  };

  contactNavLink?.addEventListener('click', startNavigationSequence);
  navLinks.filter((link) => link !== contactNavLink).forEach((link) => link.addEventListener('click', stopNavigationSequence));
  window.addEventListener('wheel', stopNavigationSequence, { passive: true });
  window.addEventListener('touchstart', stopNavigationSequence, { passive: true });
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  motionPreference.addEventListener('change', handleMotionPreference);
  requestRender();
}

function initializeHomeSignal(scene, motionPreference) {
  const home = document.querySelector('#home');
  const homeSignal = home?.querySelector('.home-signal-firefly');
  const homeSignalTrail = home?.querySelector('.home-signal-trail');
  const tree = scene?.querySelector('.home-scene-tree-wrap');
  const saber = scene?.querySelector('.home-scene-saber');
  const enter = home?.querySelector('.enter-cv');
  if (!home || !homeSignal || !homeSignalTrail || !tree || !saber || !enter) return null;

  const trailPixels = Array.from({ length: 12 }, (_, trailIndex) => {
    const pixel = document.createElement('span');
    pixel.className = 'home-signal-trail-pixel';
    pixel.dataset.trailIndex = String(trailIndex);
    homeSignalTrail.append(pixel);
    return pixel;
  });
  const state = {
    home,
    homeSignal,
    homeSignalTrail,
    motionPreference,
    trailPixels,
    trailHistory: [],
    trailLife: 780,
    trailSpacing: 3,
    lastTrailPoint: null,
    nextTrailPixel: 0,
    saberPoint: { x: 0, y: 0 },
    enterPoint: { x: 0, y: 0 },
    syncAnchors: null
  };

  state.syncAnchors = () => {
    const homeRect = home.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();
    const saberRect = saber.getBoundingClientRect();
    const enterRect = enter.getBoundingClientRect();
    const relativePoint = (rect, xRatio, yRatio) => ({
      x: rect.left - homeRect.left + rect.width * xRatio,
      y: rect.top - homeRect.top + rect.height * yRatio
    });
    const canopyPoint = relativePoint(treeRect, .582, .096);

    state.saberPoint = relativePoint(saberRect, .475, .105);
    state.enterPoint = {
      x: enterRect.right - homeRect.left - 8,
      y: enterRect.top - homeRect.top + enterRect.height * .5
    };
    const fallPath = `M ${canopyPoint.x} ${canopyPoint.y} L ${state.saberPoint.x} ${state.saberPoint.y}`;

    homeSignal.style.setProperty('--signal-fall-path', `path("${fallPath}")`);
  };

  state.syncAnchors();
  return state;
}

function updateHomeSignalTrail(state, time) {
  if (!state || state.motionPreference.matches) return;
  const { home, homeSignal } = state;
  const signalStyle = getComputedStyle(homeSignal);
  const signalOpacity = Number.parseFloat(signalStyle.opacity);

  if (signalOpacity <= .08) {
    state.trailHistory = [];
    state.lastTrailPoint = null;
    state.trailPixels.forEach((pixel) => { pixel.style.opacity = '0'; });
    return;
  }

  const homeRect = home.getBoundingClientRect();
  const signalRect = homeSignal.getBoundingClientRect();
  const x = signalRect.left - homeRect.left + signalRect.width * .5;
  const y = signalRect.top - homeRect.top + signalRect.height * .5;
  const movedDistance = state.lastTrailPoint
    ? Math.hypot(x - state.lastTrailPoint.x, y - state.lastTrailPoint.y)
    : Infinity;

  if (!state.lastTrailPoint) {
    state.lastTrailPoint = { x, y, time };
  } else if (movedDistance >= state.trailSpacing) {
    const sampleCount = Math.min(state.trailPixels.length, Math.max(1, Math.floor(movedDistance / state.trailSpacing)));
    const elapsed = Math.max(1, time - state.lastTrailPoint.time);

    for (let step = 1; step <= sampleCount; step += 1) {
      const sampleProgress = step / sampleCount;
      const sampleX = state.lastTrailPoint.x + (x - state.lastTrailPoint.x) * sampleProgress;
      const sampleY = state.lastTrailPoint.y + (y - state.lastTrailPoint.y) * sampleProgress;
      const born = state.lastTrailPoint.time + elapsed * sampleProgress;
      const pixel = state.trailPixels[state.nextTrailPixel % state.trailPixels.length];
      state.nextTrailPixel += 1;
      state.trailHistory = state.trailHistory.filter((trailPoint) => trailPoint.pixel !== pixel);
      state.trailHistory.unshift({ x: sampleX, y: sampleY, born, pixel });
    }
    state.lastTrailPoint = { x, y, time };
  }

  const activePixels = new Set();
  state.trailHistory = state.trailHistory.filter((trailPoint, trailIndex) => {
    const age = Math.max(0, time - trailPoint.born);
    const temporalFade = Math.max(0, 1 - age / state.trailLife);
    if (temporalFade <= 0) {
      trailPoint.pixel.style.opacity = '0';
      return false;
    }

    const spatialFade = (1 - trailIndex / state.trailPixels.length) ** 1.4;
    const opacity = signalOpacity * temporalFade ** 1.35 * spatialFade;
    trailPoint.pixel.style.transform = `translate3d(${Math.round(trailPoint.x)}px, ${Math.round(trailPoint.y)}px, 0)`;
    trailPoint.pixel.style.opacity = opacity.toFixed(3);
    activePixels.add(trailPoint.pixel);
    return true;
  });
  state.trailPixels.forEach((pixel) => {
    if (!activePixels.has(pixel)) pixel.style.opacity = '0';
  });
}

function updateHomeSignal(state) {
  if (!state) return;
  const { home, homeSignal, motionPreference, saberPoint, enterPoint } = state;
  const travelDistance = Math.max(1, Math.min(home.offsetHeight * .42, window.innerHeight * .56));
  const progress = Math.min(1, Math.max(0, window.scrollY / travelDistance));
  const isHandoff = !motionPreference.matches && progress > .015 && window.scrollY < home.offsetHeight;

  homeSignal.classList.toggle('is-handoff', isHandoff);
  home.classList.toggle('is-signal-handoff', isHandoff);

  if (!isHandoff) {
    homeSignal.style.removeProperty('opacity');
    homeSignal.style.removeProperty('transform');
    return;
  }

  const control = {
    x: (saberPoint.x + enterPoint.x) * .5,
    y: Math.min(saberPoint.y, enterPoint.y) - Math.min(96, window.innerHeight * .11)
  };
  const inverse = 1 - progress;
  const x = inverse ** 2 * saberPoint.x + 2 * inverse * progress * control.x + progress ** 2 * enterPoint.x;
  const y = inverse ** 2 * saberPoint.y + 2 * inverse * progress * control.y + progress ** 2 * enterPoint.y;
  const opacity = progress < .86 ? 1 : Math.max(0, (1 - progress) / .14);

  homeSignal.style.opacity = opacity.toFixed(3);
  homeSignal.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(.72 + Math.sin(progress * Math.PI) * .34).toFixed(3)})`;
}

function updateParallax(event) {
  if (reducedMotion.matches || window.innerWidth < 721) return;
  const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
  const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
  document.documentElement.style.setProperty('--pointer-x', x);
  document.documentElement.style.setProperty('--pointer-y', y);
}

function initializeProjectDrawer() {
  const layers = [...document.querySelectorAll('[data-project-layer]')];

  layers.forEach((layer) => {
    const dialog = layer.querySelector('[role="dialog"]');
    if (!dialog) return;

    const openButtons = [...document.querySelectorAll(`[aria-controls="${dialog.id}"]`)];
    const closeButtons = [...layer.querySelectorAll('[data-project-close]')];
    const backgroundElements = [...document.body.children].filter((element) => element !== layer);
    let returnFocus = null;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const openDrawer = (trigger) => {
      returnFocus = trigger;
      layer.classList.add('is-open');
      layer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-project-open');
      backgroundElements.forEach((element) => { element.inert = true; });
      window.requestAnimationFrame(() => {
        dialog.focus({ preventScroll: true });
        dialog.scrollTop = 0;
      });
    };

    const closeDrawer = () => {
      if (!layer.classList.contains('is-open')) return;
      layer.classList.remove('is-open');
      layer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-project-open');
      backgroundElements.forEach((element) => { element.inert = false; });
      returnFocus?.focus();
    };

    openButtons.forEach((button) => {
      button.addEventListener('click', () => openDrawer(button));
    });
    closeButtons.forEach((button) => {
      button.addEventListener('click', closeDrawer);
    });

    layer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [...dialog.querySelectorAll(focusableSelector)];
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });
}

reducedMotion.addEventListener('change', () => {
  cancelAnimationFrame(animationFrame);
  draw(performance.now());
});

window.addEventListener('resize', resize, { passive: true });
window.addEventListener('scroll', updateScrollMeter, { passive: true });
window.addEventListener('pointermove', updateParallax, { passive: true });

initializeProjectDrawer();
resize();
updateScrollMeter();
}

function initializeSceneStudio(studio) {
  const stage = studio.querySelector('[data-scene-stage]');
  const inputs = [...studio.querySelectorAll('[data-scene-control]')];
  const status = studio.querySelector('[data-scene-status]');
  const canopySparkles = studio.querySelector('.studio-canopy-sparkles');
  const storageKey = 'zhengji-scene-studio-night-v4';
  const sceneStudioConfig = {
    'tree-x': 22.8,
    'tree-y': 18.6,
    'tree-scale': 0.75,
    'tree-layer': 1,
    'canopy-palette': 'gold',
    'saber-x': 62.1,
    'saber-y': 68,
    'saber-scale': 0.48,
    'saber-brightness': 0.68,
    'saber-night-light': 0.47,
    'saber-layer': 3,
    'foundation-y': 4.8,
    'foundation-width': 1.02,
    'foundation-scale': 0.89,
    'foundation-layer': 1,
    'ground-x': 9.3,
    'ground-y': -5.2,
    'ground-scale': 0.65,
    'ground-layer': 5,
    'wind-frame-duration': 260
  };
  const properties = {
    'tree-x': '--tree-x',
    'tree-y': '--tree-y',
    'tree-scale': '--tree-scale',
    'tree-layer': '--tree-layer',
    'saber-x': '--saber-x',
    'saber-y': '--saber-y',
    'saber-scale': '--saber-scale',
    'saber-brightness': '--saber-brightness',
    'saber-night-light': '--saber-night-light',
    'saber-layer': '--saber-layer',
    'foundation-y': '--foundation-y',
    'foundation-width': '--foundation-width',
    'foundation-scale': '--foundation-scale',
    'foundation-layer': '--foundation-layer',
    'ground-x': '--ground-x',
    'ground-y': '--ground-y',
    'ground-scale': '--ground-scale',
    'ground-layer': '--ground-layer'
  };

  studio.querySelectorAll('[data-studio-src]').forEach((image) => {
    image.src = image.dataset.studioSrc;
  });
  createSkyTwinkles(studio.querySelector('.studio-sky-twinkles'), { count: 60 });
  createCanopySparkles(canopySparkles, { count: 52 });
  document.body.classList.add('is-scene-studio');
  studio.hidden = false;

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    Object.keys(sceneStudioConfig).forEach((key) => {
      if (key === 'canopy-palette' && ['gold', 'ice', 'jade'].includes(saved?.[key])) sceneStudioConfig[key] = saved[key];
      if (key !== 'canopy-palette' && Number.isFinite(saved?.[key])) sceneStudioConfig[key] = saved[key];
    });
  } catch {
    // A private browser window can reject storage; the editor remains usable for this visit.
  }

  const formatValue = (key, value) => {
    if (key === 'canopy-palette') return value;
    if (key === 'wind-frame-duration') return `${Math.round(value)}ms`;
    if (key.endsWith('layer')) return `z${value}`;
    if (key.endsWith('scale') || key === 'foundation-width') return `${value.toFixed(2)}×`;
    if (key === 'saber-brightness' || key === 'saber-night-light') return `${Math.round(value * 100)}%`;
    return `${value.toFixed(1)}%`;
  };

  const renderSceneStudio = () => {
    inputs.forEach((input) => {
      const key = input.dataset.sceneControl;
      const value = sceneStudioConfig[key];
      input.value = String(value);
      const isUnitless = key.endsWith('layer') || key.endsWith('scale') || key === 'foundation-width' || key === 'saber-brightness' || key === 'saber-night-light';
      if (properties[key]) stage.style.setProperty(properties[key], isUnitless ? value : `${value}%`);
      const output = studio.querySelector(`[data-scene-value="${key}"]`);
      if (output) output.textContent = formatValue(key, value);
    });
    applyCanopyPalette(canopySparkles, sceneStudioConfig['canopy-palette']);
  };

  const restartSceneStudioAnimation = startSceneStudioAnimation(studio, sceneStudioConfig);

  const saveSceneStudio = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(sceneStudioConfig));
    } catch {
      // Saving is an enhancement; rendering and copying still work without it.
    }
  };

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.sceneControl;
      sceneStudioConfig[key] = key === 'canopy-palette' ? input.value : Number(input.value);
      renderSceneStudio();
      saveSceneStudio();
      if (key === 'wind-frame-duration') restartSceneStudioAnimation();
      status.textContent = 'Draft saved in this browser.';
    });
  });

  studio.querySelector('[data-scene-action="reset"]').addEventListener('click', () => {
    Object.assign(sceneStudioConfig, {
      'tree-x': 22.8,
      'tree-y': 18.6,
      'tree-scale': 0.75,
      'tree-layer': 1,
      'canopy-palette': 'gold',
      'saber-x': 62.1,
      'saber-y': 68,
      'saber-scale': 0.48,
      'saber-brightness': 0.68,
      'saber-night-light': 0.47,
      'saber-layer': 3,
      'foundation-y': 4.8,
      'foundation-width': 1.02,
      'foundation-scale': 0.89,
      'foundation-layer': 1,
      'ground-x': 9.3,
      'ground-y': -5.2,
      'ground-scale': 0.65,
      'ground-layer': 5,
      'wind-frame-duration': 260
    });
    renderSceneStudio();
    restartSceneStudioAnimation();
    saveSceneStudio();
    status.textContent = 'Draft restored to the composed night scene.';
  });

  studio.querySelector('[data-scene-action="copy"]').addEventListener('click', async () => {
    const serializedConfig = JSON.stringify(sceneStudioConfig, null, 2);
    try {
      await navigator.clipboard.writeText(serializedConfig);
      status.textContent = 'Configuration copied. Send it to me and I will apply it to the homepage.';
    } catch {
      window.prompt('Copy this Scene Studio configuration:', serializedConfig);
      status.textContent = 'Copy the configuration from the dialog, then send it to me.';
    }
  });

  renderSceneStudio();
}

function startSceneStudioAnimation(studio, config) {
  const frames = {
    'tree-sway': [
      'assets/pixel/home/tree-sway-v1-00.png',
      'assets/pixel/home/tree-sway-v1-01.png',
      'assets/pixel/home/tree-sway-v1-02.png',
      'assets/pixel/home/tree-sway-v1-03.png'
    ],
    'meadow-sway': [
      'assets/pixel/home/meadow-sway-v2-00.png',
      'assets/pixel/home/meadow-sway-v2-01.png',
      'assets/pixel/home/meadow-sway-v2-02.png'
    ]
  };
  const animatedImages = [...studio.querySelectorAll('[data-studio-animation]')];
  const saberImages = animatedImages.filter((image) => image.dataset.studioAnimation === 'saber-idle');
  const saberEyes = [...studio.querySelectorAll('[data-saber-eye-layer]')];
  const layers = animatedImages.filter((image) => image.dataset.studioAnimation !== 'saber-idle').map((image) => ({ image, frames: frames[image.dataset.studioAnimation] }));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frameIndex = 0;
  let timer = 0;

  const render = () => {
    layers.forEach((layer) => {
      if (!layer.frames) return;
      const frame = layer.frames[frameIndex % layer.frames.length];
      layer.image.src = frame;
    });
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (motionPreference.matches) return;
    timer = window.setTimeout(() => {
      frameIndex += 1;
      render();
      schedule();
    }, config['wind-frame-duration']);
  };
  const restart = () => {
    frameIndex = 0;
    render();
    schedule();
  };

  motionPreference.addEventListener('change', restart);
  startSaberAnimation(saberImages, saberEyes, motionPreference, config['wind-frame-duration']);
  restart();
  return restart;
}

function createCanopySparkles(container, { count = 38, scale = 1 } = {}) {
  if (!container || container.childElementCount) return;

  const goldenSpots = new Set([1, 4, 7, 11, 15, 20, 26, 31, 34]);
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt(((index * 17) % 37 + 1) / 38);
    const x = 68 + Math.cos(angle) * 31 * radius;
    const y = 35 + Math.sin(angle) * 29 * radius;
    const sparkle = document.createElement('span');

    sparkle.className = 'canopy-sparkle';
    sparkle.style.left = `${x.toFixed(2)}%`;
    sparkle.style.top = `${y.toFixed(2)}%`;
    const size = index % 6 === 0 ? 7 : index % 3 === 0 ? 5 : 3;
    sparkle.style.setProperty('--sparkle-size', `${Math.round(size * scale)}px`);
    sparkle.dataset.sparkleIndex = String(index);
    sparkle.dataset.sparkleGold = String(goldenSpots.has(index));
    sparkle.style.setProperty('--sparkle-duration', `${3.2 + (index % 7) * 0.43}s`);
    sparkle.style.animationDelay = `${-(index * 0.37).toFixed(2)}s`;
    container.append(sparkle);
  }
}

function applyCanopyPalette(container, palette) {
  if (!container) return;
  const palettes = {
    gold: ['#ffdc76', '#f1b951'],
    ice: ['#e4f3ff', '#92bfff'],
    jade: ['#c6efae', '#62c6a7']
  };
  const colors = palettes[palette] ?? palettes.gold;

  container.querySelectorAll('.canopy-sparkle').forEach((sparkle) => {
    const index = Number(sparkle.dataset.sparkleIndex);
    sparkle.style.setProperty('--sparkle-color', colors[index % colors.length]);
  });
}

function createSkyTwinkles(container, { count = 42, scale = 1, profile = 'ambient' } = {}) {
  if (!container || container.childElementCount) return;

  const heroBaseCount = 84;
  const galaxyTones = [
    ...Array(24).fill('blue'),
    ...Array(17).fill('white'),
    ...Array(6).fill('gold'),
    'red'
  ];
  const galaxyColors = {
    blue: ['#78a8ff', '#a4c8ff'],
    white: ['#f7fbff', '#dceaff'],
    gold: ['#f2d58c'],
    red: ['#df858c']
  };

  for (let index = 0; index < count; index += 1) {
    const sparkle = document.createElement('span');
    const isHero = profile === 'hero';
    const isGalaxy = isHero && index >= heroBaseCount;
    const galaxyIndex = index - heroBaseCount;
    const galaxyToneName = isGalaxy ? galaxyTones[(galaxyIndex * 13) % galaxyTones.length] : '';
    const galaxyToneColors = isGalaxy ? galaxyColors[galaxyToneName] : [];
    const galaxyTone = isGalaxy
      ? { name: galaxyToneName, color: galaxyToneColors[(galaxyIndex * 7) % galaxyToneColors.length] }
      : null;
    const cycle = isHero ? index % 10 : index % 20;
    const tier = isGalaxy
      ? (galaxyIndex % 13 === 0 ? 'flare' : 'breathe')
      : isHero
      ? (cycle === 0 ? 'flare' : 'breathe')
      : (cycle === 0 ? 'flare' : cycle < 4 ? 'breathe' : 'quiet');
    sparkle.className = `sky-twinkle sky-twinkle--${tier}${isGalaxy ? ` sky-twinkle--galaxy sky-twinkle--tone-${galaxyTone.name}` : ''}`;

    if (isGalaxy) {
      const galaxyProgress = ((galaxyIndex * 29) % 48) / 47;
      const galaxyCenterY = 64 - galaxyProgress * 52;
      const galaxyJitterX = (((galaxyIndex * 11) % 9) - 4) * .65;
      const galaxyJitterY = ((galaxyIndex * 7) % 17) - 8;
      sparkle.style.left = `${Math.min(96, Math.max(2, 7 + galaxyProgress * 86 + galaxyJitterX)).toFixed(2)}%`;
      sparkle.style.top = `${Math.min(74, Math.max(6, galaxyCenterY + galaxyJitterY)).toFixed(2)}%`;
    } else {
      sparkle.style.left = `${((index * 41) % 947) / 9.47}%`;
      sparkle.style.top = `${8 + ((index * 67) % 697) / 10}%`;
    }

    const size = isGalaxy ? (galaxyIndex % 12 === 0 ? 4 : 2) : (index % 8 === 0 ? 6 : 3);
    sparkle.style.setProperty('--twinkle-size', `${Math.round(size * scale)}px`);
    sparkle.style.setProperty('--twinkle-opacity', `${(isGalaxy ? .13 + (galaxyIndex % 4) * .025 : .11 + (index % 5) * .025).toFixed(3)}`);
    sparkle.style.setProperty('--twinkle-color', isGalaxy ? galaxyTone.color : index % 5 === 0 ? '#f5df9a' : '#c7ddff');
    const duration = isGalaxy ? 4.4 + (galaxyIndex % 7) * .63 : isHero ? 2.8 + (index % 6) * .55 : 5.1 + (index % 8) * .91;
    sparkle.style.setProperty('--twinkle-duration', `${duration}s`);
    sparkle.style.animationDelay = `${-(index * (isGalaxy ? .41 : isHero ? .31 : .47)).toFixed(2)}s`;
    container.append(sparkle);
  }
}
