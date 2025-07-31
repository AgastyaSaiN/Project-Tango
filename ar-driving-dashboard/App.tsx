
import React, { useState, useCallback, useEffect } from 'react';
import { useObjectDetection } from './hooks/useObjectDetection';
import { WebcamView } from './components/WebcamView';
import { SceneView } from './components/SceneView';
import { TeslaIcon, CameraIcon } from './components/icons';
import type { DetectedObject } from './types';

const App: React.FC = () => {
  const { isLoading: isModelLoading, startDetection, stopDetection } = useObjectDetection();
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });

  // Stop detection on component unmount to prevent resource leaks
  useEffect(() => {
    return () => {
      if (isDetectionRunning) {
        console.log("Stopping detection on component unmount.");
        stopDetection();
      }
    };
  }, [isDetectionRunning, stopDetection]);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setIsVideoReady(true);
    setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
    
    if (!isModelLoading && !isDetectionRunning) {
        console.log("Starting detection...");
        startDetection(video, (newDetections) => {
            setDetections(newDetections);
        });
        setIsDetectionRunning(true);
    }
  }, [isModelLoading, startDetection, isDetectionRunning]);

  const getStatusMessage = () => {
    if (isModelLoading) {
      return "Loading AI model...";
    }
    if (!isVideoReady) {
      return "Initializing camera...";
    }
    if (!isDetectionRunning) {
      return "Ready to start detection.";
    }
    return "AR Vision System Active";
  };

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 bg-gray-900 font-sans">
      <header className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <TeslaIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl font-bold text-gray-100 tracking-wider">
            AR Driving Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-full text-sm">
            <div className={`w-3 h-3 rounded-full ${isDetectionRunning ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            <span className="text-gray-300">{getStatusMessage()}</span>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-400 flex items-center gap-2"><CameraIcon className="w-5 h-5"/> Live Camera Feed</h2>
            <div className="aspect-video w-full">
                <WebcamView 
                    detections={detections} 
                    onVideoReady={handleVideoReady}
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-400 flex items-center gap-2"><TeslaIcon className="w-5 h-5" /> 3D Scene Visualization</h2>
            <div className="aspect-video w-full">
                <SceneView detections={detections} videoDimensions={videoDimensions} />
            </div>
        </div>
      </main>
      
      <footer className="text-center text-xs text-gray-500 p-2">
        Powered by TensorFlow.js & React Three Fiber. This is a simulation and not for actual driving.
      </footer>
    </div>
  );
};

export default App;
