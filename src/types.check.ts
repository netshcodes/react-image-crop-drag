// Compile-time check that the published declarations are usable from a strict
// TypeScript project. Run by `npm run typecheck`, never bundled or published.
import type * as React from 'react';

import ImageCropView, { ImageCropViewProps } from './index';

const required: ImageCropViewProps = { src: 'poster.jpg' };

const everything: ImageCropViewProps = {
  src: 'poster.jpg',
  alt: 'Concert poster',
  containerWidth: 800,
  containerHeight: 400,
  isEditing: true,
  zoom: 1.5
};

export const component: React.FC<ImageCropViewProps> = ImageCropView;
export const props: ImageCropViewProps[] = [required, everything];
