import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../src/components/ui/StatCard'

describe('StatCard', () => {
  it('renders the provided value and label', () => {
    render(<StatCard icon={<span data-testid="icon" />} value={42} label="Locais" gradient="red" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Locais')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
