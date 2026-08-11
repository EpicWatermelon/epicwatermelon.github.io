import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFileSync(file(path), 'utf8');

const depthLayerAudit = String.raw`
import json
from PIL import Image
import sys

source = Image.open(sys.argv[1]).convert('RGBA')
back = Image.open(sys.argv[2]).convert('RGBA')
fixed = Image.open(sys.argv[3]).convert('RGBA')
front = Image.open(sys.argv[4]).convert('RGBA')

assert source.size == back.size == fixed.size == front.size
width, height = source.size
source_pixels = list(source.get_flattened_data())
back_pixels = list(back.get_flattened_data())
fixed_pixels = list(fixed.get_flattened_data())
front_pixels = list(front.get_flattened_data())

shared = 0
reconstruction_errors = 0
back_count = 0
front_count = 0
moving_below_cutoff = 0
back_green_trunk_corridor = 0

for index, (original, rear, base, leaves) in enumerate(zip(source_pixels, back_pixels, fixed_pixels, front_pixels)):
    x = index % width
    y = index // width
    rear_present = rear[3] > 0
    base_present = base[3] > 0
    leaves_present = leaves[3] > 0
    present_count = sum((rear_present, base_present, leaves_present))
    if present_count > 1:
        shared += 1
    reconstructed = leaves if leaves_present else base if base_present else rear
    if reconstructed != original:
        reconstruction_errors += 1
    if rear_present:
        back_count += 1
        if y >= 700:
            moving_below_cutoff += 1
        red, green, blue, alpha = original
        half_width = 160 + max(0, y - 430) * 0.26
        leafy_green = green > red * 1.08 and green > blue * 0.9 and green > 35
        if y >= 430 and abs(x - 1170) < half_width and leafy_green:
            back_green_trunk_corridor += 1
    if leaves_present:
        front_count += 1
        if y >= 700:
            moving_below_cutoff += 1

print(json.dumps({
    'shared': shared,
    'reconstruction_errors': reconstruction_errors,
    'back_count': back_count,
    'front_count': front_count,
    'moving_below_cutoff': moving_below_cutoff,
    'back_green_trunk_corridor': back_green_trunk_corridor,
}))
`;

const underfillAudit = String.raw`
import json
from PIL import Image
import sys

source = Image.open(sys.argv[1]).convert('RGBA')
back = Image.open(sys.argv[2]).convert('RGBA')
front = Image.open(sys.argv[3]).convert('RGBA')
underfill = Image.open(sys.argv[4]).convert('RGBA')
assert source.size == back.size == front.size == underfill.size

source_pixels = list(source.get_flattened_data())
back_pixels = list(back.get_flattened_data())
front_pixels = list(front.get_flattened_data())
underfill_pixels = list(underfill.get_flattened_data())
width, height = source.size
count = 0
outside_moving_source = 0
below_canopy = 0
darker = 0

for index, (original, rear, leaves, support) in enumerate(zip(source_pixels, back_pixels, front_pixels, underfill_pixels)):
    if support[3] == 0:
        continue
    count += 1
    if rear[3] == 0 and leaves[3] == 0:
        outside_moving_source += 1
    if index // width >= 700:
        below_canopy += 1
    if sum(support[:3]) < sum(original[:3]):
        darker += 1

print(json.dumps({
    'count': count,
    'outside_moving_source': outside_moving_source,
    'below_canopy': below_canopy,
    'darker_ratio': darker / max(1, count),
}))
`;

const nightCanopyGapAudit = String.raw`
import json
from PIL import Image
import sys

source = Image.open(sys.argv[1]).convert('RGBA')
source_alpha = source.getchannel('A').load()
centre_x, centre_y = 1120, 360
radius_x, radius_y = 360, 220
counts = []

for path in sys.argv[2:]:
    frame = Image.open(path).convert('RGBA')
    assert frame.size == source.size
    frame_alpha = frame.getchannel('A').load()
    missing = 0
    for y in range(max(0, centre_y - radius_y), min(source.height, centre_y + radius_y + 1)):
        normalized_y = (y - centre_y) / radius_y
        for x in range(max(0, centre_x - radius_x), min(source.width, centre_x + radius_x + 1)):
            normalized_x = (x - centre_x) / radius_x
            if normalized_x * normalized_x + normalized_y * normalized_y >= 1:
                continue
            if source_alpha[x, y] > 0 and frame_alpha[x, y] == 0:
                missing += 1
    counts.append(missing)

print(json.dumps(counts))
`;

test('ships an isolated daytime tree wind lab with the requested controls', () => {
  for (const path of ['tree-wind-lab.html', 'assets/css/tree-wind-lab.css', 'assets/js/tree-wind-lab.js']) {
    assert.ok(existsSync(file(path)), `${path} must exist`);
  }

  const html = read('tree-wind-lab.html');
  assert.match(html, /data-tree-wind-canvas/);
  assert.match(html, /data-control="amplitude"/);
  assert.match(html, /data-control="band-height"/);
  assert.match(html, /data-control="cycle-seconds"/);
  assert.match(html, /data-control="show-mask"/);
  assert.match(html, /后层深绿叶/);
  assert.match(html, /固定树干主枝/);
  assert.match(html, /前层亮叶枝梢/);
  assert.match(html, /assets\/pixel\/home\/tree-day-v2\.png/);
});

test('builds integer, bounded, seamless strip offsets', async () => {
  const scriptPath = file('assets/js/tree-wind-lab.js');
  assert.ok(existsSync(scriptPath), 'tree wind module must exist');
  const scriptModule = `data:text/javascript;base64,${Buffer.from(read('assets/js/tree-wind-lab.js')).toString('base64')}`;
  const { createBandOffsets } = await import(scriptModule);
  const settings = { height: 941, bandHeight: 8, maxAmplitude: 3, cycleSeconds: 3.6, canopyBottom: 700 };

  const rest = createBandOffsets({ ...settings, elapsedSeconds: 0 });
  const loopEnd = createBandOffsets({ ...settings, elapsedSeconds: 3.6 });
  const active = createBandOffsets({ ...settings, elapsedSeconds: 0.9 });

  assert.deepEqual(rest, loopEnd, 'the final state must join the first state');
  assert.ok(rest.every((band) => band.offsetX === 0), 'the loop must begin on the untouched tree');
  assert.ok(active.some((band) => band.offsetX !== 0), 'the active phase must move foliage strips');
  assert.ok(active.every((band) => Number.isInteger(band.offsetX)), 'all displacement must use integer pixels');
  assert.ok(active.every((band) => Math.abs(band.offsetX) <= 3), 'displacement must stay inside the selected amplitude');
  assert.ok(active.filter((band) => band.sourceY >= 700).every((band) => band.offsetX === 0), 'pixels below the canopy cutoff must remain fixed');
  assert.ok(active.slice(1).every((band, index) => Math.abs(band.offsetX - active[index].offsetX) <= 1), 'adjacent strips may differ by at most one pixel');
});

test('overlaps adjacent strip edges without changing the approved motion offsets', async () => {
  const scriptModule = `data:text/javascript;base64,${Buffer.from(read('assets/js/tree-wind-lab.js')).toString('base64')}`;
  const { STRIP_SEAM_GUARD, createGuardedDrawRegions } = await import(scriptModule);
  const bands = [
    { sourceY: 0, sourceHeight: 8, offsetX: 2 },
    { sourceY: 8, sourceHeight: 8, offsetX: 1 },
    { sourceY: 16, sourceHeight: 8, offsetX: 0 },
  ];
  const regions = createGuardedDrawRegions(bands, 24);

  assert.equal(STRIP_SEAM_GUARD, 1);
  assert.deepEqual(regions.map((region) => region.offsetX), bands.map((band) => band.offsetX), 'seam coverage must not alter the original sway');
  assert.equal(regions[0].sourceY, 0);
  assert.equal(regions.at(-1).sourceY + regions.at(-1).sourceHeight, 24);
  assert.ok(regions.slice(1).every((region, index) => {
    const previous = regions[index];
    return previous.sourceY + previous.sourceHeight - region.sourceY >= STRIP_SEAM_GUARD * 2;
  }), 'adjacent source regions must overlap above and below every horizontal seam');
  assert.ok(regions.every((region) => region.destinationY === region.sourceY), 'guard pixels must stay vertically aligned with their source');
});

