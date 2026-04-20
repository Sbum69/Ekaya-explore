import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

const MENU = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'Explorar Mapa', path: '/map', icon: '🗺️' },
  { label: 'Roteiros', path: '/roteiros', icon: '🧭' },
  { label: 'Meus Favoritos', path: '/favoritos', icon: '⭐' },
  { label: 'Notícias & Avisos', path: '/noticias', icon: '📰' },
  { label: 'Conquistas', path: '/conquistas', icon: '🏅' },
  { label: 'Planeador de Viagem', path: '/planeador', icon: '🧳' },
  { label: 'Perfil', path: '/perfil', icon: '👤', authOnly: true },
]

export default function Drawer({ open, onClose }) {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ekaya-purple to-ekaya-pink flex items-center justify-center text-white font-medium">
              {user ? user.name.charAt(0) : '?'}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{user ? user.name : 'Visitante'}</p>
              <p className="text-xs text-gray-500">{user ? user.email : 'Não autenticado'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU.filter((item) => !item.authOnly || user).map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          {user ? (
            <button
              onClick={() => {
                logout()
                go('/auth/login')
              }}
              className="w-full text-sm text-red-500 py-2 text-left px-1 hover:text-red-600"
            >
              Sair da conta
            </button>
          ) : (
            <button onClick={() => go('/auth/login')} className="w-full btn-primary justify-center">
              Entrar
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
