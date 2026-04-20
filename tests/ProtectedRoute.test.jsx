import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../src/components/layout/ProtectedRoute'
import { useStore } from '../src/store'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useStore.setState({ user: null })
  })

  it('redirects to login when no user is set', () => {
    renderAt('/secret')
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('secret content')).not.toBeInTheDocument()
  })

  it('renders protected content when user is authenticated', () => {
    useStore.setState({ user: { name: 'Ana', email: 'ana@test.com', joinedAt: '2026-01-01' } })
    renderAt('/secret')
    expect(screen.getByText('secret content')).toBeInTheDocument()
  })
})
