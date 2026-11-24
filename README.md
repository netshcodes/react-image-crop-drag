# react-image-crop-drag

A React component for creating draggable image views with automatic scaling and positioning. Perfect for concert posters, event banners, and profile headers.

## Features

- **Vertical and Horizontal drag adjustment** for perfect image positioning
- **Zoom support** for detailed cropping and 2D scrolling
- **Automatic image scaling** while maintaining aspect ratio
- **Smooth animations and transitions**
- **Accessibility first** with keyboard navigation
- **Touch device support** for mobile interactions
- **Center positioning** with smart constraints
- **No image overflow**
- **Zero dependencies** (except React)

## Installation

```bash
npm install react-image-crop-drag
```

## Example

```jsx
import { useState } from 'react';
import ImageCropView from 'react-image-crop-drag';

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);

  return (
    <ImageCropView
      src="/path/to/concert-poster.jpg"
      alt="Concert Poster 2024"
      containerWidth={800}
      containerHeight={400}
      isEditing={isEditing}
      zoom={zoom}
    />
  );
}
```

## Example app

[netshcodes/react-image-crop-drag-example](https://github.com/netshcodes/react-image-crop-drag-example) is a one-page React + TypeScript + Vite app that installs this package from npm the way any consumer does. Set every prop from a control panel, drag the frame, then copy the JSX for the state you ended up with.

```bash
git clone https://github.com/netshcodes/react-image-crop-drag-example.git
cd react-image-crop-drag-example
npm install
npm run dev
```

The page covers:

- Three sample images with different aspect ratios, plus any image you load from your own disk (read through `URL.createObjectURL`, so nothing is uploaded).
- Panorama, square, and portrait frames, which set `containerWidth` and `containerHeight`.
- A `isEditing` toggle, so you can see the frame keep its crop while leaving the tab order and ignoring pointer and key input.
- A `zoom` slider, including values below the fit where the image stops covering the frame and so centres and stops moving.

A readout under the frame reports the source size, the size the component scaled it to, and which axes are still draggable — an axis moves only while the scaled image is larger than the frame on that axis, which is why a tall source drags vertically but not horizontally.

## Accessibility

- **Keyboard support.** While `isEditing` is true the container is focusable, and the Up, Down, Left, and Right arrow keys move the image 20px per press. Clicking the image focuses the container, so the arrow keys work straight after a drag.
- **Screen readers.** While `isEditing` is true the container has `role="application"`, an `aria-label`, and `aria-keyshortcuts` listing the four arrow keys. While it is false the container drops those attributes and leaves its tab order, so the image alone carries the semantics.
- **Pointer support.** Mouse, touch, and pen all go through the same pointer handlers, so the component behaves the same on every input device.

## Props

| Prop              | Type     | Required | Default             | Description                     |
|-------------------|----------|----------|---------------------|---------------------------------|
| `src`             | string   | Yes      | -                   | Image source URL                |
| `alt`             | string   | No       | "Croppable image"   | Alt text for the image          |
| `containerWidth`  | number   | No       | 800                 | Width of the container          |
| `containerHeight` | number   | No       | 400                 | Height of the container         |
| `isEditing`       | boolean  | No       | false               | Enable/disable drag mode        |
| `zoom`            | number   | No       | 1                   | Zoom level (multiplier)         |

The image is scaled to cover the container, then multiplied by `zoom`. At `zoom` values below 1 the image no longer fills the container, so it stays centred and cannot be dragged. Changing `zoom` keeps the current drag position instead of recentring the image.

## Example Use Cases

- Concert posters and event banners
- Profile header images
- Cover photos for social media
- Featured image sections
- Banner advertisements

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run the layout tests and type check the published declarations
npm test
```

## License

MIT
