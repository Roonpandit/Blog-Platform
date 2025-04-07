"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../utils/api"
import PostList from "../components/posts/PostList"
import Alert from "../components/common/Alert"
import "./UserPosts.css"

// Document icon for post count
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
)

// User avatar component
const UserAvatar = ({ username, imageUrl }) => {
  if (imageUrl) {
    return <div className="user-posts-avatar"><img src={imageUrl} alt={username} /></div>
  }
  
  // If no image, use first letter of username
  return (
    <div className="user-posts-avatar">
      {username ? username[0].toUpperCase() : "U"}
    </div>
  )
}

// Skeleton loading component
const UserPostsSkeleton = () => {
  return (
    <div className="user-posts-page">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-info">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-details">
            <div className="skeleton-detail"></div>
            <div className="skeleton-detail"></div>
          </div>
        </div>
      </div>

      {/* Skeleton for PostList will be handled by the PostList component */}
    </div>
  )
}

const UserPosts = () => {
  const { userId } = useParams()
  const [username, setUsername] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const [postCount, setPostCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserInfo()
  }, [userId])

  const fetchUserInfo = async () => {
    try {
      // We'll make a request to get the first post to extract the username
      const response = await api.get(`/api/posts/user/${userId}?page=1&limit=1`)

      if (response.data.posts && response.data.posts.length > 0) {
        setUsername(response.data.posts[0].author.username)
        // If available, set the avatar
        if (response.data.posts[0].author.avatar) {
          setUserAvatar(response.data.posts[0].author.avatar)
        }
        // Set post count if available in response
        if (response.data.totalPosts) {
          setPostCount(response.data.totalPosts)
        }
      } else {
        // If user has no posts, we need to fetch user info directly
        const userResponse = await api.get(`/api/users/${userId}`)
        setUsername(userResponse.data.username)
        
        if (userResponse.data.avatar) {
          setUserAvatar(userResponse.data.avatar)
        }
        
        // User has no posts
        setPostCount(0)
      }
    } catch (err) {
      setError("Error loading user information")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <UserPostsSkeleton />
  }

  if (error) {
    return (
      <div className="user-posts-page">
        <Alert type="error" message={error} />
      </div>
    )
  }

  return (
    <div className="user-posts-page">
      <div className="user-posts-header">
        <h1 className="user-posts-title">{username ? `${username}'s Posts` : "User Posts"}</h1>
        
        <div className="user-posts-info">
          <UserAvatar username={username} imageUrl={userAvatar} />
          <div className="user-posts-details">
            <div className="user-posts-username">{username}</div>
            <span className="user-posts-count">
              <DocumentIcon />
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </span>
          </div>
        </div>
      </div>

      <PostList
        endpoint={`/api/posts/user/${userId}`}
        emptyMessage={`${username || "This user"} hasn't published any posts yet.`}
      />
    </div>
  )
}

export default UserPosts