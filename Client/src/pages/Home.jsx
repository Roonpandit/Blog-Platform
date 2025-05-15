import { useState, useEffect } from "react";
import PostList from "../components/posts/PostList";
import "./Home.css";
import Sidebar from "../components/layout/Header";

const Home = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to BlogPlatform</h1>
            <p className="hero-subtitle">
              Share your thoughts, discover new ideas, and connect with others.
            </p>
          </div>
        </div>

        <div className="content-section">
          {isLoading ? (
            <div className="skeleton-container">
              {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton-post">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))}
            </div>
          ) : (
            <PostList
              endpoint={`/api/posts?filter=${activeTab}`}
              emptyMessage="No posts found. Be the first to create a post!"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
