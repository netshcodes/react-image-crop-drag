# react-image-crop-drag

[![npm version](https://img.shields.io/npm/v/react-image-crop-drag.svg)](https://www.npmjs.com/package/react-image-crop-drag)
[![CI](https://github.com/netshcodes/react-image-crop-drag/actions/workflows/ci.yml/badge.svg)](https://github.com/netshcodes/react-image-crop-drag/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-image-crop-drag.svg)](#license)

A React component that fits an image to a fixed frame and lets the viewer drag it into position.

`ImageCropView` renders a frame of the width and height you give it, scales the image to cover that frame, and hides the overflow. While `isEditing` is true, a drag or an arrow key moves the image inside the frame, and the image can never leave a gap at an edge. Use it for a concert poster, an event banner, or a profile header whose focal point sits off centre.

It positions an image for display. It does not produce a cropped image file. See [Limitations](#limitations).

- Drag on both axes with pointer capture, so the gesture keeps tracking after the pointer leaves the image.
- Mouse, touch, and pen go through the same pointer handlers.
- Arrow keys move the image 20px per press while the frame has focus.
- A `zoom` multiplier on top of the cover scale.
- No runtime dependencies beyond React. CommonJS build, ES module build, and TypeScript declarations.

## Install

```bash
npm install react-image-crop-drag
```

React and `react-dom` are peer dependencies, at 16.8.0 or later for hooks. The component uses [pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), which every current browser supports.

## Quick start

`isEditing` and `zoom` are controlled props. Own them in your own state and render whatever controls you want.

```jsx
import { useState } from 'react';
import ImageCropView from 'react-image-crop-drag';

export default function PosterHeader() {
	const [isEditing, setIsEditing] = useState(false);
	const [zoom, setZoom] = useState(1);

	return (
		<>
			<ImageCropView
				src="/concert-poster.jpg"
				alt="Concert poster for the 2026 spring tour"
				containerWidth={800}
				containerHeight={400}
				isEditing={isEditing}
				zoom={zoom}
			/>
			<button type="button" onClick={() => setIsEditing(!isEditing)}>
				{isEditing ? 'Done' : 'Adjust image'}
			</button>
			<input
				type="range"
				min={1}
				max={3}
				step={0.1}
				value={zoom}
				onChange={(event) => setZoom(Number(event.target.value))}
			/>
		</>
	);
}
```

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | Yes | none | Image URL. Anything an `img` element accepts, including a blob URL. |
| `alt` | `string` | No | `"Croppable image"` | Alt text for the image. |
| `containerWidth` | `number` | No | `800` | Frame width in pixels. |
| `containerHeight` | `number` | No | `400` | Frame height in pixels. |
| `isEditing` | `boolean` | No | `false` | While true, the frame takes pointer and keyboard input. While false, it ignores both and keeps the current position. |
| `zoom` | `number` | No | `1` | Multiplier applied after the cover scale. |

The component takes no `className`, `style`, `id`, or event props, and it forwards no extra props to the DOM. Wrap it to position it in your layout.

## Exports and types

The package has one default export, the component. The TypeScript declarations also export the props type.

```tsx
import ImageCropView, { type ImageCropViewProps } from 'react-image-crop-drag';
```

## How the crop behaves

- **Cover scale, then zoom.** The component scales the image so it covers the frame on both axes, then multiplies both dimensions by `zoom`. Aspect ratio is preserved.
- **An axis drags only while it overflows.** A source taller than the frame drags vertically but not horizontally. The offset stays within the range that keeps the image covering the frame, so no gap appears at an edge.
- **An axis that fits stays centred.** At a `zoom` below the fit the image no longer covers the frame. It centres on both axes, stops responding to drags, and the frame's grey background shows around it.
- **Position survives a resize and a zoom.** Changing `zoom`, `containerWidth`, or `containerHeight` keeps the current position instead of recentring, and does not reload the image. Changing `src` loads the new image and centres it.
- **A drag follows the pointer, a key press eases.** The image tracks the pointer with no transition during a drag, and eases over 100ms after an arrow key press.
- **A failed load leaves an empty frame.** The component logs the error and the `src` to the console. There is no error callback.
- **An image with no intrinsic size takes the frame's shape.** An SVG without `width` and `height` attributes is one case.

## Accessibility

While `isEditing` is true:

- The frame is focusable, and the Up, Down, Left, and Right arrow keys move the image 20px per press.
- A click on the image focuses the frame, so the arrow keys work straight after a drag.
- The frame carries `role="application"`, an `aria-label`, and an `aria-keyshortcuts` list of the four arrow keys.

While `isEditing` is false the frame drops those attributes and leaves the tab order, so the image alone carries the semantics. The focus ring is the browser default, which appears on keyboard focus only.

## Limitations

- **No way to read the position.** The component owns the offset and exposes no callback, so you cannot persist a crop or restore one. Treat the result as a display, not as saved state.
- **No output image.** The frame crops by hiding overflow. Nothing is drawn to a canvas and no file is produced.
- **`zoom` is yours to drive.** The component has no pinch gesture and no wheel handler. It reads the prop.
- **Pixel sizes only.** `containerWidth` and `containerHeight` are numbers in pixels. For a responsive frame, measure the parent yourself and pass the result.

## Example app

[netshcodes/react-image-crop-drag-example](https://github.com/netshcodes/react-image-crop-drag-example) is a one-page React, TypeScript, and Vite app that installs this package from npm the way any consumer does. Set every prop from a control panel, drag the frame, then copy the JSX for the state you ended up with.

```bash
git clone https://github.com/netshcodes/react-image-crop-drag-example.git
cd react-image-crop-drag-example
npm install
npm run dev
```

It loads three sample images with different aspect ratios, or any image from your own disk through `URL.createObjectURL`, so nothing is uploaded. A readout under the frame reports the source size, the scaled size, and which axes are still draggable.

## Development

```bash
npm install     # also runs the build, through the prepare script
npm run build   # bundle with rollup into dist
npm test        # geometry unit tests, then a type check of the published declarations
```

`npm test` runs `node --test` over `src/geometry.test.mjs` and type checks `src/types.check.ts` against the declarations. `npm publish` runs it first. CI runs the same command on Node 22.

Report a bug or request a change at [the issue tracker](https://github.com/netshcodes/react-image-crop-drag/issues).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
