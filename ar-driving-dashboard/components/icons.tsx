
import React from 'react';

export const TeslaIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill="currentColor"
    />
    <path
      d="M12.5 5h-1v6.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V6h3V5h-4v-.5c0-.83-.67-1.5-1.5-1.5S10 3.67 10 4.5V5H6v1h3v.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V5z"
      fill="currentColor"
    />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h3l2-2h6l2 2h3v2H4V4zm0 4h16v12H4V8zm4 6c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm4-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
);
