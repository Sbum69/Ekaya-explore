import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { NOTIFICATIONS } from '../../services/data'
import Drawer from './Drawer'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isOffline = useStore((s) => s.isOffline)
  const user = useStore((s) => s.user)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  const toggleLang = () => {
    const next = lang === 'pt' ? 'en' : 'pt'
    setLang(next)
    i18n.changeLanguage(next)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col gap-1 cursor-pointer p-1"
            aria-label="Menu"
          >
            <span className="w-5 h-0.5 bg-gray-800 block rounded" />
            <span className="w-5 h-0.5 bg-gray-800 block rounded" />
            <span className="w-5 h-0.5 bg-gray-800 block rounded" />
          </button>
          <div>
            <h1 className="text-[17px] font-medium text-gray-900">{t('nav.location')}</h1>
            <p className="text-xs text-gray-500">{t('nav.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="pill text-xs">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
            </svg>
            {lang.toUpperCase()}
          </button>

          <div className={`pill text-xs ${isOffline ? 'pill-offline' : 'text-gray-600'}`}>
            {isOffline ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
              </svg>
            )}
            {isOffline ? t('nav.offline') : t('nav.online')}
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="nav-icon-btn"
              aria-label="Notificações"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-ekaya-orange text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white border border-gray-100 rounded-xl shadow-sm z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 font-medium text-sm">
                  {t('notifications.title')}
                </div>
                {NOTIFICATIONS.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">{t('notifications.empty')}</p>
                ) : (
                  NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-gray-50 flex gap-3 ${n.read ? 'opacity-50' : ''}`}
                    >
                      <span className="text-lg">{n.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.body}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(user ? '/perfil' : '/auth/login')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-ekaya-purple to-ekaya-pink flex items-center justify-center text-white text-xs font-medium cursor-pointer border-0"
            aria-label="Perfil"
          >
            {user ? user.name.charAt(0).toUpperCase() : ''}
          </button>
        </div>
      </nav>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {notifOpen && <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />}
    </>
  )
}
