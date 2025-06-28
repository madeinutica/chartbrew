import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Input, Button, Divider } from '@heroui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { signup, clearError } from '../store/slices/authSlice'

const Signup = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      await dispatch(signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })).unwrap()
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error(error || 'Signup failed')
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
          <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
          <p className="text-foreground-600 mt-2">Start visualizing your data today</p>
        </div>

        <Card className="shadow-lg">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                variant="bordered"
                isRequired
              />

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

              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="bordered"
                isRequired
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
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
                Create Account
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-foreground-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-foreground-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup