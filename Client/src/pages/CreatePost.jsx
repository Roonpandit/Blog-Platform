import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import Alert from "../components/common/Alert";
import "./PostForm.css";

// Icons (same as in EditPost)
const IconCreate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, image: null });
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        // Create FormData object for file upload
        const postData = new FormData();
        postData.append("title", formData.title);
        postData.append("content", formData.content);

        if (formData.tags.trim()) {
          postData.append("tags", formData.tags);
        }

        if (formData.image) {
          postData.append("image", formData.image);
        }

        const response = await api.post("/api/posts", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigate(`/posts/${response.data._id}`);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You are banned from posting.");
        } else {
          setError("Error creating post. Please try again later.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (user && user.isBanned) {
    return (
      <div className="post-form-page">
        <div className="post-form-container">
          <h1 className="post-form-title">Create Post</h1>
          <Alert type="error" message="You are banned from posting." />
          <button className="back-button" onClick={() => navigate(-1)}>
            <IconBack /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-form-page">
      <div className="post-form-container">
        <h1 className="post-form-title">
          <IconCreate /> Create New Post
        </h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={formErrors.title ? "error" : ""}
              placeholder="Enter a descriptive title"
            />
            {formErrors.title && (
              <div className="error-message">{formErrors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className={formErrors.content ? "error" : ""}
              placeholder="Write your post content here..."
            ></textarea>
            {formErrors.content && (
              <div className="error-message">{formErrors.content}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              <IconTag /> Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. technology, programming, news"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <IconImage /> Featured Image (optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setFormData({ ...formData, image: null });
                    setImagePreview(null);
                  }}
                >
                  <IconTrash /> Remove
                </button>
              </div>
            )}
          </div>

          <div className="button-group">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              <IconBack /> Cancel
            </button>
            <button type="submit" className="post-form-button" disabled={loading}>
              {loading ? "Creating..." : <><IconSend /> Create Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;