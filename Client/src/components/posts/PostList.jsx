import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import PostCard from "./PostCard";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";
import "./PostList.css";

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const EmptyStateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#718096"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="12" x2="16" y2="12"></line>
    <line x1="8" y1="16" x2="16" y2="16"></line>
    <line x1="8" y1="8" x2="16" y2="8"></line>
  </svg>
);

const PostList = ({ endpoint, title, emptyMessage }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const { user, setUser } = useContext(AuthContext);

  const tag = searchParams.get("tag");

  useEffect(() => {
    fetchPosts();
  }, [currentPage, tag, endpoint]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${endpoint}?page=${currentPage}&limit=10`;
      if (tag) url += `&tag=${tag}`;

      const response = await api.get(url);

      const fetchedPosts = Array.isArray(response.data.posts)
        ? response.data.posts
        : Array.isArray(response.data.favoritePosts)
        ? response.data.favoritePosts
        : Array.isArray(response.data)
        ? response.data
        : [];

      setPosts(fetchedPosts);

      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleFavorite = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/favorite`);

      if (user) {
        const updatedUser = {
          ...user,
          favoritePosts: response.data.favoritePosts,
        };
        setUser && setUser(updatedUser);
      }

      if (endpoint.includes("/favorites")) {
        fetchPosts();
      } else {
        setPosts([...posts]);
      }
    } catch (err) {
      console.error("Error favoriting post:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="post-list-container">
        {title && <h1 className="post-list-title">{title}</h1>}
        <div className="skeleton-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-excerpt"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {title && <h1 className="post-list-title">{title}</h1>}

      {tag && (
        <div className="tag-filter">
          <FilterIcon />
          <span>Filtered by tag: </span>
          <span className="tag">{tag}</span>
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {posts.length === 0 ? (
        <div className="empty-state">
          <EmptyStateIcon />
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
  );
};

export default PostList;
