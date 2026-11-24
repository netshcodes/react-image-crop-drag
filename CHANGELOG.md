# Changelog

All notable changes to this project will be documented in this file.

## [1.3.1] - 2026-11-24

Documentation only. The published bundle is byte for byte the 1.3.0 bundle.

### Changed

- **The README is written for someone deciding whether to install the package.** It leads with what the component does and what it does not do, states the React peer range and the pointer events requirement, and links the npm, CI, and license badges.
- **The quick start runs as written.** The old snippet created `isEditing` and `zoom` state and never changed either one, so a reader who copied it got a frame that could not enter edit mode. The new one renders the button and the slider that drive both props.
- **The props table gives the real types and defaults**, and says that the component accepts no `className`, `style`, or `id` and forwards nothing to the DOM.

### Added

- **A "How the crop behaves" section.** It covers the cover scale, the per-axis drag rule, what a `zoom` below the fit looks like, the 20px keyboard step, the 100ms ease after a key press, and the console-only load error.
- **A "Limitations" section.** No callback exposes the crop position, the component produces no cropped image file, `zoom` has no pinch or wheel gesture, and the frame takes pixel sizes only.
- **An "Exports and types" section**, which names the default export and the `ImageCropViewProps` type.
- **Development notes** that list `npm run build` and `npm test`, name the Node version CI uses, and link the issue tracker and this file.

### Removed

- The feature list of bold labels and the "Example Use Cases" list. The props table and the behavior section carry those facts.

## [1.3.0] - 2026-11-23

### Fixed

- **Drag no longer dies when the pointer leaves the image.** Mouse and touch handlers lived on the `img` element, so a drag that overshot the element stopped tracking and the image froze mid-gesture. The component now uses pointer events with pointer capture, so the gesture follows the pointer until it is released.
- **Zoom levels below 1 no longer snap the image into the top-left corner.** When the image was smaller than the container, the first drag moved it from centred to `(0, 0)`. An axis on which the image fits the container now stays centred.
- **Changing `zoom`, `containerWidth`, or `containerHeight` no longer reloads the image or discards the drag position.** The component loads the image once per `src` and derives the display size from it.
- **A slow load for an earlier `src` can no longer overwrite the current image's size.** The effect cancels its load handler on cleanup.
- **Images with no intrinsic size, such as an SVG without `width` and `height` attributes, no longer render with a `NaN` size.** They take the container's shape.
- **TypeScript consumers can pass `alt`, `isEditing`, and `zoom`.** The declarations listed only `src`, `containerWidth`, and `containerHeight`, and the build never copied them into `dist`, so the `types` entry in `package.json` pointed at a file the published package did not contain.

### Changed

- The container only has `role="application"`, `aria-label`, `aria-keyshortcuts`, and a tab stop while `isEditing` is true. It previously kept `role="application"` and an unsupported `aria-description` at all times.
- Clicking the image focuses the container, so the arrow keys work without tabbing first.
- Dropped `outline: none` from the container, which hid the focus ring from keyboard users. Browsers show the ring on keyboard focus only, so a click still leaves no outline.
- `isEditing` now defaults to `false`, which is what the README already documented.
- Removed the `onSave` prop from the README. The component never accepted or called it.

### Added

- `npm test` runs the layout unit tests and type checks the published declarations. `npm publish` runs it first.

## [1.2.0] - 2026-01-04

### Added

- **Horizontal Dragging**: Support for dragging images horizontally if they are wider than the container.
- **Zoom Support**: New `zoom` prop to scale images, enabling 2D scrolling/positioning when zoomed in.

## [1.1.0] - 2026-01-04

### Added

- **Accessibility**: Added `alt` prop to `ImageCropView` for better screen reader support (defaults to "Croppable image").
- **Keyboard Navigation**: Implemented ArrowUp/ArrowDown key support for adjusting image position.
- **Touch Support**: Added full touch event handling for mobile devices to support dragging.
- **ARIA**: Added `role="application"`, `aria-label`, and `aria-description` to the container.
- **Documentation**: Added "Accessibility" section to README and updated Props table.

### Changed

- Container is now focusable (`tabIndex={0}`) when in editing mode.
