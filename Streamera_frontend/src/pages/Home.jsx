import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getVideos } from '../api/VideoApi';
import VideoCard from '../components/VideoCard';
import { isAuthContext } from '../context/context';
import './Home.css';

const Home = () => {
  const values = useContext(isAuthContext);

  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  const fetchVideos = async (pageNumber = 1) => {
    try {
      const data = await getVideos(pageNumber);

      if (pageNumber === 1) {
        setVideos(data.docs);
        setFilteredVideos(data.docs);
      } else {
        setVideos(prev => [...prev, ...data.docs]);
        setFilteredVideos(prev => [...prev, ...data.docs]);
      }

      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError("Failed to fetch videos");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFilteredVideos(videos);
      return;
    }

    const keywords = query.split(" ");

    const results = videos.filter((video) =>
      keywords.every((word) =>
        video.title.toLowerCase().includes(word) ||
        (video.description &&
          video.description.toLowerCase().includes(word))
      )
    );

    setFilteredVideos(results);
  }, [search, videos]);

  const handleLoadMore = () => {
    if (!hasNextPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadMoreLoading(true);
    fetchVideos(nextPage);
  };

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="home-section">
      {!values.isLoggedIn && (
        <div className='login-notification'>
          <NavLink className="click-here" to="/users/login">
            Click here
          </NavLink> to sign up and start exploring!
          Use <span className='click-here'>"user_99999"</span> as Username and <span className='click-here'>"user@12345"</span> as Password.
        </div>
      )}

      {search && (
        <p className="search-info">
          Showing results for: <strong>{search}</strong>
        </p>
      )}

      <div className="home-video-grid">
        {filteredVideos.length === 0 ? (
          <p>No videos found</p>
        ) : (
          filteredVideos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))
        )}
      </div>

      {hasNextPage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleLoadMore}
            disabled={loadMoreLoading}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: loadMoreLoading ? "not-allowed" : "pointer",
              opacity: loadMoreLoading ? 0.6 : 1,
              background: "#ff6044",
              color: "#fff",
              fontWeight: "600"
            }}
          >
            {loadMoreLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;