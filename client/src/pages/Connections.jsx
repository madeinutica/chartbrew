import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardBody } from '@heroui/react'

const Connections = () => {
  const { projectId } = useParams()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Data Connections
        </h1>
        
        <Card>
          <CardBody>
            <p className="text-foreground-600">
              Project ID: {projectId}
            </p>
            <p className="text-foreground-600 mt-2">
              Connections management coming soon...
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Connections