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
      const response = await api.get(`/api/posts/user/${userId}?page=1&limit=1`)
  
      if (response.data.posts && response.data.posts.length > 0) {
        const author = response.data.posts[0].author
        setUsername(author.username)
        if (author.avatar) setUserAvatar(author.avatar)
        setPostCount(response.data.totalCount || response.data.posts.length)
      } else {
        // No posts, try to fetch just the user info
        const userResponse = await api.get(`/api/users/${userId}`)
  
        if (userResponse.data && typeof userResponse.data === 'object') {
          const userData = userResponse.data
  
          if (userData.username) {
            setUsername(userData.username)
            if (userData.avatar) setUserAvatar(userData.avatar)
            setPostCount(0)
          } else {
            setError("User exists but has no profile info.")
          }
        } else {
          setError("User not found.")
        }
      }
    } catch (err) {
      console.error("Error loading user info:", err)
      setError("This user has no posts.")
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