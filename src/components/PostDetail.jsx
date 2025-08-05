import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPost(data)
      setEditTitle(data.title)
      setEditContent(data.content || '')
      setEditImageUrl(data.image_url || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!id) return; // Don't fetch if no ID
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', parseInt(id))
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      // Don't fail silently, but don't break the whole component
      setComments([])
    }
  }

  const handleUpvote = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)

      if (error) throw error
      setPost({ ...post, upvotes: post.upvotes + 1 })
    } catch (err) {
      console.error('Error upvoting:', err)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      console.log('Adding comment for post ID:', id, 'parsed as:', parseInt(id))
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: parseInt(id),
          content: newComment.trim()
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Comment added successfully:', data)
      setComments([...comments, data[0]])
      setNewComment('')
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editTitle.trim(),
          content: editContent.trim() || null,
          image_url: editImageUrl.trim() || null
        })
        .eq('id', id)

      if (error) throw error
      
      setPost({
        ...post,
        title: editTitle.trim(),
        content: editContent.trim() || null,
        image_url: editImageUrl.trim() || null
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating post:', err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      // Delete comments first
      await supabase
        .from('comments')
        .delete()
        .eq('post_id', parseInt(id))

      // Then delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/')
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than an hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }

  if (loading) return <div className="loading">Loading post...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!post) return <div className="error">Post not found</div>

  return (
    <div className="container">
      <div className="post-detail">
        {isEditing ? (
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content (Optional)"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                className="form-input"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Image URL (Optional)"
              />
            </div>
            <div className="post-actions">
              <button type="submit" className="btn-primary">Update Post</button>
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="post-meta">Posted {formatTimeAgo(post.created_at)}</div>
            <h1 className="post-title">{post.title}</h1>
            
            {post.content && (
              <div className="post-content">{post.content}</div>
            )}
            
            {post.image_url && (
              <img src={post.image_url} alt="Post" className="post-image" />
            )}
            
            <button className="upvote-btn" onClick={handleUpvote}>
              👍 {post.upvotes} upvotes
            </button>
            
            <div className="post-actions">
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          </>
        )}
      </div>

      <div className="comments-section">
        <h3 className="comments-title">Comments</h3>
        
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-meta">
              Posted {formatTimeAgo(comment.created_at)}
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
        
        <form onSubmit={handleAddComment} className="comment-form">
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ height: '80px' }}
            />
          </div>
          <button type="submit" className="btn-primary">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostDetail
