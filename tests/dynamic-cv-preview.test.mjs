import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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
const sharedLayerPixels = `
from PIL import Image
import sys
layers = [Image.open(path).convert('RGBA').getchannel('A') for path in sys.argv[1:]]
print(sum(1 for values in zip(*(layer.get_flattened_data() for layer in layers)) if sum(value > 0 for value in values) > 1))
`;
const countSharedLayerPixels = (paths) => Number(execFileSync('python', ['-c', sharedLayerPixels, ...paths.map((path) => fileURLToPath(file(path)))], { encoding: 'utf8' }).trim());
const opaqueBlueTreeFringePixels = `
from PIL import Image
import sys

image = Image.open(sys.argv[1]).convert('RGBA')
pixels = image.load()
count = 0
for y in range(1, image.height - 1):
    for x in range(1, image.width - 1):
        red, green, blue, alpha = pixels[x, y]
        if alpha != 255 or not (blue > red + 20 and blue > green + 10):
            continue
        if any(pixels[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            count += 1
print(count)
`;
const countOpaqueBlueTreeFringePixels = (path) => Number(execFileSync('python', ['-c', opaqueBlueTreeFringePixels, fileURLToPath(file(path))], { encoding: 'utf8' }).trim());
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
  assert.match(html, /assets\/pixel\/home\/tree-sway-v2-00\.png/);
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
  assert.match(script, /const starColorOrder = \[0, 0, 0, 1, 0, 2, 0, 0, 1, 0\];/);
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

test('keeps every tree glint and drop batch independent over a longer fluorescent fall', () => {
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /const pressDropCounts = \[1, 1, 2, 2, 3, 3, 4, 5, 7\];/);
  assert.match(script, /const pressDropLifetime = 4200;/);
  assert.match(script, /const createTreePressFeedback = \(stage, event\) => \{/);
  assert.match(script, /feedback\.className = 'tree-press-feedback';/);
  assert.match(script, /tree\.append\(feedback\);/);
  assert.match(script, /window\.setTimeout\(\(\) => feedback\.remove\(\), 680\);/);
  assert.match(script, /const summonPressDrops = \(stage\) => \{/);
  assert.match(script, /const dropCount = pressDropCounts\[stage - 1\];/);
  assert.match(script, /const dropZone = canopyDropZones\[Math\.floor\(Math\.random\(\) \* canopyDropZones\.length\)\];/);
  assert.match(script, /const startPoint = pointInZone\(dropZone, Math\.random\(\), Math\.random\(\)\);/);
  assert.match(script, /const stageLane = \(Math\.random\(\) - \.5\) \* \(54 \+ stage \* 4\);/);
  assert.match(script, /const minimumFallDistance = 260 \+ stage \* 18;/);
  assert.match(script, /star\.className = 'fluorescent-rain-star fluorescent-rain-star--press';/);
  assert.match(script, /rain\.append\(\.\.\.stars\);/);
  assert.match(script, /stars\.forEach\(\(star\) => star\.remove\(\)\);/);
  assert.match(script, /tree\.dataset\.treeStage = String\(presses\);/);
  assert.match(script, /createTreePressFeedback\(presses, event\);/);
  assert.match(script, /summonPressDrops\(presses\);/);
  assert.doesNotMatch(script, /rain\.replaceChildren\(\.\.\.stars\);/);
  assert.match(css, /\.tree-press-feedback \{[^}]*position:\s*absolute;[^}]*animation:\s*tree-press-glint 680ms steps\(6, end\);/s);
  assert.match(css, /@keyframes tree-press-glint \{[\s\S]*?scale\(var\(--tree-press-scale, 1\)\)/);
  assert.match(css, /\.fluorescent-rain-star--press \{[^}]*width:\s*4px;[^}]*height:\s*4px;/s);
});

