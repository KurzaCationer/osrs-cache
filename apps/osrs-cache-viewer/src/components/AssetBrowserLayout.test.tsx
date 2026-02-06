import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
// @ts-ignore
import { AssetBrowserLayout } from './AssetBrowserLayout'

describe('AssetBrowserLayout', () => {
  it('renders title and children', () => {
    render(
      <AssetBrowserLayout title="Items">
        <div>Table Content</div>
      </AssetBrowserLayout>
    )
    expect(screen.getByText('Items')).toBeDefined()
    expect(screen.getByText('Table Content')).toBeDefined()
  })
})
