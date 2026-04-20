import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './i18n'
import { useStore } from './store'
import { useOffline } from './hooks/useOffline'
import { initAnalytics, trackPageview } from './services/analytics'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import PWAUpdatePrompt from './components/layout/PWAUpdatePrompt'
import ProtectedRoute from './components/layout/ProtectedRoute'

const MapPage = lazy(() => import('./pages/Map'))
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'))
const Roteiros = lazy(() => import('./pages/Roteiros'))
const Favoritos = lazy(() => import('./pages/Favoritos'))
const Noticias = lazy(() => import('./pages/Noticias'))
const Conquistas = lazy(() => import('./pages/Conquistas'))
const Cultura = lazy(() => import('./pages/Cultura'))
const Article = lazy(() => import('./pages/Article'))
const Itineraries = lazy(() => import('./pages/Itineraries'))
const Informacoes = lazy(() => import('./pages/Informacoes'))
const ImpactoSocial = lazy(() => import('./pages/ImpactoSocial'))
const Planeador = lazy(() => import('./pages/Planeador'))
const Perfil = lazy(() => import('./pages/Perfil'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

const NO_NAV = ['/auth/login', '/auth/register']

function Layout({ children }) {
  const { pathname } = useLocation()
  const showNav = !NO_NAV.includes(pathname)
  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        Saltar para o conteúdo
      </a>
      {showNav && <Navbar />}
      <main id="main-content">{children}</main>
    </div>
  )
}

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ekaya-bg">
      <div className="w-8 h-8 border-2 border-ekaya-orange border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AppEffects() {
  const recordActiveDay = useStore((s) => s.recordActiveDay)
  const { pathname } = useLocation()
  useOffline()
  useEffect(() => {
    recordActiveDay()
    initAnalytics()
  }, [recordActiveDay])
  useEffect(() => {
    trackPageview()
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppEffects />
      <PWAUpdatePrompt />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/place/:id" element={<PlaceDetail />} />
                  <Route path="/roteiros" element={<Roteiros />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/noticias" element={<Noticias />} />
                  <Route path="/cultura" element={<Cultura />} />
                  <Route path="/cultura/:slug" element={<Article />} />
                  <Route path="/experiencias" element={<Itineraries />} />
                  <Route path="/conquistas" element={<Conquistas />} />
                  <Route path="/informacoes" element={<Informacoes />} />
                  <Route path="/impacto-social" element={<ImpactoSocial />} />
                  <Route path="/planeador" element={<Planeador />} />
                  <Route
                    path="/perfil"
                    element={
                      <ProtectedRoute>
                        <Perfil />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
