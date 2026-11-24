import React, { useMemo, useRef, useState, useEffect } from "react";

import { centerOffset, clampOffset, coverSize } from "./geometry.mjs";

const KEY_STEP = 20;

const KEY_DELTAS = new Map([
  ["ArrowUp", { x: 0, y: -KEY_STEP }],
  ["ArrowDown", { x: 0, y: KEY_STEP }],
  ["ArrowLeft", { x: -KEY_STEP, y: 0 }],
  ["ArrowRight", { x: KEY_STEP, y: 0 }]
]);

const ImageCropView = ({
  src,
  alt = "Croppable image",
  containerWidth = 800,
  containerHeight = 400,
  isEditing = false,
  zoom = 1
}) => {
  const [natural, setNatural] = useState(null);
  // null until the viewer pans, so the image starts centred at any size or zoom.
  const [offset, setOffset] = useState(null);
  const [grab, setGrab] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;
      setNatural({ width: image.naturalWidth, height: image.naturalHeight });
      setOffset(null);
    };

    image.onerror = (err) => {
      if (cancelled) return;
      console.error("ImageCropView: Failed to load image", src, err);
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  const size = useMemo(
    () => coverSize(natural, containerWidth, containerHeight, zoom),
    [natural, containerWidth, containerHeight, zoom]
  );

  const view = clampOffset(
    offset ?? centerOffset(size, containerWidth, containerHeight),
    size,
    containerWidth,
    containerHeight
  );

  const moveTo = (x, y) => setOffset(clampOffset({ x, y }, size, containerWidth, containerHeight));

  const handlePointerDown = (e) => {
    if (!isEditing) return;

    e.preventDefault();
    containerRef.current?.focus();
    // jsdom, where consumers run their tests, has no pointer capture.
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setGrab({ pointerId: e.pointerId, originX: e.clientX - view.x, originY: e.clientY - view.y });
  };

  const handlePointerMove = (e) => {
    if (!grab || e.pointerId !== grab.pointerId) return;

    moveTo(e.clientX - grab.originX, e.clientY - grab.originY);
  };

  const handlePointerEnd = (e) => {
    if (grab && e.pointerId !== grab.pointerId) return;

    setGrab(null);
  };

  const handleKeyDown = (e) => {
    const delta = isEditing ? KEY_DELTAS.get(e.key) : undefined;
    if (!delta) return;

    e.preventDefault();
    moveTo(view.x + delta.x, view.y + delta.y);
  };

  return (
    <div
      ref={containerRef}
      role={isEditing ? "application" : undefined}
      aria-label={isEditing ? "Image cropper" : undefined}
      aria-keyshortcuts={isEditing ? "ArrowUp ArrowDown ArrowLeft ArrowRight" : undefined}
      tabIndex={isEditing ? 0 : undefined}
      onKeyDown={handleKeyDown}
      style={{
        width: containerWidth,
        height: containerHeight,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#f0f0f0",
        cursor: isEditing ? (grab ? "grabbing" : "grab") : "default"
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: size.width,
          height: size.height,
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${view.x}px, ${view.y}px, 0)`,
          transition: grab ? "none" : "transform 0.1s ease",
          userSelect: "none",
          objectFit: "fill",
          pointerEvents: isEditing ? "auto" : "none",
          touchAction: "none"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        draggable={false}
      />
    </div>
  );
};

export default ImageCropView;
