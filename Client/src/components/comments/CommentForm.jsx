import { useState } from "react";
import "./CommentForm.css";

const CommentFormSkeleton = () => {
  return (
    <div className="comment-form-skeleton">
      <div className="skeleton-textarea"></div>
      <div className="skeleton-button"></div>
    </div>
  );
};

const CommentForm = ({
  onSubmit,
  initialValue = "",
  buttonText = "Submit",
  isLoading = false,
}) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    onSubmit(content);
    setContent("");
    setError("");
  };

  if (isLoading) {
    return <CommentFormSkeleton />;
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          className={`form-control ${error ? "error" : ""}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          rows="3"
        ></textarea>
        {error && <div className="error-message">{error}</div>}
      </div>
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default CommentForm;
