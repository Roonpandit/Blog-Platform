import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import "./CommentList.css";

const CommentListSkeleton = () => {
  return (
    <div className="comment-list-skeleton">
      <div className="comments-title">Loading Comments...</div>
      {[1, 2, 3].map((item) => (
        <div key={item} className="skeleton-comment">
          <div className="skeleton-header">
            <div className="skeleton-author"></div>
            <div className="skeleton-date"></div>
          </div>
          <div className="skeleton-content"></div>
          <div className="skeleton-actions">
            <div className="skeleton-action"></div>
            <div className="skeleton-action"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentList = ({ comments, onLike, onDelete, isLoading = false }) => {
  const { user } = useContext(AuthContext);

  if (isLoading) {
    return <CommentListSkeleton />;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3 className="comments-title">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>

      {comments.map((comment) => {
        const isLiked = user && comment.likes.includes(user._id);
        const canDelete =
          user && (user._id === comment.author._id || user.role === "admin");

        return (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <Link
                to={`/users/${comment.author._id}/posts`}
                className="comment-author"
              >
                {comment.author.username}
              </Link>
              <span className="comment-date">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            <div className="comment-content">{comment.content}</div>

            <div className="comment-actions">
              {user && (
                <button
                  className={`comment-action ${isLiked ? "active" : ""}`}
                  onClick={() => onLike(comment._id)}
                >
                  <i className="icon-heart"></i>
                  <span>{comment.likes.length}</span>
                </button>
              )}

              {canDelete && (
                <button
                  className="comment-action delete"
                  onClick={() => onDelete(comment._id)}
                >
                  <i className="icon-trash"></i>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
