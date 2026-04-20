import { useNavigate } from 'react-router-dom'

export default function FAB() {
  const navigate = useNavigate()
  return (
    <button className="fab" onClick={() => navigate('/map')} aria-label="Explorar mapa">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </button>
  )
}
