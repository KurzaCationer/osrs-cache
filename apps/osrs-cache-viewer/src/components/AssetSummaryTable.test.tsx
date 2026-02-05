// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AssetSummaryTable, transformData } from './AssetSummaryTable'

/*
describe('AssetSummaryTable', () => {
  it('renders without crashing', () => {
    render(<AssetSummaryTable counts={{ item: 100 }} />)
    expect(screen.getByText('Asset Type')).toBeTruthy()
  })
})
*/

describe('transformData', () => {
  it('calculates percentages correctly', () => {
    const counts = {
      item: 100,
      npc: 100,
    }
    const data = transformData(counts)
    expect(data).toHaveLength(2)
    expect(data[0].percentage).toBe(50)
    expect(data[1].percentage).toBe(50)
  })

  it('maps technical metadata', () => {
    const counts = {
      item: 1234,
    }
    const data = transformData(counts)
    expect(data[0].name).toBe('Items')
    expect(data[0].index).toBe(2)
    expect(data[0].archive).toBe(10)
  })

  it('handles empty data', () => {
    const data = transformData({})
    expect(data).toHaveLength(0)
  })
})
