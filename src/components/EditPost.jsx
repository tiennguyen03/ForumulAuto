import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      setTitle(data.title)
      setContent(data.content || '')
      setImageUrl(data.image_url || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      let uploadedImageUrl = imageUrl

      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile)
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim() || null,
          image_url: uploadedImageUrl.trim() || null
        })
        .eq('id', id)

      if (error) throw error

      navigate(`/post/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading post...</div>
  if (error && loading) return <div className="error">Error: {error}</div>

  return (
    <div className="container">
      <div className="form-container">
        <h1>Edit Post</h1>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Content (Optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <input
              type="url"
              className="form-input"
              placeholder="Image URL (Optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="file-upload-label">
              Or upload a new image file:
            </label>
            <input
              type="file"
              className="form-input"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files[0])
                setImageUrl('') // Clear URL if file is selected
              }}
            />
            {imageFile && (
              <div className="file-preview">
                Selected: {imageFile.name}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving || uploading}
          >
            {saving ? 'Updating Post...' : uploading ? 'Uploading Image...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPost
