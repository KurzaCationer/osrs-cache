import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className={css({ fontSize: "2xl", fontWeight: 'bold', p: 4 })}>
      <h3>OSRS Cache Viewer</h3>
    </div>
  )
}
