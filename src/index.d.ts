import type * as React from 'react';

export interface ImageCropViewProps {
  src: string;
  alt?: string;
  containerWidth?: number;
  containerHeight?: number;
  isEditing?: boolean;
  zoom?: number;
}

declare const ImageCropView: React.FC<ImageCropViewProps>;
export default ImageCropView;
