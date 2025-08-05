import { Link } from 'react-router-dom'

function Header({ searchTerm, onSearchChange }) {
  return (
    <header className="header">
      <Link to="/" className="logo">ForumulAuto.</Link>
      <input
        type="text"
        className="search-bar"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/create" className="nav-link">Create New Post</Link>
      </nav>
    </header>
  )
}

export default Header
