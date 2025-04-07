"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Alert from "../components/common/Alert"
import "./Profile.css"

const Profile = () => {
  const { user, updateProfile, error, setError } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const validateForm = () => {
    const errors = {}

    if (formData.username.trim() === "") {
      errors.username = "Username is required"
    }

    if (formData.email.trim() === "") {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (formData.password && formData.password.length < 6) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // Only include fields that have changed
        const updatedData = {}

        if (formData.username !== user.username) {
          updatedData.username = formData.username
        }

        if (formData.email !== user.email) {
          updatedData.email = formData.email
        }

        if (formData.password) {
          updatedData.password = formData.password
        }

        // Only make API call if there are changes
        if (Object.keys(updatedData).length > 0) {
          await updateProfile(updatedData)
          setSuccessMessage("Profile updated successfully")

          // Clear password fields after successful update
          setFormData({
            ...formData,
            password: "",
            confirmPassword: "",
          })
        } else {
          setSuccessMessage("No changes to update")
        }
      } catch (err) {
        // Error is handled in the AuthContext
      }
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} />}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={formErrors.username ? "error" : ""}
            />
            {formErrors.username && <div className="error-message">{formErrors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? "error" : ""}
            />
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={formErrors.confirmPassword ? "error" : ""}
            />
            {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
          </div>

          <button type="submit" className="profile-button">
            Update Profile
          </button>
        </form>

        <div className="profile-info">
          <h2>Account Information</h2>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile

