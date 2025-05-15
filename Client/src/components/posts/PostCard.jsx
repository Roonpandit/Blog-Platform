import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import "./PostCard.css";

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const PostCardSkeleton = () => (
  <div className="post-card skeleton">
    <div className="post-image"></div>
    <div className="post-content">
      <div className="post-title"></div>
      <div className="post-meta">
        <span></span>
        <span></span>
      </div>
      <div className="post-excerpt"></div>
      <div className="post-footer">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
);

const PostCard = ({
  post,
  onLike,
  onFavorite,
  showActions = true,
  loading = false,
}) => {
  const { user } = useContext(AuthContext);
  const [isLikeHovered, setIsLikeHovered] = useState(false);
  const [isFavHovered, setIsFavHovered] = useState(false);
  const [message, setMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(
    user?.favoritePosts?.includes(post._id)
  );

  if (loading) {
    return <PostCardSkeleton />;
  }

  const isLiked = user && post.likes.includes(user._id);

  const handleLike = (postId) => {
    onLike(postId);
    setMessage(isLiked ? "You unliked this post" : "You liked this post");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleFavorite = (postId) => {
    onFavorite(postId);
    setIsFavorite(!isFavorite);
    setMessage(isFavorite ? "Removed from favorites" : "Added to favorites");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="post-cards">
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
            By{" "}
            <Link to={`/users/${post.author._id}/posts`}>
              {post.author.username}
            </Link>
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
          {post.content.length > 150
            ? `${post.content.substring(0, 150)}...`
            : post.content}
        </p>

        <div className="post-footer">
          <Link to={`/posts/${post._id}`} className="read-more">
            Read More
          </Link>

          {showActions && user && (
            <div className="post-actions">
              <button
                className={`post-action ${isLiked ? "active" : ""}`}
                onClick={() => handleLike(post._id)}
                onMouseEnter={() => setIsLikeHovered(true)}
                onMouseLeave={() => setIsLikeHovered(false)}
              >
                <HeartIcon />
                <span>
                  {isLikeHovered
                    ? isLiked
                      ? "Unlike"
                      : "Like"
                    : post.likes.length}
                </span>
              </button>

              <button
                className={`post-action ${isFavorite ? "active" : ""}`}
                onClick={() => handleFavorite(post._id)}
                onMouseEnter={() => setIsFavHovered(true)}
                onMouseLeave={() => setIsFavHovered(false)}
              >
                <BookmarkIcon />
                <span>
                  {isFavHovered
                    ? isFavorite
                      ? "Remove Fav"
                      : "Add Fav"
                    : isFavorite
                    ? "Saved"
                    : ""}
                </span>
              </button>

              {user._id === post.author._id && (
                <Link
                  to={`/edit-post/${post._id}`}
                  className="post-action"
                  aria-label="Edit post"
                >
                  <EditIcon />
                </Link>
              )}
            </div>
          )}

          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
