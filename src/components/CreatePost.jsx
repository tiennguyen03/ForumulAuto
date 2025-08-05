import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
      setLoading(true)
      setError(null)

      let finalImageUrl = imageUrl.trim()

      // If user uploaded a file, upload it and get the URL
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: title.trim(),
            content: content.trim() || null,
            image_url: finalImageUrl || null,
            upvotes: 0
          }
        ])
        .select()

      if (error) throw error

      navigate(`/post/${data[0].id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Create New Post</h1>
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
              Or upload an image file:
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
            disabled={loading || uploading}
          >
            {loading ? 'Creating Post...' : uploading ? 'Uploading Image...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
