import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFileSync(file(path), 'utf8');
const require = createRequire(import.meta.url);
const opaqueChromaPixels = `
from PIL import Image
import sys
image = Image.open(sys.argv[1]).convert('RGBA')
count = sum(1 for r, g, b, a in image.get_flattened_data() if a == 255 and r > 45 and b > 45 and r > g * 1.35 and b > g * 1.35)
print(count)
`;

const countOpaqueChromaPixels = (path) => Number(execFileSync('python', ['-c', opaqueChromaPixels, fileURLToPath(file(path))], { encoding: 'utf8' }).trim());

test('ships a six-chapter scroll portfolio shell', () => {
  assert.ok(existsSync(file('index.html')), 'index.html must exist');
  const html = read('index.html');

  for (const marker of ['id="pixel-cosmos"', 'data-chapter="home"', 'data-chapter="bio"', 'data-chapter="education"', 'data-chapter="ophthalmic"', 'data-chapter="industrial"', 'data-chapter="contact"']) {
    assert.match(html, new RegExp(marker));
  }
});

test('ships as a lean static GitHub Pages site without the legacy Jekyll template', () => {
  assert.ok(existsSync(file('.nojekyll')), 'GitHub Pages should publish this as a static site');

  for (const legacyPath of [
    '_config.yml',
    'Gemfile',
    '_data',
    '_drafts',
    '_includes',
    '_layouts',
    '_pages',
    '_portfolio',
    '_posts',
    '_publications',
    '_sass',
    '_talks',
    '_teaching',
    'files',
    'images',
    'markdown_generator',
    'talkmap',
    'talkmap.py',
    'talkmap.ipynb',
    'CONTRIBUTING.md',
  ]) {
    assert.equal(existsSync(file(legacyPath)), false, `${legacyPath} should not remain in the new site`);
  }
});

test('ignores local development worktrees from the publishable site', () => {
  assert.match(read('.gitignore'), /^\/\.worktrees\/$/m);
});

test('opens with the approved layered night scene before the CV profile', () => {
  const html = read('index.html');

  assert.match(html, /<section class="chapter chapter-home" id="home" data-chapter="home"/);
  assert.match(html, /class="home-visual home-visual-layered"/);
  assert.match(html, /assets\/pixel\/home\/sky-night-v1\.png/);
  assert.match(html, /assets\/pixel\/home\/ground-foundation-v6\.png/);
  assert.match(html, /assets\/pixel\/home\/tree-sway-v1-00\.png/);
  assert.match(html, /assets\/pixel\/home\/meadow-sway-v2-00\.png/);
  assert.match(html, /assets\/pixel\/home\/saber-idle-chunky-v2-00\.png/);
  assert.match(html, /<a href="#home" data-nav="home" data-mobile-label="Home"[^>]*><span class="chapter-nav-number">00<\/span> <span class="chapter-nav-label"[^>]*>Home<\/span><\/a>/);
});

test('rewards ten rapid tree presses with a slow canopy-star rain that occasionally lands on Saber', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /data-tree-easter-egg/);
  assert.match(html, /data-fluorescent-rain/);
  assert.match(html, /data-tree-easter-egg-status/);
  assert.match(script, /function initializeTreeEasterEgg\(motionPreference\)/);
  assert.match(script, /const clicksToTrigger = 10;/);
  assert.match(script, /const resetDelay = 1200;/);
  assert.match(script, /const treeScene = home\?\.querySelector\('\.home-scene-tree-wrap'\);/);
  assert.match(script, /const saber = home\?\.querySelector\('\.home-scene-saber'\);/);
  assert.match(script, /const treeRect = treeScene\.getBoundingClientRect\(\);/);
  assert.match(script, /const saberRect = saber\.getBoundingClientRect\(\);/);
  assert.match(script, /const canopyDropZones = \[/);
  assert.match(script, /const saberPoint = \{/);
  assert.match(script, /const starPalette = \[/);
  assert.match(script, /const starColorOrder = \[0, 0, 0, 0, 0, 1, 0, 2, 0, 3\];/);
  assert.match(script, /Array\.from\(\{ length: 24 \}, \(_, index\) =>/);
  assert.match(script, /const sourceProgress = \(index \* 37 % 101\) \/ 100;/);
  assert.match(script, /const dropZone = canopyDropZones\[\(index \* 3\) % canopyDropZones\.length\];/);
  assert.match(script, /const isSaberTarget = index % 11 === 0;/);
  assert.match(script, /const endPoint = isSaberTarget/);
  assert.match(script, /const fallDuration = 2400 \+ \(index \* 173 % 2200\);/);
  assert.match(script, /star\.style\.setProperty\('--star-duration', `\$\{fallDuration\}ms`\);/);
  assert.match(script, /star\.className = 'fluorescent-rain-star';/);
  assert.match(script, /star\.style\.setProperty\('--star-fall-path', `path\("\$\{fallPath\}"\)`\);/);
  assert.match(script, /star\.style\.setProperty\('--star-core', color\.core\);/);
  assert.match(script, /tree\.addEventListener\('click', registerPress\);/);
  assert.match(css, /\.home-tree-easter-egg \{[^}]*background:\s*transparent;/s);
  assert.match(css, /\.home-tree-easter-egg \{[^}]*cursor:\s*pointer;/s);
  assert.match(css, /\.home-fluorescent-rain\.is-active \{[^}]*opacity:\s*1;/s);
  assert.match(css, /\.fluorescent-rain-star \{[^}]*background:\s*var\(--star-core, #fff8c7\);/s);
  assert.match(css, /\.fluorescent-rain-star \{[^}]*offset-path:\s*var\(--star-fall-path\);/s);
  assert.match(css, /@keyframes fluorescent-star-fall[\s\S]*?offset-distance:\s*100%/);
  assert.doesNotMatch(css, /\.fluorescent-rain-drop/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.home-fluorescent-rain \{ display:\s*none;/);
});

test('provides a local-only Scene Studio for manually positioning the layered night hero', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of ['assets/pixel/home/sky-night-v1.png', 'assets/pixel/home/tree-sway-v1-00.png', 'assets/pixel/home/ground-foundation-v6.png', 'assets/pixel/home/meadow-sway-v2-00.png', 'assets/pixel/home/saber-idle-chunky-v2-00.png']) {
    assert.ok(existsSync(file(asset)), `${asset} must be available to the Scene Studio`);
  }

  assert.match(html, /id="scene-studio"/);
  assert.match(html, /tree-sway-v1-00\.png/);
  assert.match(html, /meadow-sway-v2-00\.png/);
  assert.match(html, /class="studio-layer studio-layer-ground-foundation"/);
  assert.match(html, /ground-foundation-v6\.png/);
  assert.match(html, /saber-idle-chunky-v2-00\.png/);
  assert.match(html, /class="studio-canopy-sparkles"/);
  assert.match(html, /value="22\.8" data-scene-control="tree-x"/);
  assert.match(html, /value="18\.6" data-scene-control="tree-y"/);
  assert.match(html, /value="0\.75" data-scene-control="tree-scale"/);
  assert.match(html, /value="62\.1" data-scene-control="saber-x"/);
  assert.match(html, /value="68" data-scene-control="saber-y"/);
  assert.match(html, /value="0\.48" data-scene-control="saber-scale"/);
  assert.match(html, /value="0\.68" data-scene-control="saber-brightness"/);
  assert.match(html, /value="0\.47" data-scene-control="saber-night-light"/);
  assert.match(html, /min="0\.5" max="1\.15" step="0\.01" value="0\.65" data-scene-control="ground-scale"/);
  assert.match(html, /value="-5\.2" data-scene-control="ground-y"/);
  assert.match(html, /value="9\.3" data-scene-control="ground-x"/);
  assert.match(html, /value="5" data-scene-control="ground-layer"/);
  assert.match(html, /value="4\.8" data-scene-control="foundation-y"/);
  assert.match(html, /value="0\.89" data-scene-control="foundation-scale"/);
  assert.match(html, /data-scene-control="foundation-scale"/);
  assert.match(html, /min="0\.75" max="2\.2" step="0\.01" value="1\.02" data-scene-control="foundation-width"/);
  assert.match(html, /value="1" data-scene-control="foundation-layer"/);
  assert.match(html, /data-scene-control="canopy-palette"/);
  assert.match(html, /data-scene-control="tree-x"/);
  assert.match(html, /data-scene-control="saber-scale"/);
  assert.match(html, /Size <input[^>]*data-scene-control="saber-scale"/);
  assert.match(html, /data-scene-control="saber-brightness"/);
  assert.match(html, /data-scene-control="saber-night-light"/);
  assert.match(html, /data-scene-action="copy"/);
  assert.match(css, /\.scene-studio\[hidden\]/);
  assert.match(css, /\.studio-layer-tree/);
  assert.match(css, /brightness\(var\(--saber-brightness\)\)/);
  assert.match(css, /\.studio-saber-night-light/);
  assert.match(css, /\.studio-layer-ground \{[^}]*filter:\s*brightness\(\.72\) saturate\(\.82\);/s);
  assert.match(css, /translate\(var\(--ground-x\), var\(--ground-y\)\)/);
  assert.match(css, /\.studio-layer-ground-foundation \{[^}]*z-index:\s*var\(--foundation-layer\);/s);
  assert.match(css, /scaleX\(var\(--foundation-width\)\) scaleY\(var\(--foundation-scale\)\)/);
  assert.match(css, /@keyframes canopy-sparkle/);
  assert.match(css, /@keyframes sky-twinkle/);
  assert.match(css, /@media \(max-width: 860px\) \{[\s\S]*?\.scene-studio \{[\s\S]*?grid-template-columns:\s*1fr;/);
  assert.match(script, /searchParams\.get\('studio'\) === '1'/);
  assert.match(script, /navigator\.clipboard\.writeText/);
  assert.match(script, /sceneStudioConfig/);
  assert.match(script, /function createSkyTwinkles/);
  assert.match(script, /function applyCanopyPalette/);
  assert.match(script, /'saber-night-light'/);
  assert.match(script, /function createCanopySparkles/);
  assert.match(script, /createSkyTwinkles\(studio\.querySelector\('\.studio-sky-twinkles'\), \{ count: 60 \}\)/);
  assert.match(script, /createCanopySparkles\(canopySparkles, \{ count: 52 \}\)/);
});

test('opens Scene Studio from a local file preview with clear depth controls', () => {
  const html = read('index.html');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /const isLocalStudioPreview = .*window\.location\.protocol === 'file:'/);
  assert.equal((html.match(/Depth \/ layer <input/g) ?? []).length, 4);
  for (const control of ['tree-layer', 'saber-layer', 'foundation-layer', 'ground-layer']) {
    assert.match(html, new RegExp(`data-scene-control="${control}"`));
  }
});

test('lets the local Scene Studio tune the night-wind animation speed', () => {
  const html = read('index.html');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of [
    'assets/pixel/home/tree-sway-v1-00.png',
    'assets/pixel/home/tree-sway-v1-01.png',
    'assets/pixel/home/tree-sway-v1-02.png',
    'assets/pixel/home/tree-sway-v1-03.png',
    'assets/pixel/home/meadow-sway-v2-00.png',
    'assets/pixel/home/meadow-sway-v2-01.png',
    'assets/pixel/home/meadow-sway-v2-02.png'
  ]) {
    assert.ok(existsSync(file(asset)), `${asset} must be available for the local night-wind preview`);
  }

  assert.match(html, /min="180" max="900" step="20" value="260" data-scene-control="wind-frame-duration"/);
  assert.match(html, /data-studio-animation="tree-sway"/);
  assert.match(html, /data-studio-animation="meadow-sway"/);
  assert.match(script, /function startSceneStudioAnimation/);
  assert.match(script, /'wind-frame-duration': 260/);
});

test('animates the Saber idle sequence in both night-scene previews', () => {
  const html = read('index.html');
  const script = read('assets/js/dynamic-cv.js');

  for (const frame of ['00', '01', '02', '03', '04', '05', '06', '07']) {
    assert.ok(existsSync(file(`assets/pixel/home/saber-idle-chunky-v2-${frame}.png`)), `Saber idle frame ${frame} must be available`);
  }

  assert.match(html, /class="studio-layer studio-layer-saber"[^>]*data-studio-animation="saber-idle"/);
  assert.match(html, /class="home-scene-layer home-scene-saber-figure"[^>]*data-home-animation="saber-idle"/);
  assert.match(script, /const saberIdleFrames = \[/);
  assert.match(script, /saber-idle-chunky-v2-07\.png/);
  assert.match(script, /function startSaberAnimation/);
  assert.match(script, /const blinkFrameDuration = 120/);
});

test('keeps Saber fixed while the blink plays through dedicated eye layers', () => {
  const html = read('index.html');
  const script = read('assets/js/dynamic-cv.js');

  for (const frame of ['open', 'half', 'closed']) {
    assert.ok(existsSync(file(`assets/pixel/home/saber-eyes-v2-${frame}.png`)), `Saber eye layer ${frame} must be available`);
  }

  assert.match(html, /class="[^"]*studio-layer-saber-eyes"[^>]*data-saber-eye-layer/);
  assert.match(html, /class="[^"]*home-scene-saber-eyes"[^>]*data-saber-eye-layer/);
  assert.match(script, /const saberEyeFrames = \{/);
  assert.match(script, /saber-eyes-v2-closed\.png/);
  assert.match(script, /function startSaberAnimation\(bodyImages, eyeImages,/);
  assert.match(script, /const maskFrameUrl = new URL\(frame, document\.baseURI\)\.href;/);
  assert.match(script, /style\.setProperty\('--saber-frame', `url\("\$\{maskFrameUrl\}"\)`\);/);
  assert.match(script, /idleFrameIndex = \(idleFrameIndex \+ 1\) % saberIdleFrames\.length/);
  assert.doesNotMatch(script, /'saber-blink': \[/);
  assert.ok(script.indexOf('function startSaberAnimation') < script.indexOf('if (isSceneStudioMode)'), 'the shared Saber animation must be available to Scene Studio before it initializes');
});

test('scales the approved night scene as one responsive composition on the public homepage', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="home-visual home-visual-layered"/);
  assert.match(html, /data-home-animation="tree-sway"/);
  assert.match(html, /data-home-animation="meadow-sway"/);
  assert.match(css, /\.home-scene-rig \{[^}]*aspect-ratio:\s*1672\s*\/\s*940;[^}]*--tree-x:\s*22\.8%;[^}]*--tree-y:\s*18\.6%;[^}]*--saber-x:\s*62\.1%;[^}]*--ground-x:\s*9\.3%;/s);
  assert.match(css, /\.home-scene-rig \{[^}]*--foundation-y:\s*4\.8%;[^}]*--foundation-width:\s*1\.02;[^}]*--wind-frame-duration:\s*260ms;/s);
  assert.match(css, /\.home-scene-rig \{[^}]*--home-focus-shift:[^;]+;[^}]*width:\s*max\(100%, calc\(100svh \* 1672 \/ 940\)\);/s);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.home-scene-rig \{[^}]*top:\s*50%;[^}]*bottom:\s*auto;/);
  assert.match(script, /function startHomeSceneAnimation/);
  assert.match(script, /const homeWindFrameDuration = 260;/);
});

