import React from 'react'
import { Card, CardBody } from '@heroui/react'

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Settings
        </h1>
        
        <Card>
          <CardBody>
            <p className="text-foreground-600">
              Settings functionality coming soon...
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Settings