test('limits every tree fluorescent to warm gold and soft white', () => {
  const script = read('assets/js/dynamic-cv.js');
  const treeEasterEgg = script.match(/function initializeTreeEasterEgg\(motionPreference\) \{[\s\S]*?\n\}/)?.[0] ?? '';

  assert.match(treeEasterEgg, /core: '#fff8c7'/);
  assert.match(treeEasterEgg, /core: '#fffdf2'/);
  assert.match(treeEasterEgg, /core: '#ffe6a3'/);
  assert.doesNotMatch(treeEasterEgg, /#c5e6ff|#82b9ff|#ffb0a2|#ee735e/);
  assert.match(treeEasterEgg, /const color = starPalette\[\(stage \* 2 \+ index\) % starPalette\.length\];/);
});

test('provides a local-only Scene Studio for manually positioning the layered night hero', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of ['assets/pixel/home/sky-night-v1.png', 'assets/pixel/home/tree-sway-v2-00.png', 'assets/pixel/home/ground-foundation-v6.png', 'assets/pixel/home/meadow-sway-v2-00.png', 'assets/pixel/home/saber-idle-chunky-v2-00.png']) {
    assert.ok(existsSync(file(asset)), `${asset} must be available to the Scene Studio`);
  }

  assert.match(html, /id="scene-studio"/);
  assert.match(html, /tree-sway-v2-00\.png/);
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

test('previews the combined daytime environmental study in local Scene Studio', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of [
    'assets/pixel/home/sky-day-v2.png',
    'assets/pixel/home/ground-foundation-day-v1.png',
    'assets/pixel/home/meadow-day-wind-v7-00.png',
    'assets/pixel/home/meadow-day-wind-v7-01.png',
    'assets/pixel/home/meadow-day-wind-v7-02.png',
    'assets/pixel/home/meadow-day-wind-v7-03.png',
    'assets/pixel/home/meadow-day-wind-v7-04.png',
    'assets/pixel/home/meadow-day-wind-v7-05.png',
    'assets/pixel/home/meadow-day-wind-v7-06.png',
    'assets/pixel/home/meadow-day-wind-v7-07.png'
  ]) {
    assert.ok(existsSync(file(asset)), `${asset} must be available to the daytime study`);
  }

  assert.match(html, /data-studio-day-src="assets\/pixel\/home\/sky-day-v2\.png"/);
  assert.match(html, /data-studio-day-src="assets\/pixel\/home\/ground-foundation-day-v1\.png"/);
  assert.match(html, /data-studio-day-src="assets\/pixel\/home\/tree-day-v2\.png"/);
  assert.doesNotMatch(html, /malinois/i);
  assert.match(html, /min="0" max="6" step="1" value="6" data-scene-control="day-tree-amplitude"/);
  assert.match(html, /min="4" max="32" step="2" value="4" data-scene-control="day-tree-band-height"/);
  assert.match(html, /min="2" max="7" step="0\.2" value="3" data-scene-control="day-tree-cycle-seconds"/);
  assert.doesNotMatch(html, /data-scene-control="day-wind-strength"/);
  assert.doesNotMatch(html, /bird-day-v1|studio-day-bird/);
  assert.match(script, /searchParams\.get\('studio'\) === 'day'/);
  assert.match(script, /function prepareDaySceneStudio/);
  assert.match(script, /if \(isDaySceneStudio\) \{\s*prepareDaySceneStudio\(studio\);\s*\} else \{\s*createSkyTwinkles/s);
  assert.doesNotMatch(script, /malinois/i);
  assert.doesNotMatch(script, /tree-day-wind-v8-07\.png|tree-day-wind-v9-07\.png/);
  assert.match(script, /const sceneStudioWindDefaults = isDaySceneStudio\s*\?\s*\{\s*'day-tree-amplitude': 6,\s*'day-tree-band-height': 4,\s*'day-tree-cycle-seconds': 3,\s*'day-tree-show-mask': false,\s*'wind-frame-duration': dayWindFrameDuration\s*\}\s*:\s*\{\s*'day-tree-amplitude': 3,\s*'day-tree-band-height': 8,\s*'day-tree-cycle-seconds': 3\.6,\s*'day-tree-show-mask': false,\s*'wind-frame-duration': nightWindFrameDuration\s*\}/s);
  assert.equal((script.match(/\.\.\.sceneStudioWindDefaults/g) ?? []).length, 2, 'initialization and reset must use the approved mode-specific wind defaults');
  assert.match(css, /body\.is-day-scene-studio \.studio-saber \{ display:\s*none;/);
  assert.match(css, /body\.is-day-scene-studio \.studio-control-group--day-wind \{ display:\s*grid;/);
  assert.match(css, /body\.is-day-scene-studio \.studio-layer-ground-foundation \{ display:\s*block;/);
  assert.doesNotMatch(css, /studio-day-ground-base/);
  assert.doesNotMatch(css, /malinois/i);
  assert.match(css, /body\.is-day-scene-studio \.studio-layer-sky \{ filter: brightness\(\.68\) saturate\(\.72\); \}/);
});

test('matches the wind lab controls inside Day Scene Studio', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /<input type="checkbox" data-scene-control="day-tree-show-mask" \/>/);
  assert.match(html, /data-scene-action="day-tree-toggle-pause" aria-pressed="false">Pause tree<\/button>/);
  assert.match(html, /class="studio-tree-depth-key"[\s\S]*Rear dark foliage[\s\S]*Fixed trunk \/ branches[\s\S]*Front bright foliage/);
  assert.match(css, /\.studio-tree-depth-key \{/);
  assert.match(css, /\.studio-day-tree-pause \{/);
  assert.match(css, /body:not\(\.is-day-scene-studio\) \.studio-control-group--day-wind \{ display:\s*none; \}/);
  assert.match(script, /bandHeight:\s*config\['day-tree-band-height'\]/);
  assert.match(script, /maxAmplitude:\s*config\['day-tree-amplitude'\]/);
  assert.match(script, /cycleSeconds:\s*config\['day-tree-cycle-seconds'\]/);
  assert.match(script, /if \(config\['day-tree-show-mask'\]\) \{/);
  assert.match(script, /const stopped = motionPreference\.matches \|\| isPaused;/);
  assert.match(script, /pauseButton\.addEventListener\('click', \(\) => \{/);
  assert.match(script, /key\.startsWith\('day-tree-'\)/);
});

test('renders the validated layered canopy wind inside Day Scene Studio', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of [
    'assets/pixel/home/tree-day-pixel-wind-v2-underfill.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-back.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-fixed.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-front.png'
  ]) {
    assert.ok(existsSync(file(asset)), `${asset} must be available to Day Scene Studio`);
    assert.match(script, new RegExp(asset.replaceAll('/', '\\/').replaceAll('.', '\\.')));
  }

  assert.match(html, /<canvas class="studio-layer studio-layer-tree-wind" data-studio-day-tree-wind width="1672" height="941" hidden aria-hidden="true"><\/canvas>/);
  assert.match(css, /\.studio-layer-tree-wind \{[^}]*image-rendering:\s*pixelated;/s);
  assert.match(css, /body\.is-day-scene-studio \.studio-tree\.is-day-tree-wind-ready \.studio-layer-tree-image \{ display:\s*none; \}/);
  assert.match(css, /body\.is-day-scene-studio \.studio-tree\.is-day-tree-wind-ready \.studio-layer-tree-wind \{ display:\s*block; \}/);
  assert.match(script, /function startDaySceneTreeWind\(studio, config\)/);
  assert.match(script, /maxAmplitude:\s*config\['day-tree-amplitude'\]/);
  assert.match(script, /const elapsedSeconds = stopped \? 0 : \(now - startedAt\) \/ 1000;/);
  assert.match(script, /context\.drawImage\(images\.underfill, 0, 0\);[\s\S]*drawStudioTreeStrips\(context, images\.back, backBands\);[\s\S]*context\.drawImage\(images\.fixed, 0, 0\);[\s\S]*drawStudioTreeStrips\(context, images\.front, frontBands\);/);
  assert.match(script, /isDaySceneStudio && \['tree-sway', 'meadow-sway'\]\.includes\(image\.dataset\.studioAnimation\)/);
});

test('builds a seamless integer-pixel wind field while keeping the day grass base fixed', () => {
  const modulePath = fileURLToPath(file('assets/js/day-ground-wind.js'));
  assert.ok(existsSync(modulePath), 'the reusable day-grass wind field must be available');
  const groundWind = require(modulePath);
  const settings = {
    height: 941,
    bandHeight: 4,
    maxAmplitude: 6,
    cycleSeconds: 3,
    topY: 680,
    anchorY: 842,
    activeSpan: 142
  };
  const still = groundWind.createBandOffsets({ ...settings, elapsedSeconds: 0 });
  const loopEnd = groundWind.createBandOffsets({ ...settings, elapsedSeconds: 3 });
  const active = groundWind.createBandOffsets({ ...settings, elapsedSeconds: .75 });

  assert.deepEqual(loopEnd, still, 'the three-second loop must close on the original pixels');
  assert.equal(still[0].sourceY, 680);
  assert.equal(still.at(-1).sourceY + still.at(-1).sourceHeight, 842);
  assert.ok(active.some(({ offsetX }) => offsetX !== 0), 'the grass tips must move during the loop');
  assert.ok(active.every(({ offsetX }) => Number.isInteger(offsetX) && Math.abs(offsetX) <= 6));
  assert.ok(active.every(({ sourceHeight }) => sourceHeight <= 4));
  for (let index = 1; index < active.length; index += 1) {
    assert.ok(Math.abs(active[index].offsetX - active[index - 1].offsetX) <= 1, 'adjacent grass bands must not tear apart');
  }

  const regions = groundWind.createGuardedDrawRegions(active, settings.topY, settings.anchorY, 1);
  assert.ok(regions.every(({ sourceY, sourceHeight }) => sourceY >= 680 && sourceY + sourceHeight <= 842));
  assert.ok(regions.slice(1).every((region, index) => region.sourceY <= regions[index].sourceY + regions[index].sourceHeight), 'guarded bands must overlap at every seam');
  assert.equal(groundWind.FRAME_INTERVAL, 1000 / 12);
});

test('renders Day Studio grass on a fixed-base Canvas driven by the accepted tree wind controls', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.ok(html.indexOf('assets/js/day-ground-wind.js?v=0.1.85') < html.indexOf('assets/js/dynamic-cv.js?v=0.1.85'), 'the wind-field helper must load before the scene runtime');
  assert.match(html, /<img class="studio-layer studio-layer-ground studio-layer-ground-image"[^>]*data-studio-day-src="assets\/pixel\/home\/meadow-day-v1\.png"/);
  assert.match(html, /<canvas class="studio-layer studio-layer-ground studio-layer-ground-wind" data-studio-day-ground-wind width="1672" height="941" hidden aria-hidden="true"><\/canvas>/);
  assert.match(html, /<label class="studio-wind-frame-control">Motion \/ frame/);
  assert.match(css, /\.studio-layer-ground-wind \{ display:\s*none;/);
  assert.match(css, /body\.is-day-scene-studio \.scene-studio-stage\.is-day-ground-wind-ready \.studio-layer-ground-image \{ display:\s*none; \}/);
  assert.match(css, /body\.is-day-scene-studio \.scene-studio-stage\.is-day-ground-wind-ready \.studio-layer-ground-wind \{ display:\s*block; \}/);
  assert.match(css, /body\.is-day-scene-studio \.studio-wind-frame-control \{ display:\s*none; \}/);
  assert.match(script, /const dayStudioGroundWindAsset = 'assets\/pixel\/home\/meadow-day-v1\.png';/);
  assert.match(script, /function startDaySceneGroundWind\(studio, config\)/);
  assert.match(script, /window\.dayGroundWind\.createBandOffsets\(\{/);
  assert.match(script, /bandHeight:\s*config\['day-tree-band-height'\]/);
  assert.match(script, /maxAmplitude:\s*config\['day-tree-amplitude'\]/);
  assert.match(script, /cycleSeconds:\s*config\['day-tree-cycle-seconds'\]/);
  assert.match(script, /const elapsedSeconds = motionPreference\.matches \? 0 : \(now - startedAt\) \/ 1000;/);
  assert.match(script, /context\.imageSmoothingEnabled = false;/);
  assert.match(script, /context\.drawImage\([\s\S]*dayGroundWind\.ANCHOR_Y,[\s\S]*canvas\.height - dayGroundWind\.ANCHOR_Y/s);
  assert.match(script, /isDaySceneStudio && \['tree-sway', 'meadow-sway'\]\.includes\(image\.dataset\.studioAnimation\)/);
  assert.match(script, /const restartDayGroundWind = isDaySceneStudio \? startDaySceneGroundWind\(studio, config\) : \(\) => \{\};/);
});

test('keeps the approved daytime tree free of opaque blue background residue at its transparent edge', () => {
  assert.equal(countOpaqueBlueTreeFringePixels('assets/pixel/home/tree-day-v2.png'), 0, 'the static day tree must not expose a blue fringe when enlarged');
});

test('keeps the original day tree as the loading fallback for the pixel-locked canvas wind', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /<div class="home-scene-tree-wrap home-scene-day-only">\s*<img class="[^"]*home-scene-tree-day-static[^"]*" src="assets\/pixel\/home\/tree-day-v2\.png" alt="" \/>\s*<canvas class="[^"]*home-scene-tree-day-wind[^"]*" data-home-day-tree-wind[^>]*><\/canvas>/s);
  assert.match(css, /html\[data-scene-theme="day"\] \.home-scene-tree-day \{ filter: brightness\(1\.04\) saturate\(\.94\); \}/);
  assert.doesNotMatch(css, /home-day-tree-sway/);
  assert.doesNotMatch(script, /day-tree-(?:sway|leaf-sway)/);
});

test('lets Scene Studio switch between day and night without a companion control group', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /data-scene-mode="night"/);
  assert.match(html, /data-scene-mode="day"/);
  assert.doesNotMatch(html, /malinois/i);
  assert.doesNotMatch(css, /malinois/i);
  assert.doesNotMatch(script, /malinois/i);
  assert.match(script, /function initializeSceneStudioModeSwitch\(studio\)/);
  assert.match(script, /searchParams\.set\('studio', mode === 'day' \? 'day' : '1'\);/);
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

test('uses eight distinct night tree wind frames while keeping 180ms day and 240ms night paces in Scene Studio', () => {
  const html = read('index.html');
  const script = read('assets/js/dynamic-cv.js');

  const nightTreeFrames = Array.from({ length: 8 }, (_, index) => `assets/pixel/home/tree-sway-v2-${String(index).padStart(2, '0')}.png`);
  for (const asset of [
    ...nightTreeFrames,
    'assets/pixel/home/meadow-sway-v2-00.png',
    'assets/pixel/home/meadow-sway-v2-01.png',
    'assets/pixel/home/meadow-sway-v2-02.png'
  ]) {
    assert.ok(existsSync(file(asset)), `${asset} must be available for the local night-wind preview`);
  }

  assert.match(html, /tree-sway-v2-00\.png/);
  assert.match(script, /const nightTreeWindFrames = Array\.from\(/);
  assert.match(script, /tree-sway-v2-\$\{String\(index\)\.padStart\(2, '0'\)\}\.png/);
  assert.doesNotMatch(script, /tree-sway-v1-0[0-3]\.png/);
  assert.match(html, /min="180" max="900" step="20" value="240" data-scene-control="wind-frame-duration"/);
  assert.match(html, /data-studio-animation="tree-sway"/);
  assert.match(html, /data-studio-animation="meadow-sway"/);
  assert.match(script, /function startSceneStudioAnimation/);
  assert.match(script, /const dayWindFrameDuration = 180;/);
  assert.match(script, /const nightWindFrameDuration = 240;/);
  assert.match(script, /const storageKey = isDaySceneStudio \? 'zhengji-scene-studio-day-v5' : 'zhengji-scene-studio-night-v6';/);
  assert.match(script, /'wind-frame-duration': dayWindFrameDuration/);
  assert.match(script, /'wind-frame-duration': nightWindFrameDuration/);
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
  assert.match(css, /\.home-scene-rig \{[^}]*--foundation-y:\s*4\.8%;[^}]*--foundation-width:\s*1\.02;[^}]*--wind-frame-duration:\s*180ms;/s);
  assert.match(css, /\.home-scene-rig \{[^}]*--home-focus-shift:[^;]+;[^}]*width:\s*max\(100%, calc\(100svh \* 1672 \/ 940\)\);/s);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.home-scene-rig \{[^}]*top:\s*50%;[^}]*bottom:\s*auto;/);
  assert.match(script, /function startHomeSceneAnimation/);
  assert.match(script, /const homeWindFrameDuration = isDayTheme \? dayWindFrameDuration : nightWindFrameDuration;/);
  assert.doesNotMatch(script, /day-tree-(?:sway|leaf-sway)/);
  assert.match(script, /meadow-day-wind-v7-\$\{String\(index\)\.padStart\(2, '0'\)\}\.png/);
});

test('runs the approved layered daytime tree wind on the public homepage', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="[^"]*home-scene-tree-day-static[^"]*"[^>]*src="assets\/pixel\/home\/tree-day-v2\.png"/);
  assert.match(html, /<canvas class="[^"]*home-scene-tree-day-wind[^"]*" data-home-day-tree-wind width="1672" height="941" hidden aria-hidden="true"><\/canvas>/);
  assert.match(css, /\.is-home-day-tree-wind-ready \.home-scene-tree-day-static \{ display:\s*none; \}/);
  assert.match(css, /\.is-home-day-tree-wind-ready \.home-scene-tree-day-wind \{ display:\s*block; \}/);
  assert.match(script, /const homeDayTreeWindConfig = Object\.freeze\(\{\s*bandHeight:\s*4,\s*maxAmplitude:\s*6,\s*cycleSeconds:\s*3\s*\}\);/s);
  assert.match(script, /function startHomeDayTreeWind\(motionPreference\)/);
  assert.match(script, /startHomeDayTreeWind\(motionPreference\);/);
});