test('brings the night-sky twinkles and canopy sparkles into the deployed homepage', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="home-sky-twinkles"/);
  assert.match(html, /class="home-canopy-sparkles"/);
  assert.match(css, /\.home-sky-twinkles/);
  assert.match(css, /\.home-canopy-sparkles/);
  assert.match(script, /createSkyTwinkles\(homeScene\.querySelector\('\.home-sky-twinkles'\), \{ count: 132, scale: 1\.2, profile: 'hero' \}\)/);
  assert.match(script, /createCanopySparkles\(homeCanopySparkles, \{ count: 52, scale: 1\.35 \}\)/);
  assert.match(script, /applyCanopyPalette\(homeCanopySparkles, 'gold'\)/);
});

test('separates quiet stars, breathing stars, and rare flares', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const tier of ['quiet', 'breathe', 'flare']) {
    assert.match(css, new RegExp(`\\.sky-twinkle--${tier}`));
  }
  assert.match(script, /sky-twinkle sky-twinkle--\$\{tier\}/);
  assert.match(css, /\.sky-twinkle--quiet \{[^}]*animation:\s*none;/s);
  assert.match(css, /\.sky-twinkle--breathe \{[^}]*animation:\s*sky-breathe/s);
  assert.match(css, /\.sky-twinkle--flare \{[^}]*animation:\s*sky-flare/s);
});

test('launches one meteor every five to ten seconds after the home chapter', () => {
  const script = read('assets/js/dynamic-cv.js');
  const meteorSchedule = script.match(/function createMeteorSchedule\(\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
  const starts = [...meteorSchedule.matchAll(/\{ start: (\d+)/g)].map((match) => Number(match[1]));
  const cycleDuration = Number(script.match(/const meteorCycleDuration = (\d+);/)?.[1] ?? 0);
  const intervals = starts.map((start, index) => {
    const next = starts[index + 1] ?? starts[0] + cycleDuration;
    return next - start;
  });

  assert.equal(starts.length, 6);
  assert.ok(intervals.every((interval) => interval >= 5000 && interval <= 10000));
  assert.match(script, /if \(reducedMotion\.matches \|\| activeChapter === 'home'\) return;/);
  assert.match(script, /const moment = time % meteorCycleDuration;/);
});

test('keeps the Bio background free of the detached horizon ornament', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.doesNotMatch(script, /function drawBioScene\(/);
  assert.doesNotMatch(script, /activeChapter === 'bio'\) drawBioScene/);
});

test('makes the 00 hero starfield visibly twinkle without changing later chapters', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /function createSkyTwinkles\(container, \{ count = 42, scale = 1, profile = 'ambient' \} = \{\}\)/);
  assert.match(script, /const isHero = profile === 'hero';/);
  assert.match(script, /isHero\s*\?\s*\(cycle === 0 \? 'flare' : 'breathe'\)/s);
  assert.doesNotMatch(script, /isHero[\s\S]{0,120}\?\s*\([^)]*'quiet'/);
  assert.match(script, /isHero \? 2\.8 \+ \(index % 6\) \* \.55 : 5\.1 \+ \(index % 8\) \* \.91/);
  assert.match(css, /\.home-sky-twinkles \.sky-twinkle--breathe \{[^}]*animation:\s*home-sky-breathe var\(--twinkle-duration\) steps\(4, end\) infinite;/s);
  assert.match(css, /\.home-sky-twinkles \.sky-twinkle--flare \{[^}]*animation:\s*home-sky-flare var\(--twinkle-duration\) steps\(4, end\) infinite;/s);
  assert.match(css, /@keyframes home-sky-breathe \{[\s\S]*?opacity:\s*\.82;/);
  assert.match(css, /@keyframes home-sky-flare \{[\s\S]*?opacity:\s*1;/);
  assert.doesNotMatch(css, /\.home-sky-twinkles \.sky-twinkle--(?:breathe|flare) \{[^}]*steps\(2/s);
});

test('densifies the Milky Way strip with forty-eight additional dynamic stars', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /const heroBaseCount = 84;/);
  assert.match(script, /const isGalaxy = isHero && index >= heroBaseCount;/);
  assert.match(script, /const galaxyIndex = index - heroBaseCount;/);
  assert.match(script, /const galaxyProgress = \(\(galaxyIndex \* 29\) % 48\) \/ 47;/);
  assert.match(script, /sparkle\.className = `sky-twinkle sky-twinkle--\$\{tier\}\$\{isGalaxy \? ` sky-twinkle--galaxy sky-twinkle--tone-\$\{galaxyTone\.name\}` : ''\}`;/);
  assert.match(script, /isGalaxy\s*\?\s*\(galaxyIndex % 13 === 0 \? 'flare' : 'breathe'\)/s);
  assert.match(script, /const galaxyCenterY = 64 - galaxyProgress \* 52;/);
});

test('colors Milky Way stars blue and white with restrained gold and one muted red', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /const galaxyTones = \[\s*\.\.\.Array\(24\)\.fill\('blue'\),\s*\.\.\.Array\(17\)\.fill\('white'\),\s*\.\.\.Array\(6\)\.fill\('gold'\),\s*'red'\s*\];/s);
  assert.match(script, /blue:\s*\['#78a8ff', '#a4c8ff'\]/);
  assert.match(script, /white:\s*\['#f7fbff', '#dceaff'\]/);
  assert.match(script, /gold:\s*\['#f2d58c'\]/);
  assert.match(script, /red:\s*\['#df858c'\]/);
  assert.match(script, /const galaxyToneName = isGalaxy \? galaxyTones\[\(galaxyIndex \* 13\) % galaxyTones\.length\] : '';/);
  assert.match(css, /\.home-sky-twinkles \.sky-twinkle--tone-red \{[^}]*brightness\(\.88\)[^}]*saturate\(\.76\);/s);
});

test('restores the denser independently twinkling canopy', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /function createCanopySparkles\(container, \{ count = 38, scale = 1 \} = \{\}\)/);
  assert.doesNotMatch(script, /lifeCycle|branchEndpoints|canopy-sparkle--life/);
  assert.match(css, /\.home-canopy-sparkles \.canopy-sparkle \{[^}]*filter:\s*brightness\(1\.28\);/s);
  assert.doesNotMatch(css, /\.canopy-sparkle--life|@keyframes canopy-life/);
  assert.doesNotMatch(css, /\.home-canopy-sparkles \.canopy-sparkle:nth-child/);
});

test('drops one pixel light on a straight path with a detached fading trail', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="home-signal-trail"[^>]*aria-hidden="true"/);
  assert.match(html, /class="home-signal-firefly"[^>]*aria-hidden="true"/);
  assert.match(css, /\.home-signal-firefly \{[^}]*width:\s*5px;[^}]*height:\s*5px;[^}]*border-radius:\s*0;[^}]*image-rendering:\s*pixelated;[^}]*offset-path:\s*var\(--signal-fall-path\);[^}]*offset-rotate:\s*0deg;/s);
  assert.match(css, /\.home-signal-trail \{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*pointer-events:\s*none;/s);
  assert.match(css, /\.home-signal-trail-pixel \{[^}]*position:\s*absolute;[^}]*width:\s*3px;[^}]*height:\s*3px;[^}]*background:\s*#ffe18a;[^}]*box-shadow:\s*0 0 6px 1px[^}]*image-rendering:\s*pixelated;/s);
  assert.doesNotMatch(css, /\.home-signal-firefly::before/);
  assert.doesNotMatch(css, /@keyframes home-signal-tail/);
  assert.match(css, /@keyframes home-signal-idle \{[\s\S]*?45% \{[^}]*offset-distance:\s*0%;[\s\S]*?86% \{[^}]*offset-distance:\s*100%;[\s\S]*?100% \{[^}]*opacity:\s*0;[^}]*offset-distance:\s*100%;/s);
  assert.doesNotMatch(css, /offset-distance:\s*98\.5%/);
  assert.match(css, /\.home-signal-firefly \{[^}]*animation:\s*home-signal-idle 12s linear infinite;/s);
  assert.match(css, /\.home-signal-firefly \{[^}]*transition:\s*transform 90ms linear, opacity 140ms ease-out;/s);
  assert.doesNotMatch(script, /fallAnchors|buildSmoothSignalPath/);
  assert.match(script, /const canopyPoint = relativePoint\(treeRect, \.582, \.096\);/);
  assert.match(script, /state\.saberPoint = relativePoint\(saberRect, \.475, \.105\);/);
  assert.match(script, /const fallPath = `M \$\{canopyPoint\.x\} \$\{canopyPoint\.y\} L \$\{state\.saberPoint\.x\} \$\{state\.saberPoint\.y\}`;/);
  assert.match(script, /homeSignal\.style\.setProperty\('--signal-fall-path', `path\("\$\{fallPath\}"\)`\);/);
  assert.match(script, /Array\.from\(\{ length: 12 \}, \(_, trailIndex\) =>/);
  assert.match(script, /function updateHomeSignalTrail\(state, time\)/);
  assert.match(script, /const sampleCount = Math\.min\(state\.trailPixels\.length, Math\.max\(1, Math\.floor\(movedDistance \/ state\.trailSpacing\)\)\);/);
  assert.match(script, /for \(let step = 1; step <= sampleCount; step \+= 1\)/);
  assert.match(script, /state\.trailHistory\.unshift\(\{ x: sampleX, y: sampleY, born, pixel \}\);/);
  assert.match(script, /const temporalFade = Math\.max\(0, 1 - age \/ state\.trailLife\);/);
  assert.match(script, /const spatialFade = \(1 - trailIndex \/ state\.trailPixels\.length\) \*\* 1\.4;/);
  assert.match(script, /updateHomeSignalTrail\(homeSignalState, time\);/);
  assert.match(css, /\.chapter-home\.is-signal-handoff \.home-sky-twinkles/);
  assert.match(script, /function initializeHomeSignal/);
  assert.match(script, /function updateHomeSignal/);
  assert.match(script, /homeSignal\.classList\.toggle\('is-handoff'/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.home-signal-firefly,\s*\.home-signal-trail \{ display:\s*none;/);
});

test('promotes the approved 01 scroll motion into the main portfolio without lab chrome', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');
  const packageJson = JSON.parse(read('package.json'));

  assert.equal(packageJson.version, '0.1.43');
  assert.match(html, /<html lang="en" data-motion-variant="scroll-starlight">/);
  assert.match(html, /<body data-active-chapter="home" data-scroll-motion="enabled">/);
  assert.doesNotMatch(html, /Motion Lab|motion-lab-badge/);

  assert.match(script, /function initializeScrollMotion\(chapters, motionPreference\)/);
  assert.match(script, /const measurements = chapters\.map\(\(chapter\) => \(\{[\s\S]*?rect: chapter\.getBoundingClientRect\(\)/);
  assert.match(script, /const amplitude = window\.innerWidth <= 720 \? \.52 : 1;/);
  assert.match(script, /window\.requestAnimationFrame\(render\)/);
  assert.match(script, /initializeScrollMotion\(sections, reducedMotion\);/);

  assert.match(css, /body\[data-scroll-motion="enabled"\] \.chapter-home \.home-intro \{[^}]*transform:[^}]*--motion-home-copy-x[^}]*--motion-home-copy-y[^}]*opacity:\s*var\(--motion-home-copy-opacity/s);
  assert.match(css, /body\[data-scroll-motion="enabled"\] \.chapter:not\(\.chapter-home\) \.chapter-copy \{[^}]*transform:[^}]*--motion-copy-y[^}]*opacity:\s*var\(--motion-opacity/s);
  assert.match(css, /body\[data-scroll-motion="enabled"\] \.scene \{[^}]*--motion-visual-x[^}]*--motion-visual-y[^}]*--motion-visual-scale/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?body\[data-scroll-motion="enabled"\] \.chapter-copy,[\s\S]*?transform:\s*none !important;/);
});

test('gathers the final chapter starlight into the contact links', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="contact-starlight-field"[^>]*aria-hidden="true"/);
  assert.match(script, /let contactStarlightProgress = 0;/);
  assert.match(script, /function initializeContactStarlight\(contact, motionPreference\)/);
  assert.match(script, /Array\.from\(\{ length: 24 \}, \(_, particleIndex\) =>/);
  assert.match(script, /const scrollProgress = clamp\(\(window\.innerHeight \* 1\.12 - contactRect\.top\) \/ \(window\.innerHeight \* 1\.12\), 0, 1\);/);
  assert.match(script, /const x = inverse \*\* 2 \* start\.x \+ 2 \* inverse \* easedProgress \* control\.x \+ easedProgress \*\* 2 \* target\.x;/);
  assert.match(script, /const starfieldDim = 1 - contactStarlightProgress \* \.62;/);
  assert.match(script, /initializeContactStarlight\(document\.querySelector\('#contact'\), reducedMotion\);/);

  assert.match(css, /\.contact-starlight-field \{[^}]*position:\s*fixed;[^}]*pointer-events:\s*none;/s);
  assert.match(css, /\.contact-starlight-particle \{[^}]*width:\s*4px;[^}]*height:\s*4px;[^}]*image-rendering:\s*pixelated;/s);
  assert.match(css, /html\[data-motion-variant="scroll-starlight"\] body \.chapter-contact \{[^}]*min-height:\s*100svh;/);
  assert.match(css, /\.contact-links a::after \{[^}]*offset-path:\s*inset\(2px round 999px\);/s);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.contact-starlight-particle:nth-child\(n\+13\) \{ display:\s*none;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.contact-starlight-field,[\s\S]*?\.contact-links a::after \{ display:\s*none;/);
});

test('replays the complete contact starlight sequence after a 05 navigation click', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /const contactNavLink = document\.querySelector\('\[data-nav="contact"\]'\);/);
  assert.match(script, /const navigationDuration = 1800;/);
  assert.match(script, /contactNavLink\?\.addEventListener\('click', startNavigationSequence\);/);
  assert.match(script, /navigationStart = window\.performance\.now\(\);/);
  assert.match(script, /const navigationProgress = clamp\(\(frameTime - navigationStart\) \/ navigationDuration, 0, 1\);/);
  assert.match(script, /const progress = navigationStart > 0 \? navigationProgress : scrollProgress;/);
  assert.match(script, /if \(navigationStart > 0 && navigationProgress < 1\) \{\s*renderFrame = window\.requestAnimationFrame\(render\);/);
  assert.match(script, /const stopNavigationSequence = \(\) => \{[\s\S]*?navigationStart = 0;\s*requestRender\(\);/);
});

test('blends every chapter palette continuously through the shared scroll render', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /let renderedPalette = \{ \.\.\.palettes\.home \};/);
  assert.match(script, /function mixHexColor\(from, to, amount\)/);
  assert.match(script, /function blendChapterPalettes\(measurements, viewportHeight\)/);
  assert.match(script, /const easedMix = mix \* mix \* \(3 - 2 \* mix\);/);
  assert.match(script, /renderedPalette = Object\.fromEntries\(/);
  assert.match(script, /document\.body\.style\.setProperty\('--gold', renderedPalette\.gold\);/);
  assert.match(script, /document\.body\.style\.setProperty\('--blue', renderedPalette\.blue\);/);
  assert.match(script, /blendChapterPalettes\(measurements, viewportHeight\);/);
  assert.match(script, /const palette = renderedPalette;/);
});

test('removes the detached canvas waveform and production-line ornaments', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.doesNotMatch(script, /function drawOphthalmicScene/);
  assert.doesNotMatch(script, /function drawIndustrialScene/);
  assert.doesNotMatch(script, /drawOphthalmicScene\(palette, time\)/);
  assert.doesNotMatch(script, /drawIndustrialScene\(palette, time\)/);
});

test('uses a compact handoff that leaves the lowered ground visible', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.chapter-home::after \{[^}]*height:\s*clamp\(72px, 10vh, 128px\)[^}]*linear-gradient\(180deg, transparent 0%, #03091b 90%\)/s);
});

test('shows the living CV construction status at forty percent', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /class="site-build-progress"[^>]*aria-label="Site construction progress: 40%"/);
  assert.match(html, /Site under construction <b>40%<\/b>/);
  assert.match(css, /\.site-build-progress \.build-fill \{[^}]*width:\s*40%;/s);
});

test('covers tall viewports while continuously focusing the camera on the tree and Saber', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.home-scene-rig \{[^}]*--home-focus-shift:\s*clamp\(0px, calc\(\(100svh - 56\.22vw\) \* \.5\), 14%\);/s);
  assert.match(css, /\.home-scene-rig \{[^}]*width:\s*max\(100%, calc\(100svh \* 1672 \/ 940\)\);/s);
  assert.match(css, /\.home-scene-rig \{[^}]*transform:\s*translate\(calc\(-50% - var\(--home-focus-shift\)\), -50%\);/s);
});

test('keeps the shared focal crop active on mobile after the ultrawide override', () => {
  const css = read('assets/css/dynamic-cv.css');
  const mobile = css.match(/@media \(max-width: 720px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(mobile, /\.home-scene-rig \{[^}]*top:\s*50%;[^}]*bottom:\s*auto;/s);
  assert.doesNotMatch(mobile, /translate\(-64%, -50%\)/);
});

test('keeps the calibrated scene together as one bottom-anchored ultrawide composition', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');
  const widescreen = css.match(/@media \(min-aspect-ratio: 21\/9\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(widescreen, /\.home-scene-rig \{[^}]*top:\s*auto;[^}]*bottom:\s*0;[^}]*transform:\s*translateX\(-50%\);/s);
  for (const sceneVariable of ['--tree-x', '--tree-y', '--tree-scale', '--foundation-width', '--foundation-scale', '--ground-scale']) {
    assert.doesNotMatch(widescreen, new RegExp(sceneVariable));
  }
  assert.match(script, /function createSkyTwinkles\(container, \{ count = 42, scale = 1, profile = 'ambient' \} = \{\}\)/);
  assert.match(script, /index % 8 === 0 \? 6 : 3/);
});

test('keeps the opening chapter focused on Zhengji’s academic bio', () => {
  const html = read('index.html');

  assert.match(html, /I am a PhD student at the School of Optometry/);
  assert.match(html, /Prof\. Rachel Ka-Man CHUN/);
  assert.doesNotMatch(html, /Dr\. Rachel Ka-Man CHUN/);
  assert.match(html, /href="https:\/\/www\.polyu\.edu\.hk\/so\/people\/academic-staff\/rachel-chun\//);
  assert.match(html, /<section class="chapter chapter-education" id="education"/);
});

test('closes with a specific contact invitation for imaging collaboration', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const contact = html.match(/<section class="chapter chapter-contact"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(contact, /<p class="eyebrow"[^>]*>05 \/ contact<\/p>/);
  assert.match(contact, /<h2 id="contact-title" class="contact-title-easter-egg" lang="la" tabindex="0" role="button" data-contact-easter-egg-trigger data-i18n-html="contact\.title" data-i18n-lang="contact\.title\.lang">Fata viam<br \/><i>invenient\.<\/i><\/h2>/);
  assert.match(contact, /<p[^>]*data-i18n="contact\.invitation"[^>]*>Open to research collaborations and engineering conversations across ophthalmic imaging, computer vision, and industrial inspection\.<\/p>/);
  assert.match(contact, /mailto:zheng-ji\.liu@connect\.polyu\.hk/);
  assert.match(contact, /GitHub[\s\S]*LinkedIn/);
  assert.doesNotMatch(contact, /Let’s make|images useful|next signal|something clear|For research, image systems/i);
  assert.match(css, /\.contact-panel \{[^}]*width:\s*min\(840px, 100%\);/s);
  assert.match(css, /\.contact-panel h2 \{[^}]*margin-bottom:\s*24px;[^}]*font-size:\s*clamp\(4rem, 9vw, 9\.6rem\);/s);
});

test('unlocks the Chinese contact-title easter egg on its fifth click', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.match(html, /id="contact-title"[^>]*class="contact-title-easter-egg"[^>]*data-contact-easter-egg-trigger/);
  assert.doesNotMatch(html, /data-contact-easter-egg-message/);
  assert.match(css, /\.contact-title-easter-egg \{[^}]*cursor:\s*default;/s);

  const listeners = {};
  const trigger = {
    textContent: '道阻且长 行则将至。',
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const document = {
    documentElement: { lang: 'zh-CN' },
    querySelector(selector) {
      if (selector === '[data-contact-easter-egg-trigger]') return trigger;
      return null;
    }
  };

  initializeContactEasterEgg(document);
  for (let click = 0; click < 4; click += 1) listeners.click();
  assert.equal(trigger.textContent, '道阻且长 行则将至。');
  listeners.click();
  assert.equal(trigger.textContent, '蛋糕店里卖蛋糕');
  assert.equal(new Set(contactEasterEggLyrics).size, contactEasterEggLyrics.length);
  assert.equal(contactEasterEggLyrics.at(-1), '哎呀我去你不早说');
  assert.doesNotMatch(contactEasterEggLyrics.join('\n'), /我去 你怎么不早说/);
});

test('cycles the contact-title lyric after the easter egg is unlocked', () => {
  const { initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const trigger = {
    textContent: '道阻且长 行则将至。',
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const document = {
    documentElement: { lang: 'zh-CN' },
    querySelector(selector) {
      if (selector === '[data-contact-easter-egg-trigger]') return trigger;
      return null;
    }
  };

  initializeContactEasterEgg(document);
  for (let click = 0; click < 6; click += 1) listeners.click();
  assert.equal(trigger.textContent, '面包店里卖面包');
});

test('locks the contact title after restoring its slogan from the final lyric', () => {
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const originalTitle = '道阻且长<br /><i>行则将至。</i>';
  let titleHtml = originalTitle;
  let titleText = '道阻且长 行则将至。';
  const trigger = {
    get textContent() { return titleText; },
    set textContent(value) { titleText = value; titleHtml = value; },
    get innerHTML() { return titleHtml; },
    set innerHTML(value) { titleHtml = value; titleText = value; },
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const document = {
    documentElement: { lang: 'zh-CN' },
    querySelector(selector) {
      return selector === '[data-contact-easter-egg-trigger]' ? trigger : null;
    }
  };

  initializeContactEasterEgg(document);
  for (let click = 0; click < contactEasterEggLyrics.length + 5; click += 1) listeners.click();
  assert.equal(trigger.innerHTML, originalTitle);
  listeners.click();
  assert.equal(trigger.innerHTML, originalTitle);
});

test('restores the Chinese slogan when the visitor switches languages before unlocking', () => {
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const englishTitle = 'Fata viam<br /><i>invenient.</i>';
  const chineseTitle = '道阻且长<br /><i>行则将至。</i>';
  let titleHtml = englishTitle;
  let titleText = 'Fata viam invenient.';
  const trigger = {
    get textContent() { return titleText; },
    set textContent(value) { titleText = value; titleHtml = value; },
    get innerHTML() { return titleHtml; },
    set innerHTML(value) { titleHtml = value; titleText = value; },
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const document = {
    documentElement: { lang: 'en' },
    querySelector(selector) {
      return selector === '[data-contact-easter-egg-trigger]' ? trigger : null;
    }
  };

  initializeContactEasterEgg(document);
  document.documentElement.lang = 'zh-CN';
  trigger.innerHTML = chineseTitle;
  for (let click = 0; click < contactEasterEggLyrics.length + 5; click += 1) listeners.click();
  assert.equal(trigger.innerHTML, chineseTitle);
});

test('keeps Education as a distinct part of the Background chapter', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /<a href="#education" data-nav="education" data-mobile-label="Background"[^>]*><span class="chapter-nav-number">02<\/span> <span class="chapter-nav-label"[^>]*>Background<\/span><\/a>/);
  assert.match(html, /<h2 id="education-title"[^>]*>Academic<br \/><i>Background<\/i><\/h2>/);
  assert.match(html, /<p class="path-subsection-label"[^>]*>Education<\/p>/);
  assert.doesNotMatch(html, /<em>/);
  for (const schoolMark of ['https:\/\/www\.polyu\.edu\.hk\/favicon\.ico', 'assets\/brand\/szu\.jpg', 'assets\/brand\/ysu\.png']) {
    assert.match(html, new RegExp(schoolMark));
  }
  assert.match(html, /class="school-crest[^\"]*ysu"/);
  assert.match(css, /\.school-crest\.school-crest-local \{[^}]*border-radius:\s*50%;/s);
});

test('indexes Background as three adaptive content columns', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.equal((html.match(/class="background-index-card"/g) ?? []).length, 3);
  assert.match(html, /aria-controls="path-history-dialog"[\s\S]*Education \/ Experience/);
  assert.match(html, /aria-controls="path-skills-dialog"[\s\S]*Skills/);
  assert.match(html, /aria-controls="path-publications-dialog"[\s\S]*Publications/);
  assert.doesNotMatch(html.match(/<section class="chapter chapter-education"[\s\S]*?<\/section>/)?.[0] ?? '', /\+/);
  assert.match(css, /\.background-index-grid \{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.background-index-grid \{[^}]*grid-template-columns:\s*1fr;/s);
});

test('gives Background entry cards a larger desktop reading hierarchy', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.background-index-card \{[^}]*min-height:\s*220px;[^}]*padding:\s*20px 18px;/s);
  assert.match(css, /\.background-index-number,\s*\.background-index-action \{[^}]*font:\s*500 10px\/1\.3 "DM Mono"/s);
  assert.match(css, /\.background-index-card strong \{[^}]*font:\s*500 15px\/1\.35 Manrope/);
  assert.match(css, /\.background-index-card small \{[^}]*font:\s*10px\/1\.5 "DM Mono"/);
});

test('credits the preview as generated by Codex', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const js = read('assets/js/dynamic-cv.js');

  assert.match(html, /Vibe-coded with Codex/);
  assert.doesNotMatch(`${html}\n${css}\n${js}`, /Deerflow/i);
});

test('uses isolated character and scene assets', () => {
  assert.ok(existsSync(file('index.html')), 'index.html must exist');
  const html = read('index.html');

  for (const asset of ['bio-saber-large-rice.png', 'ophthalmic-saber-glasses.png', 'ophthalmic-oct.png', 'industrial-saber-wrench.png', 'industrial-production-line-q.png']) {
    assert.match(html, new RegExp(asset));
  }
});

test('tracks every runtime scene asset for GitHub Pages deployment', () => {
  const trackedAssets = execFileSync('git', ['ls-files', '--stage', 'assets/scene', 'assets/pixel/home'], { encoding: 'utf8' });

  for (const asset of [
    'bio-saber-large-rice.png',
    'ophthalmic-saber-glasses.png',
    'ophthalmic-oct.png',
    'industrial-saber-wrench.png',
    'industrial-production-line-q.png',
    '../pixel/home/sky-night-v1.png',
    '../pixel/home/ground-foundation-v6.png',
    '../pixel/home/tree-sway-v1-00.png',
    '../pixel/home/meadow-sway-v2-00.png',
    '../pixel/home/saber-idle-chunky-v2-00.png',
    '../pixel/home/saber-eyes-v2-open.png',
    '../pixel/home/saber-eyes-v2-half.png',
    '../pixel/home/saber-eyes-v2-closed.png',
  ]) {
    const path = asset.startsWith('../pixel/') ? `assets/${asset.slice(3)}` : `assets/scene/${asset}`;
    assert.match(trackedAssets, new RegExp(`${path.replaceAll('.', '\\.')}\\n`), `${path} must be tracked for deployment`);
  }
});

