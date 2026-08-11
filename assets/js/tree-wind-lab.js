const TAU = Math.PI * 2;

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const TREE_DEPTH_ORDER = Object.freeze(['back', 'fixed', 'front']);
export const TREE_DEPTH_MOTION = Object.freeze({ back: 0.4, fixed: 0, front: 1 });
export const STRIP_SEAM_GUARD = 1;

export function createBandOffsets({ height, bandHeight, maxAmplitude, cycleSeconds, elapsedSeconds, canopyBottom }) {
  const safeHeight = Math.max(1, Math.floor(height));
  const safeBandHeight = clamp(Math.round(bandHeight), 2, 64);
  const safeAmplitude = clamp(Math.round(maxAmplitude), 0, 12);
  const safeCycle = Math.max(0.25, Number(cycleSeconds));
  const safeCanopyBottom = clamp(Math.round(canopyBottom), 1, safeHeight);
  const wrappedTime = ((Number(elapsedSeconds) % safeCycle) + safeCycle) % safeCycle;
  const phase = wrappedTime / safeCycle * TAU;
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

export function createLayerOffsets({ layer, ...settings }) {
  const motionScale = TREE_DEPTH_MOTION[layer] ?? 0;
  const layerBandHeight = layer === 'back'
    ? Number(settings.bandHeight) * 2
    : settings.bandHeight;
  return createBandOffsets({
    ...settings,
    bandHeight: layerBandHeight,
    maxAmplitude: Number(settings.maxAmplitude) * motionScale
  });
}

export function createGuardedDrawRegions(bands, imageHeight, guard = STRIP_SEAM_GUARD) {
  const safeHeight = Math.max(1, Math.floor(imageHeight));
  const safeGuard = clamp(Math.round(guard), 0, 4);
  return bands.map((band) => {
    const sourceY = Math.max(0, band.sourceY - safeGuard);
    const sourceEnd = Math.min(safeHeight, band.sourceY + band.sourceHeight + safeGuard);
    return {
      sourceY,
      sourceHeight: sourceEnd - sourceY,
      destinationY: sourceY,
      offsetX: band.offsetX
    };
  });
}

const lab = typeof document === 'undefined' ? null : document.querySelector('[data-tree-wind-lab]');

if (lab) {
  const canvas = lab.querySelector('[data-tree-wind-canvas]');
  const context = canvas.getContext('2d', { alpha: true });
  const controls = {
    amplitude: lab.querySelector('[data-control="amplitude"]'),
    bandHeight: lab.querySelector('[data-control="band-height"]'),
    cycleSeconds: lab.querySelector('[data-control="cycle-seconds"]'),
    showMask: lab.querySelector('[data-control="show-mask"]')
  };
  const pauseButton = lab.querySelector('[data-action="toggle-pause"]');
  const status = lab.querySelector('[data-tree-wind-status]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const imageSources = {
    underfill: 'assets/pixel/home/tree-day-pixel-wind-v2-underfill.png',
    back: 'assets/pixel/home/tree-day-pixel-wind-v2-back.png',
    fixed: 'assets/pixel/home/tree-day-pixel-wind-v2-fixed.png',
    front: 'assets/pixel/home/tree-day-pixel-wind-v2-front.png'
  };
  const images = {};
  const depthTints = {};
  let isPaused = false;
  let startedAt = performance.now();
  let lastPaintAt = -Infinity;
  let animationFrame = 0;

  const loadImage = (source) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error(`无法加载 ${source}`)), { once: true });
    image.src = source;
  });

  const settings = () => ({
    height: canvas.height,
    bandHeight: Number(controls.bandHeight.value),
    maxAmplitude: Number(controls.amplitude.value),
    cycleSeconds: Number(controls.cycleSeconds.value),
    canopyBottom: 700
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

  const updateReadouts = () => {
    lab.querySelector('[data-value-for="amplitude"]').textContent = `${controls.amplitude.value}px`;
    lab.querySelector('[data-value-for="band-height"]').textContent = `${controls.bandHeight.value}px`;
    lab.querySelector('[data-value-for="cycle-seconds"]').textContent = `${Number(controls.cycleSeconds.value).toFixed(1)}s`;
  };

  const drawStrips = (image, bands, alpha = 1) => {
    context.globalAlpha = alpha;
    const imageHeight = image.naturalHeight || image.height || canvas.height;
    for (const region of createGuardedDrawRegions(bands, imageHeight)) {
      context.drawImage(
        image,
        0,
        region.sourceY,
        canvas.width,
        region.sourceHeight,
        region.offsetX,
        region.destinationY,
        canvas.width,
        region.sourceHeight
      );
    }
    context.globalAlpha = 1;
  };

  const render = (elapsedSeconds) => {
    const frameSettings = { ...settings(), elapsedSeconds };
    const backBands = createLayerOffsets({ ...frameSettings, layer: 'back' });
    const frontBands = createLayerOffsets({ ...frameSettings, layer: 'front' });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.underfill, 0, 0);
    drawStrips(images.back, backBands);
    context.drawImage(images.fixed, 0, 0);
    drawStrips(images.front, frontBands);
    if (controls.showMask.checked) {
      drawStrips(depthTints.back, backBands, .52);
      context.globalAlpha = .42;
      context.drawImage(depthTints.fixed, 0, 0);
      context.globalAlpha = 1;
      drawStrips(depthTints.front, frontBands, .44);
    }
  };

  const updateStatus = () => {
    const reduced = reduceMotion.matches;
    const stopped = reduced || isPaused;
    pauseButton.textContent = isPaused ? '继续' : '暂停';
    pauseButton.setAttribute('aria-pressed', String(isPaused));
    status.textContent = reduced
      ? '系统已启用减少动态，当前显示原始静止帧。'
      : stopped
        ? '动画已暂停。'
        : '后层叶片轻动，树干主枝固定，前层叶片保持上一版摆幅。';
  };

  const tick = (now) => {
    const stopped = reduceMotion.matches || isPaused;
    if (stopped) {
      render(0);
    } else if (now - lastPaintAt >= 125) {
      render((now - startedAt) / 1000);
      lastPaintAt = now;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const rerender = () => {
    updateReadouts();
    lastPaintAt = -Infinity;
    if (reduceMotion.matches || isPaused) render(0);
  };

  Object.values(controls).forEach((control) => control.addEventListener('input', rerender));
  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) startedAt = performance.now();
    updateStatus();
    rerender();
  });
  reduceMotion.addEventListener('change', () => {
    startedAt = performance.now();
    updateStatus();
    rerender();
  });
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });

  Promise.all(Object.entries(imageSources).map(async ([key, source]) => {
    images[key] = await loadImage(source);
  })).then(() => {
    canvas.width = images.fixed.naturalWidth;
    canvas.height = images.fixed.naturalHeight;
    context.imageSmoothingEnabled = false;
    depthTints.back = createDepthTint(images.back, '#42d7ff');
    depthTints.fixed = createDepthTint(images.fixed, '#ffad42');
    depthTints.front = createDepthTint(images.front, '#a7ff5b');
    updateReadouts();
    updateStatus();
    render(0);
    animationFrame = window.requestAnimationFrame(tick);
    lab.dataset.ready = 'true';
  }).catch((error) => {
    status.textContent = error.message;
    lab.dataset.ready = 'error';
  });
}
