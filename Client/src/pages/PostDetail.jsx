"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { api } from "../utils/api"
import { AuthContext } from "../context/AuthContext"
import CommentForm from "../components/comments/CommentForm"
import CommentList from "../components/comments/CommentList"
import Loader from "../components/common/Loader"
import Alert from "../components/common/Alert"
import { formatDate } from "../utils/helpers"
import "./PostDetail.css"

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`)
      setPost(response.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Post not found")
      } else {
        setError("Error loading post. Please try again later.")
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async () => {
    try {
      const response = await api.post(`/api/posts/${id}/like`)
      setPost({ ...post, likes: response.data.likes })
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleFavoritePost = async () => {
    try {
      await api.post(`/api/posts/${id}/favorite`)
      // We don't need to update the post state here
      // Just force a re-render to show the updated favorite status
      setPost({ ...post })
    } catch (err) {
      console.error("Error favoriting post:", err)
    }
  }

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/posts/${id}`)
        navigate("/")
      } catch (err) {
        setError("Error deleting post. Please try again.")
        console.error(err)
      }
    }
  }

  const handleAddComment = async (content) => {
    try {
      const response = await api.post(`/api/comments/${id}`, { content })
      setPost({
        ...post,
        comments: [...post.comments, response.data],
      })
    } catch (err) {
      setError("Error adding comment. Please try again.")
      console.error(err)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/api/comments/${commentId}/like`)

      setPost({
        ...post,
        comments: post.comments.map((comment) => {
          if (comment._id === commentId) {
            return { ...comment, likes: response.data.likes }
          }
          return comment
        }),
      })
    } catch (err) {
      console.error("Error liking comment:", err)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/api/comments/${commentId}`)

        setPost({
          ...post,
          comments: post.comments.filter((comment) => comment._id !== commentId),
        })
      } catch (err) {
        setError("Error deleting comment. Please try again.")
        console.error(err)
      }
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="post-detail-error">
        <Alert type="error" message={error} />
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-detail-error">
        <Alert type="error" message="Post not found" />
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    )
  }

  const isAuthor = user && user._id === post.author._id
  const isLiked = user && post.likes.some((like) => like._id === user._id)
  const isFavorite = user && user.favoritePosts && user.favoritePosts.includes(post._id)

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <span className="post-author">
              By <Link to={`/users/${post.author._id}/posts`}>{post.author.username}</Link>
            </span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>

          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <Link key={index} to={`/?tag=${tag}`} className="post-tag">
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {post.image && (
          <div className="post-image">
            <img src={post.image || "/placeholder.svg"} alt={post.title} />
          </div>
        )}

        <div className="post-content">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="post-actions">
          {user && (
            <>
              <button className={`post-action ${isLiked ? "active" : ""}`} onClick={handleLikePost}>
                <i className="icon-heart"></i>
                <span>
                  {post.likes.length} Like{post.likes.length !== 1 ? "s" : ""}
                </span>
              </button>

              <button className={`post-action ${isFavorite ? "active" : ""}`} onClick={handleFavoritePost}>
                <i className="icon-bookmark"></i>
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </button>
            </>
          )}

          {isAuthor && (
            <>
              <Link to={`/edit-post/${post._id}`} className="post-action">
                <i className="icon-edit"></i>
                <span>Edit</span>
              </Link>

              <button className="post-action delete" onClick={handleDeletePost}>
                <i className="icon-trash"></i>
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        <div className="post-comments">
          <h2 className="comments-heading">Comments</h2>

          {user ? (
            user.isBanned ? (
              <Alert type="error" message="You are banned from commenting." />
            ) : (
              <CommentForm onSubmit={handleAddComment} />
            )
          ) : (
            <div className="login-to-comment">
              <p>
                Please <Link to="/login">login</Link> to leave a comment.
              </p>
            </div>
          )}

          <CommentList comments={post.comments} onLike={handleLikeComment} onDelete={handleDeleteComment} />
        </div>
      </div>
    </div>
  )
}

export default PostDetail