test('does not publish unused source or preview assets', () => {
  const trackedAssets = execFileSync('git', ['ls-files', 'assets'], { encoding: 'utf8' });
  const unusedAssets = [
    'assets/brand/ysu_bw.png',
    'assets/pixel/ASSET_MANIFEST.md',
    'assets/pixel/home/ground-foreground-v3.png',
    'assets/pixel/home/meadow-foreground-v1.png',
    'assets/pixel/home/saber-blink-chunky-v2-sheet-v2.png',
    'assets/pixel/home/saber-blink-reference-v2.png',
    ...Array.from({ length: 9 }, (_, index) => `assets/pixel/home/saber-blink-reference-v2-0${index}.png`),
    ...Array.from({ length: 8 }, (_, index) => `assets/pixel/home/saber-idle-ahoge-pixel150-0${index}.png`),
    'assets/pixel/home/saber-idle-ahoge-sheet-v1.png',
    ...Array.from({ length: 8 }, (_, index) => `assets/pixel/home/saber-idle-ahoge-v1-0${index}.png`),
    'assets/pixel/home/saber-idle-chunky-v2-sheet-v2.png',
    'assets/pixel/home/sky-dawn-v1.png',
    'assets/pixel/home/sky-day-v1.png',
    'assets/pixel/home/sky-dusk-v1.png',
    'assets/pixel/home/sky-dusk-v2.png',
    'assets/pixel/home/tree-master-v1.png',
    'assets/pixel/home/tree-master-v2.png',
    'assets/scene/Personal website.lnk',
    'assets/scene/hero-time-tree-saber-v3.png',
  ];

  for (const asset of unusedAssets) {
    assert.doesNotMatch(trackedAssets, new RegExp(`^${asset.replaceAll('.', '\\.')}$`, 'm'), `${asset} must stay out of the published site`);
  }
});

test('removes opaque magenta extraction residue from every Saber asset', () => {
  for (const asset of ['bio-saber-large-rice.png', 'ophthalmic-saber-glasses.png', 'industrial-saber-wrench.png']) {
    assert.equal(countOpaqueChromaPixels(`assets/scene/${asset}`), 0, `${asset} should not keep a magenta halo`);
  }
});

test('versions processed Saber assets so the preview cannot reuse the old haloed images', () => {
  const html = read('index.html');

  for (const asset of ['bio-saber-large-rice.png', 'ophthalmic-saber-glasses.png', 'industrial-saber-wrench.png']) {
    assert.match(html, new RegExp(`${asset.replace('.', '\\.')}\\?v=`));
  }
});

test('supports an animated starfield and reduced-motion fallback', () => {
  assert.ok(existsSync(file('assets/css/dynamic-cv.css')), 'dynamic stylesheet must exist');
  assert.ok(existsSync(file('assets/js/dynamic-cv.js')), 'dynamic script must exist');
  assert.match(read('assets/css/dynamic-cv.css'), /prefers-reduced-motion:\s*reduce/);
  assert.match(read('assets/js/dynamic-cv.js'), /IntersectionObserver/);
  assert.match(read('assets/js/dynamic-cv.js'), /function createMeteorSchedule/);
  assert.match(read('assets/js/dynamic-cv.js'), /function drawMeteor/);
});

test('uses a clean solid space field without a grain or haze overlay', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.doesNotMatch(html, /page-grain/);
  assert.doesNotMatch(css, /fractalNoise|\.page-grain/);
  assert.doesNotMatch(script, /function pixelHaze/);
});

test('removes duplicate masthead controls from the one-page portfolio', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.doesNotMatch(html, /site-header|Say hello|ZL<span>/);
  assert.doesNotMatch(css, /\.site-header|\.header-contact|\.site-status|\.site-mark/);
});

test('keeps a fine pixel starfield and gives each meteor a complete appearing-to-fading trail', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /depth: 1 \+ index % 3,/);
  assert.match(script, /const pixelScale = Math\.max\(3, Math\.min\(4, Math\.floor\(window\.innerWidth \/ 480\)\)\);/);
  assert.match(script, /canvas\.style\.imageRendering = 'pixelated';/);
  assert.match(script, /function createMeteorSchedule\(\)/);
  assert.match(script, /const meteorDuration = 1050;/);
  assert.match(script, /const meteorSchedule = createMeteorSchedule\(\);/);
  assert.match(script, /const tailProgress = Math\.min\(progress \* 2\.6, 1, \(1 - progress\) \* 2\.6\);/);
  assert.match(script, /for \(let segment = 12; segment >= 0; segment -= 1\)/);
  assert.doesNotMatch(script, /function drawCometTrail/);
});

test('reveals each chapter in a short staged sequence after it enters the viewport', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(css, /\.chapter:not\(\.is-revealed\) \.chapter-copy > \* \{[^}]*opacity:\s*0;/s);
  assert.match(css, /\.chapter\.is-revealed \.chapter-copy > \* \{[^}]*opacity:\s*1;/s);
  assert.match(script, /visible\.target\.classList\.add\('is-revealed'\);/);
});

test('versions stylesheet and script URLs so a new chapter never runs against cached code', () => {
  const html = read('index.html');

  assert.match(html, /assets\/css\/dynamic-cv\.css\?v=/);
  assert.match(html, /assets\/js\/dynamic-cv\.js\?v=/);
});

test('shows the current construction progress and concise copyright footer', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /aria-label="Site construction progress: 40%"/);
  assert.match(html, /Site under construction <b>40%<\/b>/);
  assert.match(html, /<p>© 2026 · Zhengji Liu<\/p>/);
  assert.doesNotMatch(html, /built as a living CV/);
  assert.match(css, /\.site-build-progress \.build-fill \{[^}]*width:\s*40%;/s);
  assert.match(css, /footer \{[^}]*font-size:\s*10px;/s);
});

test('keeps static-asset cache versions aligned with the release version', () => {
  const html = read('index.html');
  const packageJson = JSON.parse(read('package.json'));
  const version = packageJson.version.replaceAll('.', '\\.')

  assert.match(html, new RegExp(`assets/css/dynamic-cv\\.css\\?v=${version}`));
  assert.match(html, new RegExp(`assets/js/dynamic-cv\\.js\\?v=${version}`));
});

test('uses a pre-1.0 release number while the portfolio remains under construction', () => {
  const packageJson = JSON.parse(read('package.json'));

  assert.match(packageJson.version, /^0\.\d+\.\d+$/);
});

test('reserves room for chapter navigation beside the education card', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.education-panel \{[^}]*width:\s*min\(100%, 480px\)/s);
});

test('uses the compact numeric chapter index on mobile', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  for (const index of ['00', '01', '02', '03', '04', '05']) {
    assert.match(html, new RegExp(`<span class="chapter-nav-number">${index}</span>`));
  }
  assert.match(css, /grid-template-columns:\s*repeat\(6, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.chapter-nav-number \{ display:\s*inline; \}/);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.chapter-nav-label \{ display:\s*none; \}/);
  assert.doesNotMatch(css, /\.chapter-nav a::after \{[^}]*content:\s*attr\(data-mobile-label\);/);
});

test('anchors the desktop chapter index in the cleared upper-right corner', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.chapter-nav \{[^}]*top:\s*clamp\(28px, 4vw, 48px\);[^}]*transform:\s*none;/s);
});

test('places the industrial production line in front of Saber', () => {
  assert.ok(existsSync(file('assets/css/dynamic-cv.css')), 'dynamic stylesheet must exist');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.scene-rig \.line \{[^}]*z-index:\s*3;/s);
  assert.match(css, /\.scene-industrial \.scene-rig \.saber \{[^}]*z-index:\s*2;/s);
});

test('closes the horizontal gap between the industrial line and Saber', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.scene-rig \.line \{[^}]*left:\s*-6%;/s);
});

test('moves the industrial illustration clear of its lower caption', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.scene-industrial \.scene-rig \{[^}]*right:\s*-3%;[^}]*bottom:\s*12%;/s);
  assert.match(css, /\.scene-industrial figcaption \{[^}]*left:\s*3%;[^}]*bottom:\s*9%;/s);
});

test('packages Shenzhen and Yanshan University marks for the education timeline', () => {
  const html = read('index.html');

  for (const asset of ['assets/brand/szu.jpg', 'assets/brand/ysu.png']) {
    assert.ok(existsSync(file(asset)), `${asset} must ship with the site`);
  }

  assert.match(html, /src="assets\/brand\/szu\.jpg" alt="Shenzhen University crest"/);
  assert.match(html, /src="assets\/brand\/ysu\.png" alt="Yanshan University crest"/);
  assert.doesNotMatch(html, /www\.szu\.edu\.cn\/images\/favicon\.ico/);
  assert.doesNotMatch(html, /open\.ieee\.org\/wp-content\/uploads\/Yanshan-University\.png/);
});

test('presents university marks without a circular icon base behind them', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /class="school-crest school-crest-local" src="assets\/brand\/szu\.jpg"/);
  assert.match(html, /class="school-crest school-crest-local ysu" src="assets\/brand\/ysu\.png"/);
  assert.doesNotMatch(css, /\.path-entry-logo \{[^}]*border-radius:/s);
  assert.doesNotMatch(css, /\.path-entry-logo \{[^}]*background:/s);
});

test('opens separate experience, skills, and publications from the Background chapter', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  const dialogs = new Map(
    [...html.matchAll(/<aside class="path-detail-dialog[^"]*" id="([^"]+)"[\s\S]*?<\/aside>/g)]
      .map((match) => [match[1], match[0]])
  );

  assert.equal(dialogs.size, 4);
  assert.doesNotMatch(html, /id="path-dialog"/);
  assert.match(dialogs.get('build-status-dialog') ?? '', /role="dialog"[^>]*aria-modal="true"/);

  for (const id of ['path-history-dialog', 'path-skills-dialog', 'path-publications-dialog']) {
    assert.match(html, new RegExp(`data-path-open[^>]*aria-haspopup="dialog"[^>]*aria-controls="${id}"`));
    assert.match(dialogs.get(id) ?? '', /role="dialog"[^>]*aria-modal="true"/);
  }

  const history = dialogs.get('path-history-dialog') ?? '';
  assert.match(history, /Education \/ Experience/);
  assert.match(history, /class="path-subsection-label"[^>]*>Education<\/p>/);
  assert.match(history, /class="path-subsection-label"[^>]*>Work \/ research experience<\/p>/);
  assert.match(history, /Research Assistant[\s\S]*The Hong Kong Polytechnic University[\s\S]*2020\.09 — 2021\.08/);
  assert.match(history, /Research Assistant[\s\S]*The University of Hong Kong[\s\S]*2019\.09 — 2020\.03/);
  assert.doesNotMatch(history, /PyTorch|Selected publications/);

  const skills = dialogs.get('path-skills-dialog') ?? '';
  assert.match(skills, /<h2 id="path-skills-title"[^>]*>Skills<\/h2>/);
  for (const skill of ['Python', 'PyTorch', 'OpenCV', 'MATLAB', 'SPSS', 'LaTeX']) {
    assert.match(skills, new RegExp(skill));
  }
  assert.doesNotMatch(skills, /Research Assistant|Selected publications/);

  const publications = dialogs.get('path-publications-dialog') ?? '';
  assert.match(publications, /<h2 id="path-publications-title"[^>]*>Publications<\/h2>/);
  assert.doesNotMatch(publications, /Selected/i);
  assert.match(publications, /<h3[^>]*>Journal articles<\/h3>[\s\S]*<h3[^>]*>Conference papers<\/h3>[\s\S]*<h3[^>]*>Conference abstracts<\/h3>/);
  assert.equal((publications.match(/class="path-publication-entry"/g) ?? []).length, 11);
  assert.equal((publications.match(/<strong>Zhengji Liu<\/strong>/g) ?? []).length, 11);

  for (const title of [
    'Defocus Incorporated Multiple Segments \\(DIMS\\) spectacle lenses thicken the choroidal thickness',
    'An eye tracker based on webcam and its preliminary application evaluation in Chinese reading tests',
    'Finer cornea characterization with improved spatial resolution in Corvis ST',
    'Boosting of implicit neural representation-based image denoiser',
    'Generalized Robust Fundus Photography-Based Vision Loss Estimation for High Myopia',
    'Synthesising 3D cardiac cine-MR images and corresponding segmentation masks using a latent diffusion model',
    'Multi-dataset collaborative learning for liver tumor segmentation',
    'Self-supervised denoising of optical coherence tomography with inter-frame representation',
    'Vision loss estimation using fundus photograph for high myopia',
    'Improving retinal layer segmentation in rodent OCT images',
    'Effect of Defocus Incorporated Multiple Segments \\(DIMS\\) lenses on choroidal thickness in schoolchildren',
  ]) {
    assert.match(publications, new RegExp(title));
  }

  assert.match(publications, /Rachel Ka-man Chun[\s\S]*<strong>Zhengji Liu<\/strong>[\s\S]*Chi Ho To/);
  assert.match(publications, /Zhongjun Lin[\s\S]*<strong>Zhengji Liu<\/strong>[\s\S]*Xinyu Zhang/);
  assert.doesNotMatch(publications, /Research Assistant|PyTorch/);
  assert.doesNotMatch(publications, /<small>/, 'publication cards should not repeat volume, page, or type footers');

  const verifiedDois = [
    '10.1186/s40662-023-00356-z',
    '10.1016/j.bspc.2022.103521',
    '10.1016/j.bspc.2020.102297',
    '10.1109/icassp48485.2024.10447327',
    '10.1007/978-3-031-72378-0_65',
    '10.1109/isbi56570.2024.10635781',
    '10.1109/EMBC53108.2024.10781844',
    '10.1109/icip49359.2023.10223125',
    '10.1007/978-3-031-43990-2_61',
  ];
  assert.equal((publications.match(/href="https:\/\/doi\.org\//g) ?? []).length, verifiedDois.length);
  for (const doi of verifiedDois) {
    assert.match(publications, new RegExp(`class="path-publication-title"[\\s\\S]*?href="https://doi\\.org/${doi.replaceAll('.', '\\.')}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"`));
  }

  assert.match(css, /\.path-detail-dialog--history \{[^}]*width:\s*min\(90vw, 920px\);/s);
  assert.match(css, /\.path-detail-dialog--skills \{[^}]*width:\s*min\(88vw, 760px\);/s);
  assert.match(css, /\.path-detail-dialog--publications \{[^}]*width:\s*min\(92vw, 1040px\);/s);
  assert.match(css, /\.path-publication-list \{[^}]*list-style:\s*none;/s);
  assert.match(css, /\.path-publication-title a \{[^}]*color:\s*inherit;[^}]*text-decoration/s);
  assert.match(css, /\.path-publication-title a:focus-visible \{[^}]*outline:/s);
  assert.match(css, /\.path-publication-authors strong \{[^}]*font-weight:\s*700;/s);
  assert.match(script, /document\.querySelectorAll\('\[data-project-layer\]'\)/);
  assert.match(script, /\[aria-controls="\$\{dialog\.id\}"\]/);
});

test('expands CV education details and brands each research role', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const history = html.match(/<aside class="path-detail-dialog path-detail-dialog--history"[\s\S]*?<\/aside>/)?.[0] ?? '';

  assert.equal((history.match(/class="path-education-entry"/g) ?? []).length, 3);
  assert.match(history, /PhD candidate · Optometry[\s\S]*The Hong Kong Polytechnic University[\s\S]*2021\.09 — Present[\s\S]*Hong Kong SAR, China/);
  assert.match(history, /Supervisor[\s\S]*Prof\. Rachel Ka-Man Chun, Assistant Professor[\s\S]*Co-supervisor[\s\S]*Chi-Ho To, Chair Professor/);
  assert.doesNotMatch(history, /Research focus[\s\S]*Myopia-control methods/);
  assert.match(history, /MEng · Biomedical Engineering[\s\S]*Shenzhen University[\s\S]*2017\.09 — 2020\.07[\s\S]*Shenzhen, Guangdong, China[\s\S]*Yongjin Zhou, Associate Professor/);
  assert.match(history, /BEng · Biomedical Engineering[\s\S]*Yanshan University[\s\S]*2013\.09 — 2017\.07[\s\S]*Qinhuangdao, Hebei, China[\s\S]*Chao Sun, Professor/);

  assert.equal((history.match(/class="path-experience-entry"/g) ?? []).length, 2);
  assert.equal((history.match(/class="path-entry-logo path-entry-logo--experience"/g) ?? []).length, 2);
  assert.match(history, /alt="The Hong Kong Polytechnic University crest"[\s\S]*Research Assistant[\s\S]*The Hong Kong Polytechnic University/);
  assert.match(history, /src="https:\/\/www\.hku\.hk\/assets\/img\/apple-touch-icon\.png"[\s\S]*alt="The University of Hong Kong crest"/);

  assert.match(css, /\.path-education-entry,[\s\S]*\.path-experience-entry \{[^}]*grid-template-columns:\s*48px minmax\(0, 1fr\);/s);
  assert.match(css, /\.path-entry-logo \{[^}]*width:\s*40px;[^}]*height:\s*40px;/s);
});

test('separates doctoral supervision and experience facts in the Background detail view', () => {
  const html = read('index.html');
  const education = html.match(/<ol class="education-list path-education-list">[\s\S]*?<\/ol>/)?.[0] ?? '';
  const experience = html.match(/<ol class="path-experience-list">[\s\S]*?<\/ol>/)?.[0] ?? '';

  assert.match(education, /<dt[^>]*>Supervisor<\/dt><dd[^>]*>Prof\. Rachel Ka-Man Chun, Assistant Professor<\/dd>/);
  assert.match(education, /<dt[^>]*>Co-supervisor<\/dt><dd[^>]*>Chi-Ho To, Chair Professor<\/dd>/);
  assert.doesNotMatch(education, /<dt>Supervisors<\/dt>|<dt>Research focus<\/dt>/);
  assert.match(experience, /<dt[^>]*>School<\/dt><dd[^>]*>School of Optometry<\/dd>/);
  assert.match(experience, /<dt[^>]*>Appointment<\/dt><dd[^>]*>Full-time<\/dd>/);
  assert.match(experience, /<dt[^>]*>Department<\/dt><dd[^>]*>Department of Electrical and Electronic Engineering<\/dd>/);
  assert.match(experience, /<dt[^>]*>Appointment<\/dt><dd[^>]*>Internship<\/dd>/);
  assert.match(experience, /Research Assistant[\s\S]*?The Hong Kong Polytechnic University[\s\S]*?<p class="path-entry-location"[^>]*>Hong Kong SAR, China<\/p>/);
  assert.match(experience, /Research Assistant[\s\S]*?The University of Hong Kong[\s\S]*?<p class="path-entry-location"[^>]*>Hong Kong SAR, China<\/p>/);
  assert.doesNotMatch(experience, /<dt>Location<\/dt>/);
});

test('sizes Background detail text for comfortable reading and stacks publications', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.path-subsection-label \{[^}]*font:\s*500 10px\/1\.4 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-role \{[^}]*font:\s*500 10px\/1\.35 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-heading strong \{[^}]*font-size:\s*15px;/s);
  assert.match(css, /\.path-entry-heading time \{[^}]*font:\s*500 9px\/1\.45 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-location \{[^}]*font-size:\s*12px;/s);
  assert.match(css, /\.path-entry-details dt \{[^}]*font:\s*500 9px\/1\.5 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-details dd \{[^}]*font-size:\s*12px;/s);
  assert.match(css, /\.path-detail-dialog--publications \.path-publication-list \{[^}]*grid-template-columns:\s*1fr;/s);
  assert.doesNotMatch(css, /\.path-detail-dialog--publications \.path-publication-list \{[^}]*repeat\(2,/s);
});

test('aligns education and experience logos, copy, details, and dates to shared columns', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.doesNotMatch(css, /(?:^|\n)\.education-list li \{/, 'legacy education-list rules must not leak into the detail dialog');
  assert.match(css, /\.path-education-entry,\s*\.path-experience-entry \{[^}]*grid-template-columns:\s*48px minmax\(0, 1fr\);[^}]*align-items:\s*start;[^}]*padding:\s*16px;/s);
  assert.match(css, /\.path-entry-logo--experience \{[^}]*margin-top:\s*0;/s);
  assert.match(css, /\.path-entry-heading time \{[^}]*width:\s*124px;[^}]*text-align:\s*left;/s);
  assert.match(css, /\.path-entry-details div \{[^}]*grid-template-columns:\s*90px minmax\(0, 1fr\);[^}]*align-items:\s*baseline;/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.path-entry-heading time \{[^}]*width:\s*auto;[^}]*text-align:\s*left;/s);
});

