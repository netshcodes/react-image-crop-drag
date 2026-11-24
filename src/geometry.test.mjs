import assert from 'node:assert/strict';
import { test } from 'node:test';

import { centerOffset, clampOffset, coverSize } from './geometry.mjs';

const WIDTH = 800;
const HEIGHT = 400;

const cover = (natural, zoom) => coverSize(natural, WIDTH, HEIGHT, zoom);
const clamp = (offset, size) => clampOffset(offset, size, WIDTH, HEIGHT);

test('a tall image fills the container width and overflows vertically', () => {
  assert.deepEqual(cover({ width: 400, height: 800 }), { width: 800, height: 1600 });
});

test('a wide image fills the container height and overflows horizontally', () => {
  assert.deepEqual(cover({ width: 1600, height: 400 }), { width: 1600, height: 400 });
});

test('an image with the container ratio fills it exactly', () => {
  assert.deepEqual(cover({ width: 1600, height: 800 }), { width: 800, height: 400 });
});

test('zoom scales both axes and keeps the aspect ratio', () => {
  const size = cover({ width: 1600, height: 400 }, 2);
  assert.deepEqual(size, { width: 3200, height: 800 });
  assert.equal(size.width / size.height, 1600 / 400);
});

test('an image with no intrinsic size takes the container shape', () => {
  assert.deepEqual(cover({ width: 0, height: 0 }), { width: 800, height: 400 });
});

test('size is zero until the natural size is known', () => {
  assert.deepEqual(cover(null), { width: 0, height: 0 });
});

test('an image smaller than the container stays centred on both axes', () => {
  const size = cover({ width: 1600, height: 800 }, 0.5);
  assert.deepEqual(size, { width: 400, height: 200 });

  const centred = { x: 200, y: 100 };
  assert.deepEqual(clamp({ x: 0, y: 0 }, size), centred);
  assert.deepEqual(clamp({ x: -500, y: -500 }, size), centred);
  assert.deepEqual(clamp({ x: 500, y: 500 }, size), centred);
});

test('an overflowing axis clamps flush to each edge', () => {
  const size = { width: 1600, height: 400 };
  assert.deepEqual(clamp({ x: 50, y: 0 }, size), { x: 0, y: 0 });
  assert.deepEqual(clamp({ x: -5000, y: 0 }, size), { x: -800, y: 0 });
  assert.deepEqual(clamp({ x: -300, y: 0 }, size), { x: -300, y: 0 });
});

test('a centred offset is already legal', () => {
  for (const size of [{ width: 1600, height: 400 }, { width: 400, height: 200 }]) {
    const centred = centerOffset(size, WIDTH, HEIGHT);
    assert.deepEqual(clamp(centred, size), centred);
  }
});

test('zooming in keeps a legal pan position instead of discarding it', () => {
  const natural = { width: 1600, height: 400 };
  const panned = clamp({ x: -300, y: 0 }, cover(natural));
  assert.deepEqual(panned, { x: -300, y: 0 });
  assert.deepEqual(clamp(panned, cover(natural, 2)), { x: -300, y: 0 });
});