test('switches the public portfolio between day and night from local time with explicit preview overrides', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /<html[^>]*data-scene-theme="night"/);
  assert.match(html, /new URLSearchParams\(window\.location\.search\)\.get\('theme'\)/);
  assert.match(html, /hour >= 7 && hour < 18 \? 'day' : 'night'/);
  assert.match(script, /const isDayTheme = document\.documentElement\.dataset\.sceneTheme === 'day';/);
  assert.match(css, /html\[data-scene-theme="day"\] \{[^}]*color-scheme:\s*light;[^}]*--ink:\s*#163a2b;[^}]*--muted:\s*#2c4938;[^}]*--panel:\s*rgb\(205 225 194 \/ 82%\);/s);
  assert.match(css, /html\[data-scene-theme="day"\] body \{[^}]*background:\s*#9fbea0;/s);
  assert.match(script, /bio:\s*\{\s*base:\s*'#a8c8a3',\s*haze:\s*'#82ad8e'/);
  assert.match(script, /contact:\s*\{\s*base:\s*'#a5bd93',\s*haze:\s*'#819f79'/);
  assert.match(css, /html\[data-scene-theme="day"\] \.education-panel \{[^}]*background:\s*linear-gradient\(135deg, rgb\(205 224 191 \/ 88%\), rgb\(174 203 164 \/ 78%\)\);/s);
  assert.match(css, /html\[data-scene-theme="day"\] \.chapter-nav \{ color:\s*rgb\(18 53 36 \/ 82%\); \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.chapter-nav a \{ color:\s*#102f23; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.chapter-home \.home-intro p:last-child,\s*html\[data-scene-theme="day"\] \.chapter-home \.enter-cv \{ color:\s*#fff; \}/);
  assert.doesNotMatch(css, /html\[data-scene-theme="day"\] \.chapter-home \.home-intro p:last-child,\s*html\[data-scene-theme="day"\] \.chapter-home \.enter-cv \{[^}]*(?:background|border|box-shadow|text-shadow|padding):/s);
  assert.match(css, /html\[data-scene-theme="day"\] \.generated-by \{ color:\s*rgb\(27 57 38 \/ 78%\); \}/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="home"\] \.chapter-nav,[\s\S]*?color:\s*rgb\(242 247 244 \/ 72%\);/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="home"\] \.chapter-nav a \{ color:\s*rgb\(248 247 231 \/ 88%\); \}/);
});

test('uses a white fill and readable gold chapter numbers in the daytime compact mobile navigation', () => {
  const css = read('assets/css/dynamic-cv.css');
  const mobileNavigationStyles = css.slice(
    css.indexOf('@media (max-width: 720px) {'),
    css.indexOf('@media (max-width: 760px) {')
  );

  assert.match(css, /html\[data-scene-theme="day"\] \.chapter-nav a \{ color:\s*#102f23; \}/);
  assert.match(mobileNavigationStyles, /html\[data-scene-theme="day"\] \.chapter-nav \{ border-color:\s*#fff;[^}]*background:\s*#fff; \}/);
  assert.match(mobileNavigationStyles, /html\[data-scene-theme="day"\] \.chapter-nav a \{ color:\s*#8f671e; \}/);
  assert.match(mobileNavigationStyles, /html\[data-scene-theme="day"\] \.chapter-nav-number \{ color:\s*currentColor; \}/);
  assert.match(mobileNavigationStyles, /html\[data-scene-theme="day"\] \.chapter-nav a:hover,\s*html\[data-scene-theme="day"\] \.chapter-nav a\[aria-current="true"\] \{ color:\s*#8f671e; border-color:\s*#8f671e; \}/);
  assert.match(mobileNavigationStyles, /html\[data-scene-theme="day"\] body\[data-active-chapter="home"\] \.chapter-nav a,\s*html\[data-scene-theme="day"\] body\[data-active-chapter="home"\] \.chapter-nav a:hover,\s*html\[data-scene-theme="day"\] body\[data-active-chapter="home"\] \.chapter-nav a\[aria-current="true"\] \{ color:\s*#8f671e; \}/);
});

test('publishes the prepared daytime scene without a companion runtime', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  for (const asset of [
    'assets/pixel/home/sky-day-v2.png',
    'assets/pixel/home/ground-foundation-day-v1.png',
    'assets/pixel/home/tree-day-v2.png',
    'assets/pixel/home/meadow-day-wind-v7-00.png'
  ]) {
    assert.ok(existsSync(file(asset)), `${asset} must be available to the public daytime scene`);
    assert.match(html, new RegExp(asset.replaceAll('/', '\\/').replaceAll('.', '\\.')));
  }

  assert.doesNotMatch(html, /malinois/i);
  assert.match(css, /\.home-scene-day-only \{ display:\s*none; \}/);
  assert.match(css, /html\[data-scene-theme="night"\] \.home-scene-day-only \{ display:\s*none; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.home-scene-night-only \{ display:\s*none; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.home-scene-day-only \{ display:\s*block; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.home-tree-easter-egg,[\s\S]*?\.home-saber-theme-trigger,[\s\S]*?display:\s*none;/);
  assert.match(script, /if \(!isDayTheme\) \{\s*initializeTreeEasterEgg\(reducedMotion\);\s*initializeSaberThemeEasterEgg\(\);/s);
  assert.doesNotMatch(script, /'day-tree-(?:sway|leaf-sway)':/);
  assert.match(script, /'day-meadow-sway':\s*Array\.from\(\{ length: 8 \}/);
  assert.doesNotMatch(script, /malinois/i);
  assert.doesNotMatch(css, /html\[data-scene-theme="day"\] \.home-scene-tree-wrap\.home-scene-day-only \{[^}]*transform:/);
  assert.doesNotMatch(css, /malinois/i);
});

test('keeps daytime and nighttime scene layers registered to the same medium-screen coordinates', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.doesNotMatch(css, /@media \(min-width:\s*721px\) and \(max-aspect-ratio:\s*4\/3\) \{[\s\S]*?html\[data-scene-theme="day"\] \.home-scene-tree-wrap\.home-scene-day-only \{[^}]*transform:/);
  assert.match(css, /\.home-scene-tree-wrap \{[^}]*transform:\s*translate\(var\(--tree-x\), var\(--tree-y\)\) scale\(var\(--tree-scale\)\);/s);
});

test('replaces the daytime starfield with one-colour pixel leaves', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="home-day-leaves home-scene-day-only"/);
  assert.match(script, /function createHomeDayLeaves\(container, count = 24\)/);
  assert.match(script, /createHomeDayLeaves\(homeScene\.querySelector\('\.home-day-leaves'\)\);/);
  assert.match(script, /function seededLeaves\(count\)/);
  assert.match(script, /function drawDayLeaves\(palette, time\)/);
  assert.match(script, /context\.fillStyle = palette\.leaf;/);
  assert.doesNotMatch(script, /size:\s*index % 11 === 0 \? 2 : 1/);
  assert.doesNotMatch(script, /size \* 3/);
  assert.match(script, /const orientation = \(leaf\.depth \+ Math\.floor\(drift \* 12\)\) % 4;/);
  assert.match(css, /\.home-day-leaf \{[^}]*width:\s*2px;[^}]*height:\s*1px;[^}]*box-shadow:\s*1px -1px 0/s);
  assert.match(script, /const drift = reducedMotion\.matches \? 0 :/);
  assert.match(script, /if \(isDayTheme\) \{\s*drawDayLeaves\(palette, time\);\s*\} else \{/s);
  assert.match(script, /if \(isDayTheme \|\| reducedMotion\.matches \|\| activeChapter === 'home'\) return;/);
  assert.match(css, /html\[data-scene-theme="day"\] \.home-sky-twinkles,[\s\S]*?\.home-canopy-sparkles \{ display:\s*none; \}/);
});

test('uses dark chapter accents for legible daytime titles and project labels', () => {
  const script = read('assets/js/dynamic-cv.js');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /html\[data-scene-theme="night"\] body\[data-active-chapter="ophthalmic"\] \{ --gold: #b7e9ff; --blue: #7cf8df; \}/);
  assert.doesNotMatch(css, /(?:^|\n)body\[data-active-chapter="ophthalmic"\] \{ --gold:/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="education"\] \{ --gold: #3d2458; --blue: #23366a; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="ophthalmic"\] \{ --gold: #063b4b; --blue: #06432e; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="industrial"\] \{ --gold: #4a2d05; --blue: #0a3e4c; \}/);
  assert.match(css, /html\[data-scene-theme="day"\] body\[data-active-chapter="contact"\] \{ --gold: #4a2e06; --blue: #38265e; \}/);
  assert.doesNotMatch(css, /--day-text-accent/);
  assert.match(css, /html\[data-scene-theme="day"\] \.chapter-ophthalmic \.project-case-card,[\s\S]*?html\[data-scene-theme="day"\] \.chapter-industrial \.project-case-card \{ --case-accent:\s*var\(--blue\); \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.project-case-action \{ color:\s*var\(--blue\); \}/);
  assert.match(css, /html\[data-scene-theme="day"\] \.background-index-number \{ color:\s*var\(--blue\); \}/);
  assert.match(script, /education: \{ base: '#aebf91',[\s\S]*?gold: '#3d2458', blue: '#23366a'/);
  assert.match(script, /ophthalmic: \{ base: '#98c3a6',[\s\S]*?gold: '#063b4b', blue: '#06432e'/);
  assert.match(script, /industrial: \{ base: '#91b8a4',[\s\S]*?gold: '#4a2d05', blue: '#0a3e4c'/);
  assert.match(script, /contact: \{ base: '#a5bd93',[\s\S]*?gold: '#4a2e06', blue: '#38265e'/);
});

test('brings the night-sky twinkles and canopy sparkles into the deployed homepage', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /class="home-sky-twinkles home-scene-night-only"/);
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
  assert.match(script, /if \(isDayTheme \|\| reducedMotion\.matches \|\| activeChapter === 'home'\) return;/);
  assert.match(script, /const moment = time % meteorCycleDuration;/);
});

test('sends the Lunar cruiser across the full night viewport and the Hyperion through its full diagonal', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.ok(existsSync(file('assets/pixel/background/hyperion-background-fleet-v4.png')));
  assert.ok(existsSync(file('assets/pixel/background/lunar-cruiser-background-fleet-v1.png')));
  assert.match(script, /const backgroundFleetFlightDuration = 9600;/);
  assert.match(script, /const backgroundFleet = \[/);
  assert.match(script, /src: 'assets\/pixel\/background\/hyperion-background-fleet-v4\.png', image: new Image\(\), width: 48, height: 37, startY: -\.16, endY: 1\.04/);
  assert.match(script, /src: 'assets\/pixel\/background\/lunar-cruiser-background-fleet-v1\.png', image: new Image\(\), width: 52, height: 24, startY: \.66, endY: \.66/);
  assert.match(script, /function drawBackgroundFleet\(time\) \{/);
  assert.match(script, /if \(isDayTheme \|\| reducedMotion\.matches \|\| activeChapter === 'home'\) return;/);
  assert.match(script, /const backgroundFleetEntryChance = \.45;/);
  assert.match(script, /const backgroundFleetDelay = \(\) => 24000 \+ Math\.random\(\) \* 36000;/);
  assert.match(script, /backgroundFleetState\.nextAppearanceAt = Math\.random\(\) < backgroundFleetEntryChance \? time \+ 6000 \+ Math\.random\(\) \* 12000 : Infinity;/);
  assert.match(script, /const progress = Math\.min\(1, \(time - backgroundFleetState\.startedAt\) \/ backgroundFleetFlightDuration\);/);
  assert.match(script, /const x = -drawWidth \+ \(width \+ drawWidth \* 2\) \* progress;/);
  assert.match(script, /const y = Math\.round\(\(ship\.startY \+ \(ship\.endY - ship\.startY\) \* progress\) \* height\);/);
  assert.match(script, /context\.imageSmoothingEnabled = false;/);
  assert.match(script, /context\.globalAlpha = Math\.min\(progress \* 10, \(1 - progress\) \* 10, 1\) \* \.62;/);
  assert.match(script, /context\.drawImage\(ship\.image, Math\.round\(x\), y, drawWidth, drawHeight\);/);
  assert.match(script, /drawBackgroundFleet\(time\);/);
  assert.match(script, /if \(nextChapter !== 'home' && activeChapter === 'home'\) resetBackgroundFleet\(performance\.now\(\)\);/);
});

test('keeps the Bio background free of the detached horizon ornament', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.doesNotMatch(script, /function drawBioScene\(/);
  assert.doesNotMatch(script, /activeChapter === 'bio'\) drawBioScene/);
});

test('keeps the Bio rice-bowl caption visible on mobile', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /Beginning from curiosity\.<br \/>Keeping the bowl large\./);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.scene-bio figcaption \{[^}]*display:\s*block;[^}]*left:\s*8%;[^}]*bottom:\s*5%;/s);
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
  assert.match(html, /<html lang="en" data-motion-variant="scroll-starlight" data-scene-theme="night">/);
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

test('shows the living CV construction status at fifty percent', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /class="site-build-progress"[^>]*aria-label="Site construction progress: 50%"/);
  assert.match(html, /Site under construction <b>50%<\/b>/);
  assert.match(css, /\.site-build-progress \.build-fill \{[^}]*width:\s*50%;/s);
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

test('unlocks the contact-title easter egg on its sixth click', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.match(html, /id="contact-title"[^>]*class="contact-title-easter-egg"[^>]*data-contact-easter-egg-trigger/);
  assert.match(html, /class="contact-easter-egg-progress"[^>]*data-contact-easter-egg-progress[^>]*data-contact-progress="0"/);
  assert.equal((html.match(/class="contact-easter-egg-pixel"/g) ?? []).length, 5);
  assert.match(html, /data-contact-easter-egg-status[^>]*aria-live="polite"/);
  assert.match(css, /\.contact-title-easter-egg \{[^}]*cursor:\s*pointer;[^}]*touch-action:\s*manipulation;/s);

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
  for (let click = 0; click < 5; click += 1) listeners.click();
  assert.equal(trigger.textContent, '道阻且长 行则将至。');
  listeners.click();
  assert.equal(trigger.textContent, '蛋糕店里卖蛋糕');
  assert.equal(new Set(contactEasterEggLyrics).size, contactEasterEggLyrics.length);
  assert.equal(contactEasterEggLyrics.at(-1), '哎呀我去你不早说');
  assert.doesNotMatch(contactEasterEggLyrics.join('\n'), /我去 你怎么不早说/);
});

test('keeps the contact-title easter egg completely dormant in English', () => {
  const css = read('assets/css/dynamic-cv.css');
  const { initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const classes = new Set();
  const attributes = {};
  let titleHtml = 'Fata viam<br /><i>invenient.</i>';
  let titleText = 'Fata viam invenient.';
  const trigger = {
    dataset: {},
    offsetWidth: 800,
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); }
    },
    get textContent() { return titleText; },
    set textContent(value) { titleText = value; titleHtml = value; },
    get innerHTML() { return titleHtml; },
    set innerHTML(value) { titleHtml = value; titleText = value; },
    setAttribute(name, value) { attributes[name] = value; },
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const progress = { dataset: { contactProgress: '0' }, classList: { add() {}, remove() {} } };
  const status = { textContent: '' };
  const document = {
    documentElement: { lang: 'en' },
    querySelector(selector) {
      if (selector === '[data-contact-easter-egg-trigger]') return trigger;
      if (selector === '[data-contact-easter-egg-progress]') return progress;
      if (selector === '[data-contact-easter-egg-status]') return status;
      return null;
    }
  };

  initializeContactEasterEgg(document);
  for (let click = 0; click < 6; click += 1) listeners.click();

  assert.equal(trigger.textContent, 'Fata viam invenient.');
  assert.equal(trigger.dataset.contactStage, undefined);
  assert.equal(trigger.dataset.contactUnlocked, undefined);
  assert.equal(trigger.dataset.contactEasterEggEnabled, 'false');
  assert.equal(progress.dataset.contactProgress, '0');
  assert.equal(classes.size, 0);
  assert.equal(status.textContent, '');
  assert.equal(attributes['aria-disabled'], 'true');
  assert.equal(attributes.tabindex, '-1');
  assert.match(css, /\.contact-title-easter-egg\[data-contact-easter-egg-enabled="false"\] \{[^}]*cursor:\s*default;[^}]*touch-action:\s*auto;/s);
  assert.match(css, /\.contact-title-easter-egg\[data-contact-easter-egg-enabled="false"\] \+ \.contact-easter-egg-progress \{[^}]*visibility:\s*hidden;/s);

  document.documentElement.lang = 'zh-CN';
  listeners.click();
  assert.equal(trigger.dataset.contactEasterEggEnabled, 'true');
  assert.equal(trigger.dataset.contactStage, '1');
  assert.equal(progress.dataset.contactProgress, '1');
});

test('guides the six Chinese contact-title presses with growing knock feedback and pixel progress', () => {
  const css = read('assets/css/dynamic-cv.css');
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const classes = new Set();
  const progressClasses = new Set();
  const attributes = {};
  let titleHtml = 'Fata viam<br /><i>invenient.</i>';
  let titleText = 'Fata viam invenient.';
  const trigger = {
    dataset: {},
    offsetWidth: 800,
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      contains(name) { return classes.has(name); }
    },
    get textContent() { return titleText; },
    set textContent(value) { titleText = value; titleHtml = value; },
    get innerHTML() { return titleHtml; },
    set innerHTML(value) { titleHtml = value; titleText = value; },
    setAttribute(name, value) { attributes[name] = value; },
    addEventListener(type, listener) { listeners[type] = listener; }
  };
  const progress = {
    dataset: { contactProgress: '0' },
    classList: {
      add(...names) { names.forEach((name) => progressClasses.add(name)); },
      remove(...names) { names.forEach((name) => progressClasses.delete(name)); }
    }
  };
  const status = { textContent: '' };
  const document = {
    documentElement: { lang: 'zh-CN' },
    querySelector(selector) {
      if (selector === '[data-contact-easter-egg-trigger]') return trigger;
      if (selector === '[data-contact-easter-egg-progress]') return progress;
      if (selector === '[data-contact-easter-egg-status]') return status;
      return null;
    }
  };

  initializeContactEasterEgg(document);
  for (let stage = 1; stage <= 5; stage += 1) {
    listeners.click();
    assert.equal(trigger.dataset.contactStage, String(stage));
    assert.equal(progress.dataset.contactProgress, String(stage));
    assert.equal(trigger.textContent, 'Fata viam invenient.');
  }
  assert.equal(classes.has('is-contact-gathering'), true);

  listeners.click();
  assert.equal(trigger.dataset.contactStage, '6');
  assert.equal(trigger.dataset.contactUnlocked, 'true');
  assert.equal(progress.dataset.contactProgress, '5');
  assert.equal(progressClasses.has('is-complete'), true);
  assert.equal(classes.has('is-contact-unlocking'), true);
  assert.equal(attributes['aria-pressed'], 'true');
  assert.equal(trigger.textContent, contactEasterEggLyrics[0]);
  assert.match(status.textContent, /已解锁/);

  assert.match(css, /\.contact-easter-egg-progress \{[^}]*grid-template-columns:\s*repeat\(5, 4px\);/s);
  assert.match(css, /\.contact-title-easter-egg\[data-contact-stage="6"\] \{[^}]*--contact-knock-scale:\s*1\.06;/s);
  assert.match(css, /\.contact-title-easter-egg\.is-contact-pressed \{[^}]*animation:\s*contact-title-knock 320ms steps\(5, end\);/s);
  assert.match(css, /\.contact-title-easter-egg\.is-contact-unlocking \{[^}]*animation:\s*contact-title-unlock 620ms steps\(7, end\);/s);
  assert.match(css, /\.contact-title-easter-egg\.is-word-swapping \{[^}]*animation:\s*contact-title-word-swap 240ms ease-out;/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.contact-title-easter-egg \{ animation:\s*none !important;/);
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
  for (let click = 0; click < 7; click += 1) listeners.click();
  assert.equal(trigger.textContent, '面包店里卖面包');
});

test('shakes the final contact lyric like an emphasized shout', () => {
  const css = read('assets/css/dynamic-cv.css');
  const { contactEasterEggLyrics, initializeContactEasterEgg } = require(fileURLToPath(file('assets/js/i18n.js')));
  const listeners = {};
  const classes = new Set();
  const originalTitle = 'Fata viam<br /><i>invenient.</i>';
  let titleHtml = originalTitle;
  let titleText = 'Fata viam invenient.';
  const trigger = {
    dataset: {},
    offsetWidth: 800,
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); }
    },
    get textContent() { return titleText; },
    set textContent(value) { titleText = value; titleHtml = value; },
    get innerHTML() { return titleHtml; },
    set innerHTML(value) { titleHtml = value; titleText = value; },
    setAttribute() {},
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

  assert.equal(trigger.textContent, '哎呀我去你不早说');
  assert.equal(classes.has('is-contact-shouting'), true);
  assert.match(css, /\.contact-title-easter-egg\.is-contact-shouting \{[^}]*animation:\s*contact-title-shout 680ms steps\(9, end\);/s);
  assert.match(css, /\.contact-panel h2 \{[^}]*font-size:\s*clamp\(4rem, 9vw, 9\.6rem\);/s);
  assert.match(css, /\.contact-title-easter-egg\.is-contact-shouting \{[^}]*font-size:\s*clamp\(5\.5rem, 11\.5vw, 11rem\);[^}]*text-wrap:\s*balance;/s);
  assert.match(css, /@keyframes contact-title-shout[\s\S]*?rotate\(-\.7deg\)[\s\S]*?rotate\(\.7deg\)/);

  listeners.click();
  assert.equal(trigger.innerHTML, originalTitle);
  assert.equal(classes.has('is-contact-shouting'), false);
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
  for (let click = 0; click < contactEasterEggLyrics.length + 6; click += 1) listeners.click();
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
  for (let click = 0; click < contactEasterEggLyrics.length + 6; click += 1) listeners.click();
  assert.equal(trigger.innerHTML, chineseTitle);
});

test('records the language scope of the contact easter egg in the interaction rules', () => {
  const rulesPath = file('docs/design/INTERACTION_RULES.md');
  assert.equal(existsSync(rulesPath), true, 'docs/design/INTERACTION_RULES.md must exist');
  const rules = read('docs/design/INTERACTION_RULES.md');
  const agents = read('AGENTS.md');

  assert.match(rules, /05.*文字彩蛋[\s\S]*仅.*zh-CN/);
  assert.match(rules, /英文[\s\S]*不累计点击[\s\S]*不触发动效[\s\S]*不点亮/);
  assert.match(rules, /英文版彩蛋[\s\S]*明确确认/);
  assert.match(agents, /docs\/design\/INTERACTION_RULES\.md/);
});

test('organizes documentation into indexed rules and versioned change records', () => {
  for (const path of [
    'docs/README.md',
    'docs/CHANGELOG.md',
    'docs/design/INTERACTION_RULES.md',
    'docs/changes/0.1.65.md',
    'docs/changes/0.1.66.md',
    'docs/changes/0.1.67.md',
    'docs/changes/0.1.68.md',
    'docs/changes/0.1.69.md',
    'docs/changes/0.1.70.md',
    'docs/changes/0.1.71.md',
    'docs/changes/0.1.72.md',
    'docs/changes/0.1.73.md'
  ]) assert.equal(existsSync(file(path)), true, `${path} must exist`);

  assert.equal(existsSync(file('docs/INTERACTION_RULES.md')), false);
  assert.equal(existsSync(file('docs/changes/2026-07-31.md')), false);
  const index = read('docs/README.md');
  const changelog = read('docs/CHANGELOG.md');
  const currentChanges = read('docs/changes/0.1.73.md');
  const homeChanges = [
    read('docs/changes/0.1.65.md'),
    read('docs/changes/0.1.66.md'),
    read('docs/changes/0.1.67.md'),
    read('docs/changes/0.1.68.md')
  ].join('\n');
  const agents = read('AGENTS.md');
  const ignore = read('.gitignore');

  assert.match(index, /design\/INTERACTION_RULES\.md[\s\S]*长期有效/);
  assert.match(index, /CHANGELOG\.md[\s\S]*版本/);
  assert.match(index, /changes\/<version>\.md[\s\S]*实现/);
  assert.match(changelog, /0\.1\.73[\s\S]*0\.1\.72[\s\S]*0\.1\.71[\s\S]*0\.1\.70[\s\S]*0\.1\.69[\s\S]*0\.1\.68[\s\S]*0\.1\.67[\s\S]*0\.1\.66[\s\S]*0\.1\.65/);
  assert.match(changelog, /0\.1\.65[\s\S]*5b74db9/);
  assert.match(homeChanges, /00.*夜景[\s\S]*Saber.*音乐彩蛋[\s\S]*树木彩蛋/);
  assert.match(currentChanges, /0\.1\.73[\s\S]*跨章节[\s\S]*点击 Saber[\s\S]*暂停/);
  assert.match(agents, /package\.json[\s\S]*docs\/changes\/<version>\.md/);
  assert.match(agents, /docs\/CHANGELOG\.md/);
  assert.doesNotMatch(ignore, /^\/docs\/$/m);
  assert.match(ignore, /^\/docs\/\*\.bundle$/m);
});

test('keeps Education as a distinct part of the Background chapter', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');

  assert.match(html, /<a href="#education" data-nav="education" data-mobile-label="Background"[^>]*><span class="chapter-nav-number">02<\/span> <span class="chapter-nav-label"[^>]*>Background<\/span><\/a>/);
  assert.match(html, /<p class="eyebrow"[^>]*data-i18n="background\.eyebrow">02 \/ Path<\/p>/);
  assert.match(html, /<h2 id="education-title"[^>]*>Profile<\/h2>/);
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
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.equal((html.match(/class="background-index-card"/g) ?? []).length, 3);
  assert.match(html, /aria-controls="path-history-dialog"[\s\S]*Education & Career[\s\S]*Degrees and research roles/);
  assert.match(html, /<h2 id="path-history-title"[^>]*>Education & Career<\/h2>/);
  assert.equal(translations['zh-CN']['background.history.title'], '教育 / 职业经历');
  assert.equal(translations['zh-CN']['background.history.subtitle'], '学位与科研岗位');
  assert.equal(translations['zh-CN']['history.title'], '教育 / 职业经历');
  assert.match(html, /aria-controls="path-skills-dialog"[\s\S]*Skills/);
  assert.match(html, /aria-controls="path-publications-dialog"[\s\S]*Publications/);
  assert.doesNotMatch(html.match(/<section class="chapter chapter-education"[\s\S]*?<\/section>/)?.[0] ?? '', /\+/);
  assert.match(css, /\.background-index-grid \{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.background-index-grid \{[^}]*grid-template-columns:\s*1fr;/s);
});

test('gives Background entry cards a larger desktop reading hierarchy', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.background-index-card \{[^}]*min-height:\s*220px;[^}]*padding:\s*20px 18px;/s);
  assert.match(css, /\.background-index-number,\s*\.background-index-action \{[^}]*font:\s*500 11px\/1\.3 "DM Mono"/s);
  assert.match(css, /\.background-index-card strong \{[^}]*font:\s*500 16px\/1\.35 Manrope/);
  assert.match(css, /\.background-index-card small \{[^}]*font:\s*11px\/1\.5 "DM Mono"/);
  assert.match(css, /@media \(min-width: 761px\) \{[\s\S]*?\.background-index-card \{[^}]*grid-template-rows:\s*auto 1fr 4\.5em auto;/s);
});

test('uses a readable supporting type scale beneath the display headings', () => {
  const css = read('assets/css/dynamic-cv.css');

  assert.match(css, /\.chapter-note \{[^}]*font-size:\s*15px;/s);
  assert.match(css, /\.bio-statement p \{[^}]*font-size:\s*15px;/s);
  assert.match(css, /\.project-case-title \{[^}]*font:\s*500 15px\/1\.35 Manrope/);
  assert.match(css, /\.project-detail-sections section p:last-child \{[^}]*font-size:\s*15px;/s);
  assert.match(css, /\.path-entry-location \{[^}]*font-size:\s*14px;/s);
  assert.match(css, /\.scene figcaption \{[^}]*font-size:\s*11px;/s);
  assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.chapter-nav a \{[^}]*font-size:\s*10px;/s);
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
    '../pixel/home/tree-sway-v2-00.png',
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
    'assets/pixel/home/tree-day-v1.png',
    ...Array.from({ length: 8 }, (_, index) => `assets/pixel/home/meadow-day-wind-v6-${String(index).padStart(2, '0')}.png`),
    ...Array.from({ length: 4 }, (_, version) => Array.from({ length: 8 }, (_, index) => `assets/pixel/home/tree-day-wind-v${version + 6}-${String(index).padStart(2, '0')}.png`)).flat(),
    ...Array.from({ length: 4 }, (_, index) => `assets/pixel/home/tree-sway-v1-${String(index).padStart(2, '0')}.png`),
    'assets/pixel/home/malinois-body-v3.png',
    ...Array.from({ length: 15 }, (_, index) => `assets/pixel/home/malinois-belly-v2-${String(index).padStart(2, '0')}.png`),
    ...Array.from({ length: 15 }, (_, index) => `assets/pixel/home/malinois-head-v5-${String(index).padStart(2, '0')}.png`),
    ...Array.from({ length: 8 }, (_, index) => `assets/pixel/home/malinois-tail-v3-${String(index).padStart(2, '0')}.png`),
    'assets/scene/Personal website.lnk',
    'assets/scene/hero-time-tree-saber-v3.png',
  ];

  for (const asset of unusedAssets) {
    assert.doesNotMatch(trackedAssets, new RegExp(`^${asset.replaceAll('.', '\\.')}$`, 'm'), `${asset} must stay out of the published site`);
  }

  for (const ignoredRule of [
    '/tmp/',
    '/tools/',
    '/day-scene-v2.png',
    '/assets/pixel/home/tree-sway-v1-*.png',
    '/assets/pixel/home/tree-day-wind-v[1-9]-*.png',
    '/assets/pixel/home/meadow-day-wind-v[1-6]-*.png',
    '/assets/pixel/home/malinois-*.png'
  ]) {
    assert.ok(read('.gitignore').split(/\r?\n/).includes(ignoredRule), `${ignoredRule} must protect local-only output`);
  }
});

test('keeps the completed scene workspace free of retired visual experiments', () => {
  const activeHomeAssets = new Set([
    'ground-foundation-day-v1.png',
    'ground-foundation-v6.png',
    'meadow-day-v1.png',
    ...Array.from({ length: 8 }, (_, index) => `meadow-day-wind-v7-${String(index).padStart(2, '0')}.png`),
    ...Array.from({ length: 3 }, (_, index) => `meadow-sway-v2-${String(index).padStart(2, '0')}.png`),
    'saber-eyes-v2-closed.png',
    'saber-eyes-v2-half.png',
    'saber-eyes-v2-open.png',
    ...Array.from({ length: 8 }, (_, index) => `saber-idle-chunky-v2-${String(index).padStart(2, '0')}.png`),
    'sky-day-v2.png',
    'sky-night-v1.png',
    'tree-day-v2.png',
    'tree-day-pixel-wind-v2-back.png',
    'tree-day-pixel-wind-v2-fixed.png',
    'tree-day-pixel-wind-v2-front.png',
    'tree-day-pixel-wind-v2-underfill.png',
    ...Array.from({ length: 8 }, (_, index) => `tree-sway-v2-${String(index).padStart(2, '0')}.png`)
  ]);
  const trackedHomeAssets = execFileSync('git', ['ls-files', 'assets/pixel/home'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((path) => path.split('/').at(-1))
    .filter((name) => /\.(?:gif|jpe?g|png|webp)$/i.test(name));
  const diskHomeAssets = readdirSync(file('assets/pixel/home')).filter((name) => /\.(?:gif|jpe?g|png|webp)$/i.test(name));
  const retiredAssets = diskHomeAssets.filter((name) => !activeHomeAssets.has(name)).sort();

  for (const asset of activeHomeAssets) {
    assert.ok(trackedHomeAssets.includes(asset), `${asset} must remain tracked in the active scene pack`);
    assert.ok(diskHomeAssets.includes(asset), `${asset} must remain available on disk`);
  }
  assert.equal(retiredAssets.length, 0, `retired home assets remain: ${retiredAssets.slice(0, 12).join(', ')}`);
  assert.equal(existsSync(file('tmp')), false, 'temporary visual exports must be removed after approval');
  assert.equal(existsSync(file('day-scene-v2.png')), false, 'the root-level Day Studio capture must be removed after approval');
  for (const artifact of [
    'output',
    'design-proposal',
    'assets/brand/ysu_bw.png',
    'assets/papers/corvis-figure-1.jpg',
    'assets/papers/corvis-figure-2.jpg',
    'assets/papers/corvis-figure-3.jpg',
    'assets/papers/corvis-figure-4.jpg',
    'assets/papers/corvis-figure-6.jpg',
    'assets/papers/corvis-figure-7.jpg',
    'assets/papers/corvis-figure-8.jpg',
    'assets/papers/dims-figure-3.png',
    'assets/scene/Personal website.lnk'
  ]) {
    assert.equal(existsSync(file(artifact)), false, `${artifact} belongs to a retired visual workspace`);
  }
  for (const tool of ['tools/build_malinois_head_frames.py', 'tools/build_malinois_rig.py', 'tools/clean_tree_day_fringes.py']) {
    assert.equal(existsSync(file(tool)), false, `${tool} belongs to a retired experiment`);
  }
  assert.doesNotMatch(execFileSync('git', ['ls-files', 'tmp', 'day-scene-v2.png', 'tools'], { encoding: 'utf8' }), /\S/, 'temporary visual exports and local tooling must stay out of the published repository');
  assert.match(read('.gitignore'), /^\/tmp\/$/m, 'future temporary renders must stay out of the worktree');
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

  assert.match(html, /aria-label="Site construction progress: 50%"/);
  assert.match(html, /Site under construction <b>50%<\/b>/);
  assert.match(html, /<p>© 2026 · Zhengji Liu<\/p>/);
  assert.doesNotMatch(html, /built as a living CV/);
  assert.match(css, /\.site-build-progress \.build-fill \{[^}]*width:\s*50%;/s);
  assert.match(css, /footer \{[^}]*font-size:\s*11px;/s);
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
  assert.match(history, /Education & Career/);
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

  assert.match(css, /\.path-subsection-label \{[^}]*font:\s*500 11px\/1\.4 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-role \{[^}]*font:\s*500 11px\/1\.35 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-heading strong \{[^}]*font-size:\s*16px;/s);
  assert.match(css, /\.path-entry-heading time \{[^}]*font:\s*500 10px\/1\.45 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-location \{[^}]*font-size:\s*14px;/s);
  assert.match(css, /\.path-entry-details dt \{[^}]*font:\s*500 10px\/1\.5 "DM Mono", monospace;/s);
  assert.match(css, /\.path-entry-details dd \{[^}]*font-size:\s*14px;/s);
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
  assert.match(batteryCase, /Battery Cover Terminal[\s\S]*Weld Seam Defect Inspection/);
  assert.match(batteryCase, /<dt[^>]*>Company<\/dt>[\s\S]*Confidential battery manufacturer/);
  assert.match(batteryCase, /<dt[^>]*>Project date<\/dt>[\s\S]*Not publicly disclosed/);
  assert.match(batteryCase, /<dt[^>]*>Role<\/dt>[\s\S]*Machine Vision Engineer/);
  assert.match(batteryCase, /Project overview[\s\S]*My contribution[\s\S]*Project outcome/);
  assert.doesNotMatch(batteryCase, /<dt>Domain<\/dt>|<dt>Signal<\/dt>|<dt>Status<\/dt>|Inspection observation|Engineering intent/);
});

test('uses Ophthalmic and Industrial as scalable case indexes', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));
  const ophthalmic = html.match(/<section class="chapter chapter-ophthalmic"[\s\S]*?<\/section>/)?.[0] ?? '';
  const industrial = html.match(/<section class="chapter chapter-industrial"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(ophthalmic, /<p class="eyebrow"[^>]*data-i18n="ophthalmic\.eyebrow">03 \/ ophthalmic imaging<\/p>/);
  assert.match(industrial, /<p class="eyebrow"[^>]*data-i18n="industrial\.eyebrow">04 \/ industrial inspection<\/p>/);
  assert.equal(translations['zh-CN']['ophthalmic.eyebrow'], '03 / 眼科影像');
  assert.equal(translations['zh-CN']['industrial.eyebrow'], '04 / 工业检测');
  assert.equal((ophthalmic.match(/class="section-statement"/g) ?? []).length, 1);
  assert.equal((industrial.match(/class="section-statement"/g) ?? []).length, 1);
  assert.equal((ophthalmic.match(/class="project-case-card(?:\s|")/g) ?? []).length, 6);
  assert.equal((industrial.match(/class="project-case-card(?:\s|")/g) ?? []).length, 3);
  assert.match(ophthalmic, /Corvis ST Corneal Image Super-Resolution/);
  assert.match(ophthalmic, /OCT Choroidal Segmentation Algorithm/);
  assert.match(ophthalmic, /OCT Choroidal Vessel Segmentation Algorithm/);
  assert.match(ophthalmic, /OCT Choroidal Analysis Platform/);
  assert.match(ophthalmic, /DIMS Myopia Prediction Statistical Model/);
  const eventCameraCase = ophthalmic.match(/<article class="project-case-card project-case-card--placeholder"[^>]*data-i18n-aria-label="ophthalmic\.case6\.label"[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(eventCameraCase, /data-i18n="case\.06">Case 06<\/span>/);
  assert.match(eventCameraCase, /data-i18n="ophthalmic\.case6\.title">Fundus Event Camera Experiment<\/span>/);
  assert.match(eventCameraCase, /data-i18n="action\.pendingSetup">Pending setup<\/span>/);
  assert.doesNotMatch(eventCameraCase, /data-project-open=/);
  assert.equal(translations['zh-CN']['ophthalmic.case6.title'], '眼底事件相机实验项目');
  assert.equal(translations['zh-CN']['ophthalmic.case6.label'], '眼底事件相机实验项目，待建立');
  assert.equal((ophthalmic.match(/project-case-card--placeholder/g) ?? []).length, 4);
  assert.match(industrial, /Battery Cover Terminal Weld Seam Defect Inspection/);
  assert.match(industrial, /Battery Cover Terminal Reverse-Side Adhesive Ring Defect Inspection/);
  assert.match(industrial, /Battery Cover Safety Vent Weld Seam Defect Inspection/);
  assert.equal((industrial.match(/project-case-card--placeholder/g) ?? []).length, 2);
  assert.doesNotMatch(industrial, /data-project-open="battery-cover-terminal-reverse-ring"|data-project-open="battery-cover-safety-vent"/);
  assert.doesNotMatch(ophthalmic, /capability-list|chapter-note/);
  assert.doesNotMatch(industrial, /project-points|chapter-note/);
  assert.match(css, /\.project-case-list \{[^}]*display:\s*grid;[^}]*gap:\s*8px;/s);
  assert.match(css, /\.project-case-card \{[^}]*width:\s*min\(100%, 520px\);[^}]*min-height:\s*72px;/s);
  assert.match(css, /\.project-case-card--placeholder \{[^}]*cursor:\s*default;/s);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.project-case-card \{[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\);/s);
});

test('opens source-backed ophthalmic cases in adaptive project drawers', () => {
  const html = read('index.html');

  for (const [trigger, dialog, title] of [
    ['corvis-super-resolution', 'corvis-super-resolution-dialog', 'Corvis ST Corneal Image Super-Resolution'],
    ['choroidal-oct-analysis', 'choroidal-oct-analysis-dialog', 'OCT Choroidal Segmentation Algorithm'],
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
  assert.match(html, /<title[^>]*>Zhengji LIU — Personal Website<\/title>/);
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
  assert.match(html, /Site under construction <b>50%<\/b>/);
  assert.match(html, /Vibe-coded with Codex/);
  assert.match(html, /Fata viam<br \/><i>invenient\.<\/i>/);
});

test('keeps the browser-tab identity consistent in Chinese', () => {
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.equal(translations['zh-CN']['meta.title'], 'Zhengji LIU — Personal Website');
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
  const backgroundEyebrow = new FakeElement({
    text: '02 / Path',
    attributes: { 'data-i18n': 'background.eyebrow' }
  });
  const backgroundTitle = new FakeElement({
    html: 'Profile',
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
      'data-contact-easter-egg-trigger': '',
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
  const elements = [homeLabel, backgroundEyebrow, backgroundTitle, homeName, bioName, contactTitle, nav, englishButton, chineseButton, status];
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
  assert.equal(backgroundEyebrow.textContent, '02 / 轨迹');
  assert.equal(backgroundTitle.innerHTML, '个人履历');
  assert.equal(homeName.innerHTML, 'Zhengji<br /><span>LIU</span>');
  assert.equal(bioName.innerHTML, '刘正吉 Zhengji <strong>LIU</strong>');
  assert.equal(contactTitle.innerHTML, '道阻且长<br /><i>行则将至。</i>');
  assert.equal(contactTitle.getAttribute('lang'), 'zh-CN');
  assert.equal(contactTitle.dataset.contactEasterEggEnabled, 'true');
  assert.equal(contactTitle.getAttribute('aria-disabled'), 'false');
  assert.equal(contactTitle.getAttribute('tabindex'), '0');
  assert.equal(nav.getAttribute('aria-label'), '作品集章节');
  assert.equal(chineseButton.getAttribute('aria-pressed'), 'true');
  assert.equal(englishButton.getAttribute('aria-pressed'), 'false');

  englishButton.click();
  assert.equal(documentElement.lang, 'en');
  assert.equal(body.dataset.language, 'en');
  assert.equal(homeLabel.textContent, 'Home');
  assert.equal(backgroundEyebrow.textContent, '02 / Path');
  assert.equal(backgroundTitle.innerHTML, 'Profile');
  assert.equal(homeName.innerHTML, 'Zhengji<br /><span>LIU</span>');
  assert.equal(bioName.innerHTML, 'Zhengji <strong>LIU</strong>');
  assert.equal(contactTitle.innerHTML, 'Fata viam<br /><i>invenient.</i>');
  assert.equal(contactTitle.getAttribute('lang'), 'la');
  assert.equal(contactTitle.dataset.contactEasterEggEnabled, 'false');
  assert.equal(contactTitle.getAttribute('aria-disabled'), 'true');
  assert.equal(contactTitle.getAttribute('tabindex'), '-1');
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

test('unlocks the supplied Saber theme after five progressively brighter presses without preloading it', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');
  const audioPath = 'assets/audio/kishiou-no-hokori.mp3';

  assert.ok(existsSync(file(audioPath)), 'the user-supplied Saber theme must exist');
  assert.ok(statSync(file(audioPath)).size > 1_000_000, 'the Saber theme must contain the supplied recording');
  assert.match(html, /<button class="home-saber-theme-trigger"[^>]*data-saber-theme-trigger[^>]*aria-label="Saber — press five times"[^>]*aria-pressed="false"[^>]*>/);
  assert.match(html, /<audio data-saber-theme preload="none">[\s\S]*<source src="assets\/audio\/kishiou-no-hokori\.mp3" type="audio\/mpeg" \/>[\s\S]*<\/audio>/);
  assert.match(html, /data-saber-theme-status[^>]*aria-live="polite"/);
  assert.match(script, /function initializeSaberThemeEasterEgg\(\)/);
  assert.match(script, /const clicksToUnlock = 5;/);
  assert.match(script, /const pressLevel = unlocked \? clicksToUnlock : Math\.min\(clicksToUnlock, presses \+ 1\);/);
  assert.match(script, /const pressFeedbackDurations = \[0, 260, 300, 340, 560, 820\];/);
  assert.match(script, /trigger\.dataset\.themeStage = String\(pressLevel\);/);
  assert.match(script, /pressFeedbackDurations\[pressLevel\]/);
  assert.doesNotMatch(script, /trigger\.style\.setProperty\('--theme-press-scale'/);
  assert.match(script, /audio\.volume = \.45;/);
  assert.match(script, /await audio\.play\(\);/);
  assert.match(script, /showStatus\('Now playing · 孤独な巡礼', '正在播放 · 孤独な巡礼'\);/);
  assert.doesNotMatch(script, /騎士王の誇り|The Pride of the King of Knights/);
  assert.match(script, /trigger\.addEventListener\('click', handlePress\);/);
  assert.match(css, /\.home-saber-theme-trigger \{[^}]*z-index:\s*2;[^}]*cursor:\s*pointer;/s);
  assert.match(css, /\.home-saber-theme-trigger:focus-visible \{[^}]*outline:/s);
  assert.match(css, /\.home-saber-theme-trigger::before,\s*\.home-saber-theme-trigger::after \{[^}]*top:\s*10\.5%;[^}]*left:\s*47\.5%;/s);
  assert.match(css, /\[data-theme-stage="1"\] \{[^}]*--theme-press-scale:\s*\.7;/s);
  assert.match(css, /\[data-theme-stage="5"\] \{[^}]*--theme-press-scale:\s*3\.2;/s);
  assert.match(css, /\[data-theme-stage="4"\]\.is-pressed::before \{ animation:\s*saber-theme-gather 520ms steps\(5, end\); \}/);
  assert.match(css, /\[data-theme-stage="5"\]\.is-pressed::before \{ animation:\s*saber-theme-bloom 780ms steps\(7, end\); \}/);
  assert.match(css, /@keyframes saber-theme-gather[\s\S]*?box-shadow:\s*-34px -24px[\s\S]*?box-shadow:\s*-9px -6px/s);
  assert.match(css, /@keyframes saber-theme-bloom[\s\S]*?box-shadow:\s*-14px 0[\s\S]*?box-shadow:\s*-46px 0/s);
});

test('keeps the Saber theme playing across chapters until the visitor pauses it', () => {
  const script = read('assets/js/dynamic-cv.js');

  assert.match(script, /document\.addEventListener\('visibilitychange', handleThemeVisibility\);/);
  assert.match(script, /if \(document\.hidden\) pauseTheme\(\);/);
  assert.doesNotMatch(script, /document\.body\.dataset\.activeChapter !== 'home'/);
  assert.doesNotMatch(script, /new MutationObserver\(handleThemeVisibility\)/);
  assert.match(script, /showStatus\('Theme paused · tap Saber to continue', '主题曲已暂停 · 点击 Saber 继续'\);/);
  assert.match(script, /audio\.addEventListener\('ended', handleThemeEnded\);/);
  assert.match(script, /trigger\.setAttribute\('aria-pressed', String\(!audio\.paused\)\);/);
});

test('bumps cache tokens when an animated companion layer is replaced', () => {
  const html = read('index.html');
  const packageJson = JSON.parse(read('package.json'));

  assert.equal(packageJson.version, '0.1.85');
  assert.match(html, /assets\/js\/dynamic-cv\.js\?v=0\.1\.85/);
  assert.match(html, /assets\/css\/dynamic-cv\.css\?v=0\.1\.85/);
});

test('does not ship the abandoned ambient audio preview experiment', () => {
  const html = read('index.html');

  assert.doesNotMatch(html, /ambient-audio-preview/);
  assert.equal(existsSync(file('assets/js/ambient-audio-preview.js')), false);
  assert.equal(existsSync(file('assets/css/ambient-audio-preview.css')), false);
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
  assert.match(html, /data-i18n="progress\.current\.timeOfDay"/);
  assert.doesNotMatch(html, /progress\.cases/);
  assert.doesNotMatch(html, /build-status-timeline/);
  assert.match(css, /\.project-detail-visual--paper img \{[\s\S]*object-fit:\s*contain/);
});

test('records the released daytime scene in the build log and design rules', () => {
  const html = read('index.html');
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.match(html, /Two hidden interactions have joined the site:.*Saber/);
  assert.match(translations['zh-CN']['progress.current.scene'], /Saber/);
  assert.match(html, /The portfolio now follows local daytime and nighttime/);
  assert.equal(translations['zh-CN']['progress.current.timeOfDay'].includes('\u767d\u5929'), true);
  assert.equal(translations['zh-CN']['progress.current.timeOfDay'].includes('\u50cf\u7d20\u6811\u53f6'), true);
  assert.ok(existsSync(file('docs/design/TIME_OF_DAY_THEME.md')));
  assert.doesNotMatch(read('docs/todo.md'), /Implement a time-aware home-scene style/);
});

test('keeps the Chinese construction progress aligned with the published 50 percent status', () => {
  const { translations } = require(fileURLToPath(file('assets/js/i18n.js')));

  assert.equal(translations['zh-CN']['progress.label'], '\u7f51\u7ad9\u5efa\u8bbe\u8fdb\u5ea6\uff1a50%');
  assert.equal(translations['zh-CN']['progress.text'], '\u7f51\u7ad9\u5efa\u8bbe\u4e2d <b>50%</b>');
});

test('keeps the daytime air study opt-in with canopy leaves and pixel wind traces', () => {
  const html = read('index.html');
  const css = read('assets/css/dynamic-cv.css');
  const script = read('assets/js/dynamic-cv.js');

  assert.match(html, /<div class="home-day-air home-scene-day-only" data-day-air-layer aria-hidden="true"><\/div>/);
  assert.match(script, /const isDayAirPreview = isDayTheme && searchParams\.get\('qa'\) === 'day-air';/);
  assert.match(script, /if \(isDayTheme && isDayAirPreview\) \{\s*createHomeDayAir\(homeScene\.querySelector\('\.home-day-air'\), reducedMotion\);\s*\}/);
  assert.match(script, /function createHomeDayAir\(container, motionPreference\)/);
  assert.match(script, /const canopyLeaves = \[/);
  assert.match(script, /x: '54%', y: '24%'/);
  assert.match(script, /x: '72%', y: '27%'/);
  assert.match(script, /dy: 'clamp\(112px, 17vh, 198px\)'/);
  assert.match(script, /buildParticle\('home-day-air-leaf'/);
  assert.match(script, /Array\.from\(\{ length: 6 \}/);
  assert.match(script, /motionPreference\.addEventListener\('change', build\);/);
  assert.match(css, /\.home-day-air \{[^}]*z-index:\s*2;[^}]*pointer-events:\s*none;/s);
  assert.match(css, /\.home-day-air-leaf \{[^}]*animation:\s*home-day-air-leaf/);
  assert.match(css, /\.home-day-air-leaf \{[^}]*width:\s*5px;[^}]*height:\s*4px;/s);
  assert.match(css, /\.home-day-air-trace \{[^}]*animation:\s*home-day-air-trace/);
  assert.match(css, /@keyframes home-day-air-leaf[\s\S]*?translate3d\(calc\(var\(--air-dx\) \* 1\.08\), calc\(var\(--air-dy\) \* 1\.12\)/);
  assert.match(css, /@keyframes home-day-air-trace[\s\S]*?100% \{ opacity: 0;/);
  assert.doesNotMatch(script, /home-day-air-pollen/);
});

test('keeps daytime air leaves inside the transformed day-tree coordinate system', () => {
  const html = read('index.html');
  const treeMarkup = html.match(/<div class="home-scene-tree-wrap home-scene-day-only">([\s\S]*?)<\/div>/)?.[1] ?? '';

  assert.match(treeMarkup, /home-scene-tree-day/);
  assert.match(treeMarkup, /class="home-day-air home-scene-day-only" data-day-air-layer/);
});
