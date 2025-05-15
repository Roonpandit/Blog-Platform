import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PostList from "../components/posts/PostList";
import Layout from "../components/common/Layout";
import "./FavoritePosts.css";

const FavoritePosts = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <div className="favorite-posts-page">
        <div className="favorite-posts-header">
          <h1 className="favorite-posts-title">Your Favorite Posts</h1>
        </div>

        <PostList
          endpoint="/api/posts/favorites/list"
          emptyMessage="You haven't saved any posts yet. Discover and bookmark content you enjoy!"
        />
      </div>
    </Layout>
  );
};

export default FavoritePosts;
