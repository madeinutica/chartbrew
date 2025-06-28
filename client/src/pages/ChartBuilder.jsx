import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardBody } from '@heroui/react'

const ChartBuilder = () => {
  const { projectId, chartId } = useParams()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Chart Builder
        </h1>
        
        <Card>
          <CardBody>
            <p className="text-foreground-600">
              Project ID: {projectId}
            </p>
            <p className="text-foreground-600 mt-2">
              Chart ID: {chartId}
            </p>
            <p className="text-foreground-600 mt-2">
              Chart builder functionality coming soon...
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ChartBuilder