import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = useStore((s) => s.setUser)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo =
    location.state?.from && location.state.from !== '/auth/login'
      ? location.state.from
      : '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Preenche todos os campos.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setUser({ name: form.email.split('@')[0], email: form.email, avatar: null })
    setLoading(false)
    navigate(redirectTo, { replace: true })
  }

  const handleGoogle = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setUser({ name: 'Utilizador Google', email: 'google@ekaya.com', avatar: null })
    setLoading(false)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen bg-ekaya-bg flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-ekaya-orange rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Ekaya Explore</h1>
          <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta</p>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.google')}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex-1 h-px bg-gray-100" />
            ou
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <div>
              <label htmlFor="login-email" className="text-xs text-gray-500 mb-1 block">
                {t('auth.email')}
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nome@exemplo.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ekaya-orange bg-white"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-xs text-gray-500 mb-1 block">
                {t('auth.password')}
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ekaya-orange bg-white"
              />
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-500">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary justify-center mt-1">
              {loading ? 'A entrar...' : t('auth.login')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('auth.no_account')}{' '}
          <Link to="/auth/register" className="text-ekaya-orange font-medium">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
