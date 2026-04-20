import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import FeatureCard from '../src/components/ui/FeatureCard'
import '../src/i18n'

describe('FeatureCard', () => {
  it('navigates to the given path when clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <FeatureCard
                titleKey="features.map.title"
                descKey="features.map.desc"
                icon={<span />}
                color="#2563eb"
                path="/map"
              />
            }
          />
          <Route path="/map" element={<div>map page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('map page')).toBeInTheDocument()
  })
})
