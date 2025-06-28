import React from 'react'
import { Spinner } from '@heroui/react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4">
          <img 
            src="https://chartbrew-static.b-cdn.net/logo_v2.png" 
            alt="Chartbrew" 
            className="w-16 h-16 mx-auto"
          />
        </div>
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-foreground-600">Loading Chartbrew...</p>
      </div>
    </div>
  )
}

export default LoadingScreen