test('organizes skills by capability domain instead of mixed tool types', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const skills = html.match(/<aside class="path-detail-dialog path-detail-dialog--skills"[\s\S]*?<\/aside>/)?.[0] ?? '';

  assert.equal((skills.match(/class="path-skill-group"/g) ?? []).length, 5);
  assert.match(skills, /Computer vision \/ deep learning[\s\S]*PyTorch[\s\S]*OpenCV[\s\S]*scikit-image/);
  assert.match(skills, /Software \/ application development[\s\S]*Python[\s\S]*Flask[\s\S]*PyQt/);
  assert.match(skills, /Embedded systems[\s\S]*C[\s\S]*STM32[\s\S]*Arduino/);
  assert.match(skills, /Research \/ analysis[\s\S]*MATLAB[\s\S]*SPSS[\s\S]*LaTeX/);
  assert.match(skills, /Languages[\s\S]*Mandarin \(native\)[\s\S]*English \(proficient\)/);
  assert.doesNotMatch(skills, /<b>Python<\/b>|<b>C<\/b>|<b>Methods<\/b>/);

  assert.match(css, /\.path-skill-group \{[^}]*grid-template-columns:\s*28px minmax\(0, 1fr\);/s);
  assert.match(css, /\.path-skill-group:last-child \{[^}]*grid-column:\s*1 \/ -1;/s);
});

test('opens long detail dialogs at the top without focus-induced scrolling', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /dialog\.focus\(\{ preventScroll: true \}\);/);
  assert.match(script, /dialog\.scrollTop = 0;/);
});

test('keeps every scene character and companion asset in a shared proportional rig', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /class="scene scene-ophthalmic"[\s\S]*class="scene-rig"[\s\S]*class="oct"[\s\S]*class="saber"/);
  assert.match(html, /class="scene scene-industrial"[\s\S]*class="scene-rig"[\s\S]*class="line"[\s\S]*class="saber"/);
  assert.match(css, /\.scene-rig \{[^}]*width:\s*min\(50vw, 640px\);[^}]*aspect-ratio:/s);
  assert.match(css, /\.scene-rig \.oct \{[^}]*width:\s*58%;/s);
  assert.match(css, /\.scene-rig \.line \{[^}]*width:\s*73%;/s);
  assert.match(css, /\.scene-industrial \.scene-rig \{[^}]*right:\s*-3%;/s);
});

test('presents the battery terminal inspection sample as an industrial case study', () => {
  const html = read('index.html');
  const batteryCase = html.match(/<aside class="project-detail-drawer" id="battery-terminal-dialog"[\s\S]*?<\/aside>/)?.[0] ?? '';

  assert.ok(existsSync(file('assets/projects/battery-terminal-defect.jpeg')), 'the battery terminal sample must ship with the site');
  assert.match(html, /data-project-open="battery-terminal"/);
  assert.match(html, /id="battery-terminal-dialog"[^>]*role="dialog"[^>]*aria-modal="true"/);
  assert.match(html, /src="assets\/projects\/battery-terminal-defect\.jpeg"/);
  assert.match(batteryCase, /Battery Terminal[\s\S]*Inspection Concept/);
  assert.match(batteryCase, /<dt[^>]*>Company<\/dt>[\s\S]*Confidential battery manufacturer/);
  assert.match(batteryCase, /<dt[^>]*>Project date<\/dt>[\s\S]*Not publicly disclosed/);
  assert.match(batteryCase, /<dt[^>]*>Role<\/dt>[\s\S]*Machine Vision Engineer/);
  assert.match(batteryCase, /Project overview[\s\S]*My contribution[\s\S]*Project outcome/);
  assert.doesNotMatch(batteryCase, /<dt>Domain<\/dt>|<dt>Signal<\/dt>|<dt>Status<\/dt>|Inspection observation|Engineering intent/);
});

test('uses Ophthalmic and Industrial as scalable case indexes', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const ophthalmic = html.match(/<section class="chapter chapter-ophthalmic"[\s\S]*?<\/section>/)?.[0] ?? '';
  const industrial = html.match(/<section class="chapter chapter-industrial"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.equal((ophthalmic.match(/class="section-statement"/g) ?? []).length, 1);
  assert.equal((industrial.match(/class="section-statement"/g) ?? []).length, 1);
  assert.equal((ophthalmic.match(/class="project-case-card"/g) ?? []).length, 2);
  assert.equal((industrial.match(/class="project-case-card"/g) ?? []).length, 1);
  assert.match(ophthalmic, /Corvis ST Corneal Image Super-Resolution/);
  assert.match(ophthalmic, /Deep Learning–Based Choroidal OCT Analysis/);
  assert.match(industrial, /Battery Terminal Inspection Concept/);
  assert.doesNotMatch(ophthalmic, /capability-list|chapter-note/);
  assert.doesNotMatch(industrial, /project-points|chapter-note/);
  assert.match(css, /\.project-case-list \{[^}]*display:\s*grid;[^}]*gap:\s*8px;/s);
  assert.match(css, /\.project-case-card \{[^}]*width:\s*min\(100%, 520px\);[^}]*min-height:\s*72px;/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.project-case-card \{[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\);/s);
});

test('opens source-backed ophthalmic cases in adaptive project drawers', () => {
  const html = read('index.html');

  for (const [trigger, dialog, title] of [
    ['corvis-super-resolution', 'corvis-super-resolution-dialog', 'Corvis ST Corneal Image Super-Resolution'],
    ['choroidal-oct-analysis', 'choroidal-oct-analysis-dialog', 'Deep Learning–Based Choroidal OCT Analysis'],
  ]) {
    assert.match(html, new RegExp(`data-project-open="${trigger}"[\\s\\S]*?aria-controls="${dialog}"`));
    assert.match(html, new RegExp(`id="${dialog}"[^>]*role="dialog"[^>]*aria-modal="true"`));
    assert.match(html, new RegExp(title));
  }

  assert.match(html, /Beijing Tongren Hospital/);
  assert.match(html, /The Hong Kong Polytechnic University/);
  assert.match(html, /P &lt; 0\.0001/);
});

test('summarizes ophthalmic projects with collaborator, year, and role', () => {
  const html = read('index.html');
  const corvis = html.match(/<aside[^>]*id="corvis-super-resolution-dialog"[\s\S]*?<\/aside>/)?.[0] ?? '';
  const choroid = html.match(/<aside[^>]*id="choroidal-oct-analysis-dialog"[\s\S]*?<\/aside>/)?.[0] ?? '';

  assert.match(corvis, /data-i18n="fact\.organization">Organization<\/dt>[\s\S]*?Beijing Tongren Hospital collaboration/);
  assert.match(corvis, /data-i18n="fact\.year">Year<\/dt>[\s\S]*?data-i18n="project\.corvis\.year">2021<\/dd>/);
  assert.match(corvis, /data-i18n="fact\.role">Role<\/dt>[\s\S]*?data-i18n="project\.corvis\.role">Algorithm development and image analysis<\/dd>/);
  assert.doesNotMatch(corvis, /fact\.focus|fact\.evidence|120 participants/);

  assert.match(choroid, /data-i18n="fact\.organization">Organization<\/dt>[\s\S]*?The Hong Kong Polytechnic University/);
  assert.match(choroid, /data-i18n="fact\.year">Year<\/dt>[\s\S]*?data-i18n="project\.choroid\.year">2023<\/dd>/);
  assert.match(choroid, /data-i18n="fact\.role">Role<\/dt>[\s\S]*?data-i18n="project\.choroid\.role">Algorithm design and analysis<\/dd>/);
  assert.doesNotMatch(choroid, /fact\.application/);
});

test('gives the project drawer an adaptive one-third image and two-thirds story layout', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.project-detail-drawer \{[^}]*width:\s*min\(88vw, 1320px\);[^}]*grid-template-columns:\s*minmax\(280px, 1fr\) minmax\(0, 2fr\);/s);
  assert.match(css, /\.project-detail-visual img \{[^}]*object-fit:\s*cover;/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.project-detail-drawer \{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*1fr;[^}]*grid-template-rows:\s*minmax\(250px, 38dvh\) minmax\(0, 1fr\);/);
});

test('keeps the battery sample free of diagnostic labels and targeting frames', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.doesNotMatch(html, /inspection-reticle|reticle-corner|Raw inspection sample|Directional red illumination/);
  assert.doesNotMatch(css, /\.inspection-reticle|\.reticle-corner|\.project-detail-visual figcaption/);
  assert.match(css, /\.project-detail-visual img \{[^}]*filter:\s*saturate\(\.88\) contrast\(1\.06\) brightness\(\.86\);/s);
});

test('opens the project drawer as a keyboard-accessible modal', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /function initializeProjectDrawer\(\)/);
  assert.match(script, /layer\.classList\.add\('is-open'\);/);
  assert.match(script, /layer\.classList\.remove\('is-open'\);/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /event\.key !== 'Tab'/);
  assert.match(script, /returnFocus\?\.focus\(\);/);
  assert.match(script, /initializeProjectDrawer\(\);\s*resize\(\);/);
});

test('uses Zhengji’s confirmed research voice across the public portfolio', () => {
  const html = read('index.html');

  assert.match(html, /Image Processing Engineer · Researcher/);
  assert.match(html, /<meta name="description" content="Zhengji Liu — Image Processing Engineer working across industrial vision and ophthalmic imaging\."[^>]*\/>/);
  assert.match(html, /<title[^>]*>Zhengji Liu — Image Processing Engineer \/ Researcher<\/title>/);
  assert.match(html, /My work develops image-processing and machine-learning methods that turn ophthalmic images into clinically actionable measurements, with a focus on myopia control in children\./);
  assert.doesNotMatch(html, /translational application of image processing/);
  assert.match(html, /Training and research experience across biomedical engineering, ophthalmic imaging, and applied computer vision\./);
  assert.match(html, /Across these settings, I have focused on turning image signals into reliable clinical and operational decisions\./);
  assert.match(html, /We developed a computational method that preserves high temporal resolution/);
  assert.match(html, /We designed convolutional neural network methods/);
  assert.match(html, /We built an OCT analysis system designed to quantify choroidal change/);
  assert.match(html, /Our pipeline extracts subfoveal choroidal thickness/);
  assert.match(html, /In the DIMS study, we found that subfoveal choroidal thickness increased/);
  assert.match(html, /We designed the inspection concept and proposed pipeline/);
  assert.match(html, /We produced an explainable inspection concept and a validation plan/);
  assert.doesNotMatch(html, /I designed convolutional neural network methods|Produced an explainable inspection concept/);
  assert.match(html, /Synthesising 3D cardiac cine-MR images/);
  assert.match(html, /Site under construction <b>40%<\/b>/);
  assert.match(html, /Vibe-coded with Codex/);
  assert.match(html, /Fata viam<br \/><i>invenient\.<\/i>/);
});

test('ships an accessible bilingual switch without adding a framework', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const i18n = read('assets/js/i18n.js');
  const packageJson = JSON.parse(read('package.json'));
  const version = packageJson.version.replaceAll('.', '\\.');

  assert.match(html, new RegExp(`assets/js/i18n\\.js\\?v=${version}`));
  assert.ok(html.indexOf('assets/js/i18n.js') < html.indexOf('assets/js/dynamic-cv.js'), 'the language preference must be applied before the portfolio interaction script');
  assert.match(html, /class="language-switcher"[^>]*role="group"[^>]*data-i18n-aria-label="language\.group"/);
  assert.match(html, /data-language-option="en"[^>]*aria-pressed="true"[^>]*>EN<\/button>/);
  assert.match(html, /data-language-option="zh-CN"[^>]*aria-pressed="false"[^>]*>中<\/button>/);
  assert.match(html, /data-language-status[^>]*aria-live="polite"/);
  assert.match(css, /\.language-switcher button \{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/s);
  assert.match(css, /\.language-switcher button:focus-visible \{[^}]*outline:/s);
  assert.match(css, /html\[lang="zh-CN"\] body/);
  assert.match(css, /html\[lang="zh-CN"\] #home-title \{[^}]*font-family:\s*"Bodoni Moda"[^}]*letter-spacing:\s*-\.07em;/s);
  assert.match(i18n, /try \{\s*storage = root\.localStorage;\s*\} catch \{\s*storage = null;\s*\}/s);
});

test('presents the language switch as compact rounded blocks with full touch targets', () => {
  const css = read('assets/css/dynamic-cv.css');
  const switcher = css.match(/\.language-switcher \{([^}]*)\}/)?.[1] ?? '';
  const buttons = css.match(/\.language-switcher button \{([^}]*)\}/)?.[1] ?? '';
  const visualBlocks = css.match(/\.language-switcher button::before \{([^}]*)\}/)?.[1] ?? '';

  assert.match(switcher, /gap:\s*4px;/);
  assert.match(switcher, /border:\s*0;/);
  assert.match(switcher, /background:\s*transparent;/);
  assert.doesNotMatch(switcher, /border-radius:\s*999px;/);
  assert.match(buttons, /min-width:\s*44px;/);
  assert.match(buttons, /min-height:\s*44px;/);
  assert.match(visualBlocks, /inset:\s*5px 2px;/);
  assert.match(visualBlocks, /border-radius:\s*8px;/);
});

test('aligns the desktop language switch with the first chapter navigation row', () => {
  const css = read('assets/css/dynamic-cv.css');
  const switcher = css.match(/\.language-switcher \{([^}]*)\}/)?.[1] ?? '';
  const nav = css.match(/\.chapter-nav \{([^}]*)\}/)?.[1] ?? '';
  const navLink = css.match(/\.chapter-nav a \{([^}]*)\}/)?.[1] ?? '';

  assert.match(nav, /top:\s*clamp\(28px,\s*4vw,\s*48px\);/);
  assert.match(navLink, /min-height:\s*38px;/);
  assert.match(switcher, /top:\s*calc\(clamp\(28px,\s*4vw,\s*48px\)\s*-\s*3px\);/);
});

test('keeps translated cue labels separate from their decorative lines', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /class="enter-cv-line"[^>]*aria-hidden="true"/);
  assert.match(html, /class="scroll-cue-line"[^>]*aria-hidden="true"/);
  assert.match(css, /\.enter-cv-line \{[^}]*height:\s*1px;/s);
  assert.match(css, /\.scroll-cue-line \{[^}]*height:\s*1px;/s);
  assert.doesNotMatch(css, /\.enter-cv span \{/);
  assert.doesNotMatch(css, /\.scroll-cue span \{/);
});

test('switches the document between English and Chinese and remembers the choice', () => {
  const {
    applyLanguage,
    initializeLanguageSwitcher,
    normalizeLanguage,
    storageKey,
    translations
  } = require(fileURLToPath(file('assets/js/i18n.js')));

  class FakeElement {
    constructor({ text = '', html = text, attributes = {} } = {}) {
      this.textContent = text;
      this.innerHTML = html;
      this.attributes = new Map(Object.entries(attributes));
      this.dataset = {};
      this.listeners = {};
    }

    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }

    hasAttribute(name) {
      return this.attributes.has(name);
    }

    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    }

    addEventListener(type, listener) {
      this.listeners[type] = listener;
    }

    click() {
      this.listeners.click?.({ currentTarget: this });
    }
  }

  const homeLabel = new FakeElement({ text: 'Home', attributes: { 'data-i18n': 'nav.home' } });
  const backgroundTitle = new FakeElement({
    html: 'Academic<br /><i>Background</i>',
    attributes: { 'data-i18n-html': 'background.title' }
  });
  const homeName = new FakeElement({
    html: 'Zhengji<br /><span>LIU</span>',
    attributes: { 'data-i18n-html': 'home.name' }
  });
  const bioName = new FakeElement({
    html: 'Zhengji <strong>LIU</strong>',
    attributes: { 'data-i18n-html': 'bio.name' }
  });
  const contactTitle = new FakeElement({
    html: 'Fata viam<br /><i>invenient.</i>',
    attributes: {
      lang: 'la',
      'data-i18n-html': 'contact.title',
      'data-i18n-lang': 'contact.title.lang'
    }
  });
  const nav = new FakeElement({
    attributes: {
      'aria-label': 'Portfolio chapters',
      'data-i18n-aria-label': 'nav.label'
    }
  });
  const englishButton = new FakeElement({
    text: 'EN',
    attributes: {
      'data-language-option': 'en',
      'aria-pressed': 'true'
    }
  });
  const chineseButton = new FakeElement({
    text: '中',
    attributes: {
      'data-language-option': 'zh-CN',
      'aria-pressed': 'false'
    }
  });
  const status = new FakeElement({
    attributes: { 'data-language-status': '' }
  });
  const elements = [homeLabel, backgroundTitle, homeName, bioName, contactTitle, nav, englishButton, chineseButton, status];
  const documentElement = { lang: 'en' };
  const body = { dataset: {} };
  const document = {
    documentElement,
    body,
    querySelectorAll(selector) {
      const attribute = selector.match(/^\[([^\]]+)\]$/)?.[1];
      return attribute ? elements.filter((element) => element.hasAttribute(attribute)) : [];
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] ?? null;
    }
  };
  const writes = [];
  const storage = {
    getItem(key) {
      assert.equal(key, storageKey);
      return 'zh-CN';
    },
    setItem(key, value) {
      writes.push([key, value]);
    }
  };

  assert.equal(normalizeLanguage('zh'), 'zh-CN');
  assert.equal(normalizeLanguage('fr'), 'en');
  assert.equal(translations['zh-CN']['nav.home'], '首页');

  initializeLanguageSwitcher(document, storage);
  assert.equal(documentElement.lang, 'zh-CN');
  assert.equal(body.dataset.language, 'zh');
  assert.equal(homeLabel.textContent, '首页');
  assert.equal(backgroundTitle.innerHTML, '学术<br /><i>经历</i>');
  assert.equal(homeName.innerHTML, 'Zhengji<br /><span>LIU</span>');
  assert.equal(bioName.innerHTML, '刘正吉 Zhengji <strong>LIU</strong>');
  assert.equal(contactTitle.innerHTML, '道阻且长<br /><i>行则将至。</i>');
  assert.equal(contactTitle.getAttribute('lang'), 'zh-CN');
  assert.equal(nav.getAttribute('aria-label'), '作品集章节');
  assert.equal(chineseButton.getAttribute('aria-pressed'), 'true');
  assert.equal(englishButton.getAttribute('aria-pressed'), 'false');

  englishButton.click();
  assert.equal(documentElement.lang, 'en');
  assert.equal(body.dataset.language, 'en');
  assert.equal(homeLabel.textContent, 'Home');
  assert.equal(backgroundTitle.innerHTML, 'Academic<br /><i>Background</i>');
  assert.equal(homeName.innerHTML, 'Zhengji<br /><span>LIU</span>');
  assert.equal(bioName.innerHTML, 'Zhengji <strong>LIU</strong>');
  assert.equal(contactTitle.innerHTML, 'Fata viam<br /><i>invenient.</i>');
  assert.equal(contactTitle.getAttribute('lang'), 'la');
  assert.equal(nav.getAttribute('aria-label'), 'Portfolio chapters');
  assert.deepEqual(writes.at(-1), [storageKey, 'en']);
  assert.match(status.textContent, /English/);

  applyLanguage(document, 'zh-CN');
  assert.equal(homeLabel.textContent, '首页');
});

test('provides Chinese copy for every marked portfolio field', () => {
  const html = read('index.html');
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));
  const chinese = translations['zh-CN'];
  const markedKeys = [...html.matchAll(/data-i18n(?:-html|-aria-label|-alt|-data-mobile-label|-content|-lang)?="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(markedKeys.length >= 100, `expected broad bilingual coverage, found ${markedKeys.length} fields`);
  for (const key of new Set(markedKeys)) {
    assert.ok(chinese[key], `missing Chinese translation for ${key}`);
  }

  for (const key of [
    'bio.summary',
    'background.title',
    'ophthalmic.statement',
    'industrial.statement',
    'contact.invitation',
    'project.corvis.challenge.body',
    'project.choroid.measurements.body',
    'project.battery.contribution.body',
    'history.education',
    'skills.computerVision',
    'publications.journals'
  ]) {
    assert.match(html, new RegExp(`data-i18n(?:-html)?="${key.replaceAll('.', '\\.')}"`));
  }
});

test('uses paper figures as visual evidence and keeps a two-column construction update', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.ok(existsSync(file('assets/papers/corvis-figure-5.jpg')));
  assert.ok(existsSync(file('assets/papers/dims-figure-1.jpg')));
  assert.match(html, /src="assets\/papers\/corvis-figure-5\.jpg"/);
  assert.match(html, /src="assets\/papers\/dims-figure-1\.jpg"/);
  assert.match(html, /Fig\. 5 — Clinical Corvis ST comparison/);
  assert.match(html, /Fig\. 1 — Automated choroid segmentation/);
  assert.doesNotMatch(html, /project-method-map/);
  assert.match(html, /href="https:\/\/doi\.org\/10\.1016\/j\.bspc\.2020\.102297"/);
  assert.match(html, /href="https:\/\/doi\.org\/10\.1186\/s40662-023-00356-z"/);
  assert.match(html, /<button class="site-build-progress"[^>]*aria-controls="build-status-dialog"/);
  assert.match(html, /id="build-status-dialog"[^>]*role="dialog"[^>]*aria-modal="true"/);
  assert.match(html, /class="build-status-columns"/);
  assert.equal((html.match(/class="build-status-column"/g) ?? []).length, 2);
  assert.match(html, /data-i18n="progress\.current\.title"/);
  assert.match(html, /data-i18n="progress\.next\.title"/);
  assert.match(html, /data-i18n="progress\.current\.bilingual"/);
  assert.match(html, /data-i18n="progress\.next\.timeOfDay"/);
  assert.doesNotMatch(html, /progress\.cases/);
  assert.doesNotMatch(html, /build-status-timeline/);
  assert.match(css, /\.project-detail-visual--paper img \{[\s\S]*object-fit:\s*contain/);
});
