// An offset is the image's top-left corner relative to the container's.
// On an axis where the image overflows it must stay within [container - image, 0]
// so no gap can show; on an axis where the image fits there is nothing to pan, so
// it is centred. clampOffset is the only authority on that invariant.

export function coverSize(natural, containerWidth, containerHeight, zoom = 1) {
  if (!natural) {
    return { width: 0, height: 0 };
  }

  // An SVG without width and height attributes loads with no intrinsic size.
  if (!(natural.width > 0) || !(natural.height > 0)) {
    return { width: containerWidth * zoom, height: containerHeight * zoom };
  }

  const imageRatio = natural.width / natural.height;
  const containerRatio = containerWidth / containerHeight;
  const size =
    imageRatio > containerRatio
      ? { width: containerHeight * imageRatio, height: containerHeight }
      : { width: containerWidth, height: containerWidth / imageRatio };

  return { width: size.width * zoom, height: size.height * zoom };
}

// Always returns a legal offset, so callers never have to clamp the result.
export function centerOffset(size, containerWidth, containerHeight) {
  return {
    x: (containerWidth - size.width) / 2,
    y: (containerHeight - size.height) / 2
  };
}

export function clampAxis(offset, container, image) {
  if (image <= container) {
    return (container - image) / 2;
  }

  return Math.min(0, Math.max(container - image, offset));
}

export function clampOffset(offset, size, containerWidth, containerHeight) {
  return {
    x: clampAxis(offset.x, containerWidth, size.width),
    y: clampAxis(offset.y, containerHeight, size.height)
  };
}