test('keeps the rear foliage below fixed branches and front foliage', async () => {
  const scriptModule = `data:text/javascript;base64,${Buffer.from(read('assets/js/tree-wind-lab.js')).toString('base64')}`;
  const { TREE_DEPTH_MOTION, TREE_DEPTH_ORDER, createLayerOffsets } = await import(scriptModule);
  const settings = { height: 941, bandHeight: 8, maxAmplitude: 3, cycleSeconds: 3.6, elapsedSeconds: 0.9, canopyBottom: 700 };

  assert.deepEqual(TREE_DEPTH_ORDER, ['back', 'fixed', 'front']);
  assert.deepEqual(TREE_DEPTH_MOTION, { back: 0.4, fixed: 0, front: 1 });
  const rear = createLayerOffsets({ ...settings, layer: 'back' });
  const fixed = createLayerOffsets({ ...settings, layer: 'fixed' });
  const front = createLayerOffsets({ ...settings, layer: 'front' });
  assert.ok(rear.some((band) => band.offsetX !== 0), 'rear foliage must move with the breeze');
  assert.ok(rear.every((band) => Math.abs(band.offsetX) <= 1), 'rear foliage must stay sheltered behind the trunk');
  assert.ok(fixed.every((band) => band.offsetX === 0), 'the trunk and main branches must remain fixed');
  assert.ok(front.some((band) => Math.abs(band.offsetX) >= 2), 'front foliage must carry the visible sway');

  const script = read('assets/js/tree-wind-lab.js');
  assert.match(script, /drawStrips\(images\.back[\s\S]*context\.drawImage\(images\.fixed, 0, 0\)[\s\S]*drawStrips\(images\.front/);
});

test('splits the approved tree into lossless rear foliage, fixed branches, and front foliage', () => {
  const paths = [
    'assets/pixel/home/tree-day-v2.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-back.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-fixed.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-front.png',
  ];
  for (const path of paths) assert.ok(existsSync(file(path)), `${path} must exist`);

  const audit = JSON.parse(execFileSync('python', ['-c', depthLayerAudit, ...paths.map((path) => fileURLToPath(file(path)))], { encoding: 'utf8' }));
  assert.equal(audit.shared, 0, 'rear foliage, fixed branches, and front foliage must be disjoint');
  assert.equal(audit.reconstruction_errors, 0, 'resting depth layers must reconstruct the approved tree pixel-for-pixel');
  assert.ok(audit.back_count > 35_000, `the rear foliage layer is unexpectedly sparse: ${audit.back_count}`);
  assert.ok(audit.front_count > 240_000, `the front foliage layer is unexpectedly sparse: ${audit.front_count}`);
  assert.equal(audit.moving_below_cutoff, 0, 'roots and ground vegetation must remain fixed');
  assert.ok(audit.back_green_trunk_corridor > 12_000, `the dark green foliage behind the trunk is still fixed: ${audit.back_green_trunk_corridor}`);
});

test('keeps a dark inner-canopy underfill behind moving foliage', () => {
  const paths = [
    'assets/pixel/home/tree-day-v2.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-back.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-front.png',
    'assets/pixel/home/tree-day-pixel-wind-v2-underfill.png',
  ];
  for (const path of paths) assert.ok(existsSync(file(path)), `${path} must exist`);

  const audit = JSON.parse(execFileSync('python', ['-c', underfillAudit, ...paths.map((path) => fileURLToPath(file(path)))], { encoding: 'utf8' }));
  assert.ok(audit.count > 120_000, `the canopy underfill is too sparse to cover internal motion cavities: ${audit.count}`);
  assert.ok(audit.count < 230_000, `the canopy underfill reaches too far toward the silhouette: ${audit.count}`);
  assert.equal(audit.outside_moving_source, 0, 'the underfill must stay hidden beneath original foliage at rest');
  assert.equal(audit.below_canopy, 0, 'the underfill must never reach roots or ground vegetation');
  assert.ok(audit.darker_ratio > 0.98, `the underfill must read as deep canopy shadow: ${audit.darker_ratio}`);

  const script = read('assets/js/tree-wind-lab.js');
  assert.match(script, /context\.drawImage\(images\.underfill, 0, 0\)[\s\S]*drawStrips\(images\.back/);
});

test('keeps night sky from opening inside the moving canopy', () => {
  const source = 'assets/pixel/home/tree-sway-v2-00.png';
  const movingFrames = [1, 2, 3, 5, 6, 7].map((index) => `assets/pixel/home/tree-sway-v2-${String(index).padStart(2, '0')}.png`);
  for (const path of [source, ...movingFrames]) assert.ok(existsSync(file(path)), `${path} must exist`);

  const missingByFrame = JSON.parse(execFileSync('python', ['-c', nightCanopyGapAudit, ...[source, ...movingFrames].map((path) => fileURLToPath(file(path)))], { encoding: 'utf8' }));
  assert.deepEqual(missingByFrame, [0, 0, 0, 0, 0, 0], `moving night frames expose sky inside the canopy: ${missingByFrame.join(', ')}`);
});
