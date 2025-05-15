import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="post-list-skeleton">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div className="post-card-skeleton" key={index}>
              <div className="post-image-skeleton"></div>
              <div className="post-content-skeleton">
                <div className="post-title-skeleton"></div>
                <div className="post-meta-skeleton">
                  <div className="post-meta-item-skeleton"></div>
                  <div className="post-meta-item-skeleton"></div>
                </div>
                <div className="post-excerpt-skeleton"></div>
                <div className="post-excerpt-skeleton"></div>
                <div
                  className="post-excerpt-skeleton"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
