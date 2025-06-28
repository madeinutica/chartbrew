import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  CardBody, 
  Button, 
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure
} from '@heroui/react'
import { PlusIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { fetchProjects, createProject } from '../store/slices/projectSlice'
import { logout } from '../store/slices/authSlice'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const { user } = useSelector((state) => state.auth)
  const { projects, loading } = useSelector((state) => state.projects)
  
  const [projectName, setProjectName] = React.useState('')
  const [creating, setCreating] = React.useState(false)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name')
      return
    }

    setCreating(true)
    try {
      const result = await dispatch(createProject({ 
        name: projectName.trim(),
        description: `${projectName.trim()} dashboard`
      })).unwrap()
      
      toast.success('Project created successfully!')
      setProjectName('')
      onClose()
      navigate(`/project/${result.id}`)
    } catch (error) {
      toast.error(error || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-foreground-600 mt-2">
              Manage your data visualization projects
            </p>
          </div>
          
          <Button
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={onOpen}
          >
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <ChartBarIcon className="w-16 h-16 mx-auto text-foreground-400 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-foreground-600 mb-6">
              Create your first project to start building beautiful charts and dashboards
            </p>
            <Button
              color="primary"
              size="lg"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={onOpen}
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                isPressable
                onPress={() => navigate(`/project/${project.id}`)}
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-foreground-600">
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={(e) => {
                        e.stopPropagation()
                        navigate(`/settings`)
                      }}
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-foreground-500">
                    <span>
                      {project.charts?.length || 0} charts
                    </span>
                    <span>
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalBody>
            <Input
              label="Project Name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              variant="bordered"
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreateProject}
              isLoading={creating}
            >
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Dashboard