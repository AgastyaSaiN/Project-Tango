
import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import type { WebcamViewProps, DetectedObject } from '../types';

const drawBoundingBox = (
  ctx: CanvasRenderingContext2D,
  detection: DetectedObject,
  videoWidth: number,
  videoHeight: number
) => {
  const [x, y, width, height] = detection.bbox;
  const label = `${detection.class} (${Math.round(detection.score * 100)}%)`;

  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#00FFFF';
  ctx.font = '14px Arial';
  
  // Draw the rectangle
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();

  // Draw the label background
  const textWidth = ctx.measureText(label).width;
  ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
  ctx.fillRect(x, y, textWidth + 8, 20);
  
  // Draw the label text
  ctx.fillStyle = '#000000';
  ctx.fillText(label, x + 4, y + 14);
};

export const WebcamView: React.FC<WebcamViewProps> = ({ detections, onVideoReady }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    if (canvas && video && video.videoWidth > 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Match canvas dimensions to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detections.forEach(det => drawBoundingBox(ctx, det, video.videoWidth, video.videoHeight));
      }
    }
  }, [detections]);

  const handleUserMedia = () => {
    const video = webcamRef.current?.video;
    if (video) {
        // Video stream is ready, wait for metadata to be loaded to get dimensions
        video.onloadedmetadata = () => {
            onVideoReady(video);
        };
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: 'environment',
        }}
        onUserMedia={handleUserMedia}
        onUserMediaError={(err) => console.error("Webcam Error:", err)}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
