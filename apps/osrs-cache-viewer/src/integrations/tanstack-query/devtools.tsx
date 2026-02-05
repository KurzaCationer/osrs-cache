import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

/**
 * Integration configuration for TanStack Query DevTools.
 */
export default {
  /** The name of the tool displayed in the devtools sidebar. */
  name: 'Tanstack Query',
  /** Renders the DevTools panel component. */
  render: <ReactQueryDevtoolsPanel />,
}