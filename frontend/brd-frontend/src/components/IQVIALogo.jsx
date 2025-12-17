import React from 'react';

export default function IQVIALogo({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {/* IQVIA Icon - Five horizontal bars */}
      <g>
        {/* Bar 1 (top, shortest) */}
        <rect x="0" y="5" width="25" height="4" rx="2" fill="#93C5FD" />
        <rect x="25" y="5" width="35" height="4" rx="2" fill="#3B82F6" />
        
        {/* Bar 2 */}
        <rect x="0" y="15" width="30" height="4" rx="2" fill="#93C5FD" />
        <rect x="30" y="15" width="40" height="4" rx="2" fill="#3B82F6" />
        
        {/* Bar 3 (middle, longest) */}
        <rect x="0" y="25" width="35" height="4" rx="2" fill="#93C5FD" />
        <rect x="35" y="25" width="45" height="4" rx="2" fill="#3B82F6" />
        
        {/* Bar 4 */}
        <rect x="0" y="35" width="30" height="4" rx="2" fill="#93C5FD" />
        <rect x="30" y="35" width="40" height="4" rx="2" fill="#3B82F6" />
        
        {/* Bar 5 (bottom, shortest) */}
        <rect x="0" y="45" width="25" height="4" rx="2" fill="#93C5FD" />
        <rect x="25" y="45" width="35" height="4" rx="2" fill="#3B82F6" />
      </g>
      
      {/* IQVIA Text */}
      <text
        x="90"
        y="35"
        fontFamily="Arial, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="#1F2937"
      >
        IQVIA
        <tspan fontSize="12" dy="-5">™</tspan>
      </text>
    </svg>
  );
}

