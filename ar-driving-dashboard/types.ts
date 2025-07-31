
import type React from 'react';

// By explicitly defining the properties, we resolve the TypeScript errors
// in other components that were unable to find 'bbox', 'class', or 'score'.
export interface DetectedObject {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface WebcamViewProps {
  detections: DetectedObject[];
  onVideoReady: (video: HTMLVideoElement) => void;
}

export interface SceneViewProps {
  detections: DetectedObject[];
  videoDimensions: { width: number; height: number };
}
