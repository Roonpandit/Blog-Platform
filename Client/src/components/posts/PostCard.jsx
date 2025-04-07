"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { formatDate } from "../../utils/helpers"
import "./PostCard.css"

const PostCard = ({ post, onLike, onFavorite, showActions = true }) => {
  const { user } = useContext(AuthContext)

  const isLiked = user && post.likes.includes(user._id)
  const isFavorite = user && user.favoritePosts && user.favoritePosts.includes(post._id)

  return (
    <div className="post-card">
      {post.image && (
        <div className="post-image">
          <img src={post.image || "/placeholder.svg"} alt={post.title} />
        </div>
      )}

      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>

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

        <p className="post-excerpt">
          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
        </p>

        <div className="post-footer">
          <Link to={`/posts/${post._id}`} className="read-more">
            Read More
          </Link>

          {showActions && user && (
            <div className="post-actions">
              <button
                className={`post-action ${isLiked ? "active" : ""}`}
                onClick={() => onLike(post._id)}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <i className="icon-heart"></i>
                <span>{post.likes.length}</span>
              </button>

              <button
                className={`post-action ${isFavorite ? "active" : ""}`}
                onClick={() => onFavorite(post._id)}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <i className="icon-bookmark"></i>
              </button>

              {user._id === post.author._id && (
                <Link to={`/edit-post/${post._id}`} className="post-action" aria-label="Edit post">
                  <i className="icon-edit"></i>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostCard