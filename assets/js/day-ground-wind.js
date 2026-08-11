(function exposeDayGroundWind(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.dayGroundWind = api;
}(typeof globalThis === 'object' ? globalThis : this, () => {
  const TOP_Y = 680;
  const ANCHOR_Y = 842;
  const ACTIVE_SPAN = 142;
  const SEAM_GUARD = 1;
  const FRAME_INTERVAL = 1000 / 12;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  function createBandOffsets({
    height,
    bandHeight,
    maxAmplitude,
    cycleSeconds,
    elapsedSeconds,
    topY = TOP_Y,
    anchorY = ANCHOR_Y,
    activeSpan = ACTIVE_SPAN
  }) {
    const safeHeight = Math.max(1, Math.floor(height));
    const safeTop = clamp(Math.round(topY), 0, safeHeight - 1);
    const safeAnchor = clamp(Math.round(anchorY), safeTop + 1, safeHeight);
    const safeBandHeight = clamp(Math.round(bandHeight), 2, 64);
    const safeAmplitude = clamp(Math.round(maxAmplitude), 0, 12);
    const safeCycle = Math.max(.25, Number(cycleSeconds));
    const safeActiveSpan = Math.max(1, Number(activeSpan));
    const wrappedTime = ((Number(elapsedSeconds) % safeCycle) + safeCycle) % safeCycle;
    const phase = wrappedTime / safeCycle * Math.PI * 2;
    const bands = [];
    let previousOffset = null;

    for (let sourceY = safeTop; sourceY < safeAnchor; sourceY += safeBandHeight) {
      const sourceHeight = Math.min(safeBandHeight, safeAnchor - sourceY);
      const centreY = sourceY + sourceHeight * .5;
      const heightWeight = Math.pow(clamp((safeAnchor - centreY) / safeActiveSpan, 0, 1), .78);
      const spatialPhase = centreY * .035;
      const primaryWave = Math.sin(phase);
      const secondaryWave = Math.sin(phase * 2 + spatialPhase) - Math.sin(spatialPhase);
      const targetOffset = clamp(
        Math.round(safeAmplitude * heightWeight * (primaryWave * .84 + secondaryWave * .16)),
        -safeAmplitude,
        safeAmplitude
      );
      const offsetX = previousOffset === null
        ? targetOffset
        : clamp(targetOffset, previousOffset - 1, previousOffset + 1);

      bands.push({ sourceY, sourceHeight, offsetX });
      previousOffset = offsetX;
    }

    return bands;
  }

  function createGuardedDrawRegions(bands, topY = TOP_Y, anchorY = ANCHOR_Y, seamGuard = SEAM_GUARD) {
    const safeTop = Math.round(topY);
    const safeAnchor = Math.max(safeTop + 1, Math.round(anchorY));
    const safeGuard = clamp(Math.round(seamGuard), 0, 4);

    return bands.map((band) => {
      const sourceY = Math.max(safeTop, band.sourceY - safeGuard);
      const sourceEnd = Math.min(safeAnchor, band.sourceY + band.sourceHeight + safeGuard);
      return {
        sourceY,
        sourceHeight: sourceEnd - sourceY,
        destinationY: sourceY,
        offsetX: band.offsetX
      };
    });
  }

  return Object.freeze({
    TOP_Y,
    ANCHOR_Y,
    ACTIVE_SPAN,
    SEAM_GUARD,
    FRAME_INTERVAL,
    createBandOffsets,
    createGuardedDrawRegions
  });
}));
