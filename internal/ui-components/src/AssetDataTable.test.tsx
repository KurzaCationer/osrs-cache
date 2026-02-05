// @vitest-environment jsdom
import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
// @ts-ignore
import { AssetDataTable } from './AssetDataTable'

describe('AssetDataTable', () => {
  const data = [
    { id: 1, name: 'Item A', value: 10 },
    { id: 2, name: 'Item B', value: 20 },
  ]

  it('renders data correctly', () => {
    render(<AssetDataTable data={data} />)
    expect(screen.getByText('Item A')).toBeTruthy()
    expect(screen.getByText('Item B')).toBeTruthy()
  })

  it('renders headers based on data keys', () => {
    render(<AssetDataTable data={data} />)
    expect(screen.getAllByText('id').length).toBeGreaterThan(0)
    expect(screen.getAllByText('name').length).toBeGreaterThan(0)
    expect(screen.getAllByText('value').length).toBeGreaterThan(0)
  })
})
