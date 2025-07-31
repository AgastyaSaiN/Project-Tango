
import { useState, useEffect, useCallback, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { DetectedObject } from '../types';
import type { ObjectDetection } from '@tensorflow-models/coco-ssd';

export const useObjectDetection = () => {
  const [model, setModel] = useState<ObjectDetection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDetectingRef = useRef(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        console.log('Loading COCO-SSD model...');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('Model loaded successfully.');
      } catch (error) {
        console.error('Failed to load model:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const startDetection = useCallback((
    videoElement: HTMLVideoElement, 
    onDetections: (detections: DetectedObject[]) => void
  ) => {
    videoRef.current = videoElement;
    isDetectingRef.current = true;
    
    const detectFrame = async () => {
        if (!isDetectingRef.current || !model || !videoRef.current || videoRef.current.readyState < 3) {
            if (isDetectingRef.current) {
                requestAnimationFrame(detectFrame);
            }
            return;
        }

        try {
            const predictions = await model.detect(videoRef.current);
            onDetections(predictions as DetectedObject[]);
        } catch(error) {
            console.error("Error during detection:", error);
        }

        requestAnimationFrame(detectFrame);
    };

    detectFrame();

  }, [model]);
  
  const stopDetection = useCallback(() => {
    isDetectingRef.current = false;
  }, []);

  return { model, isLoading, startDetection, stopDetection };
};
