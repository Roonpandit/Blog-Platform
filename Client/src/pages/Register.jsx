"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Alert from "../components/common/Alert"
import "./Auth.css"

// Import icons
import { 
  FiMail, 
  FiEye, 
  FiEyeOff, 
  FiUserPlus,
  FiUser,
} from "react-icons/fi"

const RegisterSkeleton = () => {
  return (
    <div className="auth-container">
      <div className="auth-skeleton skeleton-title"></div>
      
      <div className="auth-form">
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-button"></div>
      </div>
      
      <div className="auth-skeleton skeleton-text"></div>
    </div>
  )
}

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { register, user, error, setError } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate("/")
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Clear any existing errors when component mounts
    return () => {
      setError(null)
      clearTimeout(timer)
    }
  }, [user, navigate, setError])

  const validateForm = () => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData
        await register(userData)
        navigate("/")
      } catch (err) {
        // Error is handled in the AuthContext
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="auth-page">
        <RegisterSkeleton />
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Create an Account</h1>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={formErrors.username ? "error" : ""}
              placeholder="johndoe"
            />
            <FiUser className="input-icon" />
            {formErrors.username && <div className="error-message">{formErrors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
              placeholder="your@email.com"
            />
            <FiMail className="input-icon" />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? "error" : ""}
              placeholder="••••••••"
            />
            <div className="input-icon" onClick={() => togglePasswordVisibility('password')}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={formErrors.confirmPassword ? "error" : ""}
              placeholder="••••••••"
            />
            <div className="input-icon" onClick={() => togglePasswordVisibility('confirm')}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
          </div>

          <button type="submit" className="auth-button">
            <FiUserPlus className="button-icon" />
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register