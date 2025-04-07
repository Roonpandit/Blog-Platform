"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../utils/api"
import PostList from "../components/posts/PostList"
import Loader from "../components/common/Loader"
import Alert from "../components/common/Alert"
import "./UserPosts.css"

const UserPosts = () => {
  const { userId } = useParams()
  const [username, setUsername] = useState("")
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
      } else {
        // If user has no posts, we need to fetch user info directly
        const userResponse = await api.get(`/api/users/${userId}`)
        setUsername(userResponse.data.username)
      }
    } catch (err) {
      setError("Error loading user information")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
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
      </div>

      <PostList
        endpoint={`/api/posts/user/${userId}`}
        emptyMessage={`${username || "This user"} hasn't published any posts yet.`}
      />
    </div>
  )
}

export default UserPosts

