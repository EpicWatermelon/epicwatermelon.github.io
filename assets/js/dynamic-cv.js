const sceneStudio = document.querySelector('#scene-studio');
const searchParams = new URLSearchParams(window.location.search);
const isDayTheme = document.documentElement.dataset.sceneTheme === 'day';
const isDayAirPreview = isDayTheme && searchParams.get('qa') === 'day-air';
const isLocalStudioPreview = ['127.0.0.1', 'localhost', '[::1]'].includes(window.location.hostname) || window.location.protocol === 'file:';
const isDaySceneStudio = Boolean(sceneStudio && isLocalStudioPreview && searchParams.get('studio') === 'day');
const isSceneStudioMode = Boolean(sceneStudio && isLocalStudioPreview && (searchParams.get('studio') === '1' || searchParams.get('studio') === 'day'));
const dayWindFrameDuration = 180;
const nightWindFrameDuration = 240;
const nightTreeWindFrames = Array.from(
  { length: 8 },
  (_, index) => `assets/pixel/home/tree-sway-v2-${String(index).padStart(2, '0')}.png`
);
const dayStudioTreeWindAssets = Object.freeze({
  underfill: 'assets/pixel/home/tree-day-pixel-wind-v2-underfill.png',
  back: 'assets/pixel/home/tree-day-pixel-wind-v2-back.png',
  fixed: 'assets/pixel/home/tree-day-pixel-wind-v2-fixed.png',
  front: 'assets/pixel/home/tree-day-pixel-wind-v2-front.png'
});
const homeDayTreeWindConfig = Object.freeze({
  bandHeight: 4,
  maxAmplitude: 6,
  cycleSeconds: 3
});
const dayStudioTreeWindCanopyBottom = 700;
const dayStudioTreeWindFrameInterval = 1000 / 12;
const dayStudioTreeWindSeamGuard = 1;
const dayStudioGroundWindAsset = 'assets/pixel/home/meadow-day-v1.png';
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
const homeWindFrameDuration = isDayTheme ? dayWindFrameDuration : nightWindFrameDuration;

