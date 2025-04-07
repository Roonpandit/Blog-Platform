"use client"

import { useState, useEffect, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../../utils/api"
import { AuthContext } from "../../context/AuthContext"
import PostCard from "./PostCard"
import Pagination from "../common/Pagination"
import Loader from "../common/Loader"
import Alert from "../common/Alert"
import "./PostList.css"

const PostList = ({ endpoint, title, emptyMessage }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams] = useSearchParams()
  const { user, setUser } = useContext(AuthContext)

  const tag = searchParams.get("tag")

  useEffect(() => {
    fetchPosts()
  }, [currentPage, tag, endpoint])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = `${endpoint}?page=${currentPage}&limit=10`
      if (tag) url += `&tag=${tag}`

      const response = await api.get(url)

      // Handle posts from different response formats
      const fetchedPosts = Array.isArray(response.data.posts)
        ? response.data.posts
        : Array.isArray(response.data.favoritePosts)
        ? response.data.favoritePosts
        : Array.isArray(response.data)
        ? response.data
        : []

      setPosts(fetchedPosts)

      // For normal pagination support
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages)
      }
    } catch (err) {
      setError("Failed to load posts. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`)
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      )
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleFavorite = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/favorite`)
      
      if (user) {
        // Avoid mutating context directly
        const updatedUser = { ...user, favoritePosts: response.data.favoritePosts }
        setUser && setUser(updatedUser)
      }

      // Optionally re-fetch favorite posts if on the favorites page
      if (endpoint.includes("/favorites")) {
        fetchPosts()
      } else {
        // Force UI refresh
        setPosts([...posts])
      }
    } catch (err) {
      console.error("Error favoriting post:", err)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (loading && posts.length === 0) {
    return <Loader />
  }

  return (
    <div className="post-list-container">
      {title && <h1 className="post-list-title">{title}</h1>}

      {tag && (
        <div className="tag-filter">
          <span>Filtered by tag: </span>
          <span className="tag">{tag}</span>
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage || "No posts found."}</p>
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onFavorite={handleFavorite}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default PostList