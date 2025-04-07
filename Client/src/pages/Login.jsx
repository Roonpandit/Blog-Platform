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
  FiLogIn,
} from "react-icons/fi"

const LoginSkeleton = () => {
  return (
    <div className="auth-container">
      <div className="auth-skeleton skeleton-title"></div>
      
      <div className="auth-form">
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-input"></div>
        <div className="auth-skeleton skeleton-button"></div>
      </div>
      
      <div className="auth-skeleton skeleton-text"></div>
    </div>
  )
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { login, user, error, setError } = useContext(AuthContext)
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

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      try {
        await login(formData)
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
        <LoginSkeleton />
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Login to Your Account</h1>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <div className="input-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>

          <button type="submit" className="auth-button">
            <FiLogIn className="button-icon" />
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Login