import React from 'react'

function WazeIcon({ size = 20, className = '' }) {
  return (
    <img 
      src="/images/waze-icon.png" 
      alt="Waze" 
      width={size} 
      height={size} 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default WazeIcon
