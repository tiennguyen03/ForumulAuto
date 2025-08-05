import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import PostDetail from './components/PostDetail'
import EditPost from './components/EditPost'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Router>
      <div className="App">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App