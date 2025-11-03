import React from 'react'

function WazeIcon({ size = 20, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Waze logo - blue circle with white W */}
      <circle cx="12" cy="12" r="10" fill="#33CCFF"/>
      {/* W letter in white */}
      <path 
        d="M12 8L8 16h2l1-3h2l1 3h2l-4-8zm-1.5 4l1-2 1 2h-2z" 
        fill="white"
        fontWeight="bold"
      />
      {/* Small dots below for road/route indication */}
      <circle cx="9" cy="17.5" r="1" fill="white" opacity="0.9"/>
      <circle cx="12" cy="17.5" r="1" fill="white" opacity="0.9"/>
      <circle cx="15" cy="17.5" r="1" fill="white" opacity="0.9"/>
    </svg>
  )
}

export default WazeIcon

