"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../utils/api"
import Loader from "../components/common/Loader"
import Alert from "../components/common/Alert"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/admin/users")
      setUsers(response.data)
    } catch (err) {
      setError("Error loading users. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBan = async (userId, currentStatus) => {
    const action = currentStatus ? "unban" : "ban"

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const response = await api.put(`/api/admin/users/${userId}/toggle-ban`)

        // Update the users list
        setUsers(
          users.map((user) => {
            if (user._id === userId) {
              return { ...user, isBanned: response.data.isBanned }
            }
            return user
          }),
        )

        setSuccessMessage(`User ${response.data.username} has been ${response.data.isBanned ? "banned" : "unbanned"}`)

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } catch (err) {
        setError(`Error ${action}ning user. Please try again.`)
        console.error(err)
      }
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage("")} />}

      <div className="admin-section">
        <h2 className="section-title">User Management</h2>

        <div className="user-table-container">
          {loading ? (
            <div className="skeleton-table">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton-row">
                  <div className="skeleton-cell" style={{ flex: 2 }}></div>
                  <div className="skeleton-cell" style={{ flex: 3 }}></div>
                  <div className="skeleton-cell" style={{ flex: 1 }}></div>
                  <div className="skeleton-cell" style={{ flex: 1 }}></div>
                  <div className="skeleton-cell" style={{ flex: 1 }}></div>
                  <div className="skeleton-cell" style={{ flex: 1 }}></div>
                  <div className="skeleton-cell" style={{ flex: 2 }}></div>
                </div>
              ))}
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Posts</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className={user.isBanned ? "banned" : ""}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.postCount || 0}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${user.isBanned ? "banned" : "active"}`}>
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="user-actions">
                          <Link to={`/users/${user._id}/posts`} className="action-button view">
                            View Posts
                          </Link>
                          <button
                            className={`action-button ${user.isBanned ? "unban" : "ban"}`}
                            onClick={() => handleToggleBan(user._id, user.isBanned)}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard