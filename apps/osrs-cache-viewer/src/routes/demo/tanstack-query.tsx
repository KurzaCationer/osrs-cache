import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

type Todo = {
  id: number
  name: string
}

function TanStackQueryDemo() {
  const { data, refetch } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => fetch('/demo/api/tq-todos').then((res) => res.json()),
    initialData: [],
  })

  const { mutate: addTodo } = useMutation({
    mutationFn: (todo: string) =>
      fetch('/demo/api/tq-todos', {
        method: 'POST',
        body: JSON.stringify(todo),
      }).then((res) => res.json()),
    onSuccess: () => refetch(),
  })

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    await addTodo(todo)
    setTodo('')
  }, [addTodo, todo])

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minH: 'screen',
        p: '4',
        color: 'white',
        bgGradient: 'to-br',
        gradientFrom: 'red.900',
        gradientVia: 'red.800',
        gradientTo: 'black'
      })}
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)',
      }}
    >
      <div className={css({
        w: 'full',
        maxW: '2xl',
        p: '8',
        rounded: 'xl',
        backdropBlur: 'md',
        bg: 'black/50',
        shadow: 'xl',
        borderWidth: '8px',
        borderColor: 'black/10'
      })}>
        <h1 className={css({ fontSize: '2xl', mb: '4' })}>TanStack Query Todos list</h1>
        <ul className={css({ mb: '4', display: 'flex', flexDirection: 'column', gap: '2' })}>
          {data?.map((t) => (
            <li
              key={t.id}
              className={css({
                bg: 'white/10',
                borderWidth: '1px',
                borderColor: 'white/20',
                rounded: 'lg',
                p: '3',
                backdropBlur: 'sm',
                shadow: 'md'
              })}
            >
              <span className={css({ fontSize: 'lg', color: 'white' })}>{t.name}</span>
            </li>
          ))}
        </ul>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitTodo()
              }
            }}
            placeholder="Enter a new todo..."
            className={css({
              w: 'full',
              px: '4',
              py: '3',
              rounded: 'lg',
              borderWidth: '1px',
              borderColor: 'white/20',
              bg: 'white/10',
              backdropBlur: 'sm',
              color: 'white',
              _placeholder: { color: 'white/60' },
              outline: 'none',
              _focus: { ringWidth: '2', ringColor: 'blue.400', borderColor: 'transparent' }
            })}
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className={css({
              bg: 'blue.500',
              color: 'white',
              fontWeight: 'bold',
              py: '3',
              px: '4',
              rounded: 'lg',
              transition: 'colors',
              _hover: { bg: 'blue.600' },
              _disabled: { bg: 'blue.500/50', cursor: 'not-allowed' }
            })}
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  )
}