const palettes = isDayTheme ? {
  home: { base: '#9fbea0', haze: '#7fa68b', leaf: '#355e43', star: '#355e43', accent: '#745820', gold: '#745820', blue: '#286d5b' },
  bio: { base: '#a8c8a3', haze: '#82ad8e', leaf: '#355e43', star: '#355e43', accent: '#745820', gold: '#745820', blue: '#326d58' },
  education: { base: '#aebf91', haze: '#8ea273', leaf: '#48613a', star: '#48613a', accent: '#647b3f', gold: '#3d2458', blue: '#23366a' },
  ophthalmic: { base: '#98c3a6', haze: '#75a387', leaf: '#315f43', star: '#315f43', accent: '#276c50', gold: '#063b4b', blue: '#06432e' },
  industrial: { base: '#91b8a4', haze: '#70998a', leaf: '#35594e', star: '#35594e', accent: '#30695d', gold: '#4a2d05', blue: '#0a3e4c' },
  contact: { base: '#a5bd93', haze: '#819f79', leaf: '#3f5f37', star: '#3f5f37', accent: '#5a7040', gold: '#4a2e06', blue: '#38265e' }
} : {
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
let leaves = [];
let scale = 1;
let width = 0;
let height = 0;
let animationFrame = 0;
const meteorDuration = 1050;
const meteorCycleDuration = 42000;
const meteorSchedule = createMeteorSchedule();
const backgroundFleetFlightDuration = 9600;
const backgroundFleetEntryChance = .45;
const backgroundFleetDelay = () => 24000 + Math.random() * 36000;
const backgroundFleet = [
  { src: 'assets/pixel/background/hyperion-background-fleet-v4.png', image: new Image(), width: 48, height: 37, startY: -.16, endY: 1.04 },
  { src: 'assets/pixel/background/lunar-cruiser-background-fleet-v1.png', image: new Image(), width: 52, height: 24, startY: .66, endY: .66 }
];
const backgroundFleetState = {
  active: null,
  startedAt: 0,
  nextAppearanceAt: Infinity
};

backgroundFleet.forEach((ship) => {
  ship.image.src = ship.src;
});

function startHomeSceneAnimation(motionPreference) {
  const frames = {
    'tree-sway': [
      ...nightTreeWindFrames
    ],
    'meadow-sway': [
      'assets/pixel/home/meadow-sway-v2-00.png',
      'assets/pixel/home/meadow-sway-v2-01.png',
      'assets/pixel/home/meadow-sway-v2-02.png'
    ],
    'day-meadow-sway': Array.from({ length: 8 }, (_, index) => `assets/pixel/home/meadow-day-wind-v7-${String(index).padStart(2, '0')}.png`)
  };
  const visibleThemeClass = isDayTheme ? 'home-scene-day-only' : 'home-scene-night-only';
  const animatedImages = [...document.querySelectorAll('[data-home-animation]')]
    .filter((image) => image.closest(`.${visibleThemeClass}`));
  const saberImages = animatedImages.filter((image) => image.dataset.homeAnimation === 'saber-idle');
  const saberEyes = [...document.querySelectorAll('[data-saber-eye-layer]')];
  const layers = animatedImages.filter((image) => image.dataset.homeAnimation !== 'saber-idle').map((image) => ({ image, frames: frames[image.dataset.homeAnimation] }));
  let frameIndex = 0;
  let timer = 0;

  if (isDayTheme) startHomeDayTreeWind(motionPreference);
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
  const pressDropCounts = [1, 1, 2, 2, 3, 3, 4, 5, 7];
  const pressDropLifetime = 4200;
  const canopyDropZones = [
    { x: .43, y: .18, width: .14, height: .16 },
    { x: .56, y: .09, width: .17, height: .19 },
    { x: .71, y: .13, width: .15, height: .17 },
    { x: .82, y: .24, width: .1, height: .16 },
    { x: .6, y: .27, width: .14, height: .13 }
  ];
  const starPalette = [
    { core: '#fff8c7', outline: '#f1b951', glow: 'rgb(255 210 91 / 58%)', tail: 'rgb(255 225 138 / 76%)' },
    { core: '#fffdf2', outline: '#e8e1cf', glow: 'rgb(255 250 230 / 52%)', tail: 'rgb(255 252 238 / 72%)' },
    { core: '#ffe6a3', outline: '#e6ad4d', glow: 'rgb(255 205 99 / 54%)', tail: 'rgb(255 225 159 / 74%)' }
  ];
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
  const createTreePressFeedback = (stage, event) => {
    const feedback = document.createElement('span');
    const pressX = event.detail === 0 ? tree.clientWidth * .5 : event.offsetX;
    const pressY = event.detail === 0 ? tree.clientHeight * .34 : event.offsetY;

    feedback.className = 'tree-press-feedback';
    feedback.style.left = `${pressX}px`;
    feedback.style.top = `${pressY}px`;
    feedback.style.setProperty('--tree-press-scale', (0.64 + stage * .13).toFixed(2));
    feedback.dataset.treeStage = String(stage);
    tree.append(feedback);
    window.setTimeout(() => feedback.remove(), 680);
  };
  const summonPressDrops = (stage) => {
    const dropCount = pressDropCounts[stage - 1];
    if (!dropCount) return;

    const homeRect = home.getBoundingClientRect();
    const treeRect = treeScene.getBoundingClientRect();
    const pointInZone = (zone, xRatio, yRatio) => ({
      x: treeRect.left - homeRect.left + treeRect.width * (zone.x + zone.width * xRatio),
      y: treeRect.top - homeRect.top + treeRect.height * (zone.y + zone.height * yRatio)
    });
    const stars = Array.from({ length: dropCount }, (_, index) => {
      const star = document.createElement('span');
      const color = starPalette[(stage * 2 + index) % starPalette.length];
      const dropZone = canopyDropZones[Math.floor(Math.random() * canopyDropZones.length)];
      const startPoint = pointInZone(dropZone, Math.random(), Math.random());
      const stageLane = (Math.random() - .5) * (54 + stage * 4);
      const minimumFallDistance = 260 + stage * 18;
      const endPoint = {
        x: startPoint.x + stageLane,
        y: Math.min(homeRect.height - 18, startPoint.y + minimumFallDistance + Math.random() * 110)
      };
      const fallPath = `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
      const fallDuration = 2100 + stage * 65 + Math.round(Math.random() * 620);

      star.className = 'fluorescent-rain-star fluorescent-rain-star--press';
      star.style.setProperty('--star-fall-path', `path("${fallPath}")`);
      star.style.setProperty('--star-core', color.core);
      star.style.setProperty('--star-outline', color.outline);
      star.style.setProperty('--star-glow', color.glow);
      star.style.setProperty('--star-tail', color.tail);
      star.style.setProperty('--star-duration', `${fallDuration}ms`);
      star.style.setProperty('--star-delay', `${index * 48}ms`);
      return star;
    });

    rain.append(...stars);
    rain.classList.add('is-active');
    window.setTimeout(() => {
      stars.forEach((star) => star.remove());
      if (!rain.childElementCount) rain.classList.remove('is-active');
    }, pressDropLifetime);
  };
  const summonRain = () => {
    window.clearTimeout(rainTimer);
    const homeRect = home.getBoundingClientRect();
    const treeRect = treeScene.getBoundingClientRect();
    const saberRect = saber.getBoundingClientRect();
    const saberPoint = {
      x: saberRect.left - homeRect.left + saberRect.width * .475,
      y: saberRect.top - homeRect.top + saberRect.height * .105
    };
    const starColorOrder = [0, 0, 0, 1, 0, 2, 0, 0, 1, 0];
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

    rain.append(...stars);
    rain.classList.add('is-active');
    say('Fluorescent rain.', '荧光雨降临。');
    rainTimer = window.setTimeout(clearRain, rainDuration);
  };
  const registerPress = (event) => {
    if (motionPreference.matches) {
      say('Fluorescent rain is disabled when reduced motion is enabled.', '减少动态效果已启用，荧光雨已关闭。');
      return;
    }

    presses += 1;
    window.clearTimeout(resetTimer);
    tree.dataset.treeStage = String(presses);
    createTreePressFeedback(presses, event);

    if (presses >= clicksToTrigger) {
      resetPresses();
      summonRain();
      return;
    }
    summonPressDrops(presses);
    resetTimer = window.setTimeout(resetPresses, resetDelay);
  };

  tree.addEventListener('click', registerPress);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) clearRain();
  });
}

function initializeSaberThemeEasterEgg() {
  const home = document.querySelector('#home');
  const saber = home?.querySelector('.home-scene-saber');
  const trigger = home?.querySelector('[data-saber-theme-trigger]');
  const audio = home?.querySelector('[data-saber-theme]');
  const status = home?.querySelector('[data-saber-theme-status]');
  if (!home || !saber || !trigger || !audio || !status) return;

  const clicksToUnlock = 5;
  const pressFeedbackDurations = [0, 260, 300, 340, 560, 820];
  const statusDuration = 3600;
  let presses = 0;
  let unlocked = false;
  let statusTimer = 0;
  let pressTimer = 0;
  let resizeFrame = 0;

  audio.volume = .45;

  const localized = (english, chinese) => (
    document.documentElement.lang.startsWith('zh') ? chinese : english
  );
  const showStatus = (english, chinese, persistent = false) => {
    window.clearTimeout(statusTimer);
    status.textContent = localized(english, chinese);
    status.classList.add('is-visible');
    if (!persistent) {
      statusTimer = window.setTimeout(() => status.classList.remove('is-visible'), statusDuration);
    }
  };
  const syncTriggerBounds = () => {
    const homeRect = home.getBoundingClientRect();
    const saberRect = saber.getBoundingClientRect();
    trigger.style.left = `${saberRect.left - homeRect.left}px`;
    trigger.style.top = `${saberRect.top - homeRect.top}px`;
    trigger.style.width = `${saberRect.width}px`;
    trigger.style.height = `${saberRect.height}px`;
    status.style.left = `${saberRect.left - homeRect.left + saberRect.width * .5}px`;
    status.style.top = `${saberRect.top - homeRect.top + saberRect.height * .12}px`;
  };
  const scheduleBoundsSync = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(syncTriggerBounds);
  };
  const syncPlaybackState = () => {
    trigger.setAttribute('aria-pressed', String(!audio.paused));
    trigger.classList.toggle('is-playing', !audio.paused);
    trigger.setAttribute('aria-label', audio.paused
      ? localized('Saber — play her theme', 'Saber——播放她的主题曲')
      : localized('Saber — pause her theme', 'Saber——暂停她的主题曲'));
  };
  const pauseTheme = () => {
    if (!audio.paused) audio.pause();
    syncPlaybackState();
  };
  const playTheme = async () => {
    if (audio.ended) audio.currentTime = 0;
    try {
      await audio.play();
      syncPlaybackState();
      showStatus('Now playing · 孤独な巡礼', '正在播放 · 孤独な巡礼');
    } catch {
      syncPlaybackState();
      showStatus('Tap Saber once more to play', '再点一次 Saber 开始播放', true);
    }
  };
  const handlePress = async () => {
    const pressLevel = unlocked ? clicksToUnlock : Math.min(clicksToUnlock, presses + 1);
    trigger.dataset.themeStage = String(pressLevel);
    window.clearTimeout(pressTimer);
    trigger.classList.remove('is-pressed');
    void trigger.offsetWidth;
    trigger.classList.add('is-pressed');
    pressTimer = window.setTimeout(() => trigger.classList.remove('is-pressed'), pressFeedbackDurations[pressLevel]);

    if (!unlocked) {
      presses += 1;
      trigger.dataset.pressCount = String(presses);
      trigger.setAttribute('aria-label', localized(
        `Saber — ${clicksToUnlock - presses} presses until the hidden melody`,
        `Saber——再点 ${clicksToUnlock - presses} 次唤醒隐藏旋律`
      ));
      if (presses < clicksToUnlock) return;

      unlocked = true;
      trigger.dataset.unlocked = 'true';
      await playTheme();
      return;
    }

    if (audio.paused) {
      await playTheme();
      return;
    }
    audio.pause();
    syncPlaybackState();
    showStatus('Theme paused · tap Saber to continue', '主题曲已暂停 · 点击 Saber 继续');
  };
  const handleThemeVisibility = () => {
    if (document.hidden) pauseTheme();
  };
  const handleThemeEnded = () => {
    syncPlaybackState();
    showStatus('The melody has faded · tap Saber to replay', '旋律已落幕 · 点击 Saber 再次播放');
  };

  trigger.addEventListener('click', handlePress);
  audio.addEventListener('ended', handleThemeEnded);
  document.addEventListener('visibilitychange', handleThemeVisibility);
  window.addEventListener('pagehide', pauseTheme);
  window.addEventListener('resize', scheduleBoundsSync, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleBoundsSync).observe(saber);
  syncPlaybackState();
  scheduleBoundsSync();
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

function seededLeaves(count) {
  return Array.from({ length: count }, (_, index) => ({
    x: (index * 71 % 997) / 997,
    y: (index * 113 % 991) / 991,
    depth: 1 + index % 3,
    speed: .55 + (index % 7) * .08,
    phase: (index % 19) / 19 * Math.PI * 2
  }));
}

function createHomeDayLeaves(container, count = 24) {
  if (!container || container.childElementCount) return;

  for (let index = 0; index < count; index += 1) {
    const leaf = document.createElement('span');
    leaf.className = 'home-day-leaf';
    leaf.style.setProperty('--leaf-x', `${(8 + (index * 37 % 86)).toFixed(1)}%`);
    leaf.style.setProperty('--leaf-y', `${(6 + (index * 53 % 72)).toFixed(1)}%`);
    leaf.style.setProperty('--leaf-opacity', `${(.18 + (index % 5) * .06).toFixed(2)}`);
    leaf.style.setProperty('--leaf-duration', `${(9 + (index % 7) * 1.1).toFixed(1)}s`);
    leaf.style.setProperty('--leaf-delay', `${(-(index * .83)).toFixed(2)}s`);
    container.append(leaf);
  }
}

function createHomeDayAir(container, motionPreference) {
  if (!container) return;

  const canopyLeaves = [
    { x: '54%', y: '24%', dx: 'clamp(116px, 15vw, 230px)', dy: 'clamp(112px, 17vh, 198px)', duration: '8.8s', delay: '-1.4s', color: '#e4d89d' },
    { x: '59%', y: '28%', dx: 'clamp(98px, 14vw, 206px)', dy: 'clamp(130px, 19vh, 220px)', duration: '9.6s', delay: '-4.2s', color: '#b7cf7a' },
    { x: '66%', y: '35%', dx: 'clamp(84px, 12vw, 178px)', dy: 'clamp(104px, 16vh, 188px)', duration: '8.2s', delay: '-6.6s', color: '#f1e9c1' },
    { x: '47%', y: '31%', dx: 'clamp(128px, 18vw, 260px)', dy: 'clamp(126px, 20vh, 232px)', duration: '10.2s', delay: '-2.8s', color: '#d6c982' },
    { x: '72%', y: '27%', dx: 'clamp(76px, 11vw, 170px)', dy: 'clamp(118px, 18vh, 206px)', duration: '9.2s', delay: '-5.5s', color: '#d9dc9e' },
    { x: '78%', y: '38%', dx: 'clamp(70px, 10vw, 154px)', dy: 'clamp(112px, 17vh, 198px)', duration: '8.6s', delay: '-7.8s', color: '#c6d88a' }
  ];

  const buildParticle = (className, config) => {
    const particle = document.createElement('span');
    particle.className = className;
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'color') {
        particle.style.setProperty('--air-color', value);
      } else {
        particle.style.setProperty(`--air-${key}`, value);
      }
    });
    return particle;
  };

  const build = () => {
    container.replaceChildren();
    if (motionPreference.matches) return;
    Array.from({ length: 6 }, (_, index) => canopyLeaves[index]).forEach((config) => {
      container.append(
        buildParticle('home-day-air-trace', config),
        buildParticle('home-day-air-leaf', config)
      );
    });
  };

  motionPreference.addEventListener('change', build);
  build();
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
  context.imageSmoothingEnabled = false;
  stars = seededStars(Math.round((width * height) / 920));
  leaves = seededLeaves(Math.round((width * height) / 1450));
  draw(performance.now());
  homeSignalState?.syncAnchors();
  updateHomeSignal(homeSignalState);
}

function drawDayLeaves(palette, time) {
  context.fillStyle = palette.leaf;

  for (const leaf of leaves) {
    const drift = reducedMotion.matches ? 0 : time * .000006 * leaf.speed;
    const sway = reducedMotion.matches ? 0 : Math.sin(time * .00035 + leaf.phase) * 3;
    const x = ((leaf.x + drift) % 1) * width + sway;
    const y = ((leaf.y + drift * .46) % 1) * height;
    const pulse = reducedMotion.matches ? .42 : .28 + Math.sin(time * .00042 + leaf.phase) * .09;
    const opacity = Math.max(.14, pulse + leaf.depth * .07);
    const pixelX = Math.round(x);
    const pixelY = Math.round(y);
    const orientation = (leaf.depth + Math.floor(drift * 12)) % 4;

    context.globalAlpha = opacity;
    if (orientation === 0) {
      context.fillRect(pixelX, pixelY, 2, 1);
      context.fillRect(pixelX + 1, pixelY - 1, 1, 1);
    } else if (orientation === 1) {
      context.fillRect(pixelX, pixelY, 1, 2);
      context.fillRect(pixelX + 1, pixelY, 1, 1);
    } else if (orientation === 2) {
      context.fillRect(pixelX - 1, pixelY, 2, 1);
      context.fillRect(pixelX - 1, pixelY + 1, 1, 1);
    } else {
      context.fillRect(pixelX, pixelY - 1, 1, 2);
      context.fillRect(pixelX - 1, pixelY - 1, 1, 1);
    }
  }

  context.globalAlpha = 1;
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
  if (isDayTheme || reducedMotion.matches || activeChapter === 'home') return;

  const moment = time % meteorCycleDuration;
  for (const meteor of meteorSchedule) {
    const elapsed = moment - meteor.start;
    if (elapsed >= 0 && elapsed <= meteorDuration) drawMeteor(meteor, palette, elapsed / meteorDuration);
  }
}

function resetBackgroundFleet(time) {
  backgroundFleetState.active = null;
  backgroundFleetState.startedAt = 0;
  backgroundFleetState.nextAppearanceAt = Math.random() < backgroundFleetEntryChance ? time + 6000 + Math.random() * 12000 : Infinity;
}

function drawBackgroundFleet(time) {
  if (isDayTheme || reducedMotion.matches || activeChapter === 'home') return;

  if (!backgroundFleetState.active && time >= backgroundFleetState.nextAppearanceAt) {
    backgroundFleetState.active = backgroundFleet[Math.floor(Math.random() * backgroundFleet.length)];
    backgroundFleetState.startedAt = time;
  }

  const ship = backgroundFleetState.active;
  if (!ship) return;

  const progress = Math.min(1, (time - backgroundFleetState.startedAt) / backgroundFleetFlightDuration);
  const drawWidth = ship.width;
  const drawHeight = ship.height;
  const x = -drawWidth + (width + drawWidth * 2) * progress;
  const y = Math.round((ship.startY + (ship.endY - ship.startY) * progress) * height);

  if (ship.image.complete && ship.image.naturalWidth) {
    context.globalAlpha = Math.min(progress * 10, (1 - progress) * 10, 1) * .62;
    context.drawImage(ship.image, Math.round(x), y, drawWidth, drawHeight);
  }

  if (progress === 1) {
    backgroundFleetState.active = null;
    backgroundFleetState.nextAppearanceAt = time + backgroundFleetDelay();
  }
}

function draw(time) {
  const palette = renderedPalette;
  context.fillStyle = palette.base;
  context.fillRect(0, 0, width, height);

  if (isDayTheme) {
    drawDayLeaves(palette, time);
  } else {
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
    drawBackgroundFleet(time);
  }

  context.globalAlpha = 1;
  updateHomeSignalTrail(homeSignalState, time);
  if (!reducedMotion.matches) animationFrame = requestAnimationFrame(draw);
}

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;

  const nextChapter = visible.target.dataset.chapter;
  if (nextChapter !== 'home' && activeChapter === 'home') resetBackgroundFleet(performance.now());
  activeChapter = nextChapter;
  visible.target.classList.add('is-revealed');
  document.body.dataset.activeChapter = activeChapter;
  navLinks.forEach((link) => link.setAttribute('aria-current', String(link.dataset.nav === activeChapter)));
}, { threshold: [0.42, 0.58, 0.74] });

sections.forEach((section) => observer.observe(section));
const homeScene = document.querySelector('[data-home-scene]');
if (homeScene) {
  if (isDayTheme) {
    createHomeDayLeaves(homeScene.querySelector('.home-day-leaves'));
    if (isDayTheme && isDayAirPreview) {
      createHomeDayAir(homeScene.querySelector('.home-day-air'), reducedMotion);
    }
  } else {
    const homeCanopySparkles = homeScene.querySelector('.home-canopy-sparkles');
    createSkyTwinkles(homeScene.querySelector('.home-sky-twinkles'), { count: 132, scale: 1.2, profile: 'hero' });
    createCanopySparkles(homeCanopySparkles, { count: 52, scale: 1.35 });
    applyCanopyPalette(homeCanopySparkles, 'gold');
  }
}
const homeSignalState = isDayTheme ? null : initializeHomeSignal(homeScene, reducedMotion);
if (!isDayTheme) {
  initializeTreeEasterEgg(reducedMotion);
  initializeSaberThemeEasterEgg();
}
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

function createStudioTreeBandOffsets({ height, bandHeight, maxAmplitude, cycleSeconds, elapsedSeconds, canopyBottom }) {
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const safeHeight = Math.max(1, Math.floor(height));
  const safeBandHeight = clamp(Math.round(bandHeight), 2, 64);
  const safeAmplitude = clamp(Math.round(maxAmplitude), 0, 12);
  const safeCycle = Math.max(.25, Number(cycleSeconds));
  const safeCanopyBottom = clamp(Math.round(canopyBottom), 1, safeHeight);
  const wrappedTime = ((Number(elapsedSeconds) % safeCycle) + safeCycle) % safeCycle;
  const phase = wrappedTime / safeCycle * Math.PI * 2;
  const bands = [];
  let previousOffset = null;

  for (let sourceY = 0; sourceY < safeHeight; sourceY += safeBandHeight) {
    const sourceHeight = Math.min(safeBandHeight, safeHeight - sourceY);
    const centreY = sourceY + sourceHeight * .5;
    let targetOffset = 0;

    if (centreY < safeCanopyBottom && safeAmplitude > 0) {
      const heightWeight = Math.pow(1 - centreY / safeCanopyBottom, .72);
      const spatialPhase = centreY * .035;
      const primaryWave = Math.sin(phase);
      const secondaryWave = Math.sin(phase * 2 + spatialPhase) - Math.sin(spatialPhase);
      targetOffset = Math.round(safeAmplitude * heightWeight * (primaryWave * .84 + secondaryWave * .16));
      targetOffset = clamp(targetOffset, -safeAmplitude, safeAmplitude);
    }

    const offsetX = previousOffset === null
      ? targetOffset
      : clamp(targetOffset, previousOffset - 1, previousOffset + 1);
    bands.push({ sourceY, sourceHeight, offsetX });
    previousOffset = offsetX;
  }

  return bands;
}

function createStudioTreeLayerOffsets({ layer, ...settings }) {
  const motionScale = layer === 'back' ? .4 : 1;
  return createStudioTreeBandOffsets({
    ...settings,
    bandHeight: layer === 'back' ? Number(settings.bandHeight) * 2 : settings.bandHeight,
    maxAmplitude: Number(settings.maxAmplitude) * motionScale
  });
}

function createStudioTreeGuardedDrawRegions(bands, imageHeight) {
  return bands.map((band) => {
    const sourceY = Math.max(0, band.sourceY - dayStudioTreeWindSeamGuard);
    const sourceEnd = Math.min(imageHeight, band.sourceY + band.sourceHeight + dayStudioTreeWindSeamGuard);
    return {
      sourceY,
      sourceHeight: sourceEnd - sourceY,
      destinationY: sourceY,
      offsetX: band.offsetX
    };
  });
}

function drawStudioTreeStrips(context, image, bands, alpha = 1) {
  const imageHeight = image.naturalHeight || image.height;
  const imageWidth = image.naturalWidth || image.width;
  context.globalAlpha = alpha;
  for (const region of createStudioTreeGuardedDrawRegions(bands, imageHeight)) {
    context.drawImage(
      image,
      0,
      region.sourceY,
      imageWidth,
      region.sourceHeight,
      region.offsetX,
      region.destinationY,
      imageWidth,
      region.sourceHeight
    );
  }
  context.globalAlpha = 1;
}

function startHomeDayTreeWind(motionPreference) {
  const canvas = document.querySelector('[data-home-day-tree-wind]');
  if (!isDayTheme || !canvas) return;

  const context = canvas.getContext('2d', { alpha: true });
  const tree = canvas.closest('.home-scene-tree-wrap');
  const images = {};
  let isReady = false;
  let startedAt = performance.now();
  let lastPaintAt = -Infinity;
  let animationFrame = 0;

  const loadImage = (source) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error(`Unable to load ${source}`)), { once: true });
    image.src = source;
  });

  const render = (now) => {
    if (!isReady) return;
    const elapsedSeconds = motionPreference.matches ? 0 : (now - startedAt) / 1000;
    const settings = {
      height: canvas.height,
      bandHeight: homeDayTreeWindConfig.bandHeight,
      maxAmplitude: homeDayTreeWindConfig.maxAmplitude,
      cycleSeconds: homeDayTreeWindConfig.cycleSeconds,
      elapsedSeconds,
      canopyBottom: dayStudioTreeWindCanopyBottom
    };
    const backBands = createStudioTreeLayerOffsets({ ...settings, layer: 'back' });
    const frontBands = createStudioTreeLayerOffsets({ ...settings, layer: 'front' });

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.underfill, 0, 0);
    drawStudioTreeStrips(context, images.back, backBands);
    context.drawImage(images.fixed, 0, 0);
    drawStudioTreeStrips(context, images.front, frontBands);
  };

  const tick = (now) => {
    if (now - lastPaintAt >= dayStudioTreeWindFrameInterval) {
      render(now);
      lastPaintAt = now;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const restart = () => {
    startedAt = performance.now();
    lastPaintAt = -Infinity;
    window.cancelAnimationFrame(animationFrame);
    render(startedAt);
    if (!motionPreference.matches) animationFrame = window.requestAnimationFrame(tick);
  };

  Promise.all(Object.entries(dayStudioTreeWindAssets).map(async ([key, source]) => {
    images[key] = await loadImage(source);
  })).then(() => {
    canvas.width = images.fixed.naturalWidth;
    canvas.height = images.fixed.naturalHeight;
    context.imageSmoothingEnabled = false;
    isReady = true;
    canvas.hidden = false;
    tree?.classList.add('is-home-day-tree-wind-ready');
    restart();
  }).catch(() => {
    canvas.hidden = true;
    tree?.classList.remove('is-home-day-tree-wind-ready');
  });

  motionPreference.addEventListener('change', restart);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
}

function startDaySceneTreeWind(studio, config) {
  const canvas = studio.querySelector('[data-studio-day-tree-wind]');
  if (!canvas) return () => {};

  const context = canvas.getContext('2d', { alpha: true });
  const tree = canvas.closest('.studio-tree');
  const pauseButton = studio.querySelector('[data-scene-action="day-tree-toggle-pause"]');
  const status = studio.querySelector('[data-scene-status]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const images = {};
  const depthTints = {};
  let isReady = false;
  let isPaused = false;
  let startedAt = performance.now();
  let lastPaintAt = -Infinity;
  let animationFrame = 0;

  const loadImage = (source) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error(`Unable to load ${source}`)), { once: true });
    image.src = source;
  });

  const createDepthTint = (image, color) => {
    const tint = document.createElement('canvas');
    tint.width = image.naturalWidth;
    tint.height = image.naturalHeight;
    const tintContext = tint.getContext('2d', { alpha: true });
    tintContext.imageSmoothingEnabled = false;
    tintContext.drawImage(image, 0, 0);
    tintContext.globalCompositeOperation = 'source-in';
    tintContext.fillStyle = color;
    tintContext.fillRect(0, 0, tint.width, tint.height);
    tintContext.globalCompositeOperation = 'source-over';
    return tint;
  };

  const render = (now) => {
    if (!isReady) return;
    const stopped = motionPreference.matches || isPaused;
    const elapsedSeconds = stopped ? 0 : (now - startedAt) / 1000;
    const settings = {
      height: canvas.height,
      bandHeight: config['day-tree-band-height'],
      maxAmplitude: config['day-tree-amplitude'],
      cycleSeconds: config['day-tree-cycle-seconds'],
      elapsedSeconds,
      canopyBottom: dayStudioTreeWindCanopyBottom
    };
    const backBands = createStudioTreeLayerOffsets({ ...settings, layer: 'back' });
    const frontBands = createStudioTreeLayerOffsets({ ...settings, layer: 'front' });

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.underfill, 0, 0);
    drawStudioTreeStrips(context, images.back, backBands);
    context.drawImage(images.fixed, 0, 0);
    drawStudioTreeStrips(context, images.front, frontBands);
    if (config['day-tree-show-mask']) {
      drawStudioTreeStrips(context, depthTints.back, backBands, .52);
      context.globalAlpha = .42;
      context.drawImage(depthTints.fixed, 0, 0);
      context.globalAlpha = 1;
      drawStudioTreeStrips(context, depthTints.front, frontBands, .44);
    }
  };

  const tick = (now) => {
    if (!motionPreference.matches && !isPaused && now - lastPaintAt >= dayStudioTreeWindFrameInterval) {
      render(now);
      lastPaintAt = now;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const restart = () => {
    startedAt = performance.now();
    lastPaintAt = -Infinity;
    render(startedAt);
  };

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.textContent = isPaused ? 'Resume tree' : 'Pause tree';
    pauseButton.setAttribute('aria-pressed', String(isPaused));
  };

  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      isPaused = !isPaused;
      updatePauseButton();
      restart();
      if (status) status.textContent = isPaused ? 'Day tree animation paused.' : 'Day tree animation resumed.';
    });
  }

  Promise.all(Object.entries(dayStudioTreeWindAssets).map(async ([key, source]) => {
    images[key] = await loadImage(source);
  })).then(() => {
    canvas.width = images.fixed.naturalWidth;
    canvas.height = images.fixed.naturalHeight;
    context.imageSmoothingEnabled = false;
    depthTints.back = createDepthTint(images.back, '#42d7ff');
    depthTints.fixed = createDepthTint(images.fixed, '#ffad42');
    depthTints.front = createDepthTint(images.front, '#a7ff5b');
    isReady = true;
    canvas.hidden = false;
    restart();
    tree?.classList.add('is-day-tree-wind-ready');
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(tick);
  }).catch(() => {
    canvas.hidden = true;
    tree?.classList.remove('is-day-tree-wind-ready');
  });

  motionPreference.addEventListener('change', restart);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
  updatePauseButton();
  return restart;
}

function startDaySceneGroundWind(studio, config) {
  const canvas = studio.querySelector('[data-studio-day-ground-wind]');
  const stage = studio.querySelector('[data-scene-stage]');
  const dayGroundWind = window.dayGroundWind;
  if (!canvas || !stage || !dayGroundWind) return () => {};

  const context = canvas.getContext('2d', { alpha: true });
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const image = new Image();
  let isReady = false;
  let startedAt = performance.now();
  let lastPaintAt = -Infinity;
  let animationFrame = 0;

  const render = (now) => {
    if (!isReady) return;
    const elapsedSeconds = motionPreference.matches ? 0 : (now - startedAt) / 1000;
    const bands = window.dayGroundWind.createBandOffsets({
      height: canvas.height,
      bandHeight: config['day-tree-band-height'],
      maxAmplitude: config['day-tree-amplitude'],
      cycleSeconds: config['day-tree-cycle-seconds'],
      elapsedSeconds,
      topY: dayGroundWind.TOP_Y,
      anchorY: dayGroundWind.ANCHOR_Y,
      activeSpan: dayGroundWind.ACTIVE_SPAN
    });
    const regions = dayGroundWind.createGuardedDrawRegions(
      bands,
      dayGroundWind.TOP_Y,
      dayGroundWind.ANCHOR_Y,
      dayGroundWind.SEAM_GUARD
    );
    const imageWidth = image.naturalWidth;

    context.clearRect(0, 0, canvas.width, canvas.height);
    regions.forEach((region) => {
      context.drawImage(
        image,
        0,
        region.sourceY,
        imageWidth,
        region.sourceHeight,
        region.offsetX,
        region.destinationY,
        imageWidth,
        region.sourceHeight
      );
    });
    context.drawImage(
      image,
      0,
      dayGroundWind.ANCHOR_Y,
      imageWidth,
      canvas.height - dayGroundWind.ANCHOR_Y,
      0,
      dayGroundWind.ANCHOR_Y,
      imageWidth,
      canvas.height - dayGroundWind.ANCHOR_Y
    );
  };

  const tick = (now) => {
    if (now - lastPaintAt >= dayGroundWind.FRAME_INTERVAL) {
      render(now);
      lastPaintAt = now;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const restart = () => {
    startedAt = performance.now();
    lastPaintAt = -Infinity;
    render(startedAt);
  };

  image.decoding = 'async';
  image.addEventListener('load', () => {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.imageSmoothingEnabled = false;
    isReady = true;
    canvas.hidden = false;
    restart();
    stage.classList.add('is-day-ground-wind-ready');
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(tick);
  }, { once: true });
  image.addEventListener('error', () => {
    canvas.hidden = true;
    stage.classList.remove('is-day-ground-wind-ready');
  }, { once: true });
  image.src = dayStudioGroundWindAsset;

  motionPreference.addEventListener('change', restart);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
  return restart;
}

function prepareDaySceneStudio(studio) {
  const stage = studio.querySelector('[data-scene-stage]');
  const label = studio.querySelector('.studio-stage-label');

  studio.querySelectorAll('[data-studio-day-src]').forEach((image) => {
    image.src = image.dataset.studioDaySrc;
  });
  stage.setAttribute('aria-label', 'Combined daytime environmental study');
  label.textContent = 'day scene / environment study';
  document.body.classList.add('is-day-scene-studio');
}

function initializeSceneStudioModeSwitch(studio) {
  studio.querySelectorAll('[data-scene-mode]').forEach((button) => {
    const mode = button.dataset.sceneMode;
    button.setAttribute('aria-pressed', String((mode === 'day') === isDaySceneStudio));
    button.addEventListener('click', () => {
      if ((mode === 'day') === isDaySceneStudio) return;
      searchParams.set('studio', mode === 'day' ? 'day' : '1');
      window.location.assign(`${window.location.pathname}?${searchParams.toString()}${window.location.hash}`);
    });
  });
}

function initializeSceneStudio(studio) {
  const stage = studio.querySelector('[data-scene-stage]');
  const inputs = [...studio.querySelectorAll('[data-scene-control]')];
  const status = studio.querySelector('[data-scene-status]');
  const canopySparkles = studio.querySelector('.studio-canopy-sparkles');
  const storageKey = isDaySceneStudio ? 'zhengji-scene-studio-day-v5' : 'zhengji-scene-studio-night-v6';
  const sceneStudioWindDefaults = isDaySceneStudio
    ? {
        'day-tree-amplitude': 6,
        'day-tree-band-height': 4,
        'day-tree-cycle-seconds': 3,
        'day-tree-show-mask': false,
        'wind-frame-duration': dayWindFrameDuration
      }
    : {
        'day-tree-amplitude': 3,
        'day-tree-band-height': 8,
        'day-tree-cycle-seconds': 3.6,
        'day-tree-show-mask': false,
        'wind-frame-duration': nightWindFrameDuration
      };
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
    ...sceneStudioWindDefaults
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
  if (isDaySceneStudio) {
    prepareDaySceneStudio(studio);
  } else {
    createSkyTwinkles(studio.querySelector('.studio-sky-twinkles'), { count: 60 });
    createCanopySparkles(canopySparkles, { count: 52 });
  }
  document.body.classList.add('is-scene-studio');
  studio.hidden = false;
  initializeSceneStudioModeSwitch(studio);

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    Object.keys(sceneStudioConfig).forEach((key) => {
      if (key === 'canopy-palette' && ['gold', 'ice', 'jade'].includes(saved?.[key])) sceneStudioConfig[key] = saved[key];
      if (typeof sceneStudioConfig[key] === 'boolean' && typeof saved?.[key] === 'boolean') sceneStudioConfig[key] = saved[key];
      if (key !== 'canopy-palette' && typeof sceneStudioConfig[key] !== 'boolean' && Number.isFinite(saved?.[key])) sceneStudioConfig[key] = saved[key];
    });
  } catch {
    // A private browser window can reject storage; the editor remains usable for this visit.
  }

  const formatValue = (key, value) => {
    if (key === 'canopy-palette') return value;
    if (key === 'wind-frame-duration') return `${Math.round(value)}ms`;
    if (key === 'day-tree-amplitude' || key === 'day-tree-band-height') return `${Math.round(value)}px`;
    if (key === 'day-tree-cycle-seconds') return `${Number(value).toFixed(1)}s`;
    if (key.endsWith('layer')) return `z${value}`;
    if (key.endsWith('scale') || key === 'foundation-width') return `${value.toFixed(2)}×`;
    if (key === 'saber-brightness' || key === 'saber-night-light') return `${Math.round(value * 100)}%`;
    return `${value.toFixed(1)}%`;
  };

  const renderSceneStudio = () => {
    inputs.forEach((input) => {
      const key = input.dataset.sceneControl;
      const value = sceneStudioConfig[key];
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = String(value);
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
      sceneStudioConfig[key] = input.type === 'checkbox'
        ? input.checked
        : key === 'canopy-palette' ? input.value : Number(input.value);
      renderSceneStudio();
      saveSceneStudio();
      if (key === 'wind-frame-duration' || key.startsWith('day-tree-')) restartSceneStudioAnimation();
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
      ...sceneStudioWindDefaults
    });
    renderSceneStudio();
    restartSceneStudioAnimation();
    saveSceneStudio();
    status.textContent = 'Draft restored to the shared scene composition.';
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
  const nightFrames = {
    'tree-sway': [
      ...nightTreeWindFrames
    ],
    'meadow-sway': [
      'assets/pixel/home/meadow-sway-v2-00.png',
      'assets/pixel/home/meadow-sway-v2-01.png',
      'assets/pixel/home/meadow-sway-v2-02.png'
    ]
  };
  const frames = nightFrames;
  const animatedImages = [...studio.querySelectorAll('[data-studio-animation]')];
  const saberImages = animatedImages.filter((image) => image.dataset.studioAnimation === 'saber-idle');
  const saberEyes = [...studio.querySelectorAll('[data-saber-eye-layer]')];
  const layers = animatedImages
    .filter((image) => image.dataset.studioAnimation !== 'saber-idle')
    .filter((image) => !(isDaySceneStudio && ['tree-sway', 'meadow-sway'].includes(image.dataset.studioAnimation)))
    .map((image) => ({ image, frames: frames[image.dataset.studioAnimation] }));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const restartDayTreeWind = isDaySceneStudio ? startDaySceneTreeWind(studio, config) : () => {};
  const restartDayGroundWind = isDaySceneStudio ? startDaySceneGroundWind(studio, config) : () => {};
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
    restartDayTreeWind();
    restartDayGroundWind();
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
