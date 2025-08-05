import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Home({ searchTerm }) {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, searchTerm, sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPosts = () => {
    let filtered = [...posts] // Create a copy of the array

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort posts
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    }

    setFilteredPosts(filtered)
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than an hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }

  if (loading) return <div className="loading">Loading posts...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="container">
      <div className="sort-controls">
        <span className="sort-label">Order by:</span>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => setSortBy('newest')}
          >
            Newest
          </button>
          <button
            className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            Most Popular
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="loading">
          {searchTerm ? `No posts found for "${searchTerm}"` : 'No posts yet'}
        </div>
      ) : (
        filteredPosts.map(post => (
          <Link key={post.id} to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="post-card">
              <div className="post-meta">Posted {formatTimeAgo(post.created_at)}</div>
              <h2 className="post-title">{post.title}</h2>
              {post.image_url && (
                <div className="post-preview-image">
                  <img src={post.image_url} alt="Post preview" />
                </div>
              )}
              {post.content && (
                <div className="post-preview-content">
                  {post.content.length > 150 
                    ? `${post.content.substring(0, 150)}...` 
                    : post.content
                  }
                </div>
              )}
              <div className="post-votes">{post.upvotes} upvotes</div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export default Home
