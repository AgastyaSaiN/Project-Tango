import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Plane, Box } from '@react-three/drei';
import type { SceneViewProps, DetectedObject } from '../types';

const ROAD_WIDTH = 20;
const ROAD_LENGTH = 100;

// Utility to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const DetectedItem: React.FC<{ detection: DetectedObject, videoWidth: number, videoHeight: number }> = ({ detection, videoWidth, videoHeight }) => {
    const [x, y, w, h] = detection.bbox;
    const centerX = x + w / 2;
    const bottomY = y + h;

    // Map horizontal position from video (0 to videoWidth) to 3D scene (-ROAD_WIDTH/2 to ROAD_WIDTH/2)
    const posX = mapRange(centerX, 0, videoWidth, -ROAD_WIDTH / 2, ROAD_WIDTH / 2);
    
    // Map vertical position from video (closer objects are lower) to 3D scene depth.
    // Objects lower on screen (larger Y) are closer (smaller Z magnitude).
    const posZ = mapRange(bottomY, videoHeight / 2, videoHeight, -5, -60);
    
    const isPerson = detection.class === 'person';
    // Standardize object sizes to be similar to a real vehicle/person.
    const size: [number, number, number] = isPerson ? [0.5, 1.8, 0.5] : [2.2, 1.5, 4.5];
    const posY = size[1] / 2; // Place the object on the ground plane.

    const color = isPerson ? '#ff4d4d' : '#4d4dff';

    return (
        <Box args={size} position={[posX, posY, posZ]}>
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
        </Box>
    );
};


// Simplified road without fixed lane markings, just a plain surface.
const Road = () => {
    return (
        <group>
            <Plane args={[ROAD_WIDTH, ROAD_LENGTH]} rotation-x={-Math.PI / 2} position={[0, 0, -ROAD_LENGTH/2]}>
                <meshStandardMaterial color="#222222" />
            </Plane>
        </group>
    );
}

const SceneContent: React.FC<SceneViewProps> = ({ detections, videoDimensions }) => {
  return (
    <>
      {/* Camera positioned for a first-person driver's view, slightly tilted down */}
      <PerspectiveCamera makeDefault position={[0, 1.6, 0]} fov={60} rotation={[-0.1, 0, 0]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        castShadow 
      />
      <hemisphereLight groundColor="#444" color="#00ffff" intensity={0.8} />
      
      <fog attach="fog" args={['#11111a', 15, 80]} />
      
      <Road />

      {/* Render detected objects considered relevant for driving */}
      {detections
        .filter(d => d.class === 'person' || d.class === 'car' || d.class === 'truck' || d.class === 'bus')
        .map((detection) => (
            <DetectedItem 
                key={detection.bbox.join('-')} 
                detection={detection} 
                videoWidth={videoDimensions.width} 
                videoHeight={videoDimensions.height} 
            />
      ))}
      
    </>
  );
};


export const SceneView: React.FC<SceneViewProps> = ({ detections, videoDimensions }) => {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
            <Canvas>
                <SceneContent detections={detections} videoDimensions={videoDimensions}/>
            </Canvas>
        </div>
    );
}