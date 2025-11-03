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
      {/* Waze logo - bright sky blue circular background */}
      <rect width="24" height="24" rx="12" fill="#33CCFF"/>
      
      {/* White character - friendly ghost/speech bubble shape */}
      <path 
        d="M12 5.5C9.5 5.5 7.5 7.5 7.5 10C7.5 12.5 8.5 14.5 10 16C10.8 16.6 11.4 16.9 12 16.9C12.6 16.9 13.2 16.6 14 16C15.5 14.5 16.5 12.5 16.5 10C16.5 7.5 14.5 5.5 12 5.5Z" 
        fill="white"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Pointed bottom-left edge */}
      <path 
        d="M8 17.5L10.5 15L12 16.5L13.5 15L16 17.5L12 18.2Z" 
        fill="white"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Left eye - black dot */}
      <circle cx="10.2" cy="11.5" r="1.4" fill="#000000"/>
      
      {/* Right eye - black dot */}
      <circle cx="13.8" cy="11.5" r="1.4" fill="#000000"/>
      
      {/* Smile - curved black line */}
      <path 
        d="M9.5 13.8 Q12 15.8 14.5 13.8" 
        stroke="#000000" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Left wheel - solid black circle at bottom */}
      <circle cx="9" cy="18.5" r="2" fill="#000000"/>
      
      {/* Right wheel - solid black circle at bottom */}
      <circle cx="15" cy="18.5" r="2" fill="#000000"/>
    </svg>
  )
}

export default WazeIcon
