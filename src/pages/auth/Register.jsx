import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setUser = useStore((s) => s.setUser)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Preenche todos os campos.')
      return
    }
    if (form.password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setUser({ name: form.name, email: form.email, avatar: null })
    setLoading(false)
    navigate('/dashboard')
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
          <h1 className="text-2xl font-medium text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">Começa a tua aventura hoje</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <div>
              <label htmlFor="register-name" className="text-xs text-gray-500 mb-1 block">
                {t('auth.name')}
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="O teu nome"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ekaya-orange bg-white"
              />
            </div>
            <div>
              <label htmlFor="register-email" className="text-xs text-gray-500 mb-1 block">
                {t('auth.email')}
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="text-xs text-gray-500 mb-1 block">
                {t('auth.password')}
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ekaya-orange bg-white"
              />
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-500">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary justify-center mt-1">
              {loading ? 'A criar conta...' : t('auth.register')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('auth.have_account')}{' '}
          <Link to="/auth/login" className="text-ekaya-orange font-medium">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
