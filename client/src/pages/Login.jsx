import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Input, Button, Divider } from '@heroui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { login, clearError } from '../store/slices/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await dispatch(login(formData)).unwrap()
      toast.success('Welcome back!')
    } catch (error) {
      toast.error(error || 'Login failed')
    }
  }

  React.useEffect(() => {
    if (error) {
      dispatch(clearError())
    }
  }, [formData, dispatch, error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://chartbrew-static.b-cdn.net/logo_v2.png" 
            alt="Chartbrew" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-foreground-600 mt-2">Sign in to your Chartbrew account</p>
        </div>

        <Card className="shadow-lg">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                variant="bordered"
                isRequired
              />
              
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                variant="bordered"
                isRequired
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-default-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-default-400" />
                    )}
                  </button>
                }
              />

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
              >
                Sign In
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-foreground-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-foreground